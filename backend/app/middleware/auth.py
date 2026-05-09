from dataclasses import dataclass

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwk, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.user import User

bearer_scheme = HTTPBearer()
_jwks_cache: dict = {}


async def _get_jwks() -> dict:
    if _jwks_cache:
        return _jwks_cache
    async with httpx.AsyncClient() as client:
        resp = await client.get(settings.clerk_jwks_url, timeout=10)
        resp.raise_for_status()
        _jwks_cache.update(resp.json())
    return _jwks_cache


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
    )

    try:
        jwks = await _get_jwks()
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")

        matching_key = next(
            (k for k in jwks.get("keys", []) if k.get("kid") == kid), None
        )
        if not matching_key:
            # Refresh cache and retry once in case keys rotated
            _jwks_cache.clear()
            jwks = await _get_jwks()
            matching_key = next(
                (k for k in jwks.get("keys", []) if k.get("kid") == kid), None
            )
        if not matching_key:
            raise credentials_exception

        public_key = jwk.construct(matching_key)
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
    except JWTError:
        raise credentials_exception

    clerk_id: str = payload.get("sub", "")
    if not clerk_id:
        raise credentials_exception

    result = await db.execute(select(User).where(User.clerk_id == clerk_id))
    user = result.scalar_one_or_none()

    if not user:
        email = payload.get("email", "") or ""
        user = User(clerk_id=clerk_id, email=email)
        db.add(user)
        await db.commit()
        await db.refresh(user)

    return user

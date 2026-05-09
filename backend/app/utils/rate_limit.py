from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.analysis import Analysis
from app.models.user import User


async def check_rate_limit(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> User:
    window_start = datetime.now(timezone.utc) - timedelta(days=30)
    result = await db.execute(
        select(func.count(Analysis.id)).where(
            Analysis.user_id == current_user.id,
            Analysis.created_at >= window_start,
            Analysis.from_cache.is_(False),
        )
    )
    count = result.scalar_one()

    if count >= settings.free_tier_analysis_limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Free tier limit reached. You have used {count}/{settings.free_tier_analysis_limit} analyses this month.",
        )
    return current_user

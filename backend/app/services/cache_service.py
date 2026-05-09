import hashlib
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.analysis import Analysis


def make_cache_key(company_name: str, role_title: str) -> str:
    raw = f"{company_name.lower().strip()}|{role_title.lower().strip()}"
    return hashlib.sha256(raw.encode()).hexdigest()


async def find_cached_result(
    db: AsyncSession,
    cache_key: str,
) -> Analysis | None:
    cutoff = datetime.now(timezone.utc) - timedelta(days=settings.cache_ttl_days)
    result = await db.execute(
        select(Analysis).where(
            Analysis.cache_key == cache_key,
            Analysis.status == "completed",
            Analysis.created_at >= cutoff,
        ).order_by(Analysis.created_at.desc()).limit(1)
    )
    return result.scalar_one_or_none()

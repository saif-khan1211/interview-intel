from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import AsyncSessionLocal, get_db
from app.middleware.auth import get_current_user
from app.models.analysis import Analysis
from app.models.job_description import JobDescription
from app.models.resume import Resume
from app.models.user import User
from app.schemas.analysis import (
    AnalysisCreateRequest,
    AnalysisListItem,
    AnalysisStatusResponse,
    PrepPlan,
)
from app.services.ai_pipeline import run_pipeline
from app.services.cache_service import find_cached_result, make_cache_key
from app.utils.rate_limit import check_rate_limit

router = APIRouter(prefix="/api/analyses", tags=["analyses"])


async def _run_analysis_background(
    analysis_id: int,
    resume_text: str,
    jd_text: str,
    company_name: str,
    role_title: str,
) -> None:
    async with AsyncSessionLocal() as session:
        analysis = await session.get(Analysis, analysis_id)
        if not analysis:
            return
        try:
            analysis.status = "processing"
            await session.commit()

            prep_plan = await run_pipeline(resume_text, jd_text, company_name, role_title)

            analysis.status = "completed"
            analysis.fit_score = prep_plan.fit_score
            analysis.result = prep_plan.model_dump()
            await session.commit()
        except Exception as exc:
            analysis.status = "failed"
            analysis.error_message = str(exc)[:1000]
            await session.commit()


@router.post("", status_code=status.HTTP_202_ACCEPTED)
async def create_analysis(
    body: AnalysisCreateRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(check_rate_limit),
    db: AsyncSession = Depends(get_db),
) -> dict:
    if len(body.jd_text) > settings.jd_max_chars:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Job description must be {settings.jd_max_chars} characters or fewer.",
        )

    resume_result = await db.execute(
        select(Resume).where(Resume.id == body.resume_id, Resume.user_id == current_user.id)
    )
    resume = resume_result.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    cache_key = make_cache_key(body.company_name, body.role_title)
    cached = await find_cached_result(db, cache_key)

    jd = JobDescription(
        user_id=current_user.id,
        company_name=body.company_name,
        role_title=body.role_title,
        raw_text=body.jd_text,
    )
    db.add(jd)
    await db.flush()

    analysis = Analysis(
        user_id=current_user.id,
        resume_id=resume.id,
        job_description_id=jd.id,
        cache_key=cache_key,
    )

    if cached:
        analysis.status = "completed"
        analysis.fit_score = cached.fit_score
        analysis.result = cached.result
        analysis.from_cache = True
        db.add(analysis)
        await db.commit()
        await db.refresh(analysis)
        return {"analysis_id": analysis.id, "status": "completed", "from_cache": True}

    db.add(analysis)
    await db.commit()
    await db.refresh(analysis)

    current_user.analysis_count += 1
    await db.commit()

    background_tasks.add_task(
        _run_analysis_background,
        analysis.id,
        resume.extracted_text,
        body.jd_text,
        body.company_name,
        body.role_title,
    )

    return {"analysis_id": analysis.id, "status": "pending", "from_cache": False}


@router.get("/{analysis_id}", response_model=AnalysisStatusResponse)
async def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AnalysisStatusResponse:
    result = await db.execute(
        select(Analysis, JobDescription)
        .join(JobDescription, Analysis.job_description_id == JobDescription.id)
        .where(Analysis.id == analysis_id, Analysis.user_id == current_user.id)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Analysis not found.")

    analysis, jd = row
    prep_plan = PrepPlan.model_validate(analysis.result) if analysis.result else None

    return AnalysisStatusResponse(
        id=analysis.id,
        status=analysis.status,
        fit_score=analysis.fit_score,
        result=prep_plan,
        error_message=analysis.error_message,
        created_at=analysis.created_at,
        company_name=jd.company_name,
        role_title=jd.role_title,
        from_cache=analysis.from_cache,
    )


@router.get("", response_model=list[AnalysisListItem])
async def list_analyses(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[AnalysisListItem]:
    result = await db.execute(
        select(Analysis, JobDescription)
        .join(JobDescription, Analysis.job_description_id == JobDescription.id)
        .where(Analysis.user_id == current_user.id)
        .order_by(Analysis.created_at.desc())
        .limit(50)
    )
    rows = result.all()

    return [
        AnalysisListItem(
            id=analysis.id,
            status=analysis.status,
            fit_score=analysis.fit_score,
            created_at=analysis.created_at,
            company_name=jd.company_name,
            role_title=jd.role_title,
            from_cache=analysis.from_cache,
        )
        for analysis, jd in rows
    ]

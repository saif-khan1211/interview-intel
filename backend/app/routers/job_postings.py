from fastapi import APIRouter, Depends, status

from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.job_posting import JobPostingExtractRequest, JobPostingExtractResponse
from app.services.job_extractor import extract_from_url

router = APIRouter(prefix="/api/job-postings", tags=["job-postings"])


@router.post(
    "/extract",
    response_model=JobPostingExtractResponse,
    status_code=status.HTTP_200_OK,
)
async def extract_job_posting(
    body: JobPostingExtractRequest,
    current_user: User = Depends(get_current_user),
) -> JobPostingExtractResponse:
    return await extract_from_url(body.url)

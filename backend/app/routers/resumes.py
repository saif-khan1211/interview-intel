import uuid

from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeUploadResponse
from app.services import resume_parser, s3_service

router = APIRouter(prefix="/api/resumes", tags=["resumes"])


@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ResumeUploadResponse:
    file_bytes = await file.read()
    content_type = file.content_type or ""

    extracted_text, file_type = await resume_parser.extract_text(file_bytes, content_type)

    ext = "pdf" if file_type == "pdf" else "docx"
    s3_key = f"resumes/{current_user.clerk_id}/{uuid.uuid4()}.{ext}"

    await s3_service.upload_file(file_bytes, s3_key, content_type)

    resume = Resume(
        user_id=current_user.id,
        s3_key=s3_key,
        filename=file.filename or f"resume.{ext}",
        extracted_text=extracted_text,
    )
    db.add(resume)
    await db.commit()
    await db.refresh(resume)

    return ResumeUploadResponse(resume_id=resume.id, filename=resume.filename)

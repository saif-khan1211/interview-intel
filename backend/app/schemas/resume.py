from pydantic import BaseModel


class ResumeUploadResponse(BaseModel):
    resume_id: int
    filename: str

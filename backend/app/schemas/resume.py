from pydantic import BaseModel


class ResumeUploadResponse(BaseModel):
    resume_id: int
    filename: str


class MyResumeResponse(BaseModel):
    resume_id: int
    filename: str

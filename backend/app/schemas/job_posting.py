from pydantic import BaseModel, Field


class JobPostingExtractRequest(BaseModel):
    url: str = Field(min_length=1, max_length=2048)


class JobPostingExtractResponse(BaseModel):
    company_name: str
    role_title: str
    jd_text: str

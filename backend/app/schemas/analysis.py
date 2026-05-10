from datetime import datetime

from pydantic import BaseModel, Field


class LeetCodeProblem(BaseModel):
    title: str
    url: str
    difficulty: str


class CodingPattern(BaseModel):
    name: str
    problems: list[LeetCodeProblem] = Field(default_factory=list)


class CodingPrep(BaseModel):
    patterns: list[CodingPattern] = Field(default_factory=list)


class PriorityTopic(BaseModel):
    topic: str
    why: str
    estimated_hours: int


class PrepPlan(BaseModel):
    fit_score: int = Field(ge=0, le=100)
    match_summary: str
    strengths: list[str] = Field(default_factory=list)
    skill_gaps: list[str] = Field(default_factory=list)
    interviewer_concerns: list[str] = Field(default_factory=list)
    high_priority_topics: list[PriorityTopic] = Field(default_factory=list)
    medium_priority_topics: list[PriorityTopic] = Field(default_factory=list)
    low_priority_topics: list[PriorityTopic] = Field(default_factory=list)
    what_to_ignore: list[str] = Field(default_factory=list)
    coding_prep: CodingPrep = Field(default_factory=CodingPrep)
    system_design_topics: list[str] = Field(default_factory=list)
    behavioral_focus: list[str] = Field(default_factory=list)
    interview_signals: list[str] = Field(default_factory=list)
    glassdoor_sources: list[str] = Field(default_factory=list)
    estimated_total_prep_days: int = Field(ge=1)
    timeline_breakdown: str


class AnalysisCreateRequest(BaseModel):
    resume_id: int
    jd_text: str = Field(min_length=50)
    company_name: str = Field(min_length=1, max_length=200)
    role_title: str = Field(min_length=1, max_length=200)


class AnalysisStatusResponse(BaseModel):
    id: int
    status: str
    fit_score: float | None = None
    result: PrepPlan | None = None
    error_message: str | None = None
    created_at: datetime
    company_name: str
    role_title: str
    from_cache: bool = False


class AnalysisListItem(BaseModel):
    id: int
    status: str
    fit_score: float | None = None
    created_at: datetime
    company_name: str
    role_title: str
    from_cache: bool = False

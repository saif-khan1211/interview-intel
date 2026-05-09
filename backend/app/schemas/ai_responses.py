from pydantic import BaseModel, Field


class ExperienceEntry(BaseModel):
    company: str
    role: str
    years: float | None = None
    description: str = ""


class ParsedResume(BaseModel):
    skills: list[str] = Field(default_factory=list)
    experience: list[ExperienceEntry] = Field(default_factory=list)
    tech_stack: list[str] = Field(default_factory=list)
    seniority_level: str = "mid"
    notable_achievements: list[str] = Field(default_factory=list)


class ParsedJD(BaseModel):
    required_skills: list[str] = Field(default_factory=list)
    nice_to_have: list[str] = Field(default_factory=list)
    role_type: str = "backend"
    seniority: str = "mid"
    interview_likely_focus: list[str] = Field(default_factory=list)


class InterviewSignals(BaseModel):
    round_types: list[str] = Field(default_factory=list)
    common_topics: list[str] = Field(default_factory=list)
    coding_difficulty: str = "medium"
    coding_style: str = "leetcode"
    notes: list[str] = Field(default_factory=list)

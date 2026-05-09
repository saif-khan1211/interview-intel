import json

import anthropic
from fastapi import HTTPException, status

from app.config import settings
from app.schemas.ai_responses import InterviewSignals, ParsedJD, ParsedResume
from app.schemas.analysis import PrepPlan
from app.services.ai_prompts import (
    INTERVIEW_SIGNALS_SYSTEM,
    INTERVIEW_SIGNALS_USER,
    JD_PARSER_SYSTEM,
    JD_PARSER_USER,
    PREP_PLAN_SYSTEM,
    PREP_PLAN_USER,
    RESUME_PARSER_SYSTEM,
    RESUME_PARSER_USER,
)

HAIKU_MODEL = "claude-haiku-4-5-20251001"
SONNET_MODEL = "claude-sonnet-4-6"


def _get_client() -> anthropic.AsyncAnthropic:
    return anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)


async def _call_structured(
    client: anthropic.AsyncAnthropic,
    model: str,
    system: str,
    user: str,
    response_model: type,
) -> object:
    response = await client.messages.create(
        model=model,
        max_tokens=2048,
        system=system,
        messages=[{"role": "user", "content": user}],
    )
    raw = response.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return response_model.model_validate_json(raw)


async def run_pipeline(
    resume_text: str,
    jd_text: str,
    company_name: str,
    role_title: str,
) -> PrepPlan:
    if not settings.ai_generation_enabled:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI generation is temporarily disabled.",
        )

    client = _get_client()

    # Step 1: Parse resume
    parsed_resume: ParsedResume = await _call_structured(
        client,
        HAIKU_MODEL,
        RESUME_PARSER_SYSTEM,
        RESUME_PARSER_USER.format(resume_text=resume_text[:8000]),
        ParsedResume,
    )

    # Step 2: Parse JD
    parsed_jd: ParsedJD = await _call_structured(
        client,
        HAIKU_MODEL,
        JD_PARSER_SYSTEM,
        JD_PARSER_USER.format(
            role_title=role_title,
            company_name=company_name,
            jd_text=jd_text[:5000],
        ),
        ParsedJD,
    )

    # Step 3: Interview signals
    signals: InterviewSignals = await _call_structured(
        client,
        HAIKU_MODEL,
        INTERVIEW_SIGNALS_SYSTEM,
        INTERVIEW_SIGNALS_USER.format(
            company_name=company_name,
            role_type=parsed_jd.role_type,
            seniority=parsed_jd.seniority,
        ),
        InterviewSignals,
    )

    # Step 4: Generate full prep plan (Sonnet)
    prep_plan: PrepPlan = await _call_structured(
        client,
        SONNET_MODEL,
        PREP_PLAN_SYSTEM,
        PREP_PLAN_USER.format(
            company_name=company_name,
            parsed_resume=json.dumps(parsed_resume.model_dump(), indent=2),
            parsed_jd=json.dumps(parsed_jd.model_dump(), indent=2),
            interview_signals=json.dumps(signals.model_dump(), indent=2),
        ),
        PrepPlan,
    )

    return prep_plan

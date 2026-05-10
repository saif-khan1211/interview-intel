import json
import re
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup
from fastapi import HTTPException, status

from app.config import settings
from app.schemas.job_posting import JobPostingExtractResponse
from app.services.ai_prompts import JOB_EXTRACTION_SYSTEM, JOB_EXTRACTION_USER
import anthropic

HAIKU_MODEL = "claude-haiku-4-5-20251001"

_NOISE_TAGS = {"script", "style", "noscript", "nav", "footer", "header", "meta", "link"}
_BLOCKED_DOMAINS = {"linkedin.com", "www.linkedin.com"}

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}


def _is_blocked_domain(url: str) -> bool:
    try:
        hostname = urlparse(url).hostname or ""
        return hostname in _BLOCKED_DOMAINS
    except Exception:
        return False


def _extract_visible_text(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")
    for tag in soup(list(_NOISE_TAGS)):
        tag.decompose()
    text = soup.get_text(separator="\n")
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


async def extract_from_url(url: str) -> JobPostingExtractResponse:
    if _is_blocked_domain(url):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                "LinkedIn blocks automated access to job postings. "
                "Please copy and paste the job description manually."
            ),
        )

    try:
        async with httpx.AsyncClient(
            headers=_HEADERS,
            follow_redirects=True,
            timeout=15.0,
        ) as client:
            response = await client.get(url)
            response.raise_for_status()
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The job posting URL timed out. Please paste the description manually.",
        )
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Could not fetch the job posting (HTTP {exc.response.status_code}). Try pasting manually.",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Could not reach the job posting URL. Please check the URL or paste the description manually.",
        )

    page_text = _extract_visible_text(response.text)

    if len(page_text) < 100:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The page appears to be empty or JavaScript-rendered. Please paste the description manually.",
        )

    ai_client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    try:
        ai_response = await ai_client.messages.create(
            model=HAIKU_MODEL,
            max_tokens=2048,
            system=JOB_EXTRACTION_SYSTEM,
            messages=[{
                "role": "user",
                "content": JOB_EXTRACTION_USER.format(page_text=page_text[:8000]),
            }],
        )
        raw = ai_response.content[0].text.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        extracted = JobPostingExtractResponse.model_validate(json.loads(raw))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Could not extract job details from that page. Please paste the description manually.",
        )

    if not extracted.jd_text or len(extracted.jd_text.strip()) < 50:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The page did not contain a recognisable job description. Please paste it manually.",
        )

    return extracted

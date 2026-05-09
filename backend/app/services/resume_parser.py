import asyncio
import io

from fastapi import HTTPException, status

from app.config import settings

PDF_MAGIC = b"%PDF"
DOCX_MAGIC = b"PK\x03\x04"


def _validate_file(file_bytes: bytes, content_type: str) -> str:
    size_mb = len(file_bytes) / (1024 * 1024)
    if size_mb > settings.resume_max_size_mb:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds {settings.resume_max_size_mb}MB limit.",
        )

    if file_bytes[:4] == PDF_MAGIC or content_type == "application/pdf":
        if file_bytes[:4] != PDF_MAGIC:
            raise HTTPException(status_code=400, detail="Invalid PDF file.")
        return "pdf"
    elif file_bytes[:4] == DOCX_MAGIC or "docx" in content_type or "openxmlformats" in content_type:
        if file_bytes[:4] != DOCX_MAGIC:
            raise HTTPException(status_code=400, detail="Invalid DOCX file.")
        return "docx"
    else:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are accepted.")


def _extract_pdf_sync(file_bytes: bytes) -> str:
    import pdfplumber

    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        if len(pdf.pages) > 10:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Resume must be 10 pages or fewer.",
            )
        pages = []
        for page in pdf.pages:
            text = page.extract_text(layout=True)
            if text:
                pages.append(text.strip())
        return "\n\n".join(pages)


def _extract_docx_sync(file_bytes: bytes) -> str:
    from docx import Document

    doc = Document(io.BytesIO(file_bytes))
    paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    return "\n".join(paragraphs)


async def extract_text(file_bytes: bytes, content_type: str) -> tuple[str, str]:
    file_type = _validate_file(file_bytes, content_type)

    if file_type == "pdf":
        text = await asyncio.to_thread(_extract_pdf_sync, file_bytes)
    else:
        text = await asyncio.to_thread(_extract_docx_sync, file_bytes)

    if not text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from the uploaded file.")

    return text, file_type

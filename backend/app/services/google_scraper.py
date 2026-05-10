import asyncio

from ddgs import DDGS


async def scrape_glassdoor_snippets(company: str) -> tuple[str, list[str]]:
    """Fetch Glassdoor interview review snippets for a company via DDG search.

    Returns (snippet_text, glassdoor_urls). Both empty on any error.
    """
    query = f'"{company}" software engineer interview glassdoor'
    try:
        raw_results = await asyncio.to_thread(
            lambda: list(DDGS().text(query, max_results=10))
        )

        texts: list[str] = []
        urls: list[str] = []

        for r in raw_results:
            href = r.get("href", "")
            body = r.get("body", "")
            if "glassdoor.com/Interview" in href and href not in urls:
                urls.append(href)
            if body and "glassdoor.com" in href:
                texts.append(body)

        snippet_text = "\n\n".join(texts)[:4000]
        return snippet_text, urls[:5]

    except Exception:
        return "", []

import os, httpx

# Fallback chain: real description -> LLM (if key present) -> heuristic template.
# The heuristic keeps the product honest: it never invents plot, it frames the book.

async def llm_summary(title: str, authors: list, categories: list) -> str:
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        return ""
    prompt = (f"Write a warm, 60-word magazine-style blurb for the book "
              f"'{title}' by {', '.join(authors) or 'an unknown author'} "
              f"({', '.join(categories[:3]) or 'general interest'}). No spoilers.")
    try:
        async with httpx.AsyncClient(timeout=25) as c:
            r = await c.post("https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {key}"},
                json={"model": "gpt-4o-mini", "messages": [{"role": "user", "content": prompt}],
                      "max_tokens": 120})
            return r.json()["choices"][0]["message"]["content"].strip()
    except Exception:
        return ""

def heuristic_summary(title, authors, categories, year):
    who = ", ".join(authors) if authors else "its author"
    cats = ", ".join(categories[:2]).lower() if categories else "its subject"
    return (f"{title} is a work of {cats} by {who}"
            + (f", first published in {year}" if year else "")
            + ". Readers tend to describe it in terms of its voice and its stakes rather than its plot; "
              "the excerpt and reviews at the retailers below will tell you faster than any blurb whether it is yours.")

async def ensure_description(book: dict) -> str:
    d = (book.get("description") or "").strip()
    if len(d) >= 140:
        return d
    llm = await llm_summary(book.get("title", ""), book.get("authors", []), book.get("categories", []))
    return llm or heuristic_summary(book.get("title", ""), book.get("authors", []),
                                    book.get("categories", []), book.get("published_year"))

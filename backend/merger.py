import asyncio, httpx
from typing import List, Optional
from rapidfuzz import fuzz
from models import Book, BuyLink, ReadLink
from summarizer import ensure_description

GB = "https://www.googleapis.com/books/v1/volumes"
OL = "https://openlibrary.org"

RETAIL_TEMPLATES = [
    ("Amazon",       "https://www.amazon.com/s?k={isbn}",  "print"),
    ("Bookshop.org", "https://bookshop.org/search?keywords={isbn}", "print"),
    ("Barnes & Noble", "https://www.barnesandnoble.com/s/{isbn}", "print"),
    ("Google Play",  "https://play.google.com/books/search?q={isbn}", "ebook"),
]

class Merger:
    def __init__(self):
        self.http = httpx.AsyncClient(timeout=20, follow_redirects=True)

    # ---- sources -------------------------------------------------------
    async def google(self, q: str) -> list:
        try:
            r = await self.http.get(GB, params={"q": q, "maxResults": 20, "printType": "books"})
            return r.json().get("items", [])
        except Exception:
            return []

    async def openlibrary(self, q: str) -> list:
        try:
            r = await self.http.get(OL + "/search.json", params={
                "q": q, "limit": 20,
                "fields": "key,title,author_name,cover_i,isbn,first_publish_year,subject,number_of_pages_median"})
            return r.json().get("docs", [])
        except Exception:
            return []

    async def ol_work_description(self, key: str) -> str:
        try:
            r = await self.http.get(OL + key + ".json")
            return (r.json().get("description") or "")
        except Exception:
            return ""

    # ---- normalizers ---------------------------------------------------
    @staticmethod
    def _isbn(ids: list) -> Optional[str]:
        for i in ids or []:
            if i.get("type") in ("ISBN_13", "ISBN_10"):
                return i.get("identifier")
        return None

    def norm_google(self, item: dict) -> dict:
        v = item.get("volumeInfo", {})
        cover = v.get("imageLinks", {}).get("thumbnail", "").replace("http://", "https://")
        buy = [BuyLink(retailer=n, url=u.format(isbn=self._isbn(v.get("industryIdentifiers", [])) or v.get("title", "")),
                       kind=k) for n, u, k in RETAIL_TEMPLATES]
        gl = v.get("canonicalVolumeLink")
        if gl:
            buy.append(BuyLink(retailer="Google Play", url=gl, kind="ebook"))
        return dict(id="gb:" + item.get("id", ""), title=v.get("title", ""),
                    authors=v.get("authors", []), cover_url=cover or None,
                    description=v.get("description", ""), categories=v.get("categories", []),
                    published_year=int(v["publishedDate"][:4]) if v.get("publishedDate", "")[:4].isdigit() else None,
                    page_count=v.get("pageCount"), rating=v.get("averageRating"),
                    isbn=self._isbn(v.get("industryIdentifiers", [])),
                    buy_links=buy, read_links=[])

    def norm_ol(self, doc: dict) -> dict:
        cover = f"https://covers.openlibrary.org/b/id/{doc['cover_i']}-L.jpg" if doc.get("cover_i") else None
        read = [ReadLink(platform="Open Library", url=OL + doc["key"], access="borrow")]
        if (doc.get("first_publish_year") or 9999) < 1929:
            read.append(ReadLink(platform="Project Gutenberg", url="https://www.gutenberg.org/ebooks/search/?query=" + doc.get("title", ""), access="public-domain"))
        return dict(id="ol:" + doc.get("key", "").strip("/"), title=doc.get("title", ""),
                    authors=doc.get("author_name", []), cover_url=cover,
                    description="", categories=(doc.get("subject") or [])[:5],
                    published_year=doc.get("first_publish_year"),
                    page_count=doc.get("number_of_pages_median"), rating=None,
                    isbn=(doc.get("isbn") or [None])[0],
                    buy_links=[], read_links=read, ol_key=doc.get("key"))

    # ---- merge ---------------------------------------------------------
    @staticmethod
    def _key(b: dict) -> str:
        if b.get("isbn"):
            return "isbn:" + b["isbn"].replace("-", "")
        return "ta:" + fuzz.token_sort_ratio and (b["title"].lower().strip() + "|" + (b["authors"] or [""])[0].lower().strip())

    async def merge(self, g: list, o: list) -> List[Book]:
        merged = {}
        for item in g:
            b = self.norm_google(item)
            merged[self._key(b)] = b
        for doc in o:
            b = self.norm_ol(doc)
            k = self._key(b)
            hit = merged.get(k)
            if hit is None:  # fuzzy title+author match when ISBN missing
                for mk, mv in merged.items():
                    if mk.startswith("ta:") and fuzz.token_set_ratio(mv["title"], b["title"]) > 92                        and fuzz.token_set_ratio((mv["authors"] or [""])[0], (b["authors"] or [""])[0]) > 85:
                        hit = mv
                        break
            if hit is not None:
                # Google wins on description/buy; Open Library wins on read-links + fallback cover
                if not hit["cover_url"] and b["cover_url"]:
                    hit["cover_url"] = b["cover_url"]
                if not hit["description"] and b.get("ol_key"):
                    hit["description"] = await self.ol_work_description(b["ol_key"])
                hit["read_links"].extend(b["read_links"])
                hit["page_count"] = hit["page_count"] or b["page_count"]
                hit["published_year"] = hit["published_year"] or b["published_year"]
            else:
                if b.get("ol_key"):
                    b["description"] = await self.ol_work_description(b["ol_key"])
                if not b["buy_links"]:
                    b["buy_links"] = [BuyLink(retailer=n, url=u.format(isbn=b["isbn"] or b["title"]), kind=k)
                                      for n, u, k in RETAIL_TEMPLATES]
                merged[k] = b
        out = []
        for b in merged.values():
            b.pop("ol_key", None)
            b["description"] = await ensure_description(b)
            out.append(Book(**b))
        out = [b for b in out if b.cover_url]
        return out[:20]

    async def search(self, q: str) -> List[Book]:
        g, o = await asyncio.gather(self.google(q), self.openlibrary(q))
        return await self.merge(g, o)

    async def close(self):
        await self.http.aclose()

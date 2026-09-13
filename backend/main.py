import asyncio, random
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Book
from merger import Merger

CACHE = {}          # simple in-memory cache; swap for redis in prod

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.merger = Merger()
    yield
    await app.state.merger.close()

app = FastAPI(title="Shelfie API", version="1.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

SHELVES = {
    "trending":    ["project hail mary", "tomorrow and tomorrow and tomorrow", "piranesi", "beach read", "circe"],
    "hidden-gems": ["kindred", "norwegian wood", "convenience store woman", "meditations", "the name of the wind"],
    "quick-reads": ["the little prince", "animal farm", "we should all be feminists", "the great gatsby"],
    "classics":    ["the great gatsby", "kindred", "meditations", "the left hand of darkness", "circe"],
}

@app.get("/api/search", response_model=list[Book])
async def search(q: str):
    q = q.strip()
    if len(q) < 2:
        raise HTTPException(400, "Query too short")
    if q in CACHE:
        return CACHE[q]
    books = await app.state.merger.search(q)
    CACHE[q] = books
    return books

@app.get("/api/discover/{shelf}", response_model=list[Book])
async def discover(shelf: str):
    queries = SHELVES.get(shelf)
    if not queries:
        raise HTTPException(404, "Unknown shelf")
    if shelf in CACHE:
        return CACHE[shelf]
    results = await asyncio.gather(*(app.state.merger.search(x) for x in queries))
    seen, out = set(), []
    for batch in results:
        for b in batch[:2]:
            if b.id not in seen:
                seen.add(b.id); out.append(b)
    CACHE[shelf] = out[:10]
    return out[:10]

@app.get("/api/random", response_model=Book)
async def random_book():
    shelf = random.choice(list(SHELVES))
    books = await discover(shelf)
    return random.choice(books)

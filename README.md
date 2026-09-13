# Shelfie — Every book. Every way to get it.

A book-discovery site that feels like a literary magazine, not a library catalog.

## Run it

Backend (FastAPI, merges Google Books + Open Library):
    cd shelfie/backend
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Frontend (React + Tailwind + Framer Motion):
    cd shelfie/frontend
    npm install
    npm run dev

Optional: set OPENAI_API_KEY to enable LLM fallback summaries when both APIs
return a missing/short description. Otherwise a honest heuristic blurb is used.

## Architecture notes

- backend/merger.py calls both APIs in parallel (asyncio.gather + httpx),
  normalizes to one schema, merges on ISBN (exact) or title+author (rapidfuzz
  token_set_ratio > 92). Google Books wins on description/buy links; Open
  Library wins on read-online links and fallback covers.
- Color theming: frontend/src/utils/colorTheme.ts uses node-vibrant
  (downsample -> MMCQ cluster -> dominant swatch, near-black/white filtered)
  and writes --accent / --tint / --shadow-tint CSS vars; every surface that
  uses them transitions, so opening a book page animates the whole room
  toward the cover's palette.
- Motion language: staggered rise-in for results, cursor-tracked 3D tilt on
  covers, ink-bleed loader, spring drawer, page-turn view transitions.

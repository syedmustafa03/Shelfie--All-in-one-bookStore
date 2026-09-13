import { motion } from "framer-motion";
import { Book } from "../lib/api";
import CoverCard from "./CoverCard";

// Ink-bleed loader: three expanding blots, never a generic spinner.
export function InkLoader() {
  return (
    <div className="grid place-items-center gap-5 py-28">
      <div className="relative w-14 h-14">
        {[0, .25, .5].map(d => (
          <span key={d} className="absolute inset-0 rounded-full animate-ping"
            style={{ background: "var(--accent)", animationDelay: `${d}s`, animationDuration: "1.5s" }} />
        ))}
      </div>
      <p className="font-serif italic opacity-60">Steeping your shelf…</p>
    </div>
  );
}

export default function SearchResults({ books, query, loading, onOpen }:
  { books: Book[]; query: string; loading: boolean; onOpen: (b: Book) => void }) {
  return (
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .6, ease: [0.2, 0.7, 0.2, 1] }}
      className="max-w-[1180px] mx-auto px-6 pt-32">
      <span className="kicker">Search results</span>
      <h2 className="font-serif font-semibold tracking-tight text-[clamp(30px,5vw,52px)] mt-1">
        “<em className="italic" style={{ color: "var(--accent)" }}>{query}</em>”
      </h2>
      <p className="text-sm opacity-60 mt-2">
        {loading ? "Searching the stacks…" : `${books.length} books, merged from Google Books + Open Library`}
      </p>
      {loading ? <InkLoader /> : (
        <div className="grid gap-x-6 gap-y-10 py-9 pb-24 [grid-template-columns:repeat(auto-fill,minmax(158px,1fr))]">
          {books.map((b, i) => <CoverCard key={b.id} book={b} i={i} onOpen={onOpen} />)}
        </div>
      )}
    </motion.section>
  );
}

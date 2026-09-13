import { motion } from "framer-motion";
import { Book } from "../lib/api";
import CoverCard from "./CoverCard";

const SHELVES = [
  ["01", "trending", "Trending Now", "Updated hourly, argued about daily"],
  ["02", "hidden-gems", "Hidden Gems", "Books people press into your hands"],
  ["03", "quick-reads", "Quick Reads", "Finished before the flight lands"],
  ["04", "classics", "Midnight Classics", "Old books, still up past bedtime"],
] as const;

export default function Discover({ data, onOpen }:
  { data: Record<string, Book[]>; onOpen: (b: Book) => void }) {
  return (
    <div className="max-w-[1180px] mx-auto px-6">
      {SHELVES.map(([num, key, title, note]) => (
        <motion.div key={key} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: .9, ease: [0.2, 0.7, 0.2, 1] }}
          className="my-24">
          <div className="flex items-baseline gap-4 border-t border-black/10 dark:border-white/10 pt-4">
            <span className="font-serif italic text-[15px]" style={{ color: "var(--accent)" }}>{num}</span>
            <h2 className="font-serif font-semibold tracking-tight text-[clamp(28px,4vw,42px)]">{title}</h2>
            <span className="ml-auto text-[13px] opacity-60 hidden sm:block">{note}</span>
          </div>
          <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x pt-7 pb-3">
            {(data[key] || []).map((b, i) => (
              <div key={b.id} className="snap-start shrink-0 w-[165px]">
                <CoverCard book={b} i={i} onOpen={onOpen} />
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

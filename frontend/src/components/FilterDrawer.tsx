import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

export interface Filters { genres: string[]; minRating: number; y0: number; y1: number }
const GENRES = ["Fiction", "Classics", "Fantasy", "Sci-Fi", "Romance", "Memoir", "Philosophy", "Essays"];

export default function FilterDrawer({ open, onClose, onApply }:
  { open: boolean; onClose: () => void; onApply: (f: Filters) => void }) {
  const [genres, setGenres] = useState<string[]>([]);
  const [minR, setMinR] = useState(0);
  const [y0, setY0] = useState(1800); const [y1, setY1] = useState(2026);
  return (
    <AnimatePresence>
      {open && (<>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-sm" />
        <motion.aside initial={{ x: "105%" }} animate={{ x: 0 }} exit={{ x: "105%" }}
          transition={{ type: "spring", damping: 32, stiffness: 300 }}
          className="fixed top-0 right-0 h-full w-[min(400px,94vw)] z-[80] overflow-y-auto p-7
                     bg-white dark:bg-ink-800 border-l border-black/10 dark:border-white/10
                     shadow-[-30px_0_70px_-30px_rgba(0,0,0,.45)]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif font-semibold text-[26px]">Refine</h3>
            <button onClick={onClose} className="w-9 h-9 rounded-full border border-black/10 dark:border-white/15 grid place-items-center"><X size={16} /></button>
          </div>
          <div className="mb-8"><span className="kicker block mb-3.5">Genre</span>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(g => (
                <button key={g} onClick={() => setGenres(p => p.includes(g) ? p.filter(x => x !== g) : [...p, g])}
                  className={`px-4 py-2 rounded-full border text-[13px] transition-colors
                    ${genres.includes(g) ? "bg-ink-900 text-cream-50 border-ink-900 dark:bg-cream-50 dark:text-ink-900" : "border-black/10 dark:border-white/15"}`}>{g}</button>
              ))}
            </div>
          </div>
          <div className="mb-8"><span className="kicker block mb-3.5">Minimum rating</span>
            <div className="flex gap-2">
              {[0, 3, 3.5, 4, 4.5].map(r => (
                <button key={r} onClick={() => setMinR(r)}
                  className={`flex-1 py-2.5 rounded-lg border text-[13px] transition-colors
                    ${minR === r ? "text-white border-transparent" : "border-black/10 dark:border-white/15"}`}
                  style={minR === r ? { background: "var(--accent)" } : {}}>{r ? `★ ${r}+` : "Any"}</button>
              ))}
            </div>
          </div>
          <div className="mb-9"><span className="kicker block mb-3.5">Published between</span>
            <div className="flex items-center gap-3">
              <input type="number" value={y0} onChange={e => setY0(+e.target.value)}
                className="w-full py-2.5 rounded-lg text-center bg-transparent border border-black/10 dark:border-white/15 outline-none" />
              <span className="opacity-50">—</span>
              <input type="number" value={y1} onChange={e => setY1(+e.target.value)}
                className="w-full py-2.5 rounded-lg text-center bg-transparent border border-black/10 dark:border-white/15 outline-none" />
            </div>
          </div>
          <button onClick={() => { onApply({ genres, minRating: minR, y0, y1 }); onClose(); }}
            className="w-full py-4 rounded-2xl text-white font-semibold hover:scale-[1.02] transition-transform"
            style={{ background: "var(--accent)" }}>Apply filters</button>
        </motion.aside>
      </>)}
    </AnimatePresence>
  );
}

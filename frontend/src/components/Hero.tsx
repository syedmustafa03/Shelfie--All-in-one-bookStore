import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { Book } from "../lib/api";

export default function Hero({ covers, onSearch }: { covers: string[]; onSearch: (q: string) => void }) {
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % Math.max(covers.length, 1)), 4200);
    return () => clearInterval(t);
  }, [covers.length]);
  return (
    <section className="relative min-h-svh grid place-items-center text-center overflow-hidden px-6 pt-32 pb-24">
      <div className="absolute inset-0">
        <AnimatePresence>
          {covers[i] && (
            <motion.div key={i} initial={{ opacity: 0, scale: 1.18 }} animate={{ opacity: .2, scale: 1.02 }}
              exit={{ opacity: 0 }} transition={{ duration: 1.8 }}
              className="absolute -inset-[12%] blur-[70px] saturate-150 bg-cover bg-center dark:opacity-15"
              style={{ backgroundImage: `url(${covers[i]})` }} />
          )}
        </AnimatePresence>
      </div>
      <div className="relative">
        <span className="kicker">A field guide to everything in print</span>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .1 }}
          className="font-serif font-semibold tracking-tight leading-[.98] text-[clamp(46px,8vw,96px)] max-w-[14ch] mx-auto mt-4">
          Every book.<br /><em className="italic" style={{ color: "var(--accent)" }}>Every way</em> to get it.
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .35, duration: .8 }}
          className="mt-6 max-w-[44ch] mx-auto text-[17px] leading-relaxed opacity-60">
          Search any title. Get the story, the shelves, the buy links and the free reads — in one beautiful place.
        </motion.p>
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5, duration: .7 }}
          onSubmit={e => { e.preventDefault(); onSearch(q); }}
          className="mt-10 mx-auto max-w-[620px] flex items-center gap-3 rounded-full pl-6 pr-2 py-2
                     bg-white dark:bg-ink-800 border border-black/10 dark:border-white/10
                     shadow-[0_26px_60px_-32px_rgba(0,0,0,.4)] focus-within:-translate-y-0.5
                     focus-within:shadow-[0_0_0_4px_var(--tint),0_30px_60px_-30px_rgba(0,0,0,.45)] transition-all">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search any title, author, or idea…"
            className="flex-1 bg-transparent outline-none text-[17px] min-w-0" />
          <button type="submit" className="w-[46px] h-[46px] shrink-0 rounded-full grid place-items-center text-white
                         hover:scale-110 hover:rotate-6 transition-transform" style={{ background: "var(--accent)" }}>
            <Search size={18} />
          </button>
        </motion.form>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8 }}
          className="mt-6 flex flex-wrap justify-center gap-2.5">
          {["Trending", "Hidden Gems", "Quick Reads", "Classics"].map(c => (
            <button key={c} onClick={() => onSearch(c)}
              className="px-4 py-2 rounded-full border border-black/10 dark:border-white/15 text-[13px] opacity-60
                         hover:opacity-100 hover:-translate-y-0.5 transition-all"
              style={{}}>
              {c}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

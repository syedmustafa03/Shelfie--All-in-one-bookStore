import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Book } from "../lib/api";
import { applyTheme, extractTheme } from "../utils/colorTheme";

const TABS = [["buy", "Buy"], ["read", "Read Online"], ["about", "About"]] as const;
type Tab = typeof TABS[number][0];

export default function BookDetail({ book, onBack }: { book: Book; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>("buy");

  // Animated theme shift toward the cover's palette on mount.
  useEffect(() => { let on = true;
    extractTheme(book.cover_url!).then(t => { if (on) applyTheme(t); });
    return () => { on = false; };
  }, [book]);

  return (
    <motion.section initial={{ opacity: 0, rotateY: 3, y: 14 }} animate={{ opacity: 1, rotateY: 0, y: 0 }}
      exit={{ opacity: 0 }} transition={{ duration: .6, ease: [0.2, 0.7, 0.2, 1] }}
      style={{ transformOrigin: "left center" }}
      className="max-w-[1180px] mx-auto px-6 pt-32 pb-24">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm opacity-60 hover:gap-3 hover:opacity-100 transition-all mb-11">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="grid md:grid-cols-[minmax(260px,400px)_1fr] gap-12 md:gap-20 items-start">
        <motion.img initial={{ opacity: 0, scale: .94, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: -2.5 }}
          transition={{ duration: .7, ease: [0.2, 0.7, 0.2, 1] }}
          src={book.cover_url} alt={book.title}
          className="w-full rounded-lg hover:rotate-0 hover:scale-[1.02] transition-transform duration-500"
          style={{ boxShadow: "0 55px 95px -32px var(--shadow-tint)" }} />
        <div>
          <div className="kicker mb-3">{book.categories.join(" / ")}</div>
          <h1 className="font-serif font-semibold tracking-tight leading-[1.02] text-[clamp(38px,5.5vw,68px)]">{book.title}</h1>
          <p className="mt-4 text-lg opacity-60">by <span className="opacity-100 font-medium text-current">{book.authors.join(", ")}</span></p>
          <div className="mt-3 flex flex-wrap gap-x-3.5 gap-y-2 text-sm opacity-60">
            {book.published_year && <span>{book.published_year}</span>}
            {book.page_count && <><span>·</span><span>{book.page_count} pages</span></>}
            {book.rating && <><span>·</span><span style={{ color: "var(--accent)" }}>{"★".repeat(Math.round(book.rating))}</span><span>{book.rating}</span></>}
          </div>
          <div className="flex gap-7 border-b border-black/10 dark:border-white/10 mt-9 mb-7">
            {TABS.map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)}
                className={`pb-3 text-[13px] font-semibold uppercase tracking-[.12em] transition-colors
                  ${tab === id ? "" : "opacity-50 hover:opacity-80"}`}>
                {label}
                {tab === id && <motion.span layoutId="tab-ink" className="block h-[2px] -mb-[1px]"
                  style={{ background: "var(--accent)" }} />}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: .35 }}>
              {tab === "buy" && (
                <div className="flex flex-wrap gap-3.5">
                  {book.buy_links.map((l, i) => (
                    <motion.a key={l.retailer + i} href={l.url} target="_blank" rel="noreferrer"
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .06 }}
                      className="flex items-center gap-3 pl-3 pr-6 py-3 rounded-full bg-white dark:bg-ink-800
                                 border border-black/10 dark:border-white/10 hover:-translate-y-[3px]
                                 hover:shadow-[0_18px_32px_-18px_rgba(0,0,0,.4)] transition-all">
                      <span className="w-9 h-9 rounded-full grid place-items-center text-white font-bold text-sm"
                        style={{ background: "var(--accent)" }}>{l.retailer[0]}</span>
                      <span><span className="block font-semibold text-[15px]">{l.retailer}</span>
                        <span className="block text-xs opacity-60">{l.kind === "ebook" ? "Ebook" : "Paperback"}</span></span>
                    </motion.a>
                  ))}
                </div>
              )}
              {tab === "read" && book.read_links.map((l, i) => (
                <motion.a key={l.platform} href={l.url} target="_blank" rel="noreferrer"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .06 }}
                  className="flex items-center justify-between gap-4 py-5 border-b border-black/10 dark:border-white/10
                             hover:pl-2.5 transition-all">
                  <span><span className="block font-semibold">{l.platform}</span>
                    <span className="block text-[13px] opacity-60 mt-0.5">{l.access}</span></span>
                  <span className="text-[11px] font-semibold uppercase tracking-[.1em] px-3 py-1.5 rounded-full"
                    style={{ background: "var(--tint)", color: "var(--accent)" }}>{l.access}</span>
                </motion.a>
              ))}
              {tab === "about" && (
                <div className="max-w-[62ch]">
                  <p className="text-[17px] leading-[1.8]">{book.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-9">
                    {[["Published", book.published_year], ["Pages", book.page_count],
                      ["Rating", book.rating], ["ISBN", book.isbn]].map(([k, v]) => v != null && (
                      <div key={k as string}><div className="kicker mb-1.5">{k}</div><div className="text-[15px] font-medium">{String(v)}</div></div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

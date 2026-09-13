import { Filter, Moon, Shuffle, Sun } from "lucide-react";

export function Header({ dark, onTheme, onFilters, showFilters }:
  { dark: boolean; onTheme: () => void; onFilters: () => void; showFilters: boolean }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-7 py-4
                       backdrop-blur-xl bg-cream-50/75 dark:bg-ink-900/75 border-b border-black/10 dark:border-white/10">
      <div className="font-serif font-bold text-[23px] tracking-tight">Shelfie<span style={{ color: "var(--accent)" }}>.</span></div>
      <div className="flex gap-2.5">
        {showFilters && (
          <button onClick={onFilters} className="w-9 h-9 rounded-full border border-black/10 dark:border-white/15 grid place-items-center hover:-translate-y-0.5 transition-transform"><Filter size={16} /></button>
        )}
        <button onClick={onTheme} className="w-9 h-9 rounded-full border border-black/10 dark:border-white/15 grid place-items-center hover:-translate-y-0.5 transition-transform">
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}

export function Footer({ onSurprise }: { onSurprise: () => void }) {
  return (
    <footer className="relative z-10 border-t border-black/10 dark:border-white/10 mt-16 py-16 px-6 text-center">
      <div className="font-serif font-bold text-[30px]">Shelfie<span style={{ color: "var(--accent)" }}>.</span></div>
      <p className="mt-3 mb-8 max-w-[46ch] mx-auto opacity-60 text-[15px] leading-relaxed">
        Made for people who love books — and for the ones who haven't met the right one yet.
      </p>
      <button onClick={onSurprise}
        className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-white font-semibold
                   hover:scale-105 hover:-rotate-2 transition-transform"
        style={{ background: "var(--accent)", boxShadow: "0 18px 40px -18px var(--shadow-tint)" }}>
        <Shuffle size={17} /> Surprise me
      </button>
      <div className="mt-8 text-[13px] opacity-50">About · API · GitHub · © 2026 Shelfie</div>
    </footer>
  );
}

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Book, discoverShelf, randomBook } from "./lib/api";
import { useBookSearch } from "./hooks/useBookSearch";
import { Header, Footer } from "./components/Chrome";
import Hero from "./components/Hero";
import SearchResults from "./components/SearchResults";
import BookDetail from "./components/BookDetail";
import Discover from "./components/Discover";
import FilterDrawer, { Filters } from "./components/FilterDrawer";

export default function App() {
  const [dark, setDark] = useState(false);
  const [view, setView] = useState<"home" | "results" | "detail">("home");
  const [book, setBook] = useState<Book | null>(null);
  const [shelves, setShelves] = useState<Record<string, Book[]>>({});
  const [drawer, setDrawer] = useState(false);
  const [filters, setFilters] = useState<Filters | null>(null);
  const { books, query, loading, search } = useBookSearch();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  useEffect(() => {
    (async () => {
      const keys = ["trending", "hidden-gems", "quick-reads", "classics"];
      const res = await Promise.all(keys.map(k => discoverShelf(k).catch(() => [])));
      setShelves(Object.fromEntries(keys.map((k, i) => [k, res[i]])));
    })();
  }, []);

  const filtered = useMemo(() => !filters ? books : books.filter(b =>
    (!filters.genres.length || b.categories.some(c => filters.genres.includes(c))) &&
    (b.rating ?? 0) >= filters.minRating &&
    (b.published_year ?? 2026) >= filters.y0 && (b.published_year ?? 0) <= filters.y1
  ), [books, filters]);

  const open = (b: Book) => { setBook(b); setView("detail"); window.scrollTo(0, 0); };
  const doSearch = (q: string) => { setFilters(null); search(q); setView("results"); };

  return (
    <div className="relative min-h-screen">
      <div className="tint-wash" />
      <Header dark={dark} onTheme={() => setDark(d => !d)} showFilters={view === "results"} onFilters={() => setDrawer(true)} />
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {view === "detail" && book ? (
            <BookDetail key={book.id} book={book} onBack={() => setView("results")} />
          ) : view === "results" ? (
            <SearchResults key="results" books={filtered} query={query} loading={loading} onOpen={open} />
          ) : (
            <div key="home">
              <Hero covers={Object.values(shelves).flat().slice(0, 6).map(b => b.cover_url!).filter(Boolean)} onSearch={doSearch} />
              <Discover data={shelves} onOpen={open} />
            </div>
          )}
        </AnimatePresence>
      </main>
      <Footer onSurprise={async () => open(await randomBook())} />
      <FilterDrawer open={drawer} onClose={() => setDrawer(false)} onApply={setFilters} />
      <div className="grain" />
    </div>
  );
}

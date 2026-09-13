import { useState } from "react";
import { Book, searchBooks } from "../lib/api";

export function useBookSearch() {
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  async function search(q: string) {
    setQuery(q); setLoading(true);
    try { setBooks(await searchBooks(q)); } catch { setBooks([]); }
    setLoading(false);
  }
  return { books, query, loading, search };
}

export interface BuyLink { retailer: string; url: string; kind: string; price?: string }
export interface ReadLink { platform: string; url: string; access: string }
export interface Book {
  id: string; title: string; authors: string[]; cover_url?: string; description: string;
  categories: string[]; published_year?: number; page_count?: number; rating?: number;
  isbn?: string; buy_links: BuyLink[]; read_links: ReadLink[];
}
const BASE = "http://localhost:8000";
export const searchBooks = (q: string) =>
  fetch(`${BASE}/api/search?q=${encodeURIComponent(q)}`).then(r => r.json() as Promise<Book[]>);
export const discoverShelf = (s: string) =>
  fetch(`${BASE}/api/discover/${s}`).then(r => r.json() as Promise<Book[]>);
export const randomBook = () =>
  fetch(`${BASE}/api/random`).then(r => r.json() as Promise<Book>);

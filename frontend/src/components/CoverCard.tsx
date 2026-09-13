import { motion } from "framer-motion";
import { Book } from "../lib/api";

// Cursor-tracked 3D tilt: like picking up a physical book off a shelf.
export default function CoverCard({ book, i, onOpen }: { book: Book; i: number; onOpen: (b: Book) => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 26, scale: .98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: .6, delay: i * .07, ease: [0.2, 0.7, 0.2, 1] }}
      onClick={() => onOpen(book)}
      className="group text-left [perspective:1000px]"
    >
      <div
        className="rounded-md overflow-hidden shadow-book group-hover:shadow-bookHover will-change-transform
                   transition-[transform,box-shadow] duration-500 ease-out"
        onMouseMove={e => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
          e.currentTarget.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 10}deg) scale(1.045)`;
        }}
        onMouseLeave={e => (e.currentTarget.style.transform = "")}
      >
        <img src={book.cover_url} alt={book.title} loading="lazy" className="w-full h-auto block" />
      </div>
      <h3 className="font-serif font-semibold text-base mt-3 leading-snug">{book.title}</h3>
      <p className="text-[13px] opacity-60 mt-0.5">{book.authors.join(", ")}</p>
    </motion.button>
  );
}

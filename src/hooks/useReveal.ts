import { useEffect, useRef, useState } from 'react';

/**
 * useReveal — the scroll "cut".
 *
 * Marks an element revealed the first time ~20% of it enters the viewport,
 * then disconnects: a section cuts in exactly once, like a film edit, and
 * never re-animates on the way back up. Pair with the `.reveal` /
 * `.is-revealed` classes in index.css; prefers-reduced-motion neutralises
 * the classes there, so this hook needs no motion check of its own.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold]);

  return { ref, revealed };
}

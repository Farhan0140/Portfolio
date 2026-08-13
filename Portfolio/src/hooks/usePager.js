import { useCallback, useMemo, useRef, useState } from 'react';

const PER_PAGE = 2;

function refreshTrace() {
  if (typeof window.fnRefreshTrace === 'function') window.fnRefreshTrace();
}

/**
 * Client-side port of `buildPager()`: two cards per page, with the outgoing
 * pair fading toward the direction of travel, the grid animating to the new
 * pair's height, and the arriving cards sliding in — same CSS classes
 * (pg-hidden / pg-out / pg-in) and timings (230ms swap, .5s height tween) as
 * the source. Unlike the source this doesn't remove cards from the DOM, so
 * card refs are attached via `cardRef(i)` and the grid wrapper via `gridRef`.
 */
export default function usePager(length) {
  const reduce = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const [page, setPage] = useState(0);
  const busyRef = useRef(false);
  const gridRef = useRef(null);
  const cardEls = useRef([]);

  const pages = Math.max(1, Math.ceil(length / PER_PAGE));

  const [prevPages, setPrevPages] = useState(pages);
  if (prevPages !== pages) {
    setPrevPages(pages);
    if (page > pages - 1) setPage(Math.max(0, pages - 1));
  }

  const cardRef = useCallback(
    (i) => (el) => {
      cardEls.current[i] = el;
    },
    []
  );

  const cardsOn = useCallback((p) => {
    const out = [];
    for (let i = p * PER_PAGE; i < p * PER_PAGE + PER_PAGE && i < length; i++) {
      if (cardEls.current[i]) out.push(cardEls.current[i]);
    }
    return out;
  }, [length]);

  const show = useCallback(
    (list, dir) => {
      list.forEach((card, i) => {
        card.classList.remove('pg-hidden', 'pg-out', 'pg-in');
        card.classList.add('in');
        if (!reduce) {
          card.style.setProperty('--pgx', (dir > 0 ? -26 : 26) + 'px');
          card.style.setProperty('--pd', i * 90 + 'ms');
          void card.offsetWidth; // restart the animation cleanly
          card.classList.add('pg-in');
        }
      });
    },
    [reduce]
  );

  const animateHeight = useCallback((from) => {
    const grid = gridRef.current;
    if (!grid) {
      refreshTrace();
      return;
    }
    grid.style.height = 'auto';
    const to = grid.offsetHeight;
    if (Math.abs(to - from) < 2) {
      grid.style.height = '';
      refreshTrace();
      return;
    }
    grid.style.height = from + 'px';
    grid.style.overflow = 'hidden';
    void grid.offsetHeight;
    grid.style.transition = 'height .5s var(--ease)';
    grid.style.height = to + 'px';

    let done = false;
    function settle() {
      if (done) return;
      done = true;
      grid.style.transition = '';
      grid.style.height = '';
      grid.style.overflow = '';
      grid.removeEventListener('transitionend', onEnd);
      refreshTrace();
    }
    function onEnd(e) {
      if (e.target === grid && e.propertyName === 'height') settle();
    }
    grid.addEventListener('transitionend', onEnd);
    setTimeout(settle, 700);
  }, []);

  const goTo = useCallback(
    (target, dir) => {
      if (busyRef.current || target === page || target < 0 || target > pages - 1) return;
      const leaving = cardsOn(page);

      if (reduce) {
        leaving.forEach((c) => c.classList.add('pg-hidden'));
        setPage(target);
        // arriving cards need their classes applied post-render; do it next tick
        requestAnimationFrame(() => {
          show(cardsOn(target), dir);
          refreshTrace();
        });
        return;
      }

      busyRef.current = true;
      const grid = gridRef.current;
      const startH = grid ? grid.offsetHeight : 0;
      leaving.forEach((c) => {
        c.style.setProperty('--pgx', (dir > 0 ? -26 : 26) + 'px');
        c.classList.remove('pg-in');
        c.classList.add('pg-out');
      });
      setTimeout(() => {
        leaving.forEach((c) => {
          c.classList.remove('pg-out');
          c.classList.add('pg-hidden');
        });
        setPage(target);
        requestAnimationFrame(() => {
          show(cardsOn(target), dir);
          animateHeight(startH);
        });
        busyRef.current = false;
      }, 230);
    },
    [page, pages, cardsOn, show, animateHeight, reduce]
  );

  const next = useCallback(() => goTo(page + 1, 1), [goTo, page]);
  const prev = useCallback(() => goTo(page - 1, -1), [goTo, page]);
  const goToPage = useCallback((n) => goTo(n, n > page ? 1 : -1), [goTo, page]);

  // className for a given card index, given the current page.
  const cardClassName = useCallback(
    (i) => (Math.floor(i / PER_PAGE) === page ? 'reveal in' : 'reveal pg-hidden'),
    [page]
  );

  return { page, pages, gridRef, cardRef, cardClassName, next, prev, goToPage };
}

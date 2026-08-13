import { useEffect, useRef } from 'react';

const FALLBACK_WORDS = ['Software Developer', 'IoT tinkerer', 'Go & React builder', 'Problem solver'];

/** Rotating role typewriter (hero subtitle), ported 1:1 from the source. */
export default function useTypedRole(words) {
  const ref = useRef(null);
  const WORDS = words && words.length ? words : FALLBACK_WORDS;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      el.textContent = WORDS[0];
      return undefined;
    }
    let w = 0;
    let i = 0;
    let deleting = false;
    let stopped = false;
    let timer = null;

    function tick() {
      if (stopped) return;
      const word = WORDS[w];
      i += deleting ? -1 : 1;
      el.textContent = word.slice(0, i);
      let wait = deleting ? 40 : 75;
      if (!deleting && i === word.length) {
        deleting = true;
        wait = 2200;
      } else if (deleting && i === 0) {
        deleting = false;
        w = (w + 1) % WORDS.length;
        wait = 350;
      }
      timer = setTimeout(tick, wait);
    }
    timer = setTimeout(tick, 1400);

    return () => {
      stopped = true;
      clearTimeout(timer);
    };
    // WORDS is stable by the time this mounts — App only renders Hero once
    // the portfolio data fetch has resolved.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

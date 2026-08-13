import { useEffect } from 'react';

const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/**
 * Ports "2. Scroll reveals + stagger", "3. Count-up numbers" and
 * "4. Project card cursor spotlight" from the original script. Runs once,
 * against the fully-rendered DOM (mount this at the top of the tree, after
 * all sections).
 */
export default function useRevealOnScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups = [];

    // ---- stagger delays ----
    $$('[data-stagger]').forEach((group) => {
      const step = parseInt(group.dataset.stagger, 10) || 100;
      const children = Array.prototype.filter.call(
        group.children,
        (el) => el.classList.contains('reveal') || el.classList.contains('tech-tile')
      );
      children.forEach((child, i) => {
        child.style.setProperty('--d', `${i * step}ms`);
      });
    });

    // ---- reveal-on-scroll ----
    const revealables = $$('.reveal, .eyebrow, .tech-items, .career-block, .circuit-graphic');
    if (reduce) {
      revealables.forEach((el) => el.classList.add('in'));
    } else {
      const revealObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              revealObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      );
      revealables.forEach((el) => revealObs.observe(el));
      cleanups.push(() => revealObs.disconnect());
    }

    // ---- count-up numbers ----
    const counters = $$('[data-count]');
    const countObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          countObs.unobserve(e.target);
          const el = e.target;
          const target = parseInt(el.dataset.count, 10) || 0;
          if (reduce) {
            el.textContent = target;
            return;
          }
          const dur = 1300;
          let t0 = null;
          function step(ts) {
            if (t0 === null) t0 = ts;
            const p = clamp((ts - t0) / dur, 0, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased);
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countObs.observe(el));
    cleanups.push(() => countObs.disconnect());

    // ---- project card cursor spotlight ----
    if (!reduce && window.matchMedia('(hover:hover)').matches) {
      const cards = $$('.project-card');
      const handler = (card) => (ev) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${ev.clientX - r.left}px`);
        card.style.setProperty('--my', `${ev.clientY - r.top}px`);
      };
      const handlers = cards.map((card) => {
        const h = handler(card);
        card.addEventListener('mousemove', h);
        return { card, h };
      });
      cleanups.push(() => handlers.forEach(({ card, h }) => card.removeEventListener('mousemove', h)));
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);
}

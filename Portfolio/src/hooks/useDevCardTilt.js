import { useEffect, useRef } from 'react';

/** Small 3D pointer-follow tilt on the hero id-card (initDevCardTilt). */
export default function useDevCardTilt() {
  const ref = useRef(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return undefined;

    const MAX = 7; // degrees
    let raf = null;
    let nx = 0;
    let ny = 0;

    function apply() {
      raf = null;
      card.style.transform = `perspective(900px) rotateX(${(ny * -MAX).toFixed(2)}deg) rotateY(${(nx * MAX).toFixed(2)}deg) translateY(-4px)`;
    }

    function onMove(e) {
      const r = card.getBoundingClientRect();
      nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(apply);
    }
    function onLeave() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
      card.style.transform = '';
    }

    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
    return () => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}

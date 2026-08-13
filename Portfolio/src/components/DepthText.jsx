import { useEffect, useRef } from 'react';

const MAX_LAYERS = 22;
const DEPTH_STEP = 1.6; // px between each layer
const TILT = 7.5; // deg, max tilt from pointer/orbit
const SMOOTHING = 0.14;
const ORBIT_SPEED = 0.35;
const BASE = { x: -2.4, y: 3.15 };

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function layerColor(index, total) {
  const progress = total <= 1 ? 1 : index / total;
  const eased = progress * progress;
  const mix = Math.round((1 - eased) * 72 + 4);
  return `color-mix(in srgb, var(--lemon) ${mix}%, var(--green-deep))`;
}

/**
 * The layered 3D hero name effect (buildStage/animateStage in the source),
 * ported as a self-contained component. Renders MAX_LAYERS blurred/tinted
 * copies of the text behind a crisp gradient-clipped face, then tilts the
 * whole stack toward the pointer (or auto-orbits when idle / on touch).
 */
export default function DepthText({ text }) {
  const nodeRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const node = nodeRef.current;
    const stage = stageRef.current;
    if (!node || !stage) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      stage.style.transform = `rotateX(${BASE.x}deg) rotateY(${BASE.y}deg)`;
      return undefined;
    }

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const current = { x: BASE.x, y: BASE.y };
    const target = { x: BASE.x, y: BASE.y };
    let active = false;
    const start = performance.now();
    let rafId = null;
    let stopped = false;

    function apply() {
      stage.style.transform = `rotateX(${current.x.toFixed(3)}deg) rotateY(${current.y.toFixed(3)}deg)`;
    }

    function onPointerMove(e) {
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      active = true;
      const x = clamp((e.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.8), -1, 1);
      const y = clamp((e.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.8), -1, 1);
      target.x = BASE.x - y * TILT;
      target.y = BASE.y + x * TILT;
    }
    function reset() {
      active = false;
      target.x = BASE.x;
      target.y = BASE.y;
    }

    if (finePointer) {
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerleave', reset);
      window.addEventListener('blur', reset);
    }

    function tick(now) {
      if (stopped) return;
      if (!active) {
        const elapsed = (now - start) / 1000;
        const orbit = elapsed * ORBIT_SPEED * Math.PI * 2;
        const amount = finePointer ? 0.18 : 0.55;
        target.x = BASE.x + Math.sin(orbit) * TILT * amount;
        target.y = BASE.y + Math.cos(orbit * 0.85) * TILT * amount;
      }
      current.x += (target.x - current.x) * SMOOTHING;
      current.y += (target.y - current.y) * SMOOTHING;
      apply();
      rafId = requestAnimationFrame(tick);
    }

    apply();
    rafId = requestAnimationFrame(tick);

    return () => {
      stopped = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (finePointer) {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', reset);
        window.removeEventListener('blur', reset);
      }
    };
  }, [text]);

  const layers = [];
  for (let i = MAX_LAYERS; i >= 1; i--) {
    layers.push(
      <span
        key={i}
        className="depth-text__layer"
        aria-hidden="true"
        style={{ color: layerColor(i, MAX_LAYERS), transform: `translateZ(${-i * DEPTH_STEP}px)` }}
      >
        {text}
      </span>
    );
  }

  return (
    <span className="depth-text" ref={nodeRef} data-text={text}>
      <span className="depth-text__stage" ref={stageRef}>
        {layers}
        <span className="depth-text__face">{text}</span>
      </span>
    </span>
  );
}

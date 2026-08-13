import { useEffect, useRef, useState } from 'react';
import SplitFlapText from './SplitFlapText';

const STATUS_WORDS = ['INITIALIZING', 'LOADING ASSETS', 'FETCHING MEDIA', 'ALMOST READY'];

const MIN_MS = 2400;
const MAX_MS = 4200;
const FADE_MS = 700;
const FLAP_STEP_MS = 180;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function Preloader({ imageUrls = [] }) {
  const [progress, setProgress] = useState(0);
  const [flapPercent, setFlapPercent] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [mounted, setMounted] = useState(true);
  const startedFadeRef = useRef(false);
  const progressRef = useRef(0);
  // Captured once at mount, deliberately not tracked as an effect
  // dependency — Preloader only ever mounts after the portfolio data fetch
  // resolves, so the list is already final, and treating a fresh array
  // reference as "changed" every render would restart the animation loop.
  const imageUrlsRef = useRef(imageUrls);

  useEffect(() => {
    if (!mounted) return undefined;

    const urls = imageUrlsRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const start = performance.now();
    let imagesSettled = false;
    let loaded = 0;

    const settle = () => {
      loaded += 1;
      if (loaded >= urls.length) imagesSettled = true;
    };

    if (urls.length === 0) {
      imagesSettled = true;
    } else {
      urls.forEach((src) => {
        const img = new Image();
        img.onload = settle;
        img.onerror = settle;
        img.src = src;
      });
    }

    // The percentage bar updates every frame for a smooth fill, but the
    // split-flap digits are pushed on a slower, fixed cadence — flipping
    // them every frame would restart the flap animation before it ever
    // finishes and just look like a flicker.
    const flapTimer = window.setInterval(() => {
      setFlapPercent(progressRef.current);
    }, FLAP_STEP_MS);

    let rafId = null;
    let finished = false;

    function finish() {
      if (finished) return;
      finished = true;
      progressRef.current = 100;
      setProgress(100);
      setFlapPercent(100);
      const holdMs = reduce ? 0 : 320;
      setTimeout(() => {
        if (startedFadeRef.current) return;
        startedFadeRef.current = true;
        clearInterval(flapTimer);
        setLeaving(true);
        setTimeout(() => {
          document.body.style.overflow = prevOverflow;
          setMounted(false);
        }, reduce ? 0 : FADE_MS);
      }, holdMs);
    }

    function tick(now) {
      const elapsed = now - start;

      if (reduce) {
        if ((imagesSettled && elapsed >= 300) || elapsed >= MAX_MS) finish();
        else rafId = requestAnimationFrame(tick);
        return;
      }

      const timeFrac = Math.min(1, elapsed / MIN_MS);
      const eased = easeOutCubic(timeFrac);
      const ready = imagesSettled && elapsed >= MIN_MS;
      const capped = ready ? 100 : Math.min(99, Math.round(eased * 99));
      if (capped > progressRef.current) progressRef.current = capped;
      setProgress((prev) => (capped > prev ? capped : prev));

      if ((imagesSettled && elapsed >= MIN_MS) || elapsed >= MAX_MS) {
        finish();
      } else {
        rafId = requestAnimationFrame(tick);
      }
    }
    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      clearInterval(flapTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      className={'preloader' + (leaving ? ' is-leaving' : '')}
      role="progressbar"
      aria-label="Loading site"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="preloader-glow" aria-hidden="true" />

      <div className="preloader-board">
        <div className="preloader-board-head">
          <svg className="preloader-mark" viewBox="0 0 64 64" aria-hidden="true">
            <rect x="1.5" y="1.5" width="61" height="61" rx="14" className="pl-frame" />
            <path className="pl-trace-base" d="M8 46h14V30h20V14h14" />
            <path className="pl-trace" d="M8 46h14V30h20V14h14" style={{ '--pl-p': progress / 100 }} />
            <circle className="pl-ring" cx="42" cy="30" r="9" />
            <circle className="pl-node" cx="42" cy="30" r="6.5" />
          </svg>
          <span className="preloader-brand">Farhan Nadim</span>
        </div>

        <div className="preloader-flap-row">
          <SplitFlapText
            text={String(flapPercent).padStart(3, '0')}
            padTo={3}
            charset="numeric"
            flipDuration={0.06}
            stagger={0.035}
            flipsPerChar={4}
            tileColor="#12182a"
            textColor="var(--lemon)"
            tileRadius={18}
            gap={14}
            fontSize="clamp(72px, 15vw, 176px)"
            className="preloader-flap preloader-flap--percent"
          />
          <span className="preloader-percent-sign">%</span>
        </div>

        <SplitFlapText
          words={STATUS_WORDS}
          cycleDelay={1250}
          flipDuration={0.05}
          stagger={0.018}
          flipsPerChar={3}
          charset="alpha"
          tileColor="#12182a"
          textColor="var(--green-deep)"
          tileRadius={8}
          gap={5}
          fontSize="clamp(18px, 2.6vw, 22px)"
          className="preloader-flap preloader-flap--status"
        />

        <div className="preloader-bar" aria-hidden="true">
          <i style={{ '--pl-p': progress / 100 }} />
        </div>
      </div>
    </div>
  );
}

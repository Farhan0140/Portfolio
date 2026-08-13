import { useCallback, useEffect, useRef, useState } from 'react';
import { KNOWN_PALETTE_IDS } from '../data/palettes';

/**
 * Ports the original palette-picker IIFE: palette lives on
 * document.documentElement[data-palette], persisted to localStorage under
 * 'fn-palette'. Also keeps the browser chrome (theme-color meta + the
 * data-URI favicon) in sync with whichever palette/theme is active, by
 * reading the resolved --lemon / --ink / --paper custom properties off the
 * root element — same trick as the source.
 */
export default function usePalette() {
  const [palette, setPalette] = useState(
    () => document.documentElement.getAttribute('data-palette') || 'midnight'
  );
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const syncChrome = useCallback(() => {
    const root = document.documentElement;
    const cs = getComputedStyle(root);
    const accent = cs.getPropertyValue('--lemon').trim();
    const ink = cs.getPropertyValue('--ink').trim();
    const paper = cs.getPropertyValue('--paper').trim();

    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
      m.setAttribute('content', paper);
    });

    const icon =
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>" +
      "<rect width='64' height='64' rx='14' fill='" + ink + "'/>" +
      "<path d='M8 46h14V30h20V14h14' fill='none' stroke='" + accent +
      "' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/>" +
      "<circle cx='42' cy='30' r='6.5' fill='" + accent + "'/></svg>";
    const href = 'data:image/svg+xml,' + encodeURIComponent(icon);
    document.querySelectorAll("link[rel='icon'], link[rel='apple-touch-icon']").forEach((l) => {
      l.setAttribute('href', href);
    });
  }, []);

  const choose = useCallback(
    (id) => {
      if (!KNOWN_PALETTE_IDS.includes(id)) return;
      document.documentElement.setAttribute('data-palette', id);
      try {
        localStorage.setItem('fn-palette', id);
      } catch {
        /* ignore */
      }
      setPalette(id);
      setOpen(false);
      btnRef.current?.focus();
    },
    []
  );

  // Sync chrome on mount, and whenever the theme toggle fires its event.
  useEffect(() => {
    syncChrome();
    document.addEventListener('fn:themechange', syncChrome);
    return () => document.removeEventListener('fn:themechange', syncChrome);
  }, [syncChrome]);

  // Re-sync whenever the palette itself changes.
  useEffect(() => {
    syncChrome();
  }, [palette, syncChrome]);

  // Click-outside / Escape-to-close.
  useEffect(() => {
    if (!open) return undefined;
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return { palette, open, setOpen, choose, btnRef, menuRef };
}

import { useCallback, useEffect, useState } from 'react';

/**
 * Mirrors the original inline theme-toggle script: theme lives on
 * document.documentElement[data-theme], is persisted to localStorage under
 * 'fn-theme', and a 'fn:themechange' CustomEvent is dispatched so anything
 * else that cares (the palette picker's favicon/theme-color sync, the
 * target-cursor's resting colour) can react without prop drilling — exactly
 * like the vanilla version.
 */
export default function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark'
  );

  const toggleTheme = useCallback(() => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('fn-theme', next);
    } catch {
      /* ignore (private mode / disabled storage) */
    }
    setTheme(next);
    document.dispatchEvent(new CustomEvent('fn:themechange'));
  }, []);

  // Keep in sync if something else (e.g. another tab) changes the attribute.
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  return { theme, toggleTheme };
}

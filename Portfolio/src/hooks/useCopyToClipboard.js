import { useCallback, useRef, useState } from 'react';

function legacyCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.top = '-1000px';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  let ok;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

/**
 * Ports the "copy buttons on the contact cards" behaviour: Clipboard API
 * where available, hidden-textarea execCommand fallback everywhere else.
 * `copied` flips true for ~1.8s after a successful copy, same timing as the
 * original .copied class flash.
 */
export default function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  const copy = useCallback((text) => {
    if (!text) return;
    const flash = () => {
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(flash)
        .catch(() => {
          if (legacyCopy(text)) flash();
        });
    } else if (legacyCopy(text)) {
      flash();
    }
  }, []);

  return { copied, copy };
}

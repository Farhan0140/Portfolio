import { useEffect, useMemo, useState } from 'react';
import { PortfolioDataProvider } from '../../context/PortfolioDataContext';
import { ModalProvider } from '../../context/ModalContext';
import { usePreviewBase } from '../context/PreviewDataContext';
import useRevealOnScroll from '../../hooks/useRevealOnScroll';

export const TEMP_ID = -1;
const DEBOUNCE_MS = 200;

/**
 * Renders the real public section component (About/Skills/Projects/…) with
 * the item currently being edited spliced into its list — live, on every
 * keystroke — by feeding PortfolioDataProvider draft data instead of a
 * server fetch. Same components, same CSS, so the preview is the real
 * thing, not a mockup.
 */
export default function LivePreviewPane({ PreviewSection, dataKey, draftItem, editingId }) {
  const { base, loading } = usePreviewBase();
  // Drives the same reveal-in / count-up behavior the public site uses, so
  // the preview doesn't sit permanently hidden or stuck at "0" just because
  // it's rendered outside the full Page tree.
  useRevealOnScroll();

  // The preview re-renders a whole public section (grid + cards) on every
  // change, which is too heavy to redo on literally every keystroke —
  // debounce so fast typing stays smooth and the preview still feels live.
  const [debouncedDraft, setDebouncedDraft] = useState(draftItem);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedDraft(draftItem), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [draftItem]);

  const overrideData = useMemo(() => {
    if (!base) return null;

    // Singletons (profile, siteContent) — the draft simply replaces the
    // whole object, no list/id merging needed.
    if (!Array.isArray(base[dataKey])) {
      return { ...base, [dataKey]: { ...base[dataKey], ...debouncedDraft } };
    }

    const list = base[dataKey] || [];
    const draft = { ...debouncedDraft, id: editingId ?? TEMP_ID, isPublished: true };
    const exists = list.some((item) => item.id === (editingId ?? TEMP_ID));
    const nextList = exists ? list.map((item) => (item.id === (editingId ?? TEMP_ID) ? draft : item)) : [...list, draft];
    return { ...base, [dataKey]: nextList };
  }, [base, dataKey, debouncedDraft, editingId]);

  if (loading || !overrideData) {
    return <div className="flex items-center justify-center h-full text-slate-500 text-sm p-8">Loading preview…</div>;
  }

  return (
    <div className="h-full overflow-y-auto bg-[#0B1220]" data-theme="dark">
      <div className="pointer-events-none select-none [&_.reveal]:opacity-100! [&_.reveal]:transform-none!">
        <PortfolioDataProvider overrideData={overrideData}>
          <ModalProvider>
            <PreviewSection previewId={editingId ?? TEMP_ID} />
          </ModalProvider>
        </PortfolioDataProvider>
      </div>
    </div>
  );
}

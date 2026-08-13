import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { publicPortfolio } from '../lib/api';

const PreviewDataContext = createContext(null);

/**
 * Lazily fetches the full public portfolio payload once (shared by every
 * admin page's live preview pane) so a preview can show a section's real
 * siblings around the item currently being edited, not just that one item
 * in isolation.
 */
export function PreviewDataProvider({ children }) {
  const [base, setBase] = useState(null);
  const [loading, setLoading] = useState(false);

  const ensureLoaded = useCallback(() => {
    if (base || loading) return;
    setLoading(true);
    publicPortfolio()
      .then(setBase)
      .catch(() => setBase(null))
      .finally(() => setLoading(false));
  }, [base, loading]);

  useEffect(() => {
    ensureLoaded();
  }, [ensureLoaded]);

  return <PreviewDataContext.Provider value={{ base, loading, refresh: ensureLoaded }}>{children}</PreviewDataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePreviewBase() {
  const ctx = useContext(PreviewDataContext);
  if (!ctx) throw new Error('usePreviewBase must be used within a PreviewDataProvider');
  return ctx;
}

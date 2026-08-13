/**
 * Click/Enter/Space handlers for a whole card that opens a modal, while
 * still letting inner <a> links (Code/Live/etc.) behave normally — ports
 * the `if (e.target.closest('a')) return;` guard from the source.
 */
export default function useOpenOnActivate(onOpen) {
  return {
    onClick: (e) => {
      if (e.target.closest('a')) return;
      onOpen();
    },
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('a')) return;
        e.preventDefault();
        onOpen();
      }
    },
  };
}

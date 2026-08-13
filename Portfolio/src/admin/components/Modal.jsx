import { useEffect, useRef } from 'react';

export default function Modal({ open, onClose, title, children, wide = false }) {
  const closeRef = useRef(null);
  // Callers (CrudSection etc.) don't memoize onClose, so it's a new
  // function every render — read the latest one via a ref instead of
  // putting it in the effect's deps, otherwise every keystroke in the form
  // (which re-renders the parent) would re-fire this effect and steal focus
  // back onto the close button mid-typing.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    function onKeyDown(e) {
      if (e.key === 'Escape') onCloseRef.current();
    }
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={
          'admin-modal-panel bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/50 w-full flex flex-col max-h-[90vh] ' +
          (wide ? 'max-w-5xl' : 'max-w-lg')
        }
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 text-xl leading-none rounded-md p-1 transition focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

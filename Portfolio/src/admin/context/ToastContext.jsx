import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const push = useCallback(
    (message, kind = 'ok') => {
      const id = nextId++;
      setToasts((t) => [...t, { id, message, kind }]);
      timers.current[id] = setTimeout(() => dismiss(id), 4000);
      return id;
    },
    [dismiss]
  );

  const toast = {
    success: (message) => push(message, 'ok'),
    error: (message) => push(message, 'err'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 w-80 max-w-[90vw]">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={
              'rounded-lg px-4 py-3 text-sm shadow-lg border backdrop-blur transition-all ' +
              (t.kind === 'err'
                ? 'bg-red-950/90 border-red-800 text-red-100'
                : 'bg-emerald-950/90 border-emerald-800 text-emerald-100')
            }
          >
            <div className="flex items-start justify-between gap-3">
              <span>{t.message}</span>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="opacity-60 hover:opacity-100 leading-none text-lg"
                aria-label="Dismiss"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

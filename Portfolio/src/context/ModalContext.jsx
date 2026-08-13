import { createContext, useContext, useMemo, useState } from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [projectId, setProjectId] = useState(null);
  const [certId, setCertId] = useState(null);

  const value = useMemo(
    () => ({
      projectId,
      certId,
      openProject: (id) => setProjectId(id),
      closeProject: () => setProjectId(null),
      openCert: (id) => setCertId(id),
      closeCert: () => setCertId(null),
    }),
    [projectId, certId]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within a ModalProvider');
  return ctx;
}

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { adminApi } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 'checking' | 'authed' | 'anon'
  const [status, setStatus] = useState('checking');

  const check = useCallback(() => {
    setStatus('checking');
    return adminApi
      .me()
      .then(() => setStatus('authed'))
      .catch(() => setStatus('anon'));
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const login = useCallback(async (password) => {
    await adminApi.login(password);
    setStatus('authed');
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminApi.logout();
    } finally {
      setStatus('anon');
    }
  }, []);

  return <AuthContext.Provider value={{ status, login, logout, refresh: check }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

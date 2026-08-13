import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export default function AuthGuard() {
  const { status } = useAuth();

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">Checking session…</div>
    );
  }

  if (status === 'anon') {
    return <Navigate to="login" replace />;
  }

  return <Outlet />;
}

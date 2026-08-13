import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { logout } = useAuth();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-100 mb-1">Settings</h1>
      <p className="text-sm text-slate-400 mb-6">Session and account info.</p>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 max-w-lg space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-200">Authentication</p>
          <p className="text-sm text-slate-400 mt-1">
            This dashboard is protected by a single shared password, set via the <code className="text-slate-300">ADMIN_PASSWORD</code>{' '}
            environment variable on the server. To change it, update that variable and restart the server — there's no in-app
            password change, since there's no user account to change it on.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">Session</p>
          <p className="text-sm text-slate-400 mt-1">Sessions last 24 hours and are stored in a signed, httpOnly cookie.</p>
          <button
            type="button"
            onClick={logout}
            className="mt-3 px-4 py-2 rounded-lg text-sm font-medium border border-red-900 text-red-300 hover:bg-red-950 transition"
          >
            Log out now
          </button>
        </div>
      </div>
    </div>
  );
}

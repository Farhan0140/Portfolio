import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Absolute paths — relative ones resolve against whichever child route is
// currently active (e.g. "profile" from "/admin/projects" would land on
// "/admin/projects/profile" instead of "/admin/profile").
const NAV = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/profile', label: 'Profile' },
  { to: '/admin/education', label: 'Education' },
  { to: '/admin/skills', label: 'Skills & Tools' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/certifications', label: 'Certifications' },
  { to: '/admin/career', label: 'Career & Hobbies' },
  { to: '/admin/social-links', label: 'Social Links' },
  { to: '/admin/coding-profiles', label: 'Coding Profiles' },
  { to: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="admin-shell min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <aside className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/70 backdrop-blur-xl md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        <div className="px-5 py-5 border-b border-slate-800 flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white font-semibold shadow-lg shadow-sky-950/50">
            P
          </span>
          <div className="min-w-0">
            <p className="font-semibold admin-brand-mark leading-tight">Portfolio Admin</p>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-sky-300 transition inline-flex items-center gap-1"
            >
              View live site
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <nav className="p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                'admin-navlink whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition ' +
                (isActive
                  ? 'admin-navlink-active bg-sky-600/90 text-white shadow-md shadow-sky-950/40'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 mt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={logout}
            className="w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-red-950/40 hover:text-red-300 transition text-left"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-4 md:p-8">
        <div key={location.pathname} className="admin-page-enter max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

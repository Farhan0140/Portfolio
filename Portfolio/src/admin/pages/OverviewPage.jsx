import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../lib/api';

const CARDS = [
  { resource: 'education', label: 'Education', to: '/admin/education', icon: '🎓' },
  { resource: 'skill-categories', label: 'Skill categories', to: '/admin/skills', icon: '🛠️' },
  { resource: 'projects', label: 'Projects', to: '/admin/projects', icon: '🚀' },
  { resource: 'certifications', label: 'Certifications', to: '/admin/certifications', icon: '📜' },
  { resource: 'social-links', label: 'Social links', to: '/admin/social-links', icon: '🔗' },
  { resource: 'coding-profiles', label: 'Coding profiles', to: '/admin/coding-profiles', icon: '💻' },
];

export default function OverviewPage() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    CARDS.forEach(({ resource }) => {
      adminApi
        .list(resource)
        .then((items) => setCounts((c) => ({ ...c, [resource]: items.length })))
        .catch(() => setCounts((c) => ({ ...c, [resource]: null })));
    });
  }, []);

  return (
    <div>
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/30 p-6 mb-6">
        <h1 className="text-xl font-semibold text-slate-100 mb-1">Overview</h1>
        <p className="text-sm text-slate-400">
          Everything here is live — changes you save show up on the public site immediately.
        </p>
      </div>

      <p className="text-xs uppercase tracking-wide text-slate-500 mb-3">Content</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CARDS.map((c) => (
          <Link
            key={c.resource}
            to={c.to}
            className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-sky-700 hover:bg-slate-900 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-950/40 transition"
          >
            <div className="flex items-center justify-between">
              <p className="admin-stat-number text-3xl font-semibold">{counts[c.resource] ?? '—'}</p>
              <span className="text-xl opacity-70 group-hover:opacity-100 transition" aria-hidden="true">
                {c.icon}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <p className="text-xs uppercase tracking-wide text-slate-500 mb-3 mt-8">Site copy</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/admin/profile"
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-sky-700 hover:bg-slate-900 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-950/40 transition"
        >
          <p className="font-medium text-slate-100 flex items-center gap-2">
            <span aria-hidden="true">🧑‍💻</span> Profile
          </p>
          <p className="text-sm text-slate-400 mt-1">Hero copy, photo, contact details.</p>
        </Link>
        <Link
          to="/admin/career"
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-sky-700 hover:bg-slate-900 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-950/40 transition"
        >
          <p className="font-medium text-slate-100 flex items-center gap-2">
            <span aria-hidden="true">✨</span> Career & Hobbies
          </p>
          <p className="text-sm text-slate-400 mt-1">The "Dream career" and "Hobbies" section copy.</p>
        </Link>
      </div>
    </div>
  );
}

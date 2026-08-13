const BASE = '/api/admin';

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (res.status === 401) {
    const err = new Error('Your session expired — please log in again.');
    err.status = 401;
    throw err;
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // response wasn't JSON — keep the generic message
    }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Resource CRUD (education, projects, certifications, social-links,
// coding-profiles, skill-categories, skill-items) — the same five calls
// work for every repeatable entity because the Go backend's generic
// Resource[T] type exposes an identical route shape for each of them.
export const adminApi = {
  login: (password) => request('/login', { method: 'POST', body: JSON.stringify({ password }) }),
  logout: () => request('/logout', { method: 'POST' }),
  me: () => request('/me'),

  list: (resource) => request(`/${resource}/`),
  create: (resource, body) => request(`/${resource}/`, { method: 'POST', body: JSON.stringify(body) }),
  update: (resource, id, body) => request(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (resource, id) => request(`/${resource}/${id}`, { method: 'DELETE' }),
  reorder: (resource, ids) => request(`/${resource}/reorder`, { method: 'PATCH', body: JSON.stringify({ ids }) }),

  // Singletons (profile, site-content) — GET/PUT only, no id.
  getSingleton: (resource) => request(`/${resource}/`),
  updateSingleton: (resource, body) => request(`/${resource}/`, { method: 'PUT', body: JSON.stringify(body) }),
};

export function publicPortfolio() {
  return fetch('/api/public/portfolio').then((res) => {
    if (!res.ok) throw new Error(`Failed to load preview data (${res.status})`);
    return res.json();
  });
}

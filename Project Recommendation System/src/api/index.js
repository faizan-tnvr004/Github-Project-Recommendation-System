const API_BASE = '/api'

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('prs_token')
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const api = {
  auth: {
    login: (body) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  },
  projects: {
    list: (category) =>
      apiFetch(`/projects${category && category !== 'All' ? `?category=${category}` : ''}`),
    getById: (id) => apiFetch(`/projects/${id}`),
    recommended: (limit = 4) => apiFetch(`/projects/recommended?limit=${limit}`),
  },
  github: {
    search: (q, lang, limit = 20) =>
      apiFetch(`/github/search?q=${encodeURIComponent(q)}${lang ? `&lang=${lang}` : ''}&limit=${limit}`),
    recommended: (lang, limit = 10) =>
      apiFetch(`/github/recommended${lang ? `?lang=${lang}` : ''}${limit ? `${lang ? '&' : '?'}limit=${limit}` : ''}`),
  },
}

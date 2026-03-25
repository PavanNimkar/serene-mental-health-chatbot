// src/services/api.js
const BASE = 'http://localhost:8000/api/v1';

const getToken = () => localStorage.getItem('access_token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: authHeaders(),
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const auth = {
  register: (data) =>
    fetch(`${BASE}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  login: (data) =>
    fetch(`${BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  profile: () => request('/auth/profile/'),

  onboarding: (step, data) =>
    request(`/auth/onboarding/${step}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ── Chat ──────────────────────────────────────────────────────────────────────
export const chat = {
  list: () => request('/chat/conversations/'),
  detail: (id) => request(`/chat/conversations/${id}/`),
  send: (data) =>
    request('/chat/send/', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Mood ──────────────────────────────────────────────────────────────────────
export const mood = {
  list: () => request('/mood/entries/'),
  create: (data) =>
    request('/mood/entries/', { method: 'POST', body: JSON.stringify(data) }),
  graph: (days = 30) => request(`/mood/graph/?days=${days}`),
};

// ── Tests ─────────────────────────────────────────────────────────────────────
export const tests = {
  questions: (type) => request(`/tests/questions/?type=${type}`),
  submit: (data) =>
    request('/tests/submit/', { method: 'POST', body: JSON.stringify(data) }),
  results: () => request('/tests/results/'),
  latest: () => request('/tests/latest/'),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboard = {
  get: () => request('/dashboard/'),
};

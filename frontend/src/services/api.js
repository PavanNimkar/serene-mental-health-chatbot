const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1";

const getToken = () => localStorage.getItem("access_token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: authHeaders(),
    ...options,
  });
  if (res.status === 401) {
    const refresh = localStorage.getItem("refresh_token");
    if (refresh) {
      const r = await fetch(`${BASE}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (r.ok) {
        const data = await r.json();
        localStorage.setItem("access_token", data.access);
        const retry = await fetch(`${BASE}${url}`, {
          headers: authHeaders(),
          ...options,
        });
        if (!retry.ok) throw await retry.json().catch(() => ({}));
        return retry.json();
      }
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  // 204 No Content — don't parse body
  if (res.status === 204) return null;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const auth = {
  register: (data) =>
    fetch(`${BASE}/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  login: (data) =>
    fetch(`${BASE}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  logout: (refreshToken) =>
    request("/auth/logout/", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    }),

  profile: () => request("/auth/profile/"),
  updateProfile: (data) =>
    request("/auth/profile/", { method: "PATCH", body: JSON.stringify(data) }),

  onboarding: (step, data) =>
    request(`/auth/onboarding/${step}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// ── Chat ──────────────────────────────────────────────────────────────────────
export const chat = {
  list: () => request("/chat/conversations/"),
  detail: (id) => request(`/chat/conversations/${id}/`),
  rename: (id, title) =>
    request(`/chat/conversations/${id}/rename/`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    }),
  delete: (id) =>
    request(`/chat/conversations/${id}/rename/`, { method: "DELETE" }),
  send: (data) =>
    request("/chat/send/", { method: "POST", body: JSON.stringify(data) }),
};

// ── Mood ──────────────────────────────────────────────────────────────────────
export const mood = {
  list: () => request("/mood/entries/"),
  create: (data) =>
    request("/mood/entries/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/mood/entries/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  graph: (days = 30) => request(`/mood/graph/?days=${days}`),
};

// ── Tests ─────────────────────────────────────────────────────────────────────
export const tests = {
  questions: (type) => request(`/tests/questions/?type=${type}`),
  submit: (data) =>
    request("/tests/submit/", { method: "POST", body: JSON.stringify(data) }),
  results: (type) =>
    request(type ? `/tests/results/?type=${type}` : "/tests/results/"),
  latest: () => request("/tests/latest/"),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboard = {
  get: () => request("/dashboard/"),
};

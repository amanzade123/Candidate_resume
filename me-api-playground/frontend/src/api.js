export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function getProfile() {
  const res = await fetch(`${API_BASE}/profile`);
  return res.json();
}

export async function getProjects(params='') {
  const res = await fetch(`${API_BASE}/projects${params}`);
  return res.json();
}

export async function search(q) {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`);
  return res.json();
}

export function getAuthHeader() {
  try {
    const token = localStorage.getItem('me_api_auth');
    if (!token) return {};
    return { Authorization: `Basic ${token}` };
  } catch (e) {
    return {};
  }
}
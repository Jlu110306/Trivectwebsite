const TOKEN_KEY = 'trivect_token';
const API_BASE = '/api';

export async function api(path, method = 'GET', body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  if (body) opts.body = JSON.stringify(body);
  try {
    const r = await fetch(API_BASE + path, opts);
    const data = await r.json();
    return { ok: r.ok, status: r.status, data };
  } catch (_) {
    return { ok: false, data: { error: 'Network error' } };
  }
}

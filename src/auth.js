const KEY = 'happy-auth';

export function saveAuth({ accessToken, userId, email }) {
  localStorage.setItem(KEY, JSON.stringify({ accessToken, userId, email }));
}

export function loadAuth() {
  try { return JSON.parse(localStorage.getItem(KEY)) || null; }
  catch { return null; }
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

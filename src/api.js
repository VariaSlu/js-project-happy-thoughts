const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authHeader = (token) => token ? { Authorization: `Bearer ${token}` } : {};

export const apiGet = async (path, token) => {
  const res = await fetch(`${BASE_URL}${path}`, { headers: { ...authHeader(token) } });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const apiPost = async (path, body, token) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader(token) },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const apiPatch = async (path, body, token) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeader(token) },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const apiDelete = async (path, token) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: { ...authHeader(token) }
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

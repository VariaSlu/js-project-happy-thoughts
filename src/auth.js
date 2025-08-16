const KEY = 'happy-auth';

export const saveAuth = ({ accessToken, userId, email }) => {
  localStorage.setItem(KEY, JSON.stringify({ accessToken, userId, email }));
};

export const loadAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem(KEY);
};

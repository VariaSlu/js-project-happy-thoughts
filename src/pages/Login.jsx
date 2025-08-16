import React, { useState } from 'react';

// Read API base from .env and trim any trailing slash
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

const Login = ({ onLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const ct = res.headers.get('content-type') || '';
      const data = ct.includes('application/json') ? await res.json() : await res.text();

      if (!res.ok) {
        const msg =
          typeof data === 'string'
            ? `Login failed (${res.status})`
            : data.details || data.error || 'Login failed';
        throw new Error(msg);
      }

      // success: store auth
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('email', data.email);

      onLoggedIn?.({ token: data.accessToken, userId: data.userId, email: data.email });
    } catch (e) {
      setErr(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card" style={{ maxWidth: 420, margin: '1rem auto' }}>
      <h2>Log in</h2>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="current-password"
        />
      </label>

      {err && <p style={{ color: 'crimson', marginTop: 8 }}>{err}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Log in'}
      </button>
    </form>
  );
};

export default Login;

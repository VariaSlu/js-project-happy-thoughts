import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      // Save auth for later requests
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('email', data.email);

      onLoggedIn?.({ token: data.accessToken, userId: data.userId, email: data.email });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card" style={{ maxWidth: 420, margin: '1rem auto' }}>
      <h2>Log in</h2>
      <label>Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
      </label>
      {err && <p style={{ color: 'crimson' }}>{err}</p>}
      <button type="submit" disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</button>
    </form>
  );
};

export default Login;

import React, { useState } from 'react';

// Read API base from .env and trim any trailing slash
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

const Signup = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ok, setOk] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setOk('');
    setErr('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const ct = res.headers.get('content-type') || '';
      const data = ct.includes('application/json') ? await res.json() : await res.text();

      if (!res.ok) {
        const msg =
          typeof data === 'string'
            ? `Signup failed (${res.status})`
            : data.details || data.error || 'Signup failed';
        throw new Error(msg);
      }

      setOk('Signup successful! Please log in.');
      // optionally switch to login automatically:
      onSwitchToLogin?.();
    } catch (e) {
      setErr(e.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card" style={{ maxWidth: 420, margin: '1rem auto' }}>
      <h2>Sign up</h2>
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
          autoComplete="new-password"
        />
      </label>

      {ok && <p style={{ color: 'green', marginTop: 8 }}>{ok}</p>}
      {err && <p style={{ color: 'crimson', marginTop: 8 }}>{err}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Creating…' : 'Create account'}
      </button>
    </form>
  );
};

export default Signup;

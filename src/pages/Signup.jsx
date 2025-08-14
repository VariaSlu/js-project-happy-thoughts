import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const Signup = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ok, setOk] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setOk('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || 'Signup failed');

      setOk('Signup successful! Please log in.');
      onSwitchToLogin?.(); // flip UI back to Login
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card" style={{ maxWidth: 420, margin: '1rem auto' }}>
      <h2>Sign up</h2>
      <label>Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
      </label>
      {ok && <p style={{ color: 'green' }}>{ok}</p>}
      {err && <p style={{ color: 'crimson' }}>{err}</p>}
      <button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
    </form>
  );
};

export default Signup;

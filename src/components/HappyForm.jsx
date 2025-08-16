import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const FORM_API = `${API_BASE}/thoughts`;


export const HappyForm = ({ onAddThought, token }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(FORM_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        // 401 will land here if token missing/invalid
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const newThought = await res.json();
      onAddThought(newThought);
      setMessage('');
    } catch (err) {
      setError(err.message);
      console.error('POST /thoughts failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="happy-form">
      <label htmlFor="message">Are you happy right now? Why?</label>
      <textarea
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        minLength={5}
        maxLength={140}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending…' : '💖 Send Happy Thought 💖'}
      </button>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </form>
  );
};

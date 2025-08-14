import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const HappyForm = ({ onAddThought }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_BASE}/thoughts`, {
      method: 'POST',
      body: JSON.stringify({ message }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(newThought => {
        onAddThought(newThought);
        setMessage('');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="happy-form">
      <label htmlFor="message">Are you happy right now? Why?</label>
      <textarea
        id="message"
        value={message}
        onChange={e => setMessage(e.target.value)}
        minLength="5"
        maxLength="140"
        required
      />
      <button type="submit">💖 Send Happy Thought 💖</button>
    </form>
  );
};

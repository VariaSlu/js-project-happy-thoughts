import React, { useState } from 'react';

const FORM_API = 'https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts';

export const HappyForm = ({ onAddThought }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(FORM_API, {
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
      <label htmlFor="message">What’s making you happy right now?</label>
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
  )
}
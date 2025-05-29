import React, { useState } from 'react';

const FORM_API = 'https://happy-thoughts-api-4ful.onrender.com/thoughts';

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
  )
}
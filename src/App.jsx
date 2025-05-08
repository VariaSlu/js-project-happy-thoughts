import React, { useEffect, useState } from 'react';
import { HappyForm } from './components/HappyForm';
import { ThoughtList } from './components/ThoughtList';

const API_URL = 'https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts';

export const App = () => {

  const [thoughts, setThoughts] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setThoughts);
  }, []);

  const addThought = (newThought) => {
    setThoughts(prev => [newThought, ...prev]);
  };

  const likeThought = (id) => {
    fetch(`https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts/${id}/like`, {
      method: 'POST'
    }).then(() => {
      setThoughts(prev =>
        prev.map(t => t._id === id ? { ...t, hearts: t.hearts + 1 } : t)
      );
    });
  };

  return (
    <div className="app">
      <h1>❤️ Happy Thoughts ❤️</h1>
      <HappyForm onAddThought={addThought} />
      <ThoughtList thoughts={thoughts} onLike={likeThought} />
    </div>
  )
}

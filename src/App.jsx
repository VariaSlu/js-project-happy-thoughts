import React, { useEffect, useState } from 'react';
import { HappyForm } from './components/HappyForm';
import { ThoughtList } from './components/ThoughtList';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE || '').replace(/\/+$/, '');

console.log('API_BASE =', API_BASE); // should print: https://js-project-api-862g.onrender.com

const THOUGHTS_URL = `${API_BASE}/thoughts`;

export const App = () => {
  const [thoughts, setThoughts] = useState([]);
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
  const email = localStorage.getItem('email');

  // Load thoughts on mount
  useEffect(() => {
    fetch(THOUGHTS_URL)
      .then((res) => res.json())
      .then(setThoughts)
      .catch((err) => console.error('Fetch thoughts failed:', err));
  }, []);

  // ----- Handlers -----
  const addThought = (newThought) => {
    setThoughts((prev) => [newThought, ...prev]);
  };

  const likeThought = (id) => {
    fetch(`${THOUGHTS_URL}/${id}/like`, { method: 'POST' })
      .then(() => {
        setThoughts((prev) =>
          prev.map((t) => (t._id === id ? { ...t, hearts: t.hearts + 1 } : t))
        );
      })
      .catch((err) => console.error('Like failed:', err));
  };

  // <<< These two fix your "onUpdate is not defined" error >>>
  const onUpdate = (updatedThought) => {
    setThoughts((prev) =>
      prev.map((t) => (t._id === updatedThought._id ? updatedThought : t))
    );
  };

  const onDelete = (id) => {
    setThoughts((prev) => prev.filter((t) => t._id !== id));
  };
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  const onLoggedIn = ({ token: t, userId: u, email: e, accessToken }) => {
    const finalToken = t || accessToken;
    if (finalToken) {
      localStorage.setItem('token', finalToken);
      setToken(finalToken);
    }
    if (u) {
      localStorage.setItem('userId', u);
      setUserId(u);
    }
    if (e) localStorage.setItem('email', e);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    setToken(null);
    setUserId(null);
  };

  return (
    <div className="app">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <h1>❤️ Happy Thoughts ❤️</h1>
        {token ? (
          <div>
            <span style={{ marginRight: 8 }}>Logged in{email ? ` as ${email}` : ''}</span>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <div>
            <button onClick={() => setMode('login')}>Login</button>
            <button onClick={() => setMode('signup')} style={{ marginLeft: 8 }}>Sign up</button>
          </div>
        )}
      </header>

      {!token ? (
        mode === 'login' ? (
          <Login onLoggedIn={onLoggedIn} />
        ) : (
          <Signup onSwitchToLogin={() => setMode('login')} />
        )
      ) : (
        <>
          {/* Authenticated POST inside HappyForm (sends Bearer token) */}
          <HappyForm onAddThought={addThought} token={token} />
          <ThoughtList
            thoughts={thoughts}
            onLike={likeThought}
            onUpdate={onUpdate}
            onDelete={onDelete}
            currentUserId={userId}   // so cards know if it's your thought
          />
        </>
      )}
    </div>
  );
};

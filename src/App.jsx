import React, { useEffect, useState } from 'react';
import { HappyForm } from './components/HappyForm';
import { ThoughtList } from './components/ThoughtList';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const App = () => {
  const [thoughts, setThoughts] = useState([]);
  const [mode, setMode] = useState('login'); // or 'signup'
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
  const email = localStorage.getItem('email');

  useEffect(() => {
    fetch(`${API_BASE}/thoughts`).then(r => r.json()).then(setThoughts);
  }, []);

  const addThought = (newThought) => setThoughts(prev => [newThought, ...prev]);

  const likeThought = (id) => {
    fetch(`${API_BASE}/thoughts/${id}/like`, { method: 'POST' })
      .then(() => setThoughts(prev => prev.map(t => t._id === id ? { ...t, hearts: t.hearts + 1 } : t)));
  };

  const onUpdate = (updated) => setThoughts(prev => prev.map(t => t._id === updated._id ? updated : t));
  const onDelete = (id) => setThoughts(prev => prev.filter(t => t._id !== id));

  const onLoggedIn = ({ token: t, userId: u, email: e, accessToken }) => {
    const finalToken = t || accessToken;
    setToken(finalToken);
    setUserId(u);
    // email already saved in Login
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
        mode === 'login'
          ? <Login onLoggedIn={onLoggedIn} />
          : <Signup onSwitchToLogin={() => setMode('login')} />
      ) : (
        <>
          {/* HappyForm already updated earlier to accept token */}
          <HappyForm onAddThought={addThought} token={token} />
          <ThoughtList
            thoughts={thoughts}
            onLike={likeThought}
            onUpdate={onUpdate}
            onDelete={onDelete}
            token={token}
            userId={userId}
          />
        </>
      )}
    </div>
  );
};

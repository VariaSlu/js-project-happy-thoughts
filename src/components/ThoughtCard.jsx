import React, { useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const FORM_API = `${API_BASE}/thoughts`;

export const ThoughtCard = ({ thought, onLike, onDelete, onUpdate, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(thought.message);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const isOwner = String(thought.createdBy?._id || thought.createdBy) === String(currentUserId);

  const handleLike = () => onLike(thought._id);

  const handleDelete = async () => {
    if (!token || !isOwner) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/thoughts/${thought._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Delete failed');
      }
      onDelete?.(thought._id);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!token || !isOwner) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/thoughts/${thought._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: editMessage })
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || 'Update failed');
      onUpdate?.(updated);
      setIsEditing(false);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  // time text helper
  const timeAgo = (createdAt) => {
    if (!createdAt) return '';
    const ms = Date.parse(createdAt);
    if (Number.isNaN(ms)) return '';
    const diffMin = Math.floor((Date.now() - ms) / 60000);
    if (diffMin < 1) return 'just now';
    if (diffMin === 1) return '1 minute ago';
    if (diffMin < 60) return `${diffMin} minutes ago`;
    return new Date(ms).toLocaleTimeString();
  };


  return (
    <div className="thought-card">
      {isEditing ? (
        <form onSubmit={handleSave}>
          <textarea
            value={editMessage}
            onChange={(e) => setEditMessage(e.target.value)}
            minLength={5}
            maxLength={140}
            required
          />
          <button type="submit" disabled={loading}>Save</button>
          <button type="button" onClick={() => setIsEditing(false)} disabled={loading}>Cancel</button>
        </form>
      ) : (
        <>
          <p>{thought.message}</p>
          <div className="thought-footer">
            <button
              className={`heart-button ${thought.hearts === 0 ? 'neutral' : 'liked'}`}
              onClick={handleLike}
            >
              ❤️ {thought.hearts}
            </button>
            <span className="time-ago">{timeAgo(thought.createdAt)}</span>

            {isOwner && (
              <>
                <button onClick={() => setIsEditing(true)} disabled={loading}>Edit</button>
                <button onClick={handleDelete} disabled={loading}>Delete</button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

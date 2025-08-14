import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const ThoughtCard = ({ thought, onLike, onDelete, onUpdate, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(thought.message);

  const handleLike = () => {
    onLike(thought._id);
  };

  const handleDelete = () => {
    onDelete(thought._id);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onUpdate(thought._id, editMessage);
    setIsEditing(false);
  };

  const timeAgo = (createdAt) => {
    const diff = Math.floor((Date.now() - new Date(createdAt)) / 60000);
    if (diff < 1) return 'just now';
    if (diff === 1) return '1 minute ago';
    if (diff < 60) return `${diff} minutes ago`;
    return new Date(createdAt).toLocaleTimeString();
  };

  return (
    <div className="thought-card">
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <textarea
            value={editMessage}
            onChange={(e) => setEditMessage(e.target.value)}
            minLength="5"
            maxLength="140"
            required
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
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

            {currentUserId === thought.createdBy && (
              <>
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

import React from 'react';

export const ThoughtCard = ({ thought, onLike }) => {
  const handleLike = () => {
    onLike(thought._id);
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
      <p>{thought.message}</p>
      <div className="thought-footer">
        <button onClick={handleLike}>❤️ x {thought.hearts}</button>
        <span>{timeAgo(thought.createdAt)}</span>
      </div>
    </div>
  );
}
import React from 'react';
import { ThoughtCard } from './ThoughtCard';

export const ThoughtList = ({ thoughts, onLike, onDelete, onUpdate, currentUserId }) => {
  return (
    <div className="thought-list">
      {thoughts.map((thought) => (
        <ThoughtCard
          key={thought._id}
          thought={thought}
          onLike={onLike}
          onDelete={onDelete}
          onUpdate={onUpdate}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

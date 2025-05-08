import React from 'react';
import { ThoughtCard } from './ThoughtCard';

export const ThoughtList = ({ thoughts, onLike }) => {
  return (
    <div className="thought-list">
      {thoughts.map(thought => (
        <ThoughtCard key={thought._id} thought={thought} onLike={onLike} />
      ))}
    </div>
  )
}


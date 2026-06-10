import React, { useState } from 'react';

const InteractiveStars = ({ currentRating, onRatingSelect, disabled }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '8px', cursor: disabled ? 'default' : 'pointer' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoverRating || currentRating) >= star;
        return (
          <svg
            key={star}
            width="32" height="32" viewBox="0 0 24 24"
            onMouseEnter={() => !disabled && setHoverRating(star)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
            onClick={() => !disabled && onRatingSelect(star)}
            style={{
              fill: isFilled ? 'var(--brand-primary)' : 'transparent',
              stroke: isFilled ? 'var(--brand-primary)' : 'var(--border-strong)',
              strokeWidth: '2',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              transition: 'all var(--duration-fast)',
              transform: hoverRating === star && !disabled ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      })}
    </div>
  );
};

export default InteractiveStars;
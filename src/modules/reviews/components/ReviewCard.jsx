import React from 'react';

const ReviewCard = ({ review }) => {
  // Simple formatter for "X days ago" logic
    const formatDate = (dateString) => {
        const date = new Date(dateString);
            return date.toLocaleDateString('en-UG', { month: 'short', day: 'numeric', year: 'numeric' });
              };

                return (
                    <div className="ayabus-card" style={{ 
                          padding: '20px', 
                                marginBottom: '16px', 
                                      backgroundColor: 'var(--bg-canvas)', // Slightly inset color to contrast with the surface
                                            border: '1px solid var(--border-subtle)',
                                                  boxShadow: 'none',
                                                        width: '100%'
                                                            }}>
                                                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                                          <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                                                                                    {review.author_name}
                                                                                            </span>
                                                                                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                                                                              {formatDate(review.created_at)}
                                                                                                                      </span>
                                                                                                                            </div>
                                                                                                                                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6', wordBreak: 'break-word' }}>
                                                                                                                                          "{review.content}"
                                                                                                                                                </p>
                                                                                                                                                    </div>
                                                                                                                                                      );
                                                                                                                                                      };

                                                                                                                                                      export default ReviewCard;
                                                                                                                                                      
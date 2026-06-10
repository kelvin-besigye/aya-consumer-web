import React from 'react';

const RatingStats = ({ average, total }) => {
  return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontSize: '48px', fontWeight: '900', color: 'var(--text-main)', lineHeight: '1', letterSpacing: '-2px' }}>
                    {average.toFixed(1)}
                          </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {/* Static 5 stars representing the score visually */}
                                                <div style={{ display: 'flex', gap: '2px', color: 'var(--brand-primary)' }}>
                                                          {[1, 2, 3, 4, 5].map(star => (
                                                                      <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill={star <= Math.round(average) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                                                                </svg>
                                                                                                          ))}
                                                                                                                  </div>
                                                                                                                          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                                                                                                                    Based on {total.toLocaleString()} traveler reviews
                                                                                                                                            </span>
                                                                                                                                                  </div>
                                                                                                                                                      </div>
                                                                                                                                                        );
                                                                                                                                                        };

                                                                                                                                                        export default RatingStats;
                                                                                                                                                        
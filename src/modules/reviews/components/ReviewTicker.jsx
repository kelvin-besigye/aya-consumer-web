import React from 'react';
import ReviewCard from './ReviewCard';

const ReviewTicker = ({ reviews, isLoading }) => {
  if (isLoading) {
      return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', opacity: 0.5 }}>
                    {[1, 2, 3].map(i => (
                              <div key={i} className="ayabus-card" style={{ height: '120px', animation: 'pulse 1.5s infinite', backgroundColor: 'var(--border-subtle)' }} />
                                      ))}
                                            </div>
                                                );
                                                  }

                                                    if (!reviews || reviews.length === 0) {
                                                        return <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>Be the first to leave a review!</div>;
                                                          }

                                                            return (
                                                                <div className="ayabus-vertical-marquee-container" style={{
                                                                      height: '100%',
                                                                            minHeight: '400px',
                                                                                  maxHeight: '500px',
                                                                                        overflow: 'hidden',
                                                                                              position: 'relative',
                                                                                                    maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                                                                                                          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
                                                                                                              }}>
                                                                                                                    <div className="ayabus-vertical-marquee-content">
                                                                                                                            {reviews.map((review) => (
                                                                                                                                      <ReviewCard key={`tick1-${review.id}`} review={review} />
                                                                                                                                              ))}
                                                                                                                                                      {/* Duplicate list for the seamless infinite loop */}
                                                                                                                                                              {reviews.map((review) => (
                                                                                                                                                                        <ReviewCard key={`tick2-${review.id}`} review={review} />
                                                                                                                                                                                ))}
                                                                                                                                                                                      </div>

                                                                                                                                                                                            <style>{`
                                                                                                                                                                                                    .ayabus-vertical-marquee-container:hover .ayabus-vertical-marquee-content,
                                                                                                                                                                                                            .ayabus-vertical-marquee-container:active .ayabus-vertical-marquee-content {
                                                                                                                                                                                                                      animation-play-state: paused; /* Pause so users can read */
                                                                                                                                                                                                                              }

                                                                                                                                                                                                                                      .ayabus-vertical-marquee-content {
                                                                                                                                                                                                                                                display: flex;
                                                                                                                                                                                                                                                          flex-direction: column;
                                                                                                                                                                                                                                                                    animation: scrollUp 40s linear infinite;
                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                    @keyframes scrollUp {
                                                                                                                                                                                                                                                                                              0% { transform: translateY(0); }
                                                                                                                                                                                                                                                                                                        100% { transform: translateY(-50%); } /* Scrolls exactly half the total height (one full array) */
                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                      `}</style>
                                                                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                                                                                            };

                                                                                                                                                                                                                                                                                                                            export default ReviewTicker;
                                                                                                                                                                                                                                                                                                                            
import React from 'react';
import AwardBadge from './AwardBadge';
import { AWARDS_DATA } from '../data/awardsRegistry';

const MarqueeTrack = () => {
  return (
      <div className="ayabus-marquee-container" style={{
            display: 'flex',
                  overflow: 'hidden',
                        userSelect: 'none',
                              width: '100%',
                                    maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)', // Fades the edges beautifully
                                          WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
                                              }}>
                                                    {/* Track 1 */}
                                                          <div className="ayabus-marquee-content">
                                                                  {AWARDS_DATA.map((award) => (
                                                                            <AwardBadge key={`track1-${award.id}`} award={award} />
                                                                                    ))}
                                                                                          </div>
                                                                                                
                                                                                                      {/* Track 2 (Exact Duplicate for the loop) */}
                                                                                                            <div className="ayabus-marquee-content" aria-hidden="true">
                                                                                                                    {AWARDS_DATA.map((award) => (
                                                                                                                              <AwardBadge key={`track2-${award.id}`} award={award} />
                                                                                                                                      ))}
                                                                                                                                            </div>

                                                                                                                                                  <style>{`
                                                                                                                                                          .ayabus-marquee-container:hover .ayabus-marquee-content,
                                                                                                                                                                  .ayabus-marquee-container:active .ayabus-marquee-content {
                                                                                                                                                                            animation-play-state: paused; /* Pauses on hover/touch so users can read it */
                                                                                                                                                                                    }

                                                                                                                                                                                            .ayabus-marquee-content {
                                                                                                                                                                                                      display: flex;
                                                                                                                                                                                                                flex-shrink: 0;
                                                                                                                                                                                                                          align-items: center;
                                                                                                                                                                                                                                    justify-content: space-around;
                                                                                                                                                                                                                                              min-width: 100%;
                                                                                                                                                                                                                                                        animation: scrollLeft 35s linear infinite;
                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                        @keyframes scrollLeft {
                                                                                                                                                                                                                                                                                  from { transform: translateX(0); }
                                                                                                                                                                                                                                                                                            to { transform: translateX(-100%); }
                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                          `}</style>
                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                                                                                };

                                                                                                                                                                                                                                                                                                                export default MarqueeTrack;
                                                                                                                                                                                                                                                                                                                
import React from 'react';
import PartnerLogo from './PartnerLogo';

const ConveyorBelt = ({ partners }) => {
  if (!partners || partners.length === 0) return null;

    return (
        <div className="ayabus-partner-marquee" style={{
              display: 'flex',
                    overflow: 'hidden',
                          userSelect: 'none',
                                width: '100%',
                                      padding: '24px 0',
                                            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                                                  WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                                                      }}>
                                                            
                                                                  {/* Track 1 */}
                                                                        <div className="ayabus-marquee-track">
                                                                                {partners.map((partner) => (
                                                                                          <PartnerLogo key={`t1-${partner.id}`} partner={partner} />
                                                                                                  ))}
                                                                                                        </div>
                                                                                                              
                                                                                                                    {/* Track 2 (The Duplicate) */}
                                                                                                                          <div className="ayabus-marquee-track" aria-hidden="true">
                                                                                                                                  {partners.map((partner) => (
                                                                                                                                            <PartnerLogo key={`t2-${partner.id}`} partner={partner} />
                                                                                                                                                    ))}
                                                                                                                                                          </div>

                                                                                                                                                                <style>{`
                                                                                                                                                                        /* Pause the belt when the user wants to click or read a specific partner */
                                                                                                                                                                                .ayabus-partner-marquee:hover .ayabus-marquee-track,
                                                                                                                                                                                        .ayabus-partner-marquee:active .ayabus-marquee-track {
                                                                                                                                                                                                  animation-play-state: paused; 
                                                                                                                                                                                                          }

                                                                                                                                                                                                                  .ayabus-marquee-track {
                                                                                                                                                                                                                            display: flex;
                                                                                                                                                                                                                                      flex-shrink: 0;
                                                                                                                                                                                                                                                align-items: center;
                                                                                                                                                                                                                                                          min-width: 100%;
                                                                                                                                                                                                                                                                    animation: beltScroll 45s linear infinite;
                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                    /* 45 seconds ensures a smooth, readable crawl. 
                                                                                                                                                                                                                                                                                               Adjust time to make it faster or slower. */
                                                                                                                                                                                                                                                                                                       @keyframes beltScroll {
                                                                                                                                                                                                                                                                                                                 from { transform: translateX(0); }
                                                                                                                                                                                                                                                                                                                           to { transform: translateX(-100%); }
                                                                                                                                                                                                                                                                                                                                   }
                                                                                                                                                                                                                                                                                                                                         `}</style>
                                                                                                                                                                                                                                                                                                                                             </div>
                                                                                                                                                                                                                                                                                                                                               );
                                                                                                                                                                                                                                                                                                                                               };

                                                                                                                                                                                                                                                                                                                                               export default ConveyorBelt;
import React from 'react';

const ListingCardSkeleton = () => {
  return (
      <div className="ayabus-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
            <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--border-subtle)', borderRadius: 'var(--radius-md)' }}></div>
                  <div style={{ height: '20px', width: '70%', backgroundColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}></div>
                        <div style={{ height: '14px', width: '40%', backgroundColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}></div>
                              <div style={{ height: '24px', width: '50%', backgroundColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)', marginTop: 'auto' }}></div>
                                    
                                          <style>{`
                                                  @keyframes pulse {
                                                            0%, 100% { opacity: 1; }
                                                                      50% { opacity: .5; }
                                                                              }
                                                                                    `}</style>
                                                                                        </div>
                                                                                          );
                                                                                          };

                                                                                          export default ListingCardSkeleton;
import React from 'react';
import MarqueeTrack from './components/MarqueeTrack';

const AwardsModule = () => {
  return (
      <section style={{ 
            width: '100%', 
                  backgroundColor: 'var(--bg-surface)', // Uses the slightly elevated surface color
                        borderTop: '1px solid var(--border-subtle)',
                              borderBottom: '1px solid var(--border-subtle)',
                                    padding: '32px 0',
                                          display: 'flex',
                                                flexDirection: 'column',
                                                      alignItems: 'center',
                                                            gap: '24px',
                                                                  overflow: 'hidden' // Prevents the ribbon from blowing out the horizontal layout
                                                                      }}>
                                                                            
                                                                                  {/* Section Header */}
                                                                                        <div style={{ textAlign: 'center', padding: '0 24px' }}>
                                                                                                <h3 style={{ 
                                                                                                          fontSize: '12px', 
                                                                                                                    fontWeight: '800', 
                                                                                                                              color: 'var(--text-muted)', 
                                                                                                                                        textTransform: 'uppercase', 
                                                                                                                                                  letterSpacing: '2px',
                                                                                                                                                            margin: '0'
                                                                                                                                                                    }}>
                                                                                                                                                                              Industry Recognition
                                                                                                                                                                                      </h3>
                                                                                                                                                                                            </div>

                                                                                                                                                                                                  {/* The Infinite Scrolling Ribbon */}
                                                                                                                                                                                                        <MarqueeTrack />

                                                                                                                                                                                                            </section>
                                                                                                                                                                                                              );
                                                                                                                                                                                                              };

                                                                                                                                                                                                              export default AwardsModule;
                                                                                                                                                                                                              
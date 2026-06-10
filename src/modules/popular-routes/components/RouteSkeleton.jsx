import React from 'react';

const RouteSkeleton = () => {
  return (
      <div style={{ 
            display: 'flex', 
                  alignItems: 'center', 
                        justifyContent: 'space-between', 
                              padding: '12px 0',
                                    borderBottom: '1px solid var(--border-subtle)',
                                          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                              }}>
                                                    <div style={{ height: '14px', width: '35%', backgroundColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}></div>
                                                          <div style={{ height: '12px', width: '20px', backgroundColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}></div>
                                                                <div style={{ height: '14px', width: '35%', backgroundColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}></div>
                                                                      
                                                                            <style>{`
                                                                                    @keyframes pulse {
                                                                                              0%, 100% { opacity: 1; }
                                                                                                        50% { opacity: .5; }
                                                                                                                }
                                                                                                                      `}</style>
                                                                                                                          </div>
                                                                                                                            );
                                                                                                                            };

                                                                                                                            export default RouteSkeleton;
                                                                                                                            
import React from 'react';

const SubscribeFeedback = ({ type, message }) => {
  const isSuccess = type === 'success';
    
      return (
          <div style={{
                padding: '16px',
                      borderRadius: 'var(--radius-md)',
                            backgroundColor: isSuccess ? 'var(--status-success)' : 'var(--status-error)',
                                  color: '#FFFFFF',
                                        display: 'flex',
                                              alignItems: 'center',
                                                    gap: '12px',
                                                          fontSize: '14px',
                                                                fontWeight: '600',
                                                                      animation: 'slideUp var(--duration-normal) var(--ease-main)'
                                                                          }}>
                                                                                <span>{isSuccess ? '✅' : '⚠️'}</span>
                                                                                      <span>{message}</span>
                                                                                            
                                                                                                  <style>{`
                                                                                                          @keyframes slideUp {
                                                                                                                    from { opacity: 0; transform: translateY(10px); }
                                                                                                                              to { opacity: 1; transform: translateY(0); }
                                                                                                                                      }
                                                                                                                                            `}</style>
                                                                                                                                                </div>
                                                                                                                                                  );
                                                                                                                                                  };

                                                                                                                                                  export default SubscribeFeedback;
                                                                                                                                                  
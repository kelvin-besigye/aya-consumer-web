import React from 'react';

const SubmissionFeedback = () => (
  <div style={{ 
      padding: '24px', backgroundColor: 'var(--brand-subtle)', borderRadius: 'var(--radius-md)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px',
              animation: 'slideUp var(--duration-normal) var(--ease-main)'
                }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', color: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                                  <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Thank you for your feedback!</h4>
                                      <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Your rating helps us build a better travel network for everyone.</p>
                                        </div>
                                        );

                                        export default SubmissionFeedback;
                                        
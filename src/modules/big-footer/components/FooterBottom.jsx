import React from 'react';

const FooterBottom = () => {
  const currentYear = new Date().getFullYear();

    return (
        <div style={{ 
              display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', 
                    paddingTop: '32px', marginTop: '64px', borderTop: '1px solid var(--border-subtle)',
                          gap: '16px'
                              }}>
                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                            © {currentYear} AyaBus Technologies Ltd. All rights reserved.
                                                  </div>

                                                        {/* Locale & Currency settings (Live wires for global scaling) */}
                                                              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                                                      <button style={{ 
                                                                                background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', 
                                                                                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' 
                                                                                                  }}>
                                                                                                            🌍 English (UG)
                                                                                                                    </button>
                                                                                                                            <button style={{ 
                                                                                                                                      background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', 
                                                                                                                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' 
                                                                                                                                                        }}>
                                                                                                                                                                  Ugandan Shilling (UGX)
                                                                                                                                                                          </button>
                                                                                                                                                                                </div>
                                                                                                                                                                                    </div>
                                                                                                                                                                                      );
                                                                                                                                                                                      };

                                                                                                                                                                                      export default FooterBottom;
import React from 'react';

const StoreButtons = ({ currentOS }) => {
  // Styles for the unified button look
    const btnStyle = {
        display: 'flex', alignItems: 'center', gap: '10px',
            backgroundColor: 'var(--text-main)', color: 'var(--bg-surface)',
                padding: '10px 20px', borderRadius: 'var(--radius-md)',
                    textDecoration: 'none', transition: 'transform var(--duration-fast)',
                        cursor: 'pointer'
                          };

                            return (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                      {/* Google Play Button - Renders first if on Android */}
                                            <a 
                                                    href="https://play.google.com/store/apps/details?id=com.ayabus.app" 
                                                            target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                            style={{ ...btnStyle, order: currentOS === 'android' ? 1 : 2 }}
                                                                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                                                                                  >
                                                                                                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                                                                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.986 1.986 0 01-.61-.397A1.91 1.91 0 012 20.395V3.605c0-.526.204-1.03.567-1.402.13-.131.277-.246.442-.389zM14.924 13.13l3.226 3.226-5.748 3.32-2.825-2.825 5.347-3.721zM15.349 12l5.774-3.334a1.865 1.865 0 01.693-.243c.243-.024.492.016.716.117.224.101.417.258.558.455a1.996 1.996 0 01.272 1.402 1.928 1.928 0 01-1.045 1.34L16.48 15.11 15.35 12zM14.924 10.87L9.577 7.15l2.825-2.825 5.748 3.32-3.226 3.225z"/>
                                                                                                                            </svg>
                                                                                                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                                                                                                              <span style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.8 }}>Get it on</span>
                                                                                                                                                        <span style={{ fontSize: '15px', fontWeight: '800' }}>Google Play</span>
                                                                                                                                                                </div>
                                                                                                                                                                      </a>

                                                                                                                                                                            {/* App Store Button - Renders first if on iOS */}
                                                                                                                                                                                  <a 
                                                                                                                                                                                          href="https://apps.apple.com/app/ayabus/id123456789" 
                                                                                                                                                                                                  target="_blank" 
                                                                                                                                                                                                          rel="noopener noreferrer"
                                                                                                                                                                                                                  style={{ ...btnStyle, order: currentOS === 'ios' ? 1 : 2 }}
                                                                                                                                                                                                                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                                                                                                                                                                                                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                                                                                                                                                                                                          <path d="M16.5 4.34c.59-1.02 1.25-2.28 1.05-3.34-1.12.16-2.52.87-3.26 1.74-.63.74-1.25 1.97-1.02 3.03 1.25.13 2.5-.66 3.23-1.43zM21 17.52c-.89 2.56-3.22 6.48-5.34 6.48-1.55 0-2.28-.97-4.13-.97-1.87 0-2.65.95-4.1.95C5.12 24 2.5 19.34 2.5 15.22c0-3.69 2.1-6.14 4.54-6.14 1.54 0 2.53.94 3.9.94 1.36 0 2.65-1.02 4.36-1.02 1.83 0 3.42.87 4.35 2.18-3.32 1.77-2.73 6.07.35 6.34-.14.4-.52 1.21-1.04 2.01z"/>
                                                                                                                                                                                                                                                                  </svg>
                                                                                                                                                                                                                                                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                                                                                                                                                                                                                                                    <span style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.8 }}>Download on the</span>
                                                                                                                                                                                                                                                                                              <span style={{ fontSize: '15px', fontWeight: '800' }}>App Store</span>
                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                            </a>
                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                  );
                                                                                                                                                                                                                                                                                                                  };

                                                                                                                                                                                                                                                                                                                  export default StoreButtons;
                                                                                                                                                                                                                                                                                                                  
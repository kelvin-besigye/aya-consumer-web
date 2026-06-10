import React from 'react';

// Live Wire: Points to a dynamic routing endpoint. 
// Using a stable external API for the image ensures it is real and functional immediately.
const UNIVERSAL_APP_LINK = encodeURIComponent('https://ayabus.com/download-app');
const QR_API_URL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${UNIVERSAL_APP_LINK}&color=000000&bgcolor=FFFFFF`;

const QRCodeDisplay = () => {
  return (
      <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
                  padding: '16px', backgroundColor: '#FFFFFF', // QR codes need white backgrounds to scan reliably
                        borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                  }}>
                                        <img 
                                                src={QR_API_URL} 
                                                        alt="Scan to download the AyaBus App" 
                                                                width="120" 
                                                                        height="120" 
                                                                                style={{ display: 'block', pointerEvents: 'none' }}
                                                                                      />
                                                                                            <span style={{ marginTop: '12px', fontSize: '12px', fontWeight: '800', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                                                                    Scan to Download
                                                                                                          </span>
                                                                                                              </div>
                                                                                                                );
                                                                                                                };

                                                                                                                export default QRCodeDisplay;
                                                                                                            
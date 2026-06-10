import React from 'react';

const FooterBrand = ({ config }) => {
  return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '320px' }}>
            {/* Brand Logo Placeholder (To be replaced with your actual SVG logo) */}
                  <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--brand-primary)', letterSpacing: '-1px' }}>
                          AyaBus.
                                </div>
                                      
                                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
                                                    {config?.brandText || "Seamless digital transit for the modern traveler."}
                                                          </p>

                                                                {/* Live Wire Contacts */}
                                                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                              <a href={`mailto:${config?.contactEmail}`} style={{ fontSize: '14px', color: 'var(--text-main)', textDecoration: 'none', fontWeight: '600' }}>
                                                                                        {config?.contactEmail}
                                                                                                </a>
                                                                                                        <a href={`tel:${config?.contactPhone}`} style={{ fontSize: '14px', color: 'var(--text-main)', textDecoration: 'none', fontWeight: '600' }}>
                                                                                                                  {config?.contactPhone}
                                                                                                                          </a>
                                                                                                                                </div>

                                                                                                                                      {/* Social Icons (Zero Dependencies) */}
                                                                                                                                            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                                                                                                                                                    {config?.socials?.facebook && (
                                                                                                                                                              <a href={config.socials.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>
                                                                                                                                                                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                                                                                                                                                                                    </a>
                                                                                                                                                                                            )}
                                                                                                                                                                                                    {config?.socials?.twitter && (
                                                                                                                                                                                                              <a href={config.socials.twitter} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>
                                                                                                                                                                                                                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                                                                                                                                                                                                                                     </a>
                                                                                                                                                                                                                                             )}
                                                                                                                                                                                                                                                     {config?.socials?.instagram && (
                                                                                                                                                                                                                                                               <a href={config.socials.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>
                                                                                                                                                                                                                                                                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                                                                                                                                                                                                                                                                                     </a>
                                                                                                                                                                                                                                                                                             )}
                                                                                                                                                                                                                                                                                                   </div>
                                                                                                                                                                                                                                                                                                       </div>
                                                                                                                                                                                                                                                                                                         );
                                                                                                                                                                                                                                                                                                         };

                                                                                                                                                                                                                                                                                                         export default FooterBrand;
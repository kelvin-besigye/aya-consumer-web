import React from 'react';

const FooterLinksColumn = ({ title, links }) => {
  return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4 style={{ 
                    fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', 
                            textTransform: 'uppercase', letterSpacing: '1px', margin: 0 
                                  }}>
                                          {title}
                                                </h4>
                                                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                              {links.map((link, index) => (
                                                                        <li key={index}>
                                                                                    <a 
                                                                                                  href={link.url} 
                                                                                                                style={{ 
                                                                                                                                color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none', 
                                                                                                                                                transition: 'color var(--duration-fast)' 
                                                                                                                                                              }}
                                                                                                                                                                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-primary)'}
                                                                                                                                                                                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                                                                                                                                                                                      >
                                                                                                                                                                                                                    {link.label}
                                                                                                                                                                                                                                </a>
                                                                                                                                                                                                                                          </li>
                                                                                                                                                                                                                                                  ))}
                                                                                                                                                                                                                                                        </ul>
                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                              );
                                                                                                                                                                                                                                                              };

                                                                                                                                                                                                                                                              export default FooterLinksColumn;
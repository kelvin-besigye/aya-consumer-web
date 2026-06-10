import React from 'react';
import { getInitials } from '../utils/avatarGenerator';

const PartnerLogo = ({ partner }) => {
  const hasLogo = partner.logo_url && partner.logo_url.trim() !== '';

    return (
        <div style={{
              display: 'flex',
                    alignItems: 'center',
                          gap: '16px',
                                padding: '16px 32px',
                                      margin: '0 16px',
                                            backgroundColor: 'var(--bg-surface)',
                                                  border: '1px solid var(--border-subtle)',
                                                        borderRadius: 'var(--radius-full)',
                                                              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                                                                    transition: 'transform var(--duration-fast), box-shadow var(--duration-fast)',
                                                                          cursor: 'pointer',
                                                                                minWidth: 'max-content'
                                                                                    }}
                                                                                        onMouseEnter={(e) => {
                                                                                              e.currentTarget.style.transform = 'translateY(-2px)';
                                                                                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.06)';
                                                                                                          e.currentTarget.style.borderColor = partner.brand_color || 'var(--brand-primary)';
                                                                                                              }}
                                                                                                                  onMouseLeave={(e) => {
                                                                                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                                                                                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
                                                                                                                                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                                                                                                                                        }}
                                                                                                                                            >
                                                                                                                                                  {/* Brand Visual (Logo or Initials) */}
                                                                                                                                                        <div style={{
                                                                                                                                                                width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden',
                                                                                                                                                                        backgroundColor: hasLogo ? 'transparent' : (partner.brand_color || 'var(--brand-subtle)'),
                                                                                                                                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                                                                                                                                        color: '#FFFFFF', fontWeight: '900', fontSize: '14px', letterSpacing: '1px'
                                                                                                                                                                                              }}>
                                                                                                                                                                                                      {hasLogo ? (
                                                                                                                                                                                                                <img src={partner.logo_url} alt={`${partner.name} logo`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                                                                                                                                                                                        ) : (
                                                                                                                                                                                                                                  getInitials(partner.name)
                                                                                                                                                                                                                                          )}
                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                      {/* Partner Name */}
                                                                                                                                                                                                                                                            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
                                                                                                                                                                                                                                                                    {partner.name}
                                                                                                                                                                                                                                                                          </span>
                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                                                };

                                                                                                                                                                                                                                                                                export default PartnerLogo;
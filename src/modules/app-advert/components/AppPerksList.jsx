import React from 'react';
import { APP_FEATURES } from '../data/appFeatures';

const AppPerksList = () => {
  return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px', marginBottom: '32px' }}>
            {APP_FEATURES.map((perk) => (
                    <div key={perk.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                              {/* Custom Checkmark matching brand primary */}
                                        <div style={{ 
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                                                minWidth: '28px', height: '28px', 
                                                                            backgroundColor: 'var(--brand-subtle)', borderRadius: '50%', color: 'var(--brand-primary)' 
                                                                                      }}>
                                                                                                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                                <path d="M1.5 5.5L5 9L12.5 1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                                                                                            </svg>
                                                                                                                                      </div>
                                                                                                                                                <div>
                                                                                                                                                            <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                                                                                                                                                                          {perk.title}
                                                                                                                                                                                      </h4>
                                                                                                                                                                                                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                                                                                                                                                                                                                {perk.description}
                                                                                                                                                                                                                            </p>
                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                    ))}
                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                                          };

                                                                                                                                                                                                                                                          export default AppPerksList;
                                                                                                                                                                                                                                                          
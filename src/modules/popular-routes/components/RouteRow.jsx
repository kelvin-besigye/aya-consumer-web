import React from 'react';

const RouteRow = ({ route, onRouteClick }) => {
  return (
      <div 
            onClick={() => onRouteClick(route.origin_city, route.destination_city)}
                  style={{
                          display: 'flex',
                                  alignItems: 'center',
                                          justifyContent: 'space-between',
                                                  padding: '14px 12px',
                                                          borderBottom: '1px solid var(--border-subtle)',
                                                                  cursor: 'pointer',
                                                                          transition: 'background-color var(--duration-fast)',
                                                                                  borderRadius: 'var(--radius-sm)',
                                                                                          marginBottom: '4px'
                                                                                                }}
                                                                                                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                                                                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                                                                >
                                                                                                                      <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', flex: 1 }}>
                                                                                                                              {route.origin_city}
                                                                                                                                    </span>
                                                                                                                                          
                                                                                                                                                {/* Directional Arrow matching brand colors */}
                                                                                                                                                      <span style={{ color: 'var(--brand-primary)', margin: '0 12px', fontSize: '12px' }}>
                                                                                                                                                              ➔
                                                                                                                                                                    </span>
                                                                                                                                                                          
                                                                                                                                                                                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', flex: 1, textAlign: 'right' }}>
                                                                                                                                                                                        {route.destination_city}
                                                                                                                                                                                              </span>
                                                                                                                                                                                                    
                                                                                                                                                                                                          {/* subtle indicator of popularity */}
                                                                                                                                                                                                                <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--brand-subtle)', color: 'var(--brand-primary)', width: '24px', height: '24px', borderRadius: '50%', fontSize: '10px' }}>
                                                                                                                                                                                                                        🔥
                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                    };

                                                                                                                                                                                                                                    export default RouteRow;
                                                                                                                                                                                                                                    
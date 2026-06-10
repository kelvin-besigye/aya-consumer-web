import React, { useState, useEffect } from 'react';
import ConveyorBelt from './components/ConveyorBelt';
import { fetchActivePartners } from './data/partnersApi';

const BusPartnersModule = () => {
  const [partners, setPartners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
          let mounted = true;
              const loadPartners = async () => {
                    const data = await fetchActivePartners();
                          if (mounted) {
                                  setPartners(data);
                                          setIsLoading(false);
                                                }
                                                    };
                                                        loadPartners();
                                                            return () => { mounted = false; };
                                                              }, []);

                                                                return (
                                                                    <section style={{ 
                                                                          width: '100%', 
                                                                                backgroundColor: 'var(--bg-canvas)', 
                                                                                      padding: '64px 0',
                                                                                            display: 'flex',
                                                                                                  flexDirection: 'column',
                                                                                                        alignItems: 'center',
                                                                                                              overflow: 'hidden',
                                                                                                                    borderTop: '1px solid var(--border-subtle)',
                                                                                                                          borderBottom: '1px solid var(--border-subtle)'
                                                                                                                              }}>
                                                                                                                                    
                                                                                                                                          {/* Header Context Area */}
                                                                                                                                                <div style={{ textAlign: 'center', padding: '0 24px', marginBottom: '24px', maxWidth: '600px' }}>
                                                                                                                                                        <h2 style={{ 
                                                                                                                                                                  fontSize: '28px', 
                                                                                                                                                                            fontWeight: '900', 
                                                                                                                                                                                      color: 'var(--text-main)', 
                                                                                                                                                                                                margin: '0 0 12px 0', 
                                                                                                                                                                                                          letterSpacing: '-0.5px' 
                                                                                                                                                                                                                  }}>
                                                                                                                                                                                                                            The networks we connect.
                                                                                                                                                                                                                                    </h2>
                                                                                                                                                                                                                                            <p style={{ fontSize: '16px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
                                                                                                                                                                                                                                                      We are proud to partner with the most reliable transport operators across the region. Here are the companies currently powering your journeys.
                                                                                                                                                                                                                                                              </p>
                                                                                                                                                                                                                                                                    </div>

                                                                                                                                                                                                                                                                          {/* The Live Wire Output */}
                                                                                                                                                                                                                                                                                {isLoading ? (
                                                                                                                                                                                                                                                                                        <div style={{ display: 'flex', gap: '24px', padding: '24px 0', overflow: 'hidden', opacity: 0.5 }}>
                                                                                                                                                                                                                                                                                                  {[1, 2, 3, 4, 5].map(i => (
                                                                                                                                                                                                                                                                                                              <div key={i} style={{ width: '220px', height: '70px', backgroundColor: 'var(--border-subtle)', borderRadius: 'var(--radius-full)', animation: 'pulse 1.5s infinite' }} />
                                                                                                                                                                                                                                                                                                                        ))}
                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                      ) : partners.length > 0 ? (
                                                                                                                                                                                                                                                                                                                                              <ConveyorBelt partners={partners} />
                                                                                                                                                                                                                                                                                                                                                    ) : (
                                                                                                                                                                                                                                                                                                                                                            <div style={{ padding: '32px', color: 'var(--text-muted)', fontSize: '14px' }}>
                                                                                                                                                                                                                                                                                                                                                                      Partner network currently syncing...
                                                                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                                                                                    )}

                                                                                                                                                                                                                                                                                                                                                                                        </section>
                                                                                                                                                                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                                                                                                                                                                          };

                                                                                                                                                                                                                                                                                                                                                                                          export default BusPartnersModule;
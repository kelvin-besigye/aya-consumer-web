import React from 'react';
import { useCountUp } from '../utils/useCountUp';
import { formatMetric } from '../utils/formatters';

const StatCard = ({ label, value, icon, suffix = "" }) => {
  const { count, elementRef } = useCountUp(value, 2500);

    return (
        <div ref={elementRef} style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', 
                    justifyContent: 'center', minWidth: '180px', padding: '16px',
                          scrollSnapAlign: 'center' // For mobile horizontal scrolling
                              }}>
                                    {/* Icon Wrapper */}
                                          <div style={{ 
                                                  color: 'var(--brand-primary)', marginBottom: '16px',
                                                          backgroundColor: 'var(--brand-subtle)', padding: '16px', borderRadius: '50%',
                                                                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                                        }}>
                                                                                {icon}
                                                                                      </div>
                                                                                            
                                                                                                  {/* Dynamic Number */}
                                                                                                        <div style={{ 
                                                                                                                fontSize: '36px', fontWeight: '900', color: 'var(--text-main)', 
                                                                                                                        lineHeight: '1', letterSpacing: '-1px', display: 'flex', alignItems: 'baseline'
                                                                                                                              }}>
                                                                                                                                      {formatMetric(count)}
                                                                                                                                              {count === value && value > 0 && <span style={{ color: 'var(--brand-primary)', fontSize: '24px', marginLeft: '2px' }}>{suffix}</span>}
                                                                                                                                                    </div>
                                                                                                                                                          
                                                                                                                                                                {/* Label */}
                                                                                                                                                                      <div style={{ 
                                                                                                                                                                              fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', 
                                                                                                                                                                                      textTransform: 'uppercase', letterSpacing: '1px', marginTop: '8px'
                                                                                                                                                                                            }}>
                                                                                                                                                                                                    {label}
                                                                                                                                                                                                          </div>
                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                );
                                                                                                                                                                                                                };

                                                                                                                                                                                                                export default StatCard;
                                                                                                                                                                                                                
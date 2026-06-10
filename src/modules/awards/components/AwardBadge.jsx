import React from 'react';

const AwardBadge = ({ award }) => {
  // A rapid switch to render different premium vector shapes based on the award type
    const renderIcon = () => {
        const svgProps = { width: "32", height: "32", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" };
            switch(award.iconType) {
                  case 'shield':
                          return <svg {...svgProps} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
                                case 'star':
                                        return <svg {...svgProps} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
                                              case 'crown':
                                                      return <svg {...svgProps} viewBox="0 0 24 24"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>;
                                                            case 'wheel':
                                                                    return <svg {...svgProps} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="22" x2="12" y2="15"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="22" y1="12" x2="15" y2="12"/><line x1="9" y1="12" x2="2" y2="12"/><line x1="19.07" y1="4.93" x2="14.12" y2="9.88"/><line x1="9.88" y1="14.12" x2="4.93" y2="19.07"/><line x1="19.07" y1="19.07" x2="14.12" y2="14.12"/><line x1="9.88" y1="9.88" x2="4.93" y2="4.93"/></svg>;
                                                                          case 'ribbon':
                                                                                default:
                                                                                        return <svg {...svgProps} viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>;
                                                                                            }
                                                                                              };

                                                                                                return (
                                                                                                    <div style={{
                                                                                                          display: 'flex',
                                                                                                                alignItems: 'center',
                                                                                                                      gap: '16px',
                                                                                                                            padding: '0 32px', // Horizontal padding creates the spacing in the ribbon
                                                                                                                                  borderRight: '1px solid var(--border-subtle)', // Separator line between awards
                                                                                                                                        minWidth: 'max-content'
                                                                                                                                            }}>
                                                                                                                                                  <div style={{ color: 'var(--brand-primary)' }}>
                                                                                                                                                          {renderIcon()}
                                                                                                                                                                </div>
                                                                                                                                                                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                                                                                                              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                                                                                                                                                        {award.title}
                                                                                                                                                                                                </span>
                                                                                                                                                                                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>
                                                                                                                                                                                                                  {award.category} • {award.year}
                                                                                                                                                                                                                          </span>
                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                      );
                                                                                                                                                                                                                                      };

                                                                                                                                                                                                                                      export default AwardBadge;
                                                                                                                                                                                                                                      
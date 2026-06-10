import React from 'react';

const FAQCategoryTabs = ({ activeCategory, setActiveCategory }) => {
  const tabs = [
      { id: 'PASSENGER', label: 'Traveler Support' },
          { id: 'PARTNER', label: 'Partner & Admin' }
            ];

              return (
                  <div className="ayabus-hide-scrollbar" style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto' }}>
                        {tabs.map(tab => (
                                <button
                                          key={tab.id}
                                                    className={`ayabus-btn ${activeCategory === tab.id ? 'ayabus-btn-primary' : 'ayabus-btn-ghost'}`}
                                                              onClick={() => setActiveCategory(tab.id)}
                                                                        style={{ borderRadius: 'var(--radius-full)', height: '40px', fontSize: '13px', whiteSpace: 'nowrap' }}
                                                                                >
                                                                                          {tab.label}
                                                                                                  </button>
                                                                                                        ))}
                                                                                                            </div>
                                                                                                              );
                                                                                                              };

                                                                                                              export default FAQCategoryTabs;
import React from 'react';

const FAQSearch = ({ searchQuery, setSearchQuery }) => (
  <div style={{ position: 'relative', width: '100%', marginBottom: '24px' }}>
      <input 
            type="text" 
                  className="ayabus-input" 
                        placeholder="Search for answers..."
                              value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                          style={{ paddingLeft: '40px', height: '56px', fontSize: '16px' }}
                                              />
                                                  <svg 
                                                        style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--text-muted)' }} 
                                                              width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                                  >
                                                                        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                                                            </svg>
                                                                              </div>
                                                                              );

                                                                              export default FAQSearch;
import React from 'react';

const NewsletterForm = ({ formData, setFormData, onSubmit, isLoading }) => {
  return (
      <form 
            onSubmit={onSubmit} 
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', width: '100%' }}
                      >
                            <div style={{ flex: '1 1 200px' }}>
                                    <input 
                                              type="email" 
                                                        className="ayabus-input" 
                                                                  placeholder="Enter your email address"
                                                                            value={formData.email}
                                                                                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                                                                disabled={isLoading}
                                                                                                          required
                                                                                                                  />
                                                                                                                        </div>
                                                                                                                              
                                                                                                                                    <div style={{ flex: '1 1 150px' }}>
                                                                                                                                            <input 
                                                                                                                                                      type="text" 
                                                                                                                                                                className="ayabus-input" 
                                                                                                                                                                          placeholder="Your City (e.g., Kampala)"
                                                                                                                                                                                    value={formData.city}
                                                                                                                                                                                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                                                                                                                                                                        disabled={isLoading}
                                                                                                                                                                                                                  required
                                                                                                                                                                                                                          />
                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                      <button 
                                                                                                                                                                                                                                              type="submit" 
                                                                                                                                                                                                                                                      className="ayabus-btn ayabus-btn-primary" 
                                                                                                                                                                                                                                                              disabled={isLoading}
                                                                                                                                                                                                                                                                      style={{ flex: '0 0 auto', minWidth: '140px', justifyContent: 'center' }}
                                                                                                                                                                                                                                                                            >
                                                                                                                                                                                                                                                                                    {isLoading ? 'Registering...' : 'Subscribe'}
                                                                                                                                                                                                                                                                                          </button>
                                                                                                                                                                                                                                                                                              </form>
                                                                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                                                                };

                                                                                                                                                                                                                                                                                                export default NewsletterForm;
                                                                                                                                                                                                                                                                                                
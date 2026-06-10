import React from 'react';
import ListingCard from './ListingCard';
import ListingCardSkeleton from './ListingCardSkeleton';

const ListingGrid = ({ listings, isLoading, searchCity }) => {
  if (isLoading) {
      return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
                    {[1, 2, 3, 4, 5, 6].map(i => <ListingCardSkeleton key={i} />)}
                          </div>
                              );
                                }

                                  if (!listings || listings.length === 0) {
                                      return (
                                            <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
                                                    <h3>No verified accommodations found in {searchCity}.</h3>
                                                            <p>Try adjusting your search filters or dates.</p>
                                                                  </div>
                                                                      );
                                                                        }

                                                                          return (
                                                                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
                                                                                    {listings.map(listing => (
                                                                                            <ListingCard key={listing.id} listing={listing} searchCity={searchCity} />
                                                                                                  ))}
                                                                                                      </div>
                                                                                                        );
                                                                                                        };

                                                                                                        export default ListingGrid;
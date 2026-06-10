import React from 'react';
import { buildAffiliateLink } from '../../utils/buildAffiliateLink';

const ListingCard = ({ listing, searchCity }) => {
  const handleRedirect = () => {
      const affiliateUrl = buildAffiliateLink(listing.rawUrl || "https://example-partner.com", listing.id, searchCity);
          window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
            };

              return (
                  <div className="ayabus-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer', overflow: 'hidden', padding: '0' }} onClick={handleRedirect}>
                        <div style={{ width: '100%', height: '200px', backgroundImage: `url(${listing.thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}></div>
                              
                                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{listing.name}</h3>
                                                                <span style={{ backgroundColor: 'var(--brand-subtle)', color: 'var(--brand-primary)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 'bold' }}>
                                                                            ★ {listing.rating}
                                                                                      </span>
                                                                                              </div>
                                                                                                      
                                                                                                              <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>Score: {listing.reviewScore} / 10</p>
                                                                                                                      
                                                                                                                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                                                                                                                                        {listing.amenities.map((amenity, i) => (
                                                                                                                                                    <span key={i} style={{ fontSize: '11px', padding: '2px 6px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', color: 'var(--text-muted)' }}>
                                                                                                                                                                  {amenity}
                                                                                                                                                                              </span>
                                                                                                                                                                                        ))}
                                                                                                                                                                                                </div>

                                                                                                                                                                                                        <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                                                                                                                                                                                                  <div>
                                                                                                                                                                                                                              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Price per night</p>
                                                                                                                                                                                                                                          <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--brand-primary)', margin: 0 }}>{listing.currency} {listing.pricePerNight.toLocaleString()}</p>
                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                              <button className="ayabus-btn ayabus-btn-primary" style={{ height: '36px', fontSize: '12px', padding: '0 16px' }}>Book</button>
                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                  );
                                                                                                                                                                                                                                                                                  };

                                                                                                                                                                                                                                                                                  export default ListingCard;
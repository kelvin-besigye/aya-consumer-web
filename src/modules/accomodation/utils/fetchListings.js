import { ACCOM_CONFIG } from '../data/apiConfig';
import { normalizeListing } from '../data/responseSchemas';

export const fetchAccommodations = async (searchParams) => {
  const { city, checkIn, checkOut, guests } = searchParams;
    
      try {
          // REAL WIRE: This is the live fetch logic ready for the partner.
              /*
                  const response = await fetch(`${ACCOM_CONFIG.BASE_URL}/properties?city=${city}&checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`, {
                        headers: { 'Authorization': `Bearer ${ACCOM_CONFIG.API_KEY}` },
                              signal: AbortSignal.timeout(ACCOM_CONFIG.TIMEOUT_MS)
                                  });
                                      if (!response.ok) throw new Error('Partner API failed');
                                          const data = await response.json();
                                              return data.results.map(item => normalizeListing(item, 'PartnerName'));
                                                  */

                                                      // SIMULATED WIRE: Structurally identical to what the above will return.
                                                          return new Promise((resolve) => {
                                                                setTimeout(() => {
                                                                        resolve([
                                                                                  normalizeListing({ id: "101", property_name: "Kampala Serena Hotel", image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80", price_amount: 850000, star_rating: 5, review_score: 9.4, amenities: ["WiFi", "Pool"] }, "MockAPI"),
                                                                                            normalizeListing({ id: "102", property_name: "Latitude 0 Degrees", image_url: "https://images.unsplash.com/photo-1551882547-ff40c0d13c81?auto=format&fit=crop&w=600&q=80", price_amount: 600000, star_rating: 4, review_score: 8.8, amenities: ["WiFi", "Gym"] }, "MockAPI"),
                                                                                                      normalizeListing({ id: "103", property_name: "Fairway Hotel & Spa", image_url: "https://images.unsplash.com/photo-1542314831-c6a4d1409b1c?auto=format&fit=crop&w=600&q=80", price_amount: 350000, star_rating: 4, review_score: 8.2, amenities: ["WiFi", "Breakfast"] }, "MockAPI"),
                                                                                                                normalizeListing({ id: "104", property_name: "Bushpig Backpackers", image_url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80", price_amount: 80000, star_rating: 2, review_score: 8.9, amenities: ["WiFi", "Bar"] }, "MockAPI"),
                                                                                                                        ]);
                                                                                                                              }, 1200); // Simulate network latency
                                                                                                                                  });

                                                                                                                                    } catch (error) {
                                                                                                                                        console.error("Accommodation Fetch Error:", error);
                                                                                                                                            throw error;
                                                                                                                                              }
                                                                                                                                              }; 
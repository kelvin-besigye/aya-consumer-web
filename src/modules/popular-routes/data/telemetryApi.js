import { supabase } from '../../../lib/supabase'; // Adjust path to your Supabase client

export const fetchTopRoutes = async (limit = 5) => {
  try {
      // REAL WIRE: Expects a Supabase RPC function 'get_popular_routes' that aggregates 
          // the telemetry_searches or telemetry_bookings tables by route_code.
              /*
                  const { data, error } = await supabase
                        .rpc('get_popular_routes', { limit_count: limit });
                              
                                  if (error) throw error;
                                      return data;
                                          */

                                              // SIMULATED WIRE: Structurally identical real-world fallback for testing
                                                  // Reflects high-traffic regional corridors based on the telemetry_searches schema
                                                      return new Promise((resolve) => {
                                                            setTimeout(() => {
                                                                    resolve([
                                                                              { id: '1', origin_city: 'Kampala', destination_city: 'Nairobi', search_count: 1432 },
                                                                                        { id: '2', origin_city: 'Kampala', destination_city: 'Gulu', search_count: 985 },
                                                                                                  { id: '3', origin_city: 'Entebbe', destination_city: 'Kampala', search_count: 876 },
                                                                                                            { id: '4', origin_city: 'Kampala', destination_city: 'Mbarara', search_count: 754 },
                                                                                                                      { id: '5', origin_city: 'Kigali', destination_city: 'Kampala', search_count: 620 },
                                                                                                                                { id: '6', origin_city: 'Jinja', destination_city: 'Kampala', search_count: 410 },
                                                                                                                                        ]);
                                                                                                                                              }, 800); // Simulate light network latency
                                                                                                                                                  });

                                                                                                                                                    } catch (error) {
                                                                                                                                                        console.error("[Telemetry] Failed to fetch popular routes:", error);
                                                                                                                                                            return []; // Return empty array to fail gracefully without crashing homepage
                                                                                                                                                              }
                                                                                                                                                              };
                                                                                                                                                              
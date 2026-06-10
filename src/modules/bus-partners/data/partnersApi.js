import { supabase } from '../../../lib/supabase';

export const fetchActivePartners = async () => {
  try {
      // REAL WIRE: Fetches directly from your live database, grabbing only active operators.
          /*
              const { data, error } = await supabase
                    .from('partner_operators')
                          .select('id, name, logo_url, brand_color')
                                .eq('is_active', true)
                                      .order('name', { ascending: true });

                                          if (error) throw error;
                                              return data;
                                                  */

                                                      // SIMULATED WIRE: Highly localized Ugandan fallback data for UI testing
                                                          return new Promise((resolve) => {
                                                                setTimeout(() => {
                                                                        resolve([
                                                                                  { id: '1', name: 'Link Bus Services', logo_url: '', brand_color: '#E63946' },
                                                                                            { id: '2', name: 'YY Coaches', logo_url: '', brand_color: '#1D3557' },
                                                                                                      { id: '3', name: 'Global Coaches', logo_url: '', brand_color: '#457B9D' },
                                                                                                                { id: '4', name: 'Gateway Bus', logo_url: '', brand_color: '#2A9D8F' },
                                                                                                                          { id: '5', name: 'Baby Coach', logo_url: '', brand_color: '#F4A261' },
                                                                                                                                    { id: '6', name: 'Mash Poa', logo_url: '', brand_color: '#2B2D42' },
                                                                                                                                              { id: '7', name: 'Modern Coast', logo_url: '', brand_color: '#8D99AE' }
                                                                                                                                                      ]);
                                                                                                                                                            }, 400); // Simulate network latency
                                                                                                                                                                });

                                                                                                                                                                  } catch (error) {
                                                                                                                                                                      console.error("[Bus Partners API] Failed to fetch active partners:", error);
                                                                                                                                                                          return [];
                                                                                                                                                                            }
                                                                                                                                                                            };
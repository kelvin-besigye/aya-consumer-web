import { supabase } from '../../../lib/supabase';

export const subscribeUser = async (email, city) => {
  try {
      const { error } = await supabase
            .from('newsletter_subscribers')
                  .insert([{ email: email.toLowerCase().trim(), city: city.trim() }]);

                      if (error) {
                            // Handle the unique constraint violation gracefully
                                  if (error.code === '23505') {
                                          throw new Error('This email is already subscribed to our network.');
                                                }
                                                      throw new Error('Failed to connect to the server. Please try again.');
                                                          }
                                                              
                                                                  return { success: true };
                                                                    } catch (err) {
                                                                        console.error("[Newsletter API Error]:", err);
                                                                            throw err;
                                                                              }
                                                                              };
                                                                              
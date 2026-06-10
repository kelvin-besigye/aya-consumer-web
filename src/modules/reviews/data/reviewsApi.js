import { supabase } from '../../../lib/supabase';

export const fetchRecentReviews = async () => {
  try {
      const { data, error } = await supabase
            .from('platform_reviews')
                  .select('id, author_name, content, created_at')
                        .eq('status', 'ACTIVE')
                              .order('created_at', { ascending: false })
                                    .limit(20); // Limit to top 20 to keep the ticker lightweight

                                        if (error) throw error;
                                            return data;
                                              } catch (err) {
                                                  console.error("[Reviews API] Failed to fetch reviews:", err);
                                                      return []; 
                                                        }
                                                        };

                                                        export const submitUserReview = async (authorName, content) => {
                                                          try {
                                                              const newReview = {
                                                                    author_name: authorName.trim() || 'Anonymous Traveler',
                                                                          content: content.trim()
                                                                              };

                                                                                  const { data, error } = await supabase
                                                                                        .from('platform_reviews')
                                                                                              .insert([newReview])
                                                                                                    .select() // Return the inserted row so we can instantly add it to the UI
                                                                                                          .single();
                                                                                                                
                                                                                                                    if (error) throw error;
                                                                                                                        return data;
                                                                                                                          } catch (err) {
                                                                                                                              console.error("[Reviews API] Submission failed:", err);
                                                                                                                                  throw err;
                                                                                                                                    }
                                                                                                                                    };
                                                                                                                                    
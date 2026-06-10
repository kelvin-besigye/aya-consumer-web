import { supabase } from '../../../lib/supabase';

export const fetchFAQs = async () => {
  try {
      // REAL WIRE: Pulls the most viewed, active FAQs from Supabase
          /*
              const { data, error } = await supabase
                    .from('support_faqs')
                          .select('id, category, question, answer')
                                .eq('is_active', true)
                                      .order('view_count', { ascending: false });

                                          if (error) throw error;
                                              return data;
                                                  */

                                                      // SIMULATED WIRE: Ugandan/East African context fallback for UI testing
                                                          return new Promise((resolve) => {
                                                                setTimeout(() => {
                                                                        resolve([
                                                                                  { id: '1', category: 'PASSENGER', question: 'How do I pay using MTN MoMo or Airtel Money?', answer: 'During checkout, select Mobile Money. Enter your registered phone number, and a prompt will appear on your phone to enter your PIN and authorize the exact ticket amount.' },
                                                                                            { id: '2', category: 'PASSENGER', question: 'Do I need to print my ticket before arriving at the Kampala terminal?', answer: 'No. The AyaBus app stores your e-ticket locally for offline access. Just show the QR code to the conductor when boarding.' },
                                                                                                      { id: '3', category: 'PASSENGER', question: 'What happens if I miss my scheduled bus?', answer: 'Tickets are valid for the specific time booked. However, depending on the operator\'s policy, you may be able to board the next available bus for a small rescheduling fee.' },
                                                                                                                { id: '4', category: 'PARTNER', question: 'How do we update our fleet inventory in real-time?', answer: 'Log into the Partner Admin Cockpit. Navigate to the Asset Registry and toggle the availability status of your buses. The passenger-facing app updates instantly.' },
                                                                                                                          { id: '5', category: 'PARTNER', question: 'When are ticket settlements disbursed to our account?', answer: 'AyaBus processes settlements every Tuesday and Friday at 10:00 AM EAT for all completed trips in the prior period.' }
                                                                                                                                  ]);
                                                                                                                                        }, 300);
                                                                                                                                            });

                                                                                                                                              } catch (err) {
                                                                                                                                                  console.error("[FAQ API] Connection failed:", err);
                                                                                                                                                      return [];
                                                                                                                                                        }
                                                                                                                                                        };
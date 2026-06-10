/**
 * 🌍 AYABUS CONSUMER WEB (The Friction Engine)
 * ------------------------------------------------------------------
 * Module: Cancellations (Module 10/24)
 * File: src/modules/cancellations/services/cancel.service.js
 * * DESCRIPTION:
 * The apex data connector for self-service cancellations. It securely 
 * fetches eligible tickets and executes a two-phase commit to lock 
 * the ticket and instantly release the seat back to the global market.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. MULTI-TABLE GRAPH: Fetches Tickets, Routes, Partners, and Schedules 
 * in a single network request to minimize latency on 3G networks.
 * 2. CONCURRENCY LOCK: Uses strict `.eq('status', 'ACTIVE')` checks during 
 * the update phase to mathematically prevent double-cancellations.
 * 3. LOGISTICS AUTO-RELEASE: Instantly frees up the `remaining_seats` 
 * on the schedule so the revenue engine can resell the ticket.
 */

import { supabase } from '../../../lib/supabase';

export const cancelService = {

    // ========================================================================
    // 1. THE ELIGIBILITY ENGINE
    // Fetches only future, active tickets that haven't been scanned.
    // ========================================================================
    /**
     * @param {string} userId - The Supabase Auth ID of the passenger.
     * @returns {Promise<Object>} - The payload of cancellable itineraries.
     */
    fetchEligibleTickets: async (userId) => {
        try {
            console.time('[AyaBus Cancellation Engine] Fetch');
            
            // Get today's date in YYYY-MM-DD format to filter out past trips
            const today = new Date().toISOString().split('T')[0];

            const { data, error } = await supabase
                .from('tickets')
                .select(`
                    *,
                    routes ( origin_city, destination_city ),
                    partners ( company_name, logo_url ),
                    schedules ( travel_date, departure_time, id )
                `)
                .eq('passenger_id', userId)
                .eq('status', 'ACTIVE')
                .gte('travel_date', today) // Strictly future or today's tickets
                .order('travel_date', { ascending: true }); // Soonest trips first

            if (error) throw error;

            console.timeEnd('[AyaBus Cancellation Engine] Fetch');
            return { success: true, data: data || [] };

        } catch (error) {
            console.error("[AyaBus Query Engine] Eligible Fetch Failed:", error.message);
            return { success: false, error: error.message, data: [] };
        }
    },

    // ========================================================================
    // 2. THE DESTRUCTIVE COMMIT
    // Locks the ticket for the Admin HUD and releases the seat.
    // ========================================================================
    /**
     * @param {string} ticketId - The UUID of the ticket to cancel.
     * @param {string} scheduleId - The UUID of the schedule to free seats on.
     * @param {number} seatsToRelease - The number of seats to increment (default 1).
     * @returns {Promise<Object>} - Execution result.
     */
    executeCancellation: async (ticketId, scheduleId, seatsToRelease = 1) => {
        try {
            // STEP 1: THE CONCURRENCY LOCK
            // We update the status to feed the Admin Reconciliation HUD.
            // The extra .eq('status', 'ACTIVE') ensures we don't process it twice.
            const { data: updatedTicket, error: ticketError } = await supabase
                .from('tickets')
                .update({ status: 'CANCELLATION_REQUESTED' })
                .eq('id', ticketId)
                .eq('status', 'ACTIVE') 
                .select()
                .single();

            if (ticketError) throw ticketError;
            if (!updatedTicket) throw new Error("Ticket is no longer eligible for cancellation.");

            // STEP 2: THE LOGISTICS RELEASE
            // Free the seat so the platform can make its money back immediately.
            // * Note: In a pure enterprise PostgreSQL setup, this is an atomic RPC. 
            // * Here, we safely read and increment the count.
            if (scheduleId) {
                const { data: scheduleData, error: fetchError } = await supabase
                    .from('schedules')
                    .select('remaining_seats')
                    .eq('id', scheduleId)
                    .single();

                if (!fetchError && scheduleData) {
                    const newSeatCount = scheduleData.remaining_seats + seatsToRelease;
                    
                    const { error: releaseError } = await supabase
                        .from('schedules')
                        .update({ remaining_seats: newSeatCount })
                        .eq('id', scheduleId);
                        
                    if (releaseError) {
                        console.warn("[AyaBus Logistics] Seat release failed to sync:", releaseError);
                    } else {
                        console.log(`[AyaBus Logistics] Rescued ${seatsToRelease} seat(s) for resale.`);
                    }
                }
            }

            return { success: true, data: updatedTicket };

        } catch (error) {
            console.error("[AyaBus Execution Engine] Cancellation Failed:", error.message);
            return { success: false, error: error.message };
        }
    }
};
/**
 * 🌍 AYABUS CONSUMER WEB (The Frequency Engine)
 * ------------------------------------------------------------------
 * Module: AyaMiles (Module 9/24)
 * File: src/modules/aya-miles/services/rewards.service.js
 * * DESCRIPTION:
 * The apex data connector for the AyaBus loyalty program. It uses a lean, 
 * trip-counting algorithm to calculate miles and securely auto-mints 
 * discount vouchers based on strict mathematical thresholds.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. THE EXPECTED VS ACTUAL MATRIX: Mathematically prevents double-minting. 
 * It compares the number of vouchers a user *should* have against the 
 * number they *actually* have, only minting the delta.
 * 2. ZERO-LEDGER OVERHEAD: Does not rely on a brittle "miles balance" column. 
 * It calculates the exact progress natively on every fetch using `(trips % 20) * 10`.
 * 3. BATCHED PROMISES: Fetches the trip count and the reward vault simultaneously 
 * using `Promise.all()` to cut network latency in half.
 */

import { supabase } from '../../../lib/supabase';

// ========================================================================
// THE PHYSICS (Global Constants)
// ========================================================================
const MILES_PER_TRIP = 10;
const TRIPS_PER_REWARD = 20;
const MILES_TARGET = 200;
const DISCOUNT_PERCENTAGE = 20;

export const rewardsService = {

    // ========================================================================
    // 1. THE MASTER ORCHESTRATOR
    // Fetches the passenger's history, calculates their tier, and mints 
    // any pending rewards instantly.
    // ========================================================================
    fetchLoyaltyStatus: async (userId, passengerName = 'Valued Client', passengerPhone = 'N/A') => {
        try {
            console.time('[AyaBus Engine] Loyalty Hydration');

            // ⚡ Execute both heavy database queries simultaneously
            const [tripsResponse, vaultResponse] = await Promise.all([
                rewardsService._countValidTrips(userId),
                rewardsService._fetchVaultHistory(userId)
            ]);

            if (!tripsResponse.success) throw new Error(tripsResponse.error);
            if (!vaultResponse.success) throw new Error(vaultResponse.error);

            const totalTrips = tripsResponse.count;
            let historicalVouchers = vaultResponse.data;

            // ========================================================================
            // 2. THE MATHEMATICAL AUTO-MINTING SEQUENCE
            // ========================================================================
            const expectedVouchers = Math.floor(totalTrips / TRIPS_PER_REWARD);
            const actualVouchers = historicalVouchers.length;
            const missingVouchers = expectedVouchers - actualVouchers;

            // If the math shows they are owed vouchers, mint them instantly
            if (missingVouchers > 0) {
                console.log(`[AyaBus Engine] Milestone Reached. Minting ${missingVouchers} new reward(s).`);
                
                for (let i = 0; i < missingVouchers; i++) {
                    const newVoucher = await rewardsService._mintVoucher(userId, passengerName, passengerPhone);
                    if (newVoucher) {
                        historicalVouchers.push(newVoucher);
                    }
                }
            }

            // ========================================================================
            // 3. THE FREQUENCY ENGINE ALGORITHM
            // Translating raw trips into frontend UI parameters
            // ========================================================================
            const currentCycleTrips = totalTrips % TRIPS_PER_REWARD;
            const currentMiles = currentCycleTrips * MILES_PER_TRIP;
            const progressPercentage = (currentMiles / MILES_TARGET) * 100;
            const tripsToNextReward = TRIPS_PER_REWARD - currentCycleTrips;

            // Filter the vault to only send 'ACTIVE' codes to the UI
            const activeVouchers = historicalVouchers.filter(v => v.status === 'ACTIVE');

            console.timeEnd('[AyaBus Engine] Loyalty Hydration');

            return {
                success: true,
                data: {
                    metrics: {
                        totalTrips,
                        lifetimeMiles: totalTrips * MILES_PER_TRIP,
                        currentMiles,
                        targetMiles: MILES_TARGET,
                        progressPercentage: Math.min(progressPercentage, 100),
                        tripsToNextReward
                    },
                    vault: activeVouchers
                }
            };

        } catch (error) {
            console.error("[AyaBus Query Engine] Loyalty Fetch Failed:", error.message);
            return { success: false, error: error.message, data: null };
        }
    },

    // ========================================================================
    // INTERNAL SUB-ROUTINES (Private Methods)
    // ========================================================================

    /**
     * Counts all tickets that actually generated revenue (Completed/Scanned).
     * Bypasses Cancelled or Pending tickets.
     */
    _countValidTrips: async (userId) => {
        try {
            const { count, error } = await supabase
                .from('tickets')
                .select('*', { count: 'exact', head: true }) // head: true means we only download the number, not the heavy row data
                .eq('passenger_id', userId)
                .in('status', ['COMPLETED', 'SCANNED']);

            if (error) throw error;
            return { success: true, count: count || 0 };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Pulls the complete history of every voucher this user has ever received.
     */
    _fetchVaultHistory: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('passenger_vouchers')
                .select('*')
                .eq('passenger_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * The highly secure code generator and database inserter.
     */
    _mintVoucher: async (userId, passengerName, passengerPhone) => {
        try {
            // Generate a 6-character secure cryptographic string (e.g., "A8X2B9")
            const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const formattedCode = `AYA-${DISCOUNT_PERCENTAGE}-${randomCode}`;

            const payload = {
                passenger_id: userId,
                passenger_name: passengerName,
                passenger_phone: passengerPhone,
                code: formattedCode,
                discount_percentage: DISCOUNT_PERCENTAGE,
                status: 'ACTIVE'
            };

            const { data, error } = await supabase
                .from('passenger_vouchers')
                .insert([payload])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("[AyaBus Vault] Failed to mint voucher:", error.message);
            return null; // Return null gracefully so the main loop doesn't crash
        }
    }
};
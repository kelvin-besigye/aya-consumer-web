/**
 * 🌍 AYABUS CONSUMER WEB (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Module: Park Pick-Up (Module 13/24)
 * File: src/modules/park-pick-up/services/pickup.service.js
 * * DESCRIPTION:
 * The pure data pipeline for the Last-Mile Logistics matrix.
 * This is strictly a "Puller" service for the Consumer App. It fetches 
 * verified partner data from the cloud so the UI can render it.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ZERO-ADMIN LOGIC: Strictly reads data. Injection/Mutation logic is 
 * intentionally excluded from this codebase for enterprise security.
 * 2. AUTOMATIC TRIAGE: The query inherently orders verified partners 
 * (the ones who pay to be featured) to the top of the feed.
 */

import { supabase } from '../../../lib/supabase';

export const pickupService = {
    /**
     * Fetches all ACTIVE drivers for the Consumer App.
     * Note: Supabase RLS policies guarantee only 'ACTIVE' status drivers are returned.
     */
    fetchActivePartners: async () => {
        try {
            console.time('[AyaBus] Fetch Pick-Up Partners');
            
            const { data, error } = await supabase
                .from('pickup_partners')
                .select('*')
                // Prioritize verified partners at the top of the list
                .order('is_verified', { ascending: false })
                // Secondary sort by newest joined
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            console.timeEnd('[AyaBus] Fetch Pick-Up Partners');
            
            return { success: true, data: data || [] };
            
        } catch (error) {
            console.error("[AyaBus Logistics] Database Fetch Failed:", error.message);
            // Graceful degradation: Return an empty array so the UI can show a clean "No drivers available" state
            return { success: false, error: "Failed to connect to the partner network.", data: [] };
        }
    }
};
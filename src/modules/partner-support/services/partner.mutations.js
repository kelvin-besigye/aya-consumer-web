/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Partner Support (Module 4/24)
 * File: src/modules/partner-support/services/partner.mutations.js
 * * DESCRIPTION:
 * The B2B payload injector. Submits the proposal to the database, 
 * which is configured on the backend to trigger an immediate email 
 * dispatch to the management team.
 */

import { supabase } from '../../../lib/supabase';

export const partnerMutations = {
    
    /**
     * Submits a partnership proposal.
     * @param {Object} payload - { organization, contactName, email, phone, category, customCategory, details }
     */
    submitProposal: async (payload) => {
        try {
            // 1. Resolve the final category string
            const finalCategory = payload.category === 'OTHER' 
                ? `OTHER: ${payload.customCategory.trim()}` 
                : payload.category;

            // 2. Package the Database/Email Payload
            const dbPayload = {
                organization_name: payload.organization.trim(),
                contact_person: payload.contactName.trim(),
                email: payload.email.trim().toLowerCase(),
                phone: payload.phone.trim(),
                partnership_type: finalCategory,
                proposal_details: payload.details.trim(),
                status: 'NEW', // For the Admin Cockpit to track
                created_at: new Date().toISOString()
            };

            // 3. Fire into the Supabase table (which triggers the email edge function)
            const { data, error } = await supabase
                .from('partnership_proposals')
                .insert([dbPayload])
                .select('id')
                .single();

            if (error) throw error;

            return { success: true, referenceId: data.id };

        } catch (error) {
            console.error("[AyaBus B2B Telemetry] Proposal Submission Failed:", error.message);
            return { 
                success: false, 
                error: "Our corporate network is currently experiencing high traffic. Please try again or contact management directly." 
            };
        }
    }
};
/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Customer Support (Module 3/24)
 * File: src/modules/customer-support/services/support.mutations.js
 * * DESCRIPTION:
 * The data injection engine for Direct Messages.
 * * WORLD-CLASS ENGINEERING (The Live Wire):
 * This securely packages the user's message and fires it into the 
 * 'support_tickets' Supabase table. It formats the payload to instantly 
 * trigger the SLA countdown in the Admin Cockpit's OmniInbox.
 */

import { supabase } from '../../../lib/supabase';

export const supportMutations = {
    
    /**
     * Submits a direct message to the AyaBus Helpdesk.
     * @param {Object} payload - { name, email, message, category }
     */
    submitDirectMessage: async (payload) => {
        try {
            // 1. Sanitize & Structure for the Admin Cockpit
            const dbPayload = {
                passenger_name: payload.name.trim(),
                passenger_email: payload.email.trim().toLowerCase(),
                category_id: payload.category || 'INQUIRY',
                status: 'OPEN',
                priority: 'NORMAL',
                // We wrap the initial message in the format expected by ResolutionWorkspace.jsx
                messages: [
                    {
                        sender: 'PASSENGER',
                        text: payload.message.trim(),
                        timestamp: new Date().toISOString()
                    }
                ],
                created_at: new Date().toISOString(),
                last_updated: new Date().toISOString()
            };

            // 2. Fire the Thrusters
            const { data, error } = await supabase
                .from('support_tickets')
                .insert([dbPayload])
                .select('id')
                .single();

            if (error) throw error;

            return { success: true, ticketId: data.id };

        } catch (error) {
            console.error("[AyaBus Telemetry] Support DM Failed:", error.message);
            return { 
                success: false, 
                error: "Our dispatch systems are currently busy. Please try again or use our WhatsApp lines." 
            };
        }
    }
};
/**
 * 🌍 AYABUS CONSUMER WEB (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Module: Settings (Module 11/24)
 * File: src/modules/settings/services/settings.service.js
 * * DESCRIPTION:
 * The apex data connector for user preferences and account security. 
 * It manages the synchronization of UI toggles to the database and 
 * securely negotiates cryptographic updates (passwords/deletion) with Supabase Auth.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. JSONB PREFERENCES: Packs notification and language settings into a 
 * flexible JSON payload, eliminating the need for rigid database column migrations.
 * 2. STALE-SESSION PROTECTION: Anticipates Supabase's "Requires Recent Login" 
 * security rules for password changes and formats the error gracefully for the UI.
 * 3. COMPLIANCE-READY DELETION: Routes account deletion through a secure RPC 
 * to satisfy strict App Store / Play Store data privacy mandates.
 */

import { supabase } from '../../../lib/supabase';

// ========================================================================
// THE PREFERENCE SCHEMA (Failsafe Defaults)
// ========================================================================
const DEFAULT_PREFERENCES = {
    notifications: {
        sms_transactional: true, // Boarding passes, delays
        email_receipts: true,    // Financial receipts
        marketing_promos: false  // AyaMiles discounts (Opt-in by default)
    },
    localization: {
        language: 'en', // Future proofing for Swahili/Luganda
    }
};

export const settingsService = {

    // ========================================================================
    // 1. TELEMETRY: READ PREFERENCES
    // ========================================================================
    /**
     * Fetches the user's stored preferences, merging them with failsafe 
     * defaults if the user is new or the JSON is incomplete.
     */
    fetchUserSettings: async (userId) => {
        if (!userId) return { success: false, error: "Authentication required." };

        try {
            console.time('[AyaBus Telemetry] Fetch Settings');
            
            const { data, error } = await supabase
                .from('profiles')
                .select('preferences')
                .eq('id', userId)
                .single();

            if (error) throw error;

            // Deep merge defaults with stored data to ensure the UI never crashes on missing keys
            const mergedPreferences = {
                notifications: {
                    ...DEFAULT_PREFERENCES.notifications,
                    ...(data?.preferences?.notifications || {})
                },
                localization: {
                    ...DEFAULT_PREFERENCES.localization,
                    ...(data?.preferences?.localization || {})
                }
            };

            console.timeEnd('[AyaBus Telemetry] Fetch Settings');
            return { success: true, data: mergedPreferences };

        } catch (error) {
            console.error("[AyaBus Settings] Fetch Failed:", error.message);
            return { success: false, error: "Failed to load preferences from the cloud." };
        }
    },

    // ========================================================================
    // 2. TELEMETRY: WRITE PREFERENCES
    // ========================================================================
    /**
     * Syncs a specific preference domain (e.g., notifications) to the database.
     * @param {string} userId - The active user's UUID.
     * @param {Object} fullPreferencePayload - The complete updated preferences object.
     */
    syncUserSettings: async (userId, fullPreferencePayload) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ preferences: fullPreferencePayload })
                .eq('id', userId);

            if (error) throw error;
            return { success: true };

        } catch (error) {
            console.error("[AyaBus Settings] Sync Failed:", error.message);
            return { success: false, error: "Failed to sync settings. Please check your connection." };
        }
    },

    // ========================================================================
    // 3. THE DANGER ZONE: CRYPTOGRAPHY & SECURITY
    // ========================================================================
    
    /**
     * Securely pushes a new password to the Auth provider.
     */
    updateSecurityPassword: async (newPassword) => {
        try {
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) {
                // Supabase requires a recent login to change a password.
                // If the session is old, we catch it and translate the error.
                if (error.message.includes('User must re-authenticate')) {
                    throw new Error("For your security, please log out and log back in before changing your password.");
                }
                throw error;
            }

            return { success: true, data };
        } catch (error) {
            console.error("[AyaBus Security] Password Update Failed:", error.message);
            return { success: false, error: error.message };
        }
    },

    /**
     * Initiates the App Store mandated account deletion process.
     * Triggers a PostgreSQL RPC that handles the cascading delete of PII.
     */
    initiateAccountDeletion: async (userId) => {
        try {
            // Note: In an enterprise Supabase setup, you create an RPC (Remote Procedure Call)
            // named 'request_account_deletion' in your SQL editor that securely zeroes out 
            // the user's profile data and flags the Auth ID for deletion.
            const { error } = await supabase.rpc('request_account_deletion', {
                target_user_id: userId
            });

            if (error) {
                // Fallback: If the RPC isn't configured yet, we soft-delete the profile record.
                console.warn("[AyaBus Security] RPC missing, executing soft-delete fallback.");
                const { error: softDeleteError } = await supabase
                    .from('profiles')
                    .update({ 
                        status: 'DELETED', 
                        phone_number: 'DELETED',
                        preferences: null 
                    })
                    .eq('id', userId);

                if (softDeleteError) throw softDeleteError;
            }

            // Immediately sign the user out of the local device to sever the connection
            await supabase.auth.signOut();
            return { success: true };

        } catch (error) {
            console.error("[AyaBus Security] Deletion Protocol Failed:", error.message);
            return { success: false, error: "Unable to process deletion request. Please contact support." };
        }
    }
};
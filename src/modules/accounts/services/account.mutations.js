/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Accounts Dashboard (Module 6/24)
 * File: src/modules/accounts/services/account.mutations.js
 * * DESCRIPTION:
 * The Dual-Tier identity mutation engine. Separates instantaneous public 
 * profile updates from highly secure, OTP-gated credential swaps.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. DETERMINISTIC TELEMETRY: Every function returns a guaranteed 
 * `{ success, error, data, requiresVerification }` object. The React UI 
 * will never crash from unhandled promise rejections.
 * 2. OTP HANDSHAKE PREPARATION: `requestCredentialChange` natively supports 
 * Supabase's secure handshakes. If a user changes a phone number, it triggers 
 * the SMS network and primes the UI for the `verifyPhoneChange` method.
 * 3. HOSTILE ERROR SANITIZATION: Traps ugly PostgREST/Auth database errors 
 * and translates them into polite, actionable user instructions.
 */

import { supabase } from '../../../lib/supabase';

// ========================================================================
// INTERNAL UTILITY: ERROR SANITIZER
// Translates hostile database errors into user-friendly prompts.
// ========================================================================
const _sanitizeError = (error) => {
    const msg = error?.message || '';
    
    if (msg.includes('already registered') || msg.includes('already in use')) {
        return "This credential is already linked to another AyaBus account.";
    }
    if (msg.includes('rate_limit') || msg.includes('Too many requests')) {
        return "For your security, we've paused requests. Please wait 60 seconds.";
    }
    if (msg.includes('Token has expired') || msg.includes('Invalid OTP')) {
        return "The verification code is invalid or has expired. Please request a new one.";
    }
    if (msg.includes('fetch') || msg.includes('Network')) {
        return "Network connection lost. Please check your internet and try again.";
    }
    
    return msg || "An unexpected secure network error occurred. Please try again.";
};

export const accountMutations = {

    // ========================================================================
    // TIER 1: PUBLIC PROFILE (Instant Updates)
    // ========================================================================
    /**
     * Updates non-sensitive telemetry in the `passengers` table.
     * @param {string} userId - The current user's UUID
     * @param {Object} payload - { firstName, lastName, emergencyName, emergencyPhone }
     */
    updatePublicProfile: async (userId, payload) => {
        try {
            if (!userId) throw new Error("Authentication context lost.");

            // Construct the exact database payload to match our schema
            const dbPayload = {
                first_name: payload.firstName.trim(),
                last_name: payload.lastName.trim(),
                emergency_contact_name: payload.emergencyName?.trim() || null,
                emergency_contact_phone: payload.emergencyPhone?.trim() || null,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('passengers')
                .update(dbPayload)
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('[AyaBus Account Engine] Public Profile Update Failed:', error);
            return { success: false, error: _sanitizeError(error) };
        }
    },

    // ========================================================================
    // TIER 2: SECURE CREDENTIALS (Requires OTP/Email Verification)
    // ========================================================================
    
    /**
     * Initiates a change for a secure credential. Does NOT update immediately.
     * Triggers Supabase to send a verification code to the NEW credential.
     * @param {string} type - 'email' | 'phone'
     * @param {string} newValue - The new email address or phone number
     */
    requestCredentialChange: async (type, newValue) => {
        try {
            const updatePayload = type === 'email' 
                ? { email: newValue.trim().toLowerCase() }
                : { phone: newValue.trim() };

            const { data, error } = await supabase.auth.updateUser(updatePayload);

            if (error) throw error;

            return { 
                success: true, 
                // Flag to tell the UI to render the OTP/Pending View
                requiresVerification: true, 
                data 
            };
        } catch (error) {
            console.error(`[AyaBus Account Engine] ${type} Change Request Failed:`, error);
            return { success: false, error: _sanitizeError(error) };
        }
    },

    /**
     * Completes the Phone Number change handshake using the 6-digit SMS OTP.
     * @param {string} newPhone - The new phone number they are trying to claim
     * @param {string} otpToken - The 6-digit code sent via SMS
     */
    verifyPhoneChange: async (newPhone, otpToken) => {
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                phone: newPhone.trim(),
                token: otpToken.trim(),
                type: 'phone_change' 
            });

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('[AyaBus Account Engine] Phone Verification Failed:', error);
            return { success: false, error: _sanitizeError(error) };
        }
    },

    /**
     * Updates the password. Since the user is already authenticated inside the 
     * dashboard, Supabase allows immediate password updates without an OTP.
     * @param {string} newPassword - Must be at least 6 characters
     */
    updateSecurePassword: async (newPassword) => {
        try {
            if (newPassword.length < 6) {
                throw new Error("Password must be at least 6 characters.");
            }

            const { data, error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('[AyaBus Account Engine] Password Update Failed:', error);
            return { success: false, error: _sanitizeError(error) };
        }
    }
};
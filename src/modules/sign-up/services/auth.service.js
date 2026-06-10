/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Identity & Authentication (Module 5/24)
 * File: src/services/auth.service.js
 * * DESCRIPTION:
 * The pure data-access layer for Supabase Authentication. It handles 
 * the network requests, encrypts credentials in transit, and normalizes 
 * all responses into a predictable format for the React UI.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. DETERMINISTIC RESPONSES: All methods return a `{ success, data, error }` 
 * signature, completely eliminating unhandled promise rejections in the UI.
 * 2. METADATA HYDRATION: The `signUp` method natively passes user metadata 
 * directly to the Auth engine, allowing database triggers to seamlessly 
 * build the public `passengers` row without requiring a secondary API call.
 * 3. OAUTH READY: Includes `signInWithOAuth` for future 1-click Google/Apple 
 * conversions, recognizing that users hate remembering passwords.
 */

import { supabase } from '../../../lib/supabase';

// ========================================================================
// INTERNAL UTILITY: ERROR SANITIZER
// Translates hostile database errors into user-friendly prompts.
// ========================================================================
const _sanitizeError = (error) => {
    const msg = error?.message || '';
    
    if (msg.includes('User already registered')) {
        return "An account with this email already exists. Please sign in.";
    }
    if (msg.includes('Invalid login credentials')) {
        return "Incorrect email or password. Please try again.";
    }
    if (msg.includes('Password should be at least')) {
        return "For your security, your password must be at least 6 characters.";
    }
    if (msg.includes('rate_limit') || msg.includes('Too many requests')) {
        return "Too many attempts. Please wait a moment before trying again.";
    }
    if (msg.includes('fetch') || msg.includes('Network')) {
        return "Network error. Please check your internet connection.";
    }
    
    // Fallback for unknown errors
    return msg || "An unexpected error occurred with the authentication servers.";
};

export const authService = {
    // ========================================================================
    // 1. ACCOUNT CREATION (Sign Up)
    // ========================================================================
    /**
     * Creates a new user in the Supabase Auth system and triggers the 
     * creation of a Passenger profile.
     * @param {Object} payload - { email, password, firstName, lastName, phone }
     */
    signUp: async ({ email, password, firstName, lastName, phone }) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email.trim().toLowerCase(),
                password: password,
                options: {
                    // This metadata is attached to the JWT and passed to the 
                    // database trigger to populate the 'passengers' table.
                    data: {
                        first_name: firstName.trim(),
                        last_name: lastName.trim(),
                        phone: phone.trim()
                    }
                }
            });

            if (error) throw error;

            return { 
                success: true, 
                // Note: If you have "Confirm Email" turned ON in Supabase, 
                // data.session will be null until they click the link.
                requiresEmailConfirmation: !data.session,
                data: data.user 
            };
        } catch (error) {
            console.error('[AyaBus Auth Engine] Sign Up Failed:', error);
            return { success: false, error: _sanitizeError(error) };
        }
    },

    // ========================================================================
    // 2. AUTHENTICATION (Sign In)
    // ========================================================================
    /**
     * Authenticates an existing user and establishes a secure local session.
     * @param {string} email 
     * @param {string} password 
     */
    signInWithEmail: async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password: password
            });

            if (error) throw error;

            return { success: true, data: data.user };
        } catch (error) {
            console.error('[AyaBus Auth Engine] Sign In Failed:', error);
            return { success: false, error: _sanitizeError(error) };
        }
    },

    // ========================================================================
    // 3. OAUTH PROVIDERS (1-Click Login)
    // ========================================================================
    /**
     * Triggers a redirect to a third-party provider (Google, Apple).
     * @param {string} provider - 'google' | 'apple'
     */
    signInWithOAuth: async (provider) => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    // Ensures they are redirected back to the app after logging in
                    redirectTo: `${window.location.origin}/auth/callback` 
                }
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error(`[AyaBus Auth Engine] OAuth (${provider}) Failed:`, error);
            return { success: false, error: _sanitizeError(error) };
        }
    },

    // ========================================================================
    // 4. SESSION TERMINATION (Sign Out)
    // ========================================================================
    /**
     * Securely destroys the local JWT session and notifies the backend.
     */
    signOut: async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            return { success: true };
        } catch (error) {
            console.error('[AyaBus Auth Engine] Sign Out Failed:', error);
            return { success: false, error: _sanitizeError(error) };
        }
    },

    // ========================================================================
    // 5. SECURITY & RECOVERY
    // ========================================================================
    /**
     * Triggers a secure password reset email.
     * @param {string} email 
     */
    resetPassword: async (email) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(
                email.trim().toLowerCase(), 
                {
                    redirectTo: `${window.location.origin}/update-password`,
                }
            );

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('[AyaBus Auth Engine] Password Reset Failed:', error);
            return { success: false, error: _sanitizeError(error) };
        }
    }
};
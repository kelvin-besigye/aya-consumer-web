/**
 * 🌍 AYABUS CONSUMER WEB (The Financial Engine)
 * ------------------------------------------------------------------
 * Module: Booking Funnel (Phase 2)
 * File: services/payment.service.js
 * * DESCRIPTION:
 * The apex payment orchestration layer. Handles asynchronous Mobile Money 
 * (MoMo) pushes, transaction polling, and the signature 1-Click Refunds.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ZERO-TRUST ARCHITECTURE: No API keys exist here. All transactions are 
 * routed through secure Supabase Edge Functions.
 * 2. IDEMPOTENCY LOCKS: Every transaction request generates a unique UUID 
 * to guarantee a user is never double-charged, even if they spam the "Pay" button.
 * 3. KINETIC POLLING: MoMo requires users to check their phone and enter a PIN. 
 * This service implements an intelligent polling matrix that checks the DB for 
 * webhooks without overwhelming the network, handling connection drops gracefully.
 */

import { supabase } from '../../../lib/supabase';

// ========================================================================
// 1. THE CONSTANTS & LIMITS
// Tuning the engine for East African network realities.
// ========================================================================
const POLLING_INTERVAL_MS = 3000; // Check status every 3 seconds
const MAX_POLLING_ATTEMPTS = 20;  // 60 seconds total timeout for user to enter PIN
const PROVIDERS = {
    MTN: 'mtn_momo',
    AIRTEL: 'airtel_money',
    CARD: 'stripe_card' // Future-proofed for international tourists
};

export const paymentEngine = {
    // ========================================================================
    // STEP 1: INITIATE TRANSACTION
    // Triggers the USSD Push to the passenger's phone.
    // ========================================================================
    /**
     * @param {string} bookingId - The locked booking ID from Phase 1.
     * @param {string} phoneNumber - Formatted number (e.g., 25677...).
     * @param {number} amount - Total cost in UGX.
     * @param {string} network - 'MTN' or 'AIRTEL'.
     * @param {string} idempotencyKey - Unique string to prevent double charges.
     */
    initiateMoMoPush: async (bookingId, phoneNumber, amount, network, idempotencyKey) => {
        try {
            // 1. Determine exact provider routing
            const providerCode = network.toUpperCase() === 'MTN' ? PROVIDERS.MTN : PROVIDERS.AIRTEL;

            // 2. Call the secure Edge Function to talk to the Telco API
            // We use edge functions so your MoMo API keys never touch the browser.
            const { data, error } = await supabase.functions.invoke('process-momo-payment', {
                body: {
                    booking_id: bookingId,
                    phone_number: phoneNumber,
                    amount: amount,
                    provider: providerCode,
                    currency: 'UGX',
                    idempotency_key: idempotencyKey
                }
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.message || 'Payment initiation failed.');

            return {
                success: true,
                transactionId: data.transaction_id,
                message: 'USSD Push sent. Waiting for passenger PIN...'
            };

        } catch (error) {
            console.error('[AyaBus Financial Engine] MoMo Push Failed:', error.message);
            return { 
                success: false, 
                error: paymentEngine._mapNetworkErrors(error.message) 
            };
        }
    },

    // ========================================================================
    // STEP 2: THE POLLING MATRIX
    // Waits for the Telco webhook to update our database.
    // ========================================================================
    /**
     * @param {string} transactionId - The ID returned from initiateMoMoPush.
     * @param {function} onTick - Callback to update UI countdown/status.
     */
    verifyTransactionStatus: async (transactionId, onTick = () => {}) => {
        let attempts = 0;

        return new Promise((resolve, reject) => {
            const poll = async () => {
                attempts++;
                onTick(attempts, MAX_POLLING_ATTEMPTS);

                try {
                    // Query the exact transaction row. 
                    // Our Edge Function/Webhook will flip this status from PENDING to SUCCESS/FAILED.
                    const { data, error } = await supabase
                        .from('transactions')
                        .select('status, failure_reason')
                        .eq('id', transactionId)
                        .single();

                    if (error) throw error;

                    // Evaluate the status
                    if (data.status === 'SUCCESS') {
                        return resolve({ success: true, status: 'PAID' });
                    } 
                    else if (data.status === 'FAILED') {
                        return resolve({ 
                            success: false, 
                            error: data.failure_reason || 'Transaction declined by provider.' 
                        });
                    }

                    // If still PENDING, check timeout limits
                    if (attempts >= MAX_POLLING_ATTEMPTS) {
                        return resolve({ 
                            success: false, 
                            error: 'TIMEOUT: You took too long to enter the PIN. Please try again.' 
                        });
                    }

                    // Wait and loop
                    setTimeout(poll, POLLING_INTERVAL_MS);

                } catch (err) {
                    // If network drops during polling, don't crash. Just retry until timeout.
                    console.warn(`[AyaBus Financial Engine] Polling interruption (Attempt ${attempts}):`, err.message);
                    if (attempts >= MAX_POLLING_ATTEMPTS) {
                        return resolve({ success: false, error: 'Network timeout while verifying payment.' });
                    }
                    setTimeout(poll, POLLING_INTERVAL_MS);
                }
            };

            // Start the engine
            poll();
        });
    },

    // ========================================================================
    // STEP 3: THE 1-CLICK REFUND ENGINE
    // Weaponized Trust Signal: Reverses MoMo instantly.
    // ========================================================================
    /**
     * @param {string} ticketId - The validated ticket ID.
     * @param {string} cancellationReason - Logged for analytics.
     */
    processInstantRefund: async (ticketId, cancellationReason) => {
        try {
            const { data, error } = await supabase.functions.invoke('process-momo-refund', {
                body: {
                    ticket_id: ticketId,
                    reason: cancellationReason
                }
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.message || 'Refund processing failed.');

            return {
                success: true,
                message: 'Refund dispatched to your Mobile Money account.'
            };

        } catch (error) {
            console.error('[AyaBus Financial Engine] Refund Failed:', error.message);
            return { success: false, error: error.message };
        }
    },

    // ========================================================================
    // UTILITIES: INTELLIGENT ERROR MAPPING
    // Translates cryptic server/telco codes into human-readable alerts.
    // ========================================================================
    _mapNetworkErrors: (rawError) => {
        const errorStr = String(rawError).toUpperCase();
        if (errorStr.includes('INSUFFICIENT')) return 'Insufficient funds on this mobile money account.';
        if (errorStr.includes('TIMEOUT')) return 'The payment network took too long to respond.';
        if (errorStr.includes('INVALID_NUMBER')) return 'The phone number provided is invalid or not registered for Mobile Money.';
        if (errorStr.includes('FAILED TO FETCH')) return 'You are offline. Please check your data connection.';
        return 'We encountered an issue connecting to the payment provider. Please try again.';
    }
};
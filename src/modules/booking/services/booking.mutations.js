/**
 * 🌍 AYABUS CONSUMER WEB (The Transaction Engine)
 * ------------------------------------------------------------------
 * Module: Booking Funnel (Phase 1)
 * File: services/booking.mutations.js
 * Goes to: apps/consumer-web/src/services/booking.mutations.js
 *
 * CHANGES IN THIS VERSION:
 * - Added generatePNR() → produces codes like "AYA-LK3M9QR2-X7P"
 * - pnr_code included in insert payload
 * - select() now fetches id, ticket_token AND pnr_code back from DB
 * - Return value includes pnrCode alongside bookingId and ticketToken
 * - refund_status RESTORED in processCancellation (column added via SQL)
 */

import { supabase } from '../../../lib/supabase';
import { telemetryService } from './telemetry.service';

// ========================================================================
// 0. PNR GENERATOR (Passenger Name Record — The Boarding Pass Identity)
// ========================================================================
/**
 * Generates a unique, human-readable booking reference.
 * Format: AYA-{timestamp-base36}-{random-suffix}
 * Example: AYA-LK3M9QR2-X7P
 */
const generatePNR = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `AYA-${timestamp}-${suffix}`;
};

export const bookingMutations = {

  // ========================================================================
  // 1. SECURE THE BOOKING (The Checkout Action)
  // ========================================================================
  /**
   * Commits the user's booking to the database after successful MoMo payment.
   * @param {Object} payload - The complete booking context.
   * @param {string} payload.scheduleId - The ID of the trip schedule.
   * @param {Array<string>} payload.seatNumbers - E.g., ['12A', '12B'].
   * @param {Object} payload.passengerInfo - Name, Phone, Next of Kin.
   * @param {number} payload.totalPaid - Exact amount paid in UGX/USD.
   * @param {string} payload.paymentReference - The MoMo transaction ID.
   */
  secureBooking: async (payload) => {
    try {
      const { scheduleId, seatNumbers, passengerInfo, totalPaid, paymentReference } = payload;

      // 1. Telemetry: Log the exact moment the mutation fires
      telemetryService.logFunnelStep('checkout_mutation_start', { scheduleId, seatCount: seatNumbers.length });

      // 2. Generate the PNR before insertion
      // This must happen client-side so ticket_engine.js can reference it
      // immediately — before the DB round-trip completes.
      const pnr = generatePNR();

      // 3. The Insertion Payload
      const bookingRecord = {
        schedule_id: scheduleId,
        user_phone: passengerInfo.phone,       // Primary identifier for B2C users
        passenger_name: passengerInfo.fullName,
        next_of_kin_phone: passengerInfo.nextOfKin || null,
        seat_allocation: seatNumbers,
        total_amount: totalPaid,
        payment_ref: paymentReference,
        pnr_code: pnr,                         // Unique boarding pass reference
        status: 'CONFIRMED',                   // Options: PENDING, CONFIRMED, CANCELLED
        booked_at: new Date().toISOString()
      };

      // 4. Execute the Database Write
      // NOTE: In a strictly constrained environment, this is ideally an RPC call
      // to ensure seat availability is checked at the exact millisecond of insertion.
      const { data, error } = await supabase
        .from('user_bookings')
        .insert(bookingRecord)
        .select('id, ticket_token, pnr_code')  // Fetch all three back to confirm storage
        .single();

      if (error) {
        // Catch constraint violations (e.g., someone else took the seat)
        if (error.code === '23505') throw new Error('Seat was taken during checkout. Please select another.');
        throw error;
      }

      // 5. Telemetry: Log success
      telemetryService.logConversion(data.id, totalPaid);

      return {
        success: true,
        bookingId: data.id,
        pnrCode: data.pnr_code,               // Used by ticket_engine.js for QR and boarding pass label
        ticketToken: data.ticket_token         // Used by ticket_engine.js to generate the QR secondary hash
      };

    } catch (error) {
      console.error('[AyaBus Transaction Error]:', error.message);
      telemetryService.logCheckoutAbandonment(payload.scheduleId, error.message);
      return { success: false, error: error.message || 'Network unstable. Please verify your connection.' };
    }
  },

  // ========================================================================
  // 2. THE TRUST ENGINE (1-Click MoMo Refunds)
  // ========================================================================
  /**
   * Processes a user-initiated cancellation. Updates the booking status
   * and flags it for the automated MoMo refund disbursement queue.
   * @param {string} bookingId - The unique ID of the booking.
   * @param {string} phone - Verification to ensure the right person is cancelling.
   */
  processCancellation: async (bookingId, phone) => {
    try {
      telemetryService.logFunnelStep('cancellation_initiated', { bookingId });

      // 1. Verify and Update Status
      // NOTE: refund_status column exists (added via SQL migration).
      const { data, error } = await supabase
        .from('user_bookings')
        .update({
          status: 'CANCELLED',
          refund_status: 'PROCESSING_MOMO'     // Flags this for the MoMo disbursement queue
        })
        .eq('id', bookingId)
        .eq('user_phone', phone)               // Security constraint: only the booker can cancel
        .select('total_amount')
        .single();

      if (error) throw error;

      telemetryService.logFunnelStep('cancellation_successful', { bookingId, amount: data.total_amount });

      return {
        success: true,
        message: 'Ticket cancelled. MoMo refund initiated to your registered number.'
      };

    } catch (error) {
      console.error('[AyaBus Refund Error]:', error.message);
      return { success: false, error: 'Could not process cancellation at this time. Please contact support.' };
    }
  }
};

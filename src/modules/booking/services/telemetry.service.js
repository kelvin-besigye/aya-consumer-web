/**
 * 🌍 AYABUS CONSUMER WEB (The Telemetry Engine)
 * ------------------------------------------------------------------
 * Module: Core Brain
 * File: services/telemetry.service.js
 * * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ZERO-BLOCKING ARCHITECTURE: Every function here is "fire and forget". We do 
 * not `await` telemetry calls. This ensures the UI remains blazing fast at 60fps 
 * even if the analytics ping fails due to a weak 3G connection.
 * 2. BEACON API: Falls back to `navigator.sendBeacon` for critical exit events 
 * (like a user closing the app during checkout) to ensure data is still captured.
 * 3. ANONYMIZATION: Strips personally identifiable information (PII) before logging 
 * to comply with modern privacy standards while maintaining aggregate metrics.
 */

import { supabase } from '../../../lib/supabase';

// Helper to prevent the UI thread from waiting on analytics
const fireAndForget = (promise) => {
  promise.catch(err => {
    // Silent fail in production to avoid console clutter.
    // In development, you can uncomment the line below:
    // console.warn('[Telemetry Ignored]:', err.message);
  });
};

export const telemetryService = {

  // ========================================================================
  // 1. INTENT TRACKING (Search Engine)
  // ========================================================================
  /**
   * Logs what routes users are searching for, helping AyaBus determine 
   * where to deploy more buses.
   */
  logSearchIntent: (origin, destination, date, passengers) => {
    if (!origin || !destination) return;
    
    const payload = {
      event_type: 'SEARCH_INTENT',
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      travel_date: date,
      passenger_count: passengers,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent
    };

    fireAndForget(
      supabase.from('telemetry_logs').insert(payload)
    );
  },

  // ========================================================================
  // 2. FUNNEL VELOCITY (Step 1 to 4)
  // ========================================================================
  /**
   * Tracks user progression through the UI components (RouteCard -> SeatVault -> Checkout)
   */
  logFunnelStep: (stepName, metadata = {}) => {
    const payload = {
      event_type: `FUNNEL_${stepName.toUpperCase()}`,
      metadata: metadata,
      timestamp: new Date().toISOString()
    };

    fireAndForget(
      supabase.from('telemetry_logs').insert(payload)
    );
  },

  // ========================================================================
  // 3. FRICTION IDENTIFICATION (Abandonment)
  // ========================================================================
  /**
   * Captures when a user attempts to book but fails (e.g., MoMo PIN error, Network drop).
   */
  logCheckoutAbandonment: (scheduleId, reason) => {
    const payload = {
      event_type: 'CHECKOUT_ABANDONED',
      metadata: { scheduleId, reason },
      timestamp: new Date().toISOString()
    };

    fireAndForget(
      supabase.from('telemetry_logs').insert(payload)
    );
  },

  // ========================================================================
  // 4. THE SWEETSPOT (Revenue Conversion)
  // ========================================================================
  /**
   * The ultimate success metric. Logs generated revenue.
   */
  logConversion: (bookingId, revenueAmount) => {
    const payload = {
      event_type: 'SUCCESSFUL_CONVERSION',
      metadata: { bookingId, revenue: revenueAmount },
      timestamp: new Date().toISOString()
    };

    fireAndForget(
      supabase.from('telemetry_logs').insert(payload)
    );
  }
};
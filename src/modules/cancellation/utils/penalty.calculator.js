/**
 * 🌍 AYABUS CONSUMER WEB (The Friction Engine)
 * ------------------------------------------------------------------
 * Module: Cancellations (Module 10/24)
 * File: src/modules/cancellations/utils/penalty.calculator.js
 * * DESCRIPTION:
 * The frontend mirror of the Admin Reconciliation Physics Engine. 
 * This strictly calculates the financial liability and refund 
 * estimates BEFORE the user commits to a destructive cancellation.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ZERO-LEAKAGE MIRROR: Uses the exact same tier logic (90/50/0) 
 * as the `reconciliation.physics.js` file in the Admin Cockpit.
 * 2. TEMPORAL PRECISION: Safely parses string-based travel dates and 
 * mixed time formats into accurate millisecond-level hour-deltas.
 * 3. PSYCHOLOGICAL TRANSPARENCY: Generates user-facing explanation 
 * strings to justify the penalty and protect brand trust.
 */

export const penaltyCalculator = {
    // ========================================================================
    // 1. THE LAWS OF PHYSICS (Strictly Synced with Admin Cockpit)
    // ========================================================================
    RULES: {
        REFUND_TIER_HIGH: 90,    // 90% refund if > 24 hours (10% penalty)
        REFUND_TIER_MID: 50,     // 50% refund if 4-24 hours (50% penalty)
        REFUND_TIER_DEADLINE: 4, // 0% refund if < 4 hours (100% penalty)
        PLATFORM_TAX: 2000       // Standard non-refundable platform booking fee
    },

    // ========================================================================
    // 2. THE MASTER ESTIMATOR
    // ========================================================================
    /**
     * Evaluates a ticket and returns a complete financial breakdown.
     * @param {Object} ticket - The raw ticket object from the database.
     * @returns {Object} - The detailed preview payload to feed the UI.
     */
    calculatePreview: (ticket) => {
        if (!ticket) return null;

        // 1. Parse Temporal Data
        const hoursLeft = penaltyCalculator._calculateHoursRemaining(
            ticket.travel_date, 
            ticket.departure_time
        );

        // 2. Extract Financials Safely
        const totalPaid = Number(ticket.amount_paid) || 0;
        const taxPaid = Number(ticket.platform_tax) || penaltyCalculator.RULES.PLATFORM_TAX;
        
        // The Base Fare is the only refundable portion of the ticket
        const baseFare = Math.max(0, totalPaid - taxPaid);

        // 3. Determine Eligibility (Failsafe for ghost states)
        const uncancelableStates = ['COMPLETED', 'SCANNED', 'REFUND_SETTLED', 'CANCELLATION_REQUESTED'];
        
        if (hoursLeft <= 0 || uncancelableStates.includes(ticket.status)) {
            return {
                isEligible: false,
                hoursLeft: Math.max(0, hoursLeft),
                originalTotal: totalPaid,
                baseFare: baseFare,
                estimatedRefund: 0,
                penaltyPercentage: 100,
                penaltyAmount: baseFare,
                explanation: "This ticket has already departed or is no longer eligible for cancellation."
            };
        }

        // 4. Apply the Physics Tiers
        let refundPercentage = 0;
        let penaltyPercentage = 100;
        let explanation = "";

        if (hoursLeft > 24) {
            refundPercentage = penaltyCalculator.RULES.REFUND_TIER_HIGH;
            penaltyPercentage = 100 - refundPercentage;
            explanation = "Cancellation is more than 24 hours before departure. A standard 10% penalty applies.";
        } else if (hoursLeft >= penaltyCalculator.RULES.REFUND_TIER_DEADLINE) {
            refundPercentage = penaltyCalculator.RULES.REFUND_TIER_MID;
            penaltyPercentage = 100 - refundPercentage;
            explanation = "Cancellation is within 24 hours of departure. A 50% penalty applies.";
        } else {
            refundPercentage = 0;
            penaltyPercentage = 100;
            explanation = "Cancellation is less than 4 hours before departure. A 100% penalty applies.";
        }

        // 5. Calculate Final Fiat Values
        const customerRefund = Math.floor(baseFare * (refundPercentage / 100));
        const penaltyAmount = baseFare - customerRefund;

        return {
            isEligible: true,
            hoursLeft: Math.round(hoursLeft * 10) / 10, // Rounded to 1 decimal for clean UI
            originalTotal: totalPaid,
            baseFare,
            taxRetained: taxPaid,
            penaltyPercentage,
            penaltyAmount,
            estimatedRefund: customerRefund,
            explanation
        };
    },

    // ========================================================================
    // 3. THE TEMPORAL PARSER (Private Subroutine)
    // ========================================================================
    /**
     * Failsafe function to convert dates and times into exact hour deltas.
     */
    _calculateHoursRemaining: (travelDateStr, timeString) => {
        try {
            if (!travelDateStr || !timeString) return 0;

            let hours = 0;
            let minutes = 0;

            // Handle AM/PM format (e.g., "09:30 AM")
            const amPmMatch = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
            
            if (amPmMatch) {
                hours = parseInt(amPmMatch[1], 10);
                minutes = parseInt(amPmMatch[2], 10);
                const modifier = amPmMatch[3].toUpperCase();

                if (modifier === 'PM' && hours < 12) hours += 12;
                if (modifier === 'AM' && hours === 12) hours = 0;
            } else {
                // Handle 24-hour database format (e.g., "14:30" or "14:30:00")
                const timeParts = timeString.split(':');
                hours = parseInt(timeParts[0], 10);
                minutes = parseInt(timeParts[1], 10);
            }

            // Construct exact Date Object
            // Format constraint: assumes travelDateStr is strictly "YYYY-MM-DD"
            const [year, month, day] = travelDateStr.split('-');
            const departureDate = new Date(year, month - 1, day, hours, minutes, 0);

            // Calculate the exact millisecond delta
            const now = new Date();
            const timeDiffMs = departureDate.getTime() - now.getTime();
            
            // Convert to total decimal hours
            return timeDiffMs / (1000 * 60 * 60);

        } catch (error) {
            console.error("[AyaBus Temporal Engine] Parsing Failed:", error);
            // Hard failsafe: Assume it has departed to prevent illegal refunds
            return 0; 
        }
    }
};
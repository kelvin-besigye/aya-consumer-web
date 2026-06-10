/**
 * 🌍 AYABUS CONSUMER WEB (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Module: Marketing (Module 12/24)
 * File: src/modules/marketing/data/marketing.payload.js
 * * DESCRIPTION:
 * The centralized copywriting vault for the auto-scrolling marketing carousel.
 * Separating this data from the UI components ensures that non-technical 
 * team members can update sales copy without risking the React layout.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ZERO LOREM IPSUM: Production-ready, localized copy designed to build 
 * immediate trust and drive conversions in the East African market.
 * 2. MODAL-READY STRUCTURE: Pre-formatted with arrays for bullet points 
 * and split text to feed directly into the Glassmorphic expansion modals.
 * 3. ICON MAPPING: Ties string identifiers to Lucide React icons, keeping 
 * the payload strictly JSON-compatible if it ever moves to a database.
 */

export const MARKETING_PAYLOAD = [
    {
        id: 'feature-seat-selection',
        iconName: 'Armchair', // Maps to Lucide React <Armchair />
        title: 'Precision Seat Selection',
        short_desc: 'Pick your exact seat in advance. Skip the scramble at the bus park.',
        modal: {
            title: 'Your Space, Guaranteed',
            body: 'Gone are the days of arriving hours early just to fight for a window seat. With AyaBus, you have full visibility of the bus layout before you pay. Whether you prefer the front row for legroom or a quiet window seat at the back, your choice is digitally locked the moment you book.',
            bullet_points: [
                'Interactive digital seating charts',
                'Window, aisle, and front-row filtering',
                'Guaranteed reservations—no double booking'
            ],
            cta_text: 'Find a Route'
        }
    },
    {
        id: 'feature-aya-miles',
        iconName: 'Gift', // Maps to Lucide React <Gift />
        title: 'AyaMiles Rewards',
        short_desc: 'Travel should be rewarding. Earn 10 miles for every trip you complete.',
        modal: {
            title: 'The Simplest Loyalty Engine',
            body: 'We engineered AyaMiles to be perfectly transparent. No confusing points systems or hidden tiers. You earn exactly 10 miles for every single trip you complete. The moment you hit 200 miles (just 20 trips), the system instantly generates a 20% OFF voucher in your secure vault for your next journey.',
            bullet_points: [
                '1 Trip = 10 Miles automatically credited',
                'Unlock a 20% discount at 200 miles',
                'Zero expiration dates on active accounts'
            ],
            cta_text: 'View My Vault'
        }
    },
    {
        id: 'feature-universal-payments',
        iconName: 'SmartphoneNfc', // Maps to Lucide React <SmartphoneNfc />
        title: 'Universal Payments',
        short_desc: 'Secure, instant payments via MTN MoMo, Airtel Money, or Card.',
        modal: {
            title: 'Frictionless Checkout',
            body: 'Paying for travel should be the easiest part of your journey. The AyaBus checkout engine connects directly to local telecom networks for instant Mobile Money prompts. Prefer banking? Our enterprise-grade gateway securely processes Visa and Mastercard transactions with zero hidden fees.',
            bullet_points: [
                'Instant MTN MoMo & Airtel Money push prompts',
                'Secure Visa/Mastercard processing',
                'Automated PDF receipts sent to your email'
            ],
            cta_text: 'Book Now'
        }
    },
    {
        id: 'feature-cancellations',
        iconName: 'RefreshCcw', // Maps to Lucide React <RefreshCcw />
        title: 'Frictionless Cancellations',
        short_desc: 'Plans change? Cancel your ticket instantly directly from your phone.',
        modal: {
            title: 'Self-Service Refunds',
            body: 'We believe your money is your money. If your plans change, you don\'t need to call customer service or visit a booking office. Use our transparent cancellation engine to release your seat back to the platform and instantly calculate your refund based on departure time.',
            bullet_points: [
                'No phone calls or office visits required',
                'Transparent, time-based penalty calculator',
                'Funds returned directly to your original payment method'
            ],
            cta_text: 'Manage Bookings'
        }
    },
    {
        id: 'feature-live-support',
        iconName: 'Headset', // Maps to Lucide React <Headset />
        title: '7-Day Quick Support',
        short_desc: 'Real help from real people, available 7 days a week.',
        modal: {
            title: 'Always On Your Side',
            body: 'Technology is great, but sometimes you need a human. Our dedicated support team is available 7 days a week to handle rerouting, missed buses, or payment inquiries. Reach out via our in-app chat, direct phone line, or our dedicated WhatsApp Business channel for instant resolution.',
            bullet_points: [
                'Integrated WhatsApp Business support',
                'Rapid response times for active travelers',
                'Direct phone lines for immediate triage'
            ],
            cta_text: 'Contact Support'
        }
    }
];
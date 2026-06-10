/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Customer Support (Module 3/24)
 * File: src/modules/customer-support/data/support.constants.js
 * * DESCRIPTION:
 * The single source of truth for all AyaBus public contact telemetry.
 * * PHYSICS:
 * Hardcoded into the client to ensure the support page renders instantly 
 * without requiring a database fetch. Formatted perfectly for deep-linking.
 */

export const SUPPORT_TELEMETRY = {
    header_statement: "Support available every day of the week, 24/7.",
    
    phone: [
        { label: "Main Helpdesk (Toll Free)", display: "0800 111 222", value: "+256800111222" },
        { label: "Dispatch & Lost Baggage", display: "+256 772 334 455", value: "+256772334455" },
        { label: "Corporate & Partner Booking", display: "+256 752 998 877", value: "+256752998877" }
    ],
    
    whatsapp: [
        { label: "Instant Chat Support", display: "+256 772 334 455", value: "256772334455" }, // WA requires no '+'
        { label: "Ticketing Issues", display: "+256 701 223 344", value: "256701223344" }
    ],
    
    email: [
        { label: "General Inquiries", display: "support@ayabus.com", value: "support@ayabus.com" },
        { label: "Refunds & Cancellations", display: "refunds@ayabus.com", value: "refunds@ayabus.com" },
        { label: "Partner Relations", display: "partners@ayabus.com", value: "partners@ayabus.com" }
    ],
    
    socials: [
        { platform: "X", handle: "@AyaBusUG", link: "https://x.com/AyaBusUG", icon: "Twitter" },
        { platform: "Facebook", handle: "AyaBus Uganda", link: "https://facebook.com/AyaBusUG", icon: "Facebook" },
        { platform: "Instagram", handle: "@ayabus.ug", link: "https://instagram.com/ayabus.ug", icon: "Instagram" },
        { platform: "TikTok", handle: "@ayabus_official", link: "https://tiktok.com/@ayabus_official", icon: "Video" } // Using standard video icon as fallback
    ]
};

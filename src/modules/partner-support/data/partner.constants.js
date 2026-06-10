/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Partner Support (Module 4/24)
 * File: src/modules/partner-support/data/partner.constants.js
 * * DESCRIPTION:
 * The single source of truth for B2B categories and executive telemetry.
 */

export const PARTNERSHIP_CATEGORIES = [
    { id: 'BUS_OPERATOR', label: 'Bus Transport Operator' },
    { id: 'CAR_HIRE', label: 'Car Hire & Rental Fleet' },
    { id: 'ACCOMMODATION', label: 'Hotel & Accommodation' },
    { id: 'LOGISTICS', label: 'Cargo & Logistics' },
    { id: 'TECHNOLOGY', label: 'Technology & API Integration' },
    { id: 'OTHER', label: 'Something Else' } // Triggers the dynamic input
];

export const MANAGEMENT_CONTACTS = {
    statement: "Thank you for your interest in partnering with AyaBus. For direct inquiries regarding strategic partnerships, corporate accounts, or fleet integration, please contact executive management.",
    phones: [
        { label: "Corporate Relations", value: "+256 701 000 111", display: "+256 701 000 111" },
        { label: "Fleet Integration", value: "+256 772 000 222", display: "+256 772 000 222" }
    ],
    emails: [
        { label: "Partnerships Desk", value: "partners@ayabus.com", display: "partners@ayabus.com" },
        { label: "Management", value: "management@ayabus.com", display: "management@ayabus.com" }
    ]
};
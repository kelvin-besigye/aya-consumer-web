/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Flash Booking (Module 2/24)
 * File: src/modules/flash-booking/data/regional-hubs.js
 * * DESCRIPTION:
 * The ultra-fast local intelligence dictionary for East African routes.
 * * PHYSICS:
 * Pre-loaded into RAM to ensure instant autocomplete search results 
 * without network latency, crucial for 3G mobile environments.
 * Sorted by weight (popularity) to suggest the most likely hubs first.
 */

export const REGIONAL_HUBS = [
    // --- UGANDA (Tier 1) ---
    { id: 'UG-KLA', name: 'Kampala', country: 'Uganda', weight: 100, tags: ['capital', 'central'] },
    { id: 'UG-EBB', name: 'Entebbe', country: 'Uganda', weight: 90, tags: ['airport'] },
    { id: 'UG-MBR', name: 'Mbarara', country: 'Uganda', weight: 85, tags: ['west'] },
    { id: 'UG-GR',  name: 'Gulu', country: 'Uganda', weight: 80, tags: ['north'] },
    { id: 'UG-JIN', name: 'Jinja', country: 'Uganda', weight: 80, tags: ['east'] },
    { id: 'UG-MBE', name: 'Mbale', country: 'Uganda', weight: 75, tags: ['east'] },
    { id: 'UG-KAB', name: 'Kabale', country: 'Uganda', weight: 70, tags: ['west', 'border'] },
    { id: 'UG-FRT', name: 'Fort Portal', country: 'Uganda', weight: 70, tags: ['west', 'tourism'] },
    { id: 'UG-ARU', name: 'Arua', country: 'Uganda', weight: 65, tags: ['north', 'west-nile'] },
    { id: 'UG-KAS', name: 'Kasese', country: 'Uganda', weight: 60, tags: ['west', 'border'] },
    { id: 'UG-MSK', name: 'Masaka', country: 'Uganda', weight: 60, tags: ['central', 'transit'] },
    { id: 'UG-HOI', name: 'Hoima', country: 'Uganda', weight: 55, tags: ['mid-west', 'oil'] },

    // --- KENYA (Tier 1) ---
    { id: 'KE-NBO', name: 'Nairobi', country: 'Kenya', weight: 95, tags: ['capital', 'cross-border'] },
    { id: 'KE-MBA', name: 'Mombasa', country: 'Kenya', weight: 85, tags: ['coast'] },
    { id: 'KE-KSM', name: 'Kisumu', country: 'Kenya', weight: 80, tags: ['lake', 'west'] },
    { id: 'KE-NKU', name: 'Nakuru', country: 'Kenya', weight: 75, tags: ['rift-valley'] },
    { id: 'KE-EDT', name: 'Eldoret', country: 'Kenya', weight: 70, tags: ['rift-valley'] },

    // --- RWANDA (Tier 1) ---
    { id: 'RW-KGL', name: 'Kigali', country: 'Rwanda', weight: 90, tags: ['capital', 'cross-border'] },
    { id: 'RW-GIS', name: 'Gisenyi', country: 'Rwanda', weight: 65, tags: ['border', 'lake'] },
    { id: 'RW-HYE', name: 'Huye', country: 'Rwanda', weight: 60, tags: ['south'] },

    // --- TANZANIA (Tier 1) ---
    { id: 'TZ-DAR', name: 'Dar es Salaam', country: 'Tanzania', weight: 85, tags: ['coast', 'cross-border'] },
    { id: 'TZ-MZA', name: 'Mwanza', country: 'Tanzania', weight: 75, tags: ['lake'] },
    { id: 'TZ-ARK', name: 'Arusha', country: 'Tanzania', weight: 70, tags: ['north', 'tourism'] },
    { id: 'TZ-DOM', name: 'Dodoma', country: 'Tanzania', weight: 65, tags: ['capital'] },

    // --- SOUTH SUDAN (Tier 1) ---
    { id: 'SS-JUB', name: 'Juba', country: 'South Sudan', weight: 80, tags: ['capital', 'cross-border'] },
    { id: 'SS-NML', name: 'Nimule', country: 'South Sudan', weight: 60, tags: ['border'] },

    // --- BURUNDI (Tier 1) ---
    { id: 'BI-BJM', name: 'Bujumbura', country: 'Burundi', weight: 70, tags: ['capital', 'cross-border'] }
];
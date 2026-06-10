/**
 * 🌍 AYABUS CONSUMER WEB (The Query Engine)
 * ------------------------------------------------------------------
 * Module: Park Finder (Module 8/24)
 * File: src/modules/park-finder/services/park.queries.js
 * * DESCRIPTION:
 * The apex data connector for the geolocation directory. It strictly fetches 
 * verified, active bus parks and structures them for zero-latency UI rendering.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. INNER JOIN FILTERING: Uses `partners!inner` to mathematically guarantee 
 * that if a bus company is suspended in the admin-cockpit, all of their 
 * bus parks instantly disappear from the consumer map.
 * 2. 1D FLATTENING: Destructures the nested DB response into a flat, predictable 
 * object to prevent complex dot-notation errors in the UI components.
 * 3. SMART CITY EXTRACTION: Implements a defensive parsing mechanism to extract 
 * the 'City' from unstructured address strings for the dropdown matrix.
 */

import { supabase } from '../../../lib/supabase';

export const parkQueries = {

    // ========================================================================
    // 1. THE MASTER LOCATOR GRAPH
    // Fetches all active parks and their parent operators in a single trip.
    // ========================================================================
    fetchActiveParksMatrix: async () => {
        try {
            console.time('[AyaBus Engine] Park Matrix Hydration');

            // The strict relational join. `!inner` ensures we only get parks 
            // where the parent partner actually exists AND is ACTIVE.
            const { data, error } = await supabase
                .from('parks')
                .select(`
                    id,
                    name,
                    address,
                    gps_lat,
                    gps_lng,
                    contact_name,
                    contact_phone,
                    partner_id,
                    partners!inner (
                        id,
                        company_name,
                        logo_url,
                        status
                    )
                `)
                .eq('partners.status', 'ACTIVE');

            if (error) throw error;

            // ========================================================================
            // 2. THE FLATTENING ENGINE
            // Crushing the nested payload into a high-speed 1D array.
            // ========================================================================
            const matrix = (data || []).map(park => {
                
                // Defensive City Extraction: 
                // Assumes East African formatting (e.g., "Kisenyi, Kampala"). 
                // Grabs the last segment as the macroscopic city identifier.
                const addressParts = (park.address || 'Unknown Location').split(',');
                const rawCity = addressParts.length > 1 
                    ? addressParts[addressParts.length - 1].trim() 
                    : addressParts[0].trim();

                // Capitalize first letter for visual consistency in dropdowns
                const formattedCity = rawCity.charAt(0).toUpperCase() + rawCity.slice(1).toLowerCase();

                return {
                    id: park.id,
                    partnerId: park.partner_id,
                    partnerName: park.partners?.company_name || 'Unknown Operator',
                    partnerLogo: park.partners?.logo_url || '/assets/fallbacks/bus-placeholder.png',
                    parkName: park.name || 'Main Terminal',
                    address: park.address || 'Address not provided',
                    city: formattedCity,
                    coordinates: {
                        lat: parseFloat(park.gps_lat) || 0,
                        lng: parseFloat(park.gps_lng) || 0
                    },
                    telemetry: {
                        contactName: park.contact_name || 'Station Manager',
                        contactPhone: park.contact_phone || 'N/A'
                    }
                };
            });

            // Filter out any corrupted entries without valid GPS coordinates
            const validMatrix = matrix.filter(p => p.coordinates.lat !== 0 && p.coordinates.lng !== 0);

            console.timeEnd('[AyaBus Engine] Park Matrix Hydration');

            return {
                success: true,
                data: validMatrix
            };

        } catch (error) {
            console.error("[AyaBus Query Engine] Locator Fetch Failed:", error.message);
            return { success: false, error: error.message, data: [] };
        }
    },

    // ========================================================================
    // 3. THE DICTIONARY EXTRACTOR (For Smart Dropdowns)
    // Takes the flattened matrix and outputs perfectly unique lists for the UI.
    // ========================================================================
    getDropdownDictionaries: (parksMatrix = []) => {
        // 1. Extract Unique Cities (Alphabetical)
        const uniqueCities = [...new Set(parksMatrix.map(park => park.city))]
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b));

        // 2. Extract Unique Partners (Alphabetical by Company Name)
        // We use a Map to ensure we don't get duplicate partners if a partner has multiple parks.
        const partnersMap = new Map();
        parksMatrix.forEach(park => {
            if (park.partnerId && !partnersMap.has(park.partnerId)) {
                partnersMap.set(park.partnerId, {
                    id: park.partnerId,
                    name: park.partnerName,
                    logo: park.partnerLogo
                });
            }
        });

        const uniquePartners = Array.from(partnersMap.values())
            .sort((a, b) => a.name.localeCompare(b.name));

        return {
            cities: uniqueCities,
            partners: uniquePartners
        };
    }
};
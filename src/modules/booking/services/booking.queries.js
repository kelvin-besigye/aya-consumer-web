/**
 * 🌍 AYABUS CONSUMER WEB (The Query Engine)
 * ------------------------------------------------------------------
 * File: services/booking.queries.js
 *
 * ARCHITECTURE NOTES v3 (Bug Fix):
 * - REMOVED embedded PostgREST selects (e.g. `partners ( ... )`).
 *   They break when both `routes.partner_id` and `bus_configs.partner_id`
 *   exist because PostgREST chokes on the relationship ambiguity and
 *   emits "column bus_configs_1.capacity does not exist".
 * - Now we fetch the parent row, then batch-load related tables in JS
 *   with `.in('id', [...])` calls. Output shape is preserved so the
 *   rest of the funnel works without further changes.
 */

import { supabase } from '../../../lib/supabase';

const STORAGE_BUCKET = 'partner-assets';

// ---------------------------------------------------------------------------
// CONSOLE HELPERS (unchanged)
// ---------------------------------------------------------------------------

export const testConnection = async () => {
  console.log('[AyaBus Engine] Testing Supabase system connectivity...');
  try {
    const { data, error, status } = await supabase
      .from('routes')
      .select('id, origin_city, destination_city, status')
      .limit(1);

    if (error) {
      console.error('[AyaBus Engine] ❌ Connection FAILED:', { status, message: error.message, code: error.code, hint: error.hint });
      if (error.code === 'PGRST301' || error.message?.includes('permission denied')) {
        console.error('[AyaBus Engine] 🔒 RLS POLICY GAP: The "anon" public role lacks a SELECT policy rule on the `routes` catalog table.');
      }
      return { success: false, error };
    }
    console.log('[AyaBus Engine] ✅ Connection successfully validated. Sample row payload:', data);
    return { success: true, data };
  } catch (err) {
    console.error('[AyaBus Engine] ❌ Runtime connection engine threw:', err);
    return { success: false, error: err };
  }
};

export const diagnoseRLS = async () => {
  const tables = ['routes', 'route_schedules', 'partners', 'bus_configs', 'user_bookings'];
  console.group('[AyaBus Engine] Row-Level Security Diagnostic Tracing');
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        console.warn(`  ⚠️  ${table}: INVALID ENDPOINT - SCHEMA TABLE DOES NOT EXIST IN POSTGRES DATABASE`);
      } else if (error.message?.includes('permission denied') || error.code === 'PGRST301') {
        console.error(`  🔒 ${table}: RLS ACCESS DENIED - Public anonymous operations are missing a SELECT rule access policy.`);
      } else {
        console.error(`  ❌ ${table}: SYSTEM EXCEPTION - ${error.message} (Code: ${error.code})`);
      }
    } else {
      console.log(`  ✅ ${table}: READ VERIFIED (${data?.length ?? 0} data record row(s) returned)`);
    }
  }
  console.groupEnd();
};

// ---------------------------------------------------------------------------
// INTERNAL RESOLVER: Confirmed Ticket Traversal Engine (unchanged)
// ---------------------------------------------------------------------------
const fetchConfirmedTicketCounts = async (scheduleIds) => {
  const tableCandidates = ['user_bookings', 'tickets', 'bookings'];

  for (const table of tableCandidates) {
    const { data, error } = await supabase
      .from(table)
      .select('id, schedule_id, status')
      .in('schedule_id', scheduleIds);

    if (!error) {
      const confirmedTickets = (data || []).filter(ticket =>
        ticket.status && ticket.status.toUpperCase() === 'CONFIRMED'
      );
      console.log(`[AyaBus Engine] Ticket record counts read from target table "${table}":`, confirmedTickets.length);
      return confirmedTickets;
    }
    if (error.code !== '42P01') {
      console.warn(`[AyaBus Engine] Secondary tracking fetch query on "${table}" rejected:`, error.message);
    }
  }
  return [];
};

// ---------------------------------------------------------------------------
// PRIMARY EXPORTED BUSINESS LOGIC ENGINE
// ---------------------------------------------------------------------------

export const bookingQueries = {

  testConnection,
  diagnoseRLS,

  // ==========================================================================
  // STEP 1: ROUTE NETWORK SEARCH DEPLOYMENT
  // ==========================================================================
  searchAvailableRoutes: async (paramOrOrigin, maybeDestination, maybeDate) => {
    try {
      // ---- 1. PARAMETER NORMALIZATION --------------------------------------
      let origin = '';
      let destination = '';
      let date = '';
      let passengers = 1;

      if (typeof paramOrOrigin === 'object' && paramOrOrigin !== null) {
        origin = (paramOrOrigin.origin || '').trim();
        destination = (paramOrOrigin.destination || '').trim();
        date = paramOrOrigin.date || paramOrOrigin.travelDate || '';
        passengers = paramOrOrigin.passengers || 1;
      } else {
        origin = (paramOrOrigin || '').trim();
        destination = (maybeDestination || '').trim();
        date = maybeDate || '';
        passengers = 1;
      }

      console.log('[AyaBus Engine] Resolving network search query metrics:', { origin, destination, date, passengers });

      if (!origin || !destination || !date) {
        console.warn('[AyaBus Engine] Execution halted. Search parameters lack mandatory operational constraints.');
        return { success: false, error: 'Mandatory search parameters missing or undefined.', data: [] };
      }

      // ---- 2. ROUTES — parent only, no embeds -------------------------------
      const { data: routeData, error: routeError } = await supabase
        .from('routes')
        .select(`
          id,
          origin_city,
          destination_city,
          departure_park,
          price_ticket,
          price_tax,
          departure_time,
          duration_hours,
          duration_minutes,
          route_code,
          partner_id,
          bus_config_id,
          status
        `)
        .ilike('origin_city', `%${origin}%`)
        .ilike('destination_city', `%${destination}%`);

      if (routeError) {
        console.error('[AyaBus Engine] Primary route resolution exception:', routeError);
        if (routeError.message?.includes('permission denied') || routeError.code === 'PGRST301') {
          console.error(
            '[AyaBus Engine] 🔒 SECURITY FAILURE: anon is blocked on `routes`.\n' +
            'Action: CREATE POLICY "Allow public read access to active entries" ON routes ' +
            'FOR SELECT USING (status = \'ACTIVE\');'
          );
        }
        throw routeError;
      }

      const activeRoutes = (routeData || []).filter(r => r.status && r.status.toUpperCase() === 'ACTIVE');
      console.log('[AyaBus Engine] Active primary target route entries located:', activeRoutes.length);

      if (activeRoutes.length === 0) {
        return { success: true, data: [] };
      }

      // ---- 3. BATCHED RELATIONSHIP FETCHES (no joins) ------------------------
      const routeIds       = activeRoutes.map(r => r.id);
      const partnerIds     = [...new Set(activeRoutes.map(r => r.partner_id).filter(Boolean))];
      const busConfigIds   = [...new Set(activeRoutes.map(r => r.bus_config_id).filter(Boolean))];

      const [partnersRes, busConfigsRes, schedulesRes] = await Promise.all([
        partnerIds.length > 0
          ? supabase.from('partners').select('id, company_name, status').in('id', partnerIds)
          : Promise.resolve({ data: [], error: null }),
        busConfigIds.length > 0
          ? supabase.from('bus_configs').select('id, bus_class, capacity, amenities, gallery').in('id', busConfigIds)
          : Promise.resolve({ data: [], error: null }),
        supabase.from('route_schedules').select('id, route_id, frequency_type, frequency_data, status').in('route_id', routeIds),
      ]);

      if (partnersRes.error)   console.warn('[AyaBus Engine] partners batch error:', partnersRes.error.message);
      if (busConfigsRes.error) console.warn('[AyaBus Engine] bus_configs batch error:', busConfigsRes.error.message);
      if (schedulesRes.error) {
        console.error('[AyaBus Engine] Schedule tracking retrieval database exception:', schedulesRes.error);
        if (schedulesRes.error.message?.includes('permission denied') || schedulesRes.error.code === 'PGRST301') {
          console.error(
            '[AyaBus Engine] 🔒 SECURITY FAILURE: anon is blocked on `route_schedules`.\n' +
            'Action: CREATE POLICY "Allow public read access to active schedules" ON route_schedules ' +
            'FOR SELECT USING (status = \'ACTIVE\');'
          );
        }
        throw schedulesRes.error;
      }

      const partnerMap   = Object.fromEntries((partnersRes.data   || []).map(p => [p.id, p]));
      const busConfigMap = Object.fromEntries((busConfigsRes.data || []).map(b => [b.id, b]));
      const routeMap     = Object.fromEntries(activeRoutes.map(r => [r.id, r]));

      // ---- 4. SCHEDULE FILTERING -------------------------------------------
      const activeSchedules = (schedulesRes.data || []).filter(s => s.status && s.status.toUpperCase() === 'ACTIVE');
      console.log('[AyaBus Engine] Target structural route schedules established:', activeSchedules.length);

      if (activeSchedules.length === 0) {
        console.warn('[AyaBus Engine] ⚠️ Routes matched but no linked active schedules.');
        return { success: true, data: [] };
      }

      const requestedDate = new Date(date);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const requestedDayName = dayNames[requestedDate.getDay()];

      const validSchedules = activeSchedules.filter(sched => {
        if (!sched.frequency_type) return true;
        const typeNormalized = sched.frequency_type.toUpperCase();
        if (typeNormalized === 'DAILY') return true;
        if (typeNormalized === 'WEEKLY') {
          const days = sched.frequency_data?.days || [];
          return days.map(d => d.toUpperCase()).includes(requestedDayName.toUpperCase());
        }
        if (typeNormalized === 'SPECIFIC') {
          const dates = sched.frequency_data?.dates || [];
          return dates.includes(date);
        }
        return true;
      });

      console.log('[AyaBus Engine] Active schedules corresponding to destination calendar metric:', validSchedules.length);

      if (validSchedules.length === 0) {
        return { success: true, data: [] };
      }

      // ---- 5. TICKET INVENTORY ---------------------------------------------
      const scheduleIds = validSchedules.map(s => s.id);
      const ticketRecords = await fetchConfirmedTicketCounts(scheduleIds);

      const ticketCountBySchedule = {};
      ticketRecords.forEach(t => {
        if (t.schedule_id) {
          ticketCountBySchedule[t.schedule_id] = (ticketCountBySchedule[t.schedule_id] || 0) + 1;
        }
      });

      // ---- 6. OUTPUT NORMALIZATION (stitched in JS, same shape as before) ---
      const formattedResults = validSchedules.map((schedule) => {
        const route     = routeMap[schedule.route_id] || {};
        const partner   = partnerMap[route.partner_id] || {};
        const busConfig = busConfigMap[route.bus_config_id] || {};

        const price          = route.price_ticket || 0;
        const totalCapacity  = busConfig.capacity || 45;
        const ticketsSold    = ticketCountBySchedule[schedule.id] || 0;
        const seatsLeft      = Math.max(0, totalCapacity - ticketsSold);

        return {
          scheduleId: schedule.id,
          routeId: route.id,
          partnerId: route.partner_id,

          companyName:    partner.company_name || 'AyaBus Transit Operator',
          rating:         4.8,
          busClass:       busConfig.bus_class || 'Standard Executive',
          amenities:      busConfig.amenities || [],

          departureTime:   route.departure_time,
          arrivalTime:     null,
          price,
          priceTax:        route.price_tax || 0,
          boardingLocation: route.departure_park || 'Main Transit Terminal',
          origin:          route.origin_city,
          destination:     route.destination_city,
          durationHours:   route.duration_hours,
          durationMinutes: route.duration_minutes,
          routeCode:       route.route_code,
          frequencyType:   schedule.frequency_type,

          totalCapacity,
          seatsLeft,

          busImage:    bookingQueries.resolveImageUrl((busConfig.gallery || [])[0] || null),
          companyLogo: null,
        };
      });

      const viableRoutes = formattedResults.filter(bus => bus.seatsLeft >= passengers);

      viableRoutes.sort((a, b) => {
        if (!a.departureTime) return 1;
        if (!b.departureTime) return -1;
        return String(a.departureTime).localeCompare(String(b.departureTime));
      });

      console.log('[AyaBus Engine] Data handshake complete. Total deployment assets returned:', viableRoutes.length);
      return { success: true, data: viableRoutes };

    } catch (error) {
      console.error('[AyaBus Core Exception] Fatal search traversal interruption:', error.message);
      return { success: false, error: error.message, data: [] };
    }
  },

  fetchAvailableRoutes: async (origin, destination, date) => {
    return bookingQueries.searchAvailableRoutes(origin, destination, date);
  },

  // ==========================================================================
  // AUTOFILL & CITY REGISTRY SYNC (unchanged)
  // ==========================================================================
  fetchAllCities: async () => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .select('origin_city, destination_city, status');

      if (error) throw error;

      const activeEntries = (data || []).filter(r => r.status && r.status.toUpperCase() === 'ACTIVE');
      const citySet = new Set();

      activeEntries.forEach(r => {
        if (r.origin_city) citySet.add(r.origin_city.trim());
        if (r.destination_city) citySet.add(r.destination_city.trim());
      });

      return { success: true, data: Array.from(citySet).sort() };
    } catch (error) {
      console.error('[AyaBus Engine] Autofill city network fetch failed:', error.message);
      return { success: false, data: [] };
    }
  },

  // ==========================================================================
  // VIEW HOOKS: SPECIFIC SCHEDULE DEEP LOOKUP (also de-embedded)
  // ==========================================================================
  getRouteDetails: async (scheduleId) => {
    try {
      // Stage 1: schedule
      const { data: schedule, error: scheduleError } = await supabase
        .from('route_schedules')
        .select('id, route_id, frequency_type, frequency_data')
        .eq('id', scheduleId)
        .single();

      if (scheduleError) throw scheduleError;

      // Stage 2: route
      const { data: route, error: routeError } = await supabase
        .from('routes')
        .select('id, route_code, departure_park, bus_config_id')
        .eq('id', schedule.route_id)
        .single();

      if (routeError) throw routeError;

      // Stage 3: bus config (only if FK is set)
      let busConfig = {};
      if (route.bus_config_id) {
        const { data: bc, error: bcError } = await supabase
          .from('bus_configs')
          .select('id, bus_class, amenities, gallery, capacity')
          .eq('id', route.bus_config_id)
          .single();
        if (!bcError && bc) busConfig = bc;
      }

      return {
        success: true,
        data: {
          frequencyType: schedule.frequency_type,
          frequencyData: schedule.frequency_data,
          amenities:     busConfig.amenities || [],
          busClass:      busConfig.bus_class  || 'Standard Express',
          routeCode:     route.route_code,
          boardingPark:  route.departure_park,
        }
      };
    } catch (error) {
      console.error('[AyaBus Engine] Target schedule record deep view trace failed:', error.message);
      return { success: false, error: error.message };
    }
  },

  // ==========================================================================
  // STATIC ASSET ENGINE (unchanged)
  // ==========================================================================
  resolveImageUrl: (imagePath) => {
    if (!imagePath) return '/assets/fallbacks/bus-placeholder.png';
    if (imagePath.startsWith('http')) return imagePath;
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(imagePath);
    return data.publicUrl;
  }
};

/**
 * AYABUS — Supabase Client
 * Path: src/lib/supabase.js
 *
 * Vite env vars required in your .env.local (project root, NOT inside src/):
 *   VITE_SUPABASE_URL=https://xxxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
 *
 * NOTE: After editing .env.local you MUST restart the dev server
 * (Vite reads env vars at startup only).
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl    = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    '[AyaBus] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.\n' +
    'Check your .env.local file in the project root and RESTART the dev server.'
  );
  throw new Error('Missing Supabase Environment Variables. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Expose a quick connection probe on `window.__ayabusSupabase` for
// debugging from the browser DevTools console:
//   await window.__ayabusSupabase.ping()
if (typeof window !== 'undefined') {
  window.__ayabusSupabase = {
    client: supabase,
    ping: async () => {
      try {
        const { data, error, status } = await supabase
          .from('routes')
          .select('id, origin_city, destination_city, status')
          .limit(1);
        if (error) {
          // eslint-disable-next-line no-console
          console.error('[AyaBus ping] ❌', { status, message: error.message, code: error.code, hint: error.hint });
          return { ok: false, error };
        }
        // eslint-disable-next-line no-console
        console.log('[AyaBus ping] ✅ Supabase reachable. Sample row:', data);
        return { ok: true, data };
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[AyaBus ping] ❌ threw:', e);
        return { ok: false, error: e };
      }
    },
  };
}

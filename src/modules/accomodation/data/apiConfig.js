// Centralized configuration for accommodation API partners.
export const ACCOM_CONFIG = {
  // Uses Vite's native environment engine to handle variable resolution safely in the browser
  BASE_URL: import.meta.env.VITE_ACCOM_API_URL || 'https://api.partner-sandbox.com/v1',
  API_KEY: import.meta.env.VITE_ACCOM_API_KEY || 'PENDING_PARTNER_KEY',
  AFFILIATE_ID: 'AYABUS_AFF_001',
  DEFAULT_CURRENCY: 'UGX',
  TIMEOUT_MS: 8000, // 8 seconds before timing out for poor networks
};
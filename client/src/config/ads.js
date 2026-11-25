/**
 * Google AdSense configuration.
 *
 * Ads load ONLY when:
 *   1. `enabled` is true, and
 *   2. `client` is a real publisher ID (ca-pub- followed by 16 digits), and
 *   3. the specific slot has a real numeric ad-unit ID.
 * Until then, ad areas render nothing in production (and a labelled outline in dev).
 * Never put a guessed or example ID here.
 */
const env = import.meta.env;

export const ADS = {
  enabled: true,
  client: env.VITE_ADSENSE_CLIENT || 'ca-pub-XXXXXXXXXXXXXXXX', // placeholder
  slots: {
    inContent: env.VITE_ADSENSE_SLOT_IN_CONTENT || '',
    belowResult: env.VITE_ADSENSE_SLOT_BELOW_RESULT || '',
    sidebar: env.VITE_ADSENSE_SLOT_SIDEBAR || '',
  },
};

export const isRealClient = (id) => /^ca-pub-\d{16}$/.test(id || '');
export const isRealSlot = (id) => /^\d{6,}$/.test(id || '');
export const adsActive = () => ADS.enabled && isRealClient(ADS.client);

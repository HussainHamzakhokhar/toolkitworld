/**
 * Central site configuration. Real values come from environment variables
 * (see .env.example) so nothing personal or secret is hard-coded.
 */
const env = import.meta.env;

export const SITE = {
  name: 'ToolKitWorld',
  tagline: 'Free Tools. Smart Solutions. No Hassle.',
  url: (env.VITE_SITE_URL || 'https://toolkitworld.pages.dev').replace(/\/+$/, ''),
  locale: 'en_US',
  /** Empty strings mean "not configured yet" — pages show a neutral notice instead of fake data. */
  contactEmail: env.VITE_CONTACT_EMAIL || '',
  apiUrl: (env.VITE_API_URL || '').replace(/\/+$/, ''),
  ownerName: env.VITE_OWNER_NAME || '',
  gscVerification: env.VITE_GSC_VERIFICATION || '',
  ogImage: '/og-image.png',
  author: {
    name: 'ToolKitWorld Team',
    bio: 'The people who build, test and maintain the tools on ToolKitWorld. Articles are reviewed against the tools they describe before publishing.',
  },
  launchDate: '2026-11-25',
};

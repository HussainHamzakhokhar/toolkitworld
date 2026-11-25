/** Google Analytics 4. Empty measurement ID = analytics fully disabled (no script loaded). */
export const GA_ID = /^G-[A-Z0-9]+$/.test(import.meta.env.VITE_GA_MEASUREMENT_ID || '')
  ? import.meta.env.VITE_GA_MEASUREMENT_ID
  : '';

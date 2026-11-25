import { GA_ID } from '../config/analytics';
import { getConsent, onConsentChange } from '../privacy/consent';

let loaded = false;

function loadGtag() {
  if (loaded || !GA_ID || typeof window === 'undefined') return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // We send page views ourselves on route change (single-page navigation).
  window.gtag('config', GA_ID, { send_page_view: false, anonymize_ip: true });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

/** Loads GA4 only if configured AND the visitor accepted analytics cookies. */
export function initAnalytics() {
  if (!GA_ID) return;
  if (getConsent()?.analytics) loadGtag();
  onConsentChange((c) => c.analytics && (loadGtag(), trackPageView(location.pathname)));
}

/** Sends a GA4 event. Silently does nothing when analytics is disabled or not consented. */
export function track(name, params = {}) {
  if (loaded && window.gtag) window.gtag('event', name, params);
}

export const trackPageView = (path) =>
  track('page_view', { page_path: path, page_location: typeof location !== 'undefined' ? location.href : path, page_title: typeof document !== 'undefined' ? document.title : '' });

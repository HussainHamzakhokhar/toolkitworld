/**
 * Minimal consent store. Choices are kept in localStorage on the visitor's
 * device only. Analytics and personalised ads stay OFF until opted in.
 */
const KEY = 'tkw-consent-v1';
const listeners = new Set();

export function getConsent() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function setConsent({ analytics, ads }) {
  const value = { analytics: !!analytics, ads: !!ads, date: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(value));
  listeners.forEach((fn) => fn(value));
  return value;
}

export function onConsentChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Lets any page (e.g. Cookie Policy) reopen the banner. */
export const openConsentSettings = () => window.dispatchEvent(new Event('tkw-open-consent'));

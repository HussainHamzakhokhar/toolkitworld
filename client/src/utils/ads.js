import { ADS, adsActive } from '../config/ads';
import { getConsent } from '../privacy/consent';

let loaded = false;
/** Loads the AdSense library once, and only when a real publisher ID is configured. */
export function loadAdsScript() {
  if (loaded || !adsActive() || typeof document === 'undefined') return;
  loaded = true;
  if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
    const s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS.client}`;
    document.head.appendChild(s);
  }
}

/** Without ad-personalisation consent, request non-personalised ads only. */
export function pushAd() {
  window.adsbygoogle = window.adsbygoogle || [];
  window.adsbygoogle.requestNonPersonalizedAds = getConsent()?.ads ? 0 : 1;
  window.adsbygoogle.push({});
}

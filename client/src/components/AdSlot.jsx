import { useEffect, useRef } from 'react';
import { ADS, adsActive, isRealSlot } from '../config/ads';
import { loadAdsScript, pushAd } from '../utils/ads';

/**
 * Reusable ad area. Placement rules followed site-wide:
 *  - never inside or next to upload areas, buttons or download links,
 *  - always clearly labelled "Advertisement",
 *  - separated from tool controls by margin so they can't be clicked by mistake.
 * Renders nothing until AdSense is configured with real IDs.
 */
export default function AdSlot({ slot = 'inContent', format = 'auto', className = '' }) {
  const slotId = ADS.slots[slot];
  const active = adsActive() && isRealSlot(slotId);
  const pushed = useRef(false);

  useEffect(() => {
    if (!active || pushed.current) return;
    pushed.current = true;
    loadAdsScript();
    try { pushAd(); } catch { /* ad blockers can throw; ignore */ }
  }, [active]);

  if (!active) {
    return import.meta.env.DEV ? (
      <div className={`ad-placeholder ${className}`} aria-hidden="true">Ad area “{slot}” — hidden until real AdSense IDs are configured</div>
    ) : null;
  }
  return (
    <aside className={`ad-slot ad-slot--${slot} ${className}`} aria-label="Advertisement">
      <span className="ad-slot__label">Advertisement</span>
      <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client={ADS.client} data-ad-slot={slotId} data-ad-format={format} data-full-width-responsive="true" />
    </aside>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Cookie } from 'lucide-react';
import { getConsent, setConsent } from '../privacy/consent';
import { GA_ID } from '../config/analytics';
import { adsActive } from '../config/ads';

/**
 * Cookie consent banner. Shown automatically only when the site actually uses
 * optional cookies (analytics or ads configured). It can always be reopened
 * from "Cookie settings" in the footer.
 */
export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, ads: false });
  const needed = !!GA_ID || adsActive();

  useEffect(() => {
    const c = getConsent();
    if (c) setPrefs({ analytics: c.analytics, ads: c.ads });
    else if (needed) setOpen(true);
    const reopen = () => { setCustom(true); setOpen(true); };
    window.addEventListener('tkw-open-consent', reopen);
    return () => window.removeEventListener('tkw-open-consent', reopen);
  }, [needed]);

  if (!open) return null;
  const save = (v) => { setConsent(v); setPrefs(v); setOpen(false); setCustom(false); };

  return (
    <section className="consent" role="region" aria-label="Cookie consent">
      <div className="consent__inner">
        <div className="consent__text">
          <h2 className="consent__title"><Cookie size={18} aria-hidden="true" /> Your privacy choices</h2>
          <p>
            We use essential storage to remember settings. With your permission we also use cookies for anonymous
            {GA_ID ? ' usage statistics' : ''}{GA_ID && adsActive() ? ' and' : ''}{adsActive() ? ' personalised advertising' : ''}
            {!needed ? ' statistics and advertising, which are currently switched off on this site' : ''}. Files you use in our tools are never uploaded.
            {' '}<Link to="/cookie-policy/">Cookie Policy</Link>
          </p>
          {custom && (
            <fieldset className="consent__prefs">
              <legend className="sr-only">Cookie categories</legend>
              <label className="check"><input type="checkbox" checked disabled /> Essential (always on)</label>
              <label className="check"><input type="checkbox" checked={prefs.analytics} onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })} /> Analytics</label>
              <label className="check"><input type="checkbox" checked={prefs.ads} onChange={(e) => setPrefs({ ...prefs, ads: e.target.checked })} /> Personalised ads</label>
            </fieldset>
          )}
        </div>
        <div className="consent__actions">
          {custom ? (
            <button className="btn btn--primary" onClick={() => save(prefs)}>Save choices</button>
          ) : (
            <button className="btn btn--ghost" onClick={() => setCustom(true)}>Customise</button>
          )}
          <button className="btn btn--secondary" onClick={() => save({ analytics: false, ads: false })}>Reject optional</button>
          <button className="btn btn--primary" onClick={() => save({ analytics: true, ads: true })}>Accept all</button>
        </div>
      </div>
    </section>
  );
}

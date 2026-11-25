import { Link } from 'react-router';
import { CATEGORIES, toolsInCategory } from '../data/tools';
import { openConsentSettings } from '../privacy/consent';
import Logo from './Logo';
import { SITE } from '../config/site';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo light />
          <p>{SITE.tagline}</p>
          <p className="site-footer__note">Most tools run entirely in your browser. Your files stay on your device.</p>
        </div>
        {CATEGORIES.map((c) => (
          <nav key={c.id} aria-label={c.name}>
            <h2 className="site-footer__h"><Link to={c.path}>{c.name}</Link></h2>
            <ul>
              {toolsInCategory(c.id).map((t) => <li key={t.id}><Link to={t.path}>{t.name}</Link></li>)}
            </ul>
          </nav>
        ))}
        <nav aria-label="Company">
          <h2 className="site-footer__h">ToolKitWorld</h2>
          <ul>
            <li><Link to="/tools/">All Tools</Link></li>
            <li><Link to="/blog/">Blog</Link></li>
            <li><Link to="/about/">About Us</Link></li>
            <li><Link to="/contact/">Contact</Link></li>
          </ul>
        </nav>
      </div>
      <div className="site-footer__legal">
        <div className="container site-footer__legal-inner">
          <p>© {year} ToolKitWorld. All rights reserved.</p>
          <ul>
            <li><Link to="/privacy-policy/">Privacy Policy</Link></li>
            <li><Link to="/terms/">Terms and Conditions</Link></li>
            <li><Link to="/disclaimer/">Disclaimer</Link></li>
            <li><Link to="/cookie-policy/">Cookie Policy</Link></li>
            <li><button type="button" className="link-btn" onClick={openConsentSettings}>Cookie settings</button></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

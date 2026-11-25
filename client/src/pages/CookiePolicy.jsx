import { Cookie } from 'lucide-react';
import PageShell from '../layouts/PageShell';
import IconBadge from '../components/IconBadge';
import LegalMeta, { contactLine } from '../components/LegalMeta';
import { openConsentSettings } from '../privacy/consent';

export default function CookiePolicy() {
  return (
    <PageShell title="Cookie Policy" path="/cookie-policy/" icon={<IconBadge icon={Cookie} color="slate" size="lg" />}
      description="Which cookies and similar technologies ToolKitWorld uses, why, and how to change your choices at any time."
      lead="What we store on your device, and how you stay in control.">
      <div className="prose legal">
        <LegalMeta />
        <p><button type="button" className="btn btn--primary" onClick={openConsentSettings}>Change cookie settings</button></p>
        <h2>What are cookies?</h2>
        <p>Cookies are small text files a website stores on your device. Similar technologies, such as local storage, work in a comparable way. They can be essential for a site to work, or used for statistics and advertising.</p>
        <h2>Cookies we use</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Category</th><th>Purpose</th><th>Provider</th><th>Default</th></tr></thead>
            <tbody>
              <tr><td>Essential</td><td>Remembers your cookie choices (local storage key <code>tkw-consent-v1</code>).</td><td>ToolKitWorld</td><td>Always on</td></tr>
              <tr><td>Analytics</td><td>Counts visits and tool usage in aggregate to improve the site (cookies such as <code>_ga</code>). Only used if analytics is enabled on the site.</td><td>Google Analytics</td><td>Off until you accept</td></tr>
              <tr><td>Advertising</td><td>Shows and measures ads; with consent, personalises them. Only used if advertising is enabled on the site.</td><td>Google AdSense and its partners</td><td>Personalisation off until you accept</td></tr>
            </tbody>
          </table>
        </div>
        <h2>Your choices</h2>
        <ul>
          <li>Use the <strong>Cookie settings</strong> link in the footer (or the button above) to change your choices at any time.</li>
          <li>You can delete or block cookies in your browser settings. Blocking essential storage may mean we ask for your choices again.</li>
          <li>You can control personalised Google ads at <a href="https://myadcenter.google.com/" rel="noopener">My Ad Center</a>.</li>
        </ul>
        <h2>Files are not stored</h2>
        <p>Files and text you use in our tools are processed in your browser and are never written to cookies or sent to us.</p>
        <h2>Contact</h2>
        <p>Questions about cookies can be sent {contactLine()}.</p>
      </div>
    </PageShell>
  );
}

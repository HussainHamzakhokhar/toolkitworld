import PageShell from '../layouts/PageShell';
import LegalMeta, { contactLine, operator } from '../components/LegalMeta';
import { ShieldCheck } from 'lucide-react';
import IconBadge from '../components/IconBadge';

export default function PrivacyPolicy() {
  return (
    <PageShell title="Privacy Policy" path="/privacy-policy/" icon={<IconBadge icon={ShieldCheck} color="teal" size="lg" />}
      description="How ToolKitWorld handles your data: files are processed on your device and never uploaded, plus details on cookies, analytics and advertising."
      lead="The short version: your files and text stay on your device. We collect as little as possible.">
      <div className="prose legal">
        <LegalMeta />
        <h2>1. Who we are</h2>
        <p>This website, ToolKitWorld, is operated by {operator()}. You can contact us {contactLine()}.</p>

        <h2>2. Files and text you use in our tools</h2>
        <p>
          Our calculators, text tools, image tools and PDF tools process your input <strong>inside your web browser</strong>. Files you select are read by your
          own device and are <strong>not uploaded</strong> to our servers. We do not see, store or keep copies of your documents, images or text. When you close
          or refresh the page, that data is gone from the page.
        </p>

        <h2>3. Information we collect</h2>
        <ul>
          <li><strong>Contact messages.</strong> If you use the contact form or email us, we receive your name, email address and message, and use them only to reply. We keep them only as long as needed to handle your request.</li>
          <li><strong>Technical logs.</strong> Our hosting provider may automatically process standard request data (such as IP address, browser type and the page requested) to deliver the site, prevent abuse and keep it secure.</li>
          <li><strong>Analytics (only with consent).</strong> If enabled and you agree, we use Google Analytics 4 to understand which pages and tools are used, in aggregate. We do not send your files or tool input to analytics.</li>
          <li><strong>Settings on your device.</strong> We store your cookie choices in your browser’s local storage so we don’t ask again.</li>
        </ul>

        <h2>4. Advertising</h2>
        <p>
          We may show ads served by Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website
          or other websites. Google’s use of advertising cookies enables it and its partners to serve ads based on visits to this and/or other sites on the
          internet. Where required by law, personalised advertising is used only with your consent; otherwise non-personalised ads may be shown.
        </p>
        <p>
          You can opt out of personalised advertising in <a href="https://myadcenter.google.com/" rel="noopener">Google’s My Ad Center</a>, and learn more at{' '}
          <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">How Google uses information from sites that use its services</a>.
          You can also visit <a href="https://www.aboutads.info/choices/" rel="noopener">aboutads.info</a> to opt out of some third-party vendors’ use of cookies.
        </p>

        <h2>5. Cookies</h2>
        <p>Details of the cookies and similar technologies we use, and how to control them, are in our <a href="/cookie-policy/">Cookie Policy</a>.</p>

        <h2>6. Legal bases (EEA and UK visitors)</h2>
        <p>We rely on <em>consent</em> for analytics and personalised ads, <em>legitimate interests</em> for security and essential site operation, and on steps necessary to respond to your requests when you contact us.</p>

        <h2>7. Your rights</h2>
        <p>
          Depending on where you live (for example under the GDPR, UK GDPR or California privacy laws), you may have the right to access, correct or delete
          personal information we hold about you, to object to or restrict processing, to withdraw consent at any time, and to complain to your local data
          protection authority. Because we don’t keep your tool files, there is no such data to request. To exercise other rights, contact us {contactLine()}.
        </p>

        <h2>8. Children</h2>
        <p>ToolKitWorld is a general-audience website and is not directed at children under 13. We do not knowingly collect personal information from children.</p>

        <h2>9. Security</h2>
        <p>The site is served over HTTPS. Processing files on your device means they are never transmitted to us, which removes a common risk of online tools.</p>

        <h2>10. Third-party links</h2>
        <p>Our pages may link to other websites. We are not responsible for their privacy practices.</p>

        <h2>11. Changes</h2>
        <p>We may update this policy as the site changes. The “last updated” date above shows the latest version.</p>
      </div>
    </PageShell>
  );
}

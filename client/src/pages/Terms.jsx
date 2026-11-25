import { FileText } from 'lucide-react';
import PageShell from '../layouts/PageShell';
import IconBadge from '../components/IconBadge';
import LegalMeta, { contactLine, operator } from '../components/LegalMeta';

export default function Terms() {
  return (
    <PageShell title="Terms and Conditions" path="/terms/" icon={<IconBadge icon={FileText} color="slate" size="lg" />}
      description="The terms that apply when you use ToolKitWorld's free online calculators, PDF, image and text tools."
      lead="Please read these terms before using ToolKitWorld.">
      <div className="prose legal">
        <LegalMeta />
        <h2>1. Acceptance</h2>
        <p>By using ToolKitWorld (“the site”), operated by {operator()}, you agree to these terms. If you do not agree, please do not use the site.</p>
        <h2>2. The service</h2>
        <p>The site provides free online tools and educational articles. We may change, add or remove tools at any time, and we do not guarantee that any tool will always be available.</p>
        <h2>3. Acceptable use</h2>
        <ul>
          <li>Use the tools only for lawful purposes and only with files you have the right to use.</li>
          <li>Do not attempt to disrupt, overload, scrape at scale or gain unauthorised access to the site or its infrastructure.</li>
          <li>Do not use the site to infringe anyone’s intellectual property or privacy rights.</li>
        </ul>
        <h2>4. Your content</h2>
        <p>Files and text you use in the tools remain yours. They are processed on your own device and are not transferred to us. You are responsible for keeping your own copies of important files.</p>
        <h2>5. Accuracy and no professional advice</h2>
        <p>We work hard to make the tools accurate, but results are provided “as is” for general information. They are not financial, legal, academic, medical or other professional advice. Please verify important results independently. See our <a href="/disclaimer/">Disclaimer</a>.</p>
        <h2>6. Intellectual property</h2>
        <p>The site’s design, text, graphics and code are protected by copyright. You may link to our pages and share them, but you may not copy the site or its content in bulk without permission. Open-source components remain under their own licences.</p>
        <h2>7. Advertising and third parties</h2>
        <p>The site may display third-party advertising and links. We do not endorse and are not responsible for third-party products, services or websites.</p>
        <h2>8. Limitation of liability</h2>
        <p>To the fullest extent permitted by law, {operator()} is not liable for any indirect, incidental or consequential loss, or for loss of data, arising from your use of the site or its tools. Nothing in these terms limits liability that cannot be limited by law.</p>
        <h2>9. Changes to these terms</h2>
        <p>We may update these terms. Continued use of the site after changes means you accept the updated terms.</p>
        <h2>10. Contact</h2>
        <p>Questions about these terms can be sent {contactLine()}.</p>
      </div>
    </PageShell>
  );
}

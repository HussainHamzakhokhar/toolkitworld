import { AlertTriangle } from 'lucide-react';
import PageShell from '../layouts/PageShell';
import IconBadge from '../components/IconBadge';
import LegalMeta, { contactLine } from '../components/LegalMeta';

export default function Disclaimer() {
  return (
    <PageShell title="Disclaimer" path="/disclaimer/" icon={<IconBadge icon={AlertTriangle} color="slate" size="lg" />}
      description="Important information about the accuracy and intended use of ToolKitWorld's calculators, file tools and articles."
      lead="Our tools are designed to be accurate and helpful, but please read this before relying on any result.">
      <div className="prose legal">
        <LegalMeta />
        <h2>General information only</h2>
        <p>The tools and articles on ToolKitWorld are provided for general informational and educational purposes. They are not a substitute for advice from a qualified professional.</p>
        <h2>Calculators</h2>
        <p>Calculators use standard formulas and show their working so results can be checked. Institutions may use different rules — for example, universities calculate GPA in different ways and retailers may round prices differently. Always confirm figures that matter (grades, money, legal or contractual deadlines) with the organisation concerned.</p>
        <h2>File tools</h2>
        <p>PDF and image tools create new files from the ones you provide. Always check the output before deleting your originals. Compression may not reduce every file, and image-based PDF compression makes text unselectable; each tool explains its limitations.</p>
        <h2>No warranties</h2>
        <p>We do not warrant that the site will be error-free or uninterrupted, or that results will meet your particular requirements.</p>
        <h2>External links and advertising</h2>
        <p>Links to other websites and third-party advertisements are provided for convenience. We do not control and are not responsible for their content.</p>
        <h2>Corrections</h2>
        <p>If you spot an error in a tool or article, please let us know {contactLine()}.</p>
      </div>
    </PageShell>
  );
}

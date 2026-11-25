import { Link } from 'react-router';
import { Info } from 'lucide-react';
import PageShell from '../layouts/PageShell';
import IconBadge from '../components/IconBadge';
import { SITE } from '../config/site';
import { TOOLS } from '../data/tools';

export default function About() {
  return (
    <PageShell title="About ToolKitWorld" seoTitle="About Us" path="/about/" icon={<IconBadge icon={Info} color="blue" size="lg" />}
      description="ToolKitWorld builds free, private online tools that run in your browser. Learn how the tools work, how we write our guides and how the site is funded."
      lead="Free, fast tools for everyday tasks — built to respect your time and your privacy.">
      <div className="prose">
        <h2>What we do</h2>
        <p>
          ToolKitWorld is a collection of {TOOLS.length} free online tools: calculators for percentages, age, dates, GPA and discounts;
          text tools for counting, case conversion and comparison; image converters and a resizer; and PDF tools for merging, splitting and compressing.
          You can use every tool immediately, without creating an account or installing software.
        </p>
        <h2>How our tools work</h2>
        <p>
          Wherever possible, tools run entirely inside your web browser. When you add a PDF or a photo, your own device does the processing using open-source
          libraries such as <a href="https://pdf-lib.js.org/" rel="noopener">pdf-lib</a> and Mozilla’s <a href="https://mozilla.github.io/pdf.js/" rel="noopener">PDF.js</a>,
          plus the browser’s built-in graphics engine. Your files are not uploaded to our servers, which makes the tools faster and keeps your documents private.
        </p>
        <h2>How we write our guides</h2>
        <p>
          Our articles explain the methods behind the tools in plain language, with worked examples that can be checked by hand or with the matching tool.
          We do not claim professional credentials we do not have. For decisions with financial, legal, medical or academic consequences, please confirm results
          with a qualified professional or the institution concerned. If you find a mistake, <Link to="/contact/">tell us</Link> and we will correct it.
        </p>
        <h2>How the site is funded</h2>
        <p>
          ToolKitWorld is free because it may show advertising. Ads are labelled and kept away from buttons, upload areas and download links so they can’t be
          confused with the tools. You can manage cookie choices at any time from the “Cookie settings” link in the footer.
        </p>
        <h2>Who runs ToolKitWorld</h2>
        <p>
          {SITE.ownerName ? <>ToolKitWorld is operated by {SITE.ownerName}.</> : <>ToolKitWorld is run by a small independent team.</>}{' '}
          Questions, bug reports and tool suggestions are always welcome on our <Link to="/contact/">contact page</Link>.
        </p>
      </div>
    </PageShell>
  );
}

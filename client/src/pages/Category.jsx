import { Link } from 'react-router';
import { ArrowRight, BookOpen } from 'lucide-react';
import PageShell from '../layouts/PageShell';
import ToolCard from '../components/ToolCard';
import IconBadge from '../components/IconBadge';
import Faq from '../components/Faq';
import AdSlot from '../components/AdSlot';
import { categoryById, toolsInCategory } from '../data/tools';
import { POSTS } from '../data/posts';

/** Unique supporting copy for each category page (avoids thin, duplicate pages). */
const EXTRA = {
  calculators: {
    about: [
      'Everyday maths is easy to get slightly wrong: a percentage taken from the wrong base, a month with 30 days instead of 31, or a GPA averaged without weighting by credit hours. These calculators are built to avoid those traps and to show their working, so you can see exactly how each answer was reached.',
      'All calculations run in your browser the moment you type. Nothing you enter is sent anywhere, which also means the calculators keep working on a slow connection once the page has loaded.',
    ],
    faqs: [
      ['Do the calculators show how the answer was calculated?', 'Yes. The percentage, discount and GPA calculators show the formula and each step, and the date tools explain how days, months and leap years were counted.'],
      ['Are dates affected by my time zone?', 'No. Date calculations use calendar dates only, so daylight-saving changes and time zones cannot shift a result by a day.'],
      ['Can I use the GPA calculator for my university?', 'Yes. Choose the closest grading scale, then edit any grade or point value so it matches your institution exactly.'],
    ],
    guideCat: 'Calculators',
  },
  'pdf-tools': {
    about: [
      'Most online PDF services upload your document to their servers. ToolKitWorld does the work inside your browser instead, using well-tested open-source PDF libraries. Contracts, statements and coursework stay on your own device from start to finish.',
      'Because processing is local, speed depends on your device. Typical documents finish in seconds; very large files (hundreds of pages or scans of 100 MB and more) may take longer on older phones.',
    ],
    faqs: [
      ['Is it safe to use these PDF tools for confidential documents?', 'The files are read and processed by your browser and are not uploaded. You can even disconnect from the internet after the page loads and the tools will still work.'],
      ['Can I process password-protected PDFs?', 'Not directly. Encrypted PDFs need to be unlocked first with the password in a PDF reader. The tools will tell you clearly if a file is protected.'],
      ['Is there a file size limit?', 'There is no fixed limit on our side, but browsers have memory limits. Files up to a few hundred megabytes usually work on desktop computers.'],
    ],
    guideCat: 'PDF',
  },
  'image-tools': {
    about: [
      'Convert and resize images using the graphics engine already built into your browser. Pictures are decoded, redrawn and re-encoded on your device, so photos of people, documents or IDs are never sent to a server.',
      'Each tool explains what it changes. Converting a JPG to PNG preserves what is in the file but cannot restore detail that JPG compression already removed, and converting a transparent PNG to JPG requires choosing a background colour.',
    ],
    faqs: [
      ['Do the image tools reduce quality?', 'PNG output is lossless. JPG and WebP output use the quality you choose; higher quality means a larger file. Resizing to smaller dimensions always discards some detail.'],
      ['Which formats are supported?', 'JPG/JPEG and PNG in all modern browsers. WebP export is offered where your browser supports it.'],
      ['Is photo metadata (EXIF) kept?', 'No. Re-encoding through the canvas removes metadata such as camera details and GPS location, which can be a privacy benefit.'],
    ],
    guideCat: 'Images',
  },
  'text-tools': {
    about: [
      'Text tools for students, writers, marketers and developers. Counters update live as you type and use modern Unicode rules, so accented letters, emoji and non-Latin scripts are counted the way people actually see them.',
      'Your text never leaves the page. Nothing is saved, logged or sent to a server, so it is safe to paste drafts, emails or private notes.',
    ],
    faqs: [
      ['Is my text saved anywhere?', 'No. Text exists only in the page while it is open. Closing or refreshing the page clears it.'],
      ['Why might my word count differ from another program?', 'Programs define a “word” slightly differently, for example around hyphens, numbers and symbols. Our rules are explained on each tool page.'],
      ['Do the tools work with languages other than English?', 'Yes. Counting and case conversion use Unicode-aware rules. Case conversion only affects scripts that have upper and lower case.'],
    ],
    guideCat: 'Text',
  },
};

export default function Category({ id }) {
  const cat = categoryById[id];
  const extra = EXTRA[id];
  const tools = toolsInCategory(id);
  const guides = POSTS.filter((p) => p.category === extra.guideCat);
  return (
    <PageShell title={cat.name} seoTitle={cat.metaTitle} description={cat.metaDescription} path={cat.path} lead={cat.intro}
      icon={<IconBadge icon={cat.icon} color={cat.color} size="lg" />} wide>
      <div className="grid grid--3">{tools.map((t) => <ToolCard key={t.id} tool={t} />)}</div>
      <AdSlot slot="inContent" />
      <div className="two-col">
        <section className="prose">
          <h2>About our {cat.name.toLowerCase()}</h2>
          {extra.about.map((p, i) => <p key={i}>{p}</p>)}
          <h2>Questions about {cat.name.toLowerCase()}</h2>
          <Faq items={extra.faqs} />
        </section>
        {guides.length > 0 && (
          <aside className="side-card">
            <h2 className="side-card__title">Related guides</h2>
            <ul className="guide-links guide-links--compact">
              {guides.map((g) => (
                <li key={g.slug}><Link to={`/blog/${g.slug}/`}><BookOpen size={16} aria-hidden="true" /> <span>{g.title}</span> <ArrowRight size={14} aria-hidden="true" /></Link></li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </PageShell>
  );
}

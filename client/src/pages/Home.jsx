import { Link } from 'react-router';
import { ArrowRight, BadgeCheck, Gauge, Lock, MousePointerClick, Smartphone, Sparkles, UserX, Upload, Wand2 } from 'lucide-react';
import Seo from '../seo/Seo';
import { ldOrganization, ldWebsite } from '../seo/head';
import SearchBox from '../components/SearchBox';
import HeroArt from '../components/HeroArt';
import ToolCard from '../components/ToolCard';
import PostCard from '../components/PostCard';
import IconBadge from '../components/IconBadge';
import Faq from '../components/Faq';
import AdSlot from '../components/AdSlot';
import { CATEGORIES, TOOLS, popularTools, toolById, toolsInCategory } from '../data/tools';
import { latestPosts } from '../data/posts';

const SHORTCUTS = ['pdf-to-word', 'word-to-pdf', 'percentage-calculator', 'word-counter', 'jpg-to-pdf', 'pdf-merger'];

const WHY = [
  { icon: BadgeCheck, title: 'Free to use', text: 'Every tool is free, with no trial periods, watermarks or hidden limits on results.' },
  { icon: UserX, title: 'No registration', text: 'Open a tool and start. You never need an account or an email address.' },
  { icon: Gauge, title: 'Fast processing', text: 'Work happens in your browser, so results appear instantly with no upload wait.' },
  { icon: Lock, title: 'Privacy-conscious', text: 'Your files and text stay on your device. We do not upload or store them.' },
  { icon: Smartphone, title: 'Mobile-friendly', text: 'Designed for phones, tablets and desktops, with large touch-friendly controls.' },
];

const STEPS = [
  { icon: MousePointerClick, title: 'Select your tool', text: 'Search or browse by category to find the tool you need.' },
  { icon: Upload, title: 'Enter information or add a file', text: 'Type your numbers or text, or choose files from your device.' },
  { icon: Wand2, title: 'Get your result instantly', text: 'See the answer straight away, then copy or download it.' },
];

const FAQS = [
  ['Are the tools on ToolKitWorld really free?', 'Yes. All tools are free to use. The site is supported by advertising, which is kept separate from tool controls so it never gets in the way of your work.'],
  ['Do you upload or keep my files?', 'No. The PDF and image tools process files inside your web browser using your own device. Files are not sent to our servers, so there is nothing for us to store or delete.'],
  ['Do I need to install anything or create an account?', 'No. The tools work in any modern browser on Windows, macOS, Linux, Android and iOS. There is nothing to install and no sign-up.'],
  ['How accurate are the calculators?', 'The calculators use standard formulas and show the steps they followed, so you can check every result. For important financial, academic or legal decisions, confirm the figures with the relevant institution.'],
  ['Can I use the tools on my phone?', 'Yes. Every page adapts to small screens. Very large PDFs or images may process more slowly on older phones because the work happens on the device.'],
  ['Will more tools be added?', 'Yes. New tools are added regularly. You can suggest one through the contact page.'],
];

export default function Home() {
  return (
    <>
      <Seo
        title="ToolKitWorld – Free Online Tools for Everyday Tasks"
        description="Free online calculators, PDF tools, image converters and text tools. No downloads, no registration — fast, private tools that run in your browser."
        path="/"
        jsonLd={[ldOrganization(), ldWebsite()]}
      />

      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow"><Sparkles size={16} aria-hidden="true" /> {TOOLS.length} free tools · no sign-up</p>
            <h1>Free Online Tools for <span className="text-gradient">Everyday Tasks</span></h1>
            <p className="hero__lead">
              Calculate, convert, compress, and create with simple, powerful online tools. No downloads. No registration. Just get things done.
            </p>
            <SearchBox variant="hero" />
            <div className="hero__popular">
              <span>Popular:</span>
              <ul>
                {SHORTCUTS.map((id) => <li key={id}><Link to={toolById[id].path} className="chip">{toolById[id].name}</Link></li>)}
              </ul>
            </div>
          </div>
          <div className="hero__art"><HeroArt /></div>
        </div>
      </section>

      <section className="section" aria-labelledby="popular-h">
        <div className="container">
          <div className="section__head">
            <div>
              <h2 id="popular-h">Popular tools</h2>
              <p>The tools people use most, one click away.</p>
            </div>
            <Link to="/tools/" className="btn btn--ghost">View all tools <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="grid grid--4">{popularTools().map((t) => <ToolCard key={t.id} tool={t} />)}</div>
        </div>
      </section>

      <div className="container"><AdSlot slot="inContent" /></div>

      <section className="section section--tint" aria-labelledby="cats-h">
        <div className="container">
          <div className="section__head section__head--center">
            <div>
              <h2 id="cats-h">Browse by category</h2>
              <p>Four toolboxes for numbers, documents, pictures and words.</p>
            </div>
          </div>
          <div className="cat-blocks">
            {CATEGORIES.map((c) => (
              <div key={c.id} className={`cat-block cat-block--${c.color}`}>
                <div className="cat-block__head">
                  <IconBadge icon={c.icon} color={c.color} size="lg" />
                  <div>
                    <h3><Link to={c.path}>{c.name}</Link></h3>
                    <p>{c.short}</p>
                  </div>
                </div>
                <ul className="cat-block__list">
                  {toolsInCategory(c.id).map((t) => (
                    <li key={t.id}><Link to={t.path}><t.icon size={18} aria-hidden="true" /> {t.name}</Link></li>
                  ))}
                </ul>
                <Link to={c.path} className="cat-block__more">See all {c.name.toLowerCase()} <ArrowRight size={16} aria-hidden="true" /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="why-h">
        <div className="container">
          <div className="section__head section__head--center">
            <div>
              <h2 id="why-h">Why ToolKitWorld?</h2>
              <p>Useful tools without the usual hassle.</p>
            </div>
          </div>
          <div className="features">
            {WHY.map((w) => (
              <div className="feature" key={w.title}>
                <span className="feature__icon"><w.icon aria-hidden="true" /></span>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark" aria-labelledby="how-h">
        <div className="container">
          <div className="section__head section__head--center">
            <div>
              <h2 id="how-h">How it works</h2>
              <p>Three steps, usually a few seconds.</p>
            </div>
          </div>
          <ol className="how">
            {STEPS.map((s, i) => (
              <li key={s.title} className="how__step">
                <span className="how__num" aria-hidden="true">{i + 1}</span>
                <s.icon className="how__icon" aria-hidden="true" />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="guides-h">
        <div className="container">
          <div className="section__head">
            <div>
              <h2 id="guides-h">Latest guides</h2>
              <p>Short, practical tutorials for the maths and file tasks behind our tools.</p>
            </div>
            <Link to="/blog/" className="btn btn--ghost">All guides <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="grid grid--3">{latestPosts(3).map((p) => <PostCard key={p.slug} post={p} />)}</div>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="faq-h">
        <div className="container container--narrow">
          <div className="section__head section__head--center">
            <div><h2 id="faq-h">Frequently asked questions</h2></div>
          </div>
          <Faq items={FAQS} />
        </div>
      </section>
    </>
  );
}

import { Link } from 'react-router';
import { ArrowRight, BookOpen, ShieldCheck, Lightbulb } from 'lucide-react';
import Seo from '../seo/Seo';
import { ldBreadcrumbs, ldWebApp } from '../seo/head';
import Breadcrumbs from '../components/Breadcrumbs';
import IconBadge from '../components/IconBadge';
import ToolCard from '../components/ToolCard';
import Faq from '../components/Faq';
import AdSlot from '../components/AdSlot';
import { categoryById, toolById, toolsInCategory } from '../data/tools';
import { postBySlug } from '../data/posts';

/**
 * The template every tool page follows:
 * breadcrumbs → H1 → short intro → TOOL → how to use → how it works →
 * examples → benefits → FAQ → related tools → guides.
 */
export default function ToolLayout({ id, content, children }) {
  const tool = toolById[id];
  const cat = categoryById[tool.category];
  const crumbs = [{ name: 'Home', path: '/' }, { name: cat.name, path: cat.path }, { name: tool.name, path: tool.path }];
  const related = tool.related.map((r) => toolById[r]).filter(Boolean);
  const guides = tool.guides.map((g) => postBySlug[g]).filter(Boolean);
  const siblings = toolsInCategory(cat.id).filter((t) => t.id !== id);

  return (
    <>
      <Seo title={tool.metaTitle} description={tool.metaDescription} path={tool.path} jsonLd={[ldWebApp(tool), ldBreadcrumbs(crumbs)]} />
      <div className={`tool-hero tool-hero--${cat.color}`}>
        <div className="container">
          <Breadcrumbs items={crumbs} />
          <div className="tool-hero__head">
            <IconBadge icon={tool.icon} color={cat.color} size="lg" />
            <div>
              <h1>{tool.name}</h1>
              <p className="lead">{content.intro}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container tool-page">
        <div className="tool-page__main">
          <section className="tool-panel" aria-label={`${tool.name} tool`}>{children}</section>

          <AdSlot slot="belowResult" className="tool-page__ad" />

          <article className="tool-content prose">
            <section>
              <h2>How to use the {tool.name}</h2>
              <ol className="steps">
                {content.howTo.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </section>

            <section>
              <h2>{content.explanationTitle || 'How it works'}</h2>
              {content.explanation}
            </section>

            <section>
              <h2>Examples</h2>
              <div className="examples">
                {content.examples.map((ex) => (
                  <div className="example" key={ex.title}>
                    <h3><Lightbulb size={18} aria-hidden="true" /> {ex.title}</h3>
                    <p>{ex.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <AdSlot slot="inContent" />

            <section>
              <h2>Benefits and common uses</h2>
              <ul className="benefits">
                {content.benefits.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </section>

            <section>
              <h2>Frequently asked questions</h2>
              <Faq items={content.faqs} />
            </section>
          </article>

          <section className="related">
            <h2>Related tools</h2>
            <div className="grid grid--3">{related.map((t) => <ToolCard key={t.id} tool={t} />)}</div>
          </section>

          {guides.length > 0 && (
            <section className="related">
              <h2>Helpful guides</h2>
              <ul className="guide-links">
                {guides.map((g) => (
                  <li key={g.slug}>
                    <Link to={`/blog/${g.slug}/`}><BookOpen size={18} aria-hidden="true" /> <span>{g.title}</span> <ArrowRight size={16} aria-hidden="true" /></Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="tool-page__side" aria-label="More tools">
          <div className="side-card">
            <h2 className="side-card__title">More {cat.name}</h2>
            <ul className="side-list">
              {siblings.map((t) => (
                <li key={t.id}><Link to={t.path}><IconBadge icon={t.icon} color={cat.color} size="sm" /> {t.name}</Link></li>
              ))}
            </ul>
            <Link to={cat.path} className="side-card__more">All {cat.name} <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
          <div className="side-card side-card--trust">
            <ShieldCheck aria-hidden="true" />
            <p><strong>Private by design.</strong> {tool.category === 'calculators' || tool.category === 'text-tools' ? 'Everything you type stays in your browser.' : 'Files are processed on your device and never uploaded.'}</p>
          </div>
          <AdSlot slot="sidebar" format="vertical" className="side-ad" />
        </aside>
      </div>
    </>
  );
}

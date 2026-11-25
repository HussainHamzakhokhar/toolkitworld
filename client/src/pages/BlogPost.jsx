import { Link, useNavigate } from 'react-router';
import { ArrowRight, CalendarDays, Clock, RefreshCw, UserRound } from 'lucide-react';
import Seo from '../seo/Seo';
import { ldArticle, ldBreadcrumbs } from '../seo/head';
import Breadcrumbs from '../components/Breadcrumbs';
import PostArt from '../components/PostArt';
import PostCard, { formatPostDate } from '../components/PostCard';
import ToolCard from '../components/ToolCard';
import AdSlot from '../components/AdSlot';
import { POSTS, postBySlug } from '../data/posts';
import { toolById } from '../data/tools';
import { SITE } from '../config/site';

// Articles are Markdown converted to HTML at build time (see vite.config.js).
const bodies = import.meta.glob('../../../content/blog/*.md', { eager: true, import: 'default' });
const bodyFor = (slug) => bodies[`../../../content/blog/${slug}.md`] || '';

const tocFrom = (html) =>
  [...html.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)].map((m) => ({ id: m[1], text: m[2].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&') }));

/** Splits the article after roughly the middle <h2> so an ad can sit between sections, never inside one. */
function splitForAd(html) {
  const idx = [...html.matchAll(/<h2 /g)].map((m) => m.index);
  if (idx.length < 4) return [html, ''];
  const cut = idx[Math.floor(idx.length / 2)];
  return [html.slice(0, cut), html.slice(cut)];
}

export default function BlogPost({ slug }) {
  const post = postBySlug[slug];
  const navigate = useNavigate();
  const html = bodyFor(slug);
  const toc = tocFrom(html);
  const [first, second] = splitForAd(html);
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog/' }, { name: post.title, path: `/blog/${slug}/` }];
  const related = POSTS.filter((p) => p.slug !== slug)
    .map((p) => ({ p, score: (p.category === post.category ? 2 : 0) + p.tools.filter((t) => post.tools.includes(t)).length }))
    .sort((a, b) => b.score - a.score).slice(0, 3).map((x) => x.p);

  // Keep internal links inside the single-page app (no full reload).
  const onClick = (e) => {
    const a = e.target.closest('a');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
    const href = a.getAttribute('href');
    if (href?.startsWith('/')) { e.preventDefault(); navigate(href); }
  };

  return (
    <>
      <Seo title={post.title} description={post.description} path={`/blog/${slug}/`} type="article" article={post}
        jsonLd={[ldArticle(post), ldBreadcrumbs(crumbs)]} />
      <div className="post-hero">
        <div className="container container--narrow">
          <Breadcrumbs items={crumbs} />
          <span className="post-card__cat">{post.category}</span>
          <h1>{post.title}</h1>
          <p className="lead">{post.description}</p>
          <ul className="post-meta">
            <li><UserRound size={16} aria-hidden="true" /> {SITE.author.name}</li>
            <li><CalendarDays size={16} aria-hidden="true" /> Published <time dateTime={post.published}>{formatPostDate(post.published)}</time></li>
            {post.modified !== post.published && <li><RefreshCw size={16} aria-hidden="true" /> Updated <time dateTime={post.modified}>{formatPostDate(post.modified)}</time></li>}
            <li><Clock size={16} aria-hidden="true" /> {post.readMinutes} min read</li>
          </ul>
        </div>
      </div>
      <div className="container post-layout">
        <aside className="post-toc" aria-label="Table of contents">
          <p className="post-toc__title">On this page</p>
          <ol>{toc.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>)}</ol>
        </aside>
        <article className="post-body">
          <PostArt category={post.category} large />
          <div className="prose" onClick={onClick} dangerouslySetInnerHTML={{ __html: first }} />
          {second && <AdSlot slot="inContent" />}
          {second && <div className="prose" onClick={onClick} dangerouslySetInnerHTML={{ __html: second }} />}

          <section className="post-tools">
            <h2>Try the tools from this guide</h2>
            <div className="grid grid--2">{post.tools.map((id) => <ToolCard key={id} tool={toolById[id]} />)}</div>
          </section>

          <section className="author-box" aria-label="About the author">
            <span className="author-box__avatar" aria-hidden="true">TK</span>
            <div>
              <p className="author-box__name">{SITE.author.name}</p>
              <p>{SITE.author.bio} <Link to="/about/">More about us <ArrowRight size={14} aria-hidden="true" /></Link></p>
            </div>
          </section>
        </article>
      </div>
      <section className="section section--tint" aria-labelledby="rel-h">
        <div className="container">
          <h2 id="rel-h">Related articles</h2>
          <div className="grid grid--3">{related.map((p) => <PostCard key={p.slug} post={p} />)}</div>
        </div>
      </section>
    </>
  );
}

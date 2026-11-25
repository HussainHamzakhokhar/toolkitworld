import { useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import PageShell from '../layouts/PageShell';
import PostCard from '../components/PostCard';
import IconBadge from '../components/IconBadge';
import { BLOG_CATEGORIES, POSTS } from '../data/posts';

export default function Blog() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const posts = [...POSTS]
    .sort((a, b) => b.published.localeCompare(a.published))
    .filter((p) => cat === 'All' || p.category === cat)
    .filter((p) => terms.every((t) => `${p.title} ${p.description} ${p.category}`.toLowerCase().includes(t)));

  return (
    <PageShell
      title="Guides & Tutorials"
      seoTitle="ToolKitWorld Blog – Guides for Calculations, PDFs, Images & Text"
      description="Practical guides on calculating percentages, age, GPA and dates, compressing PDFs, converting images and counting words — with worked examples."
      path="/blog/"
      lead="Clear explanations of the maths and file tasks behind our tools, with worked examples you can follow."
      icon={<IconBadge icon={BookOpen} color="slate" size="lg" />}
      wide
    >
      <div className="blog-toolbar">
        <div className="input-icon">
          <Search aria-hidden="true" />
          <label htmlFor="blog-q" className="sr-only">Search articles</label>
          <input id="blog-q" type="search" placeholder="Search articles…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="filter-chips" role="group" aria-label="Filter articles by category">
          {['All', ...BLOG_CATEGORIES].map((c) => (
            <button type="button" key={c} className={`chip${cat === c ? ' is-active' : ''}`} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{posts.length} articles shown</p>
      {posts.length ? (
        <div className="grid grid--3">{posts.map((p) => <PostCard key={p.slug} post={p} />)}</div>
      ) : (
        <div className="empty-state"><BookOpen aria-hidden="true" /><p>No articles match your search. Try another word or category.</p></div>
      )}
    </PageShell>
  );
}

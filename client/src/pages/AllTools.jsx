import { useState } from 'react';
import { Link } from 'react-router';
import { LayoutGrid } from 'lucide-react';
import PageShell from '../layouts/PageShell';
import ToolCard from '../components/ToolCard';
import IconBadge from '../components/IconBadge';
import { CATEGORIES, TOOLS, toolsInCategory } from '../data/tools';

export default function AllTools() {
  const [filter, setFilter] = useState('all');
  const cats = filter === 'all' ? CATEGORIES : CATEGORIES.filter((c) => c.id === filter);
  return (
    <PageShell
      title="All Tools"
      seoTitle="All Free Online Tools – Calculators, PDF, Image & Text Tools"
      description={`Browse all ${TOOLS.length} free ToolKitWorld tools: calculators, PDF merger, splitter and compressor, image converters and resizer, and text tools.`}
      path="/tools/"
      lead={`Every tool on ToolKitWorld in one place — ${TOOLS.length} and counting. All free, all in your browser.`}
      icon={<IconBadge icon={LayoutGrid} color="blue" size="lg" />}
      wide
    >
      <div className="filter-chips" role="group" aria-label="Filter by category">
        <button type="button" className={`chip${filter === 'all' ? ' is-active' : ''}`} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All ({TOOLS.length})</button>
        {CATEGORIES.map((c) => (
          <button type="button" key={c.id} className={`chip${filter === c.id ? ' is-active' : ''}`} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
            {c.name} ({toolsInCategory(c.id).length})
          </button>
        ))}
      </div>
      {cats.map((c) => (
        <section key={c.id} className="tool-group" aria-labelledby={`g-${c.id}`}>
          <div className="tool-group__head">
            <h2 id={`g-${c.id}`}><Link to={c.path}>{c.name}</Link></h2>
            <p>{c.short}</p>
          </div>
          <div className="grid grid--3">{toolsInCategory(c.id).map((t) => <ToolCard key={t.id} tool={t} />)}</div>
        </section>
      ))}
    </PageShell>
  );
}

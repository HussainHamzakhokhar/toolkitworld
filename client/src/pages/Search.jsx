import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Search as SearchIcon, SearchX } from 'lucide-react';
import PageShell from '../layouts/PageShell';
import SearchBox from '../components/SearchBox';
import IconBadge from '../components/IconBadge';
import ToolCard from '../components/ToolCard';
import { search } from '../utils/search';
import { popularTools } from '../data/tools';

export default function Search() {
  const location = useLocation();
  const [q, setQ] = useState(null); // read from the URL after hydration
  useEffect(() => setQ(new URLSearchParams(location.search).get('q') || ''), [location.search]);
  const results = q ? search(q, 50) : [];

  return (
    <PageShell title="Search" seoTitle="Search ToolKitWorld" description="Search all ToolKitWorld tools and guides." path="/search/" noindex
      icon={<IconBadge icon={SearchIcon} color="blue" size="lg" />} lead={q ? `Results for “${q}”` : 'Find a tool or guide by name, keyword or category.'}>
      <SearchBox variant="page" key={q} initialQuery={q || ''} />
      {q !== null && q !== '' && (
        results.length ? (
          <ul className="search-results" aria-label={`${results.length} results`}>
            {results.map((r) => (
              <li key={r.path}>
                <Link to={r.path} className="search-result">
                  <IconBadge icon={r.icon} color={r.color} />
                  <span><span className="search-result__type">{r.type}</span><span className="search-result__title">{r.title}</span><span className="search-result__sub">{r.subtitle}</span></span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <SearchX aria-hidden="true" />
            <p>Nothing matched “{q}”. Check the spelling or try a broader word such as “pdf”, “image”, “date” or “count”.</p>
          </div>
        )
      )}
      <h2 className="mt-xl">Popular tools</h2>
      <div className="grid grid--2">{popularTools().slice(0, 4).map((t) => <ToolCard key={t.id} tool={t} />)}</div>
    </PageShell>
  );
}

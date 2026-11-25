import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';

/** Visible breadcrumb trail. The matching BreadcrumbList JSON-LD is added by the page's <Seo>. */
export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {items.map((it, i) => (
          <li key={it.path}>
            {i < items.length - 1 ? <Link to={it.path}>{it.name}</Link> : <span aria-current="page">{it.name}</span>}
            {i < items.length - 1 && <ChevronRight aria-hidden="true" size={14} />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

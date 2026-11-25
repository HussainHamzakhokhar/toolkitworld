import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import IconBadge from './IconBadge';
import { categoryById } from '../data/tools';

export default function ToolCard({ tool, compact = false }) {
  const cat = categoryById[tool.category];
  return (
    <Link to={tool.path} className={`tool-card tool-card--${cat.color}${compact ? ' tool-card--compact' : ''}`}>
      <IconBadge icon={tool.icon} color={cat.color} />
      <span className="tool-card__body">
        <span className="tool-card__name">{tool.name}</span>
        {!compact && <span className="tool-card__desc">{tool.short}</span>}
      </span>
      {!compact && <span className="tool-card__cta">Open tool <ArrowRight size={16} aria-hidden="true" /></span>}
    </Link>
  );
}

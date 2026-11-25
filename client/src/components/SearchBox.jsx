import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, CornerDownLeft } from 'lucide-react';
import { search } from '../utils/search';
import { TOOLS } from '../data/tools';
import { track } from '../utils/analytics';
import IconBadge from './IconBadge';

/**
 * Accessible search combobox (WAI-ARIA pattern): live suggestions,
 * ↑/↓ to move, Enter to open, Esc to close.
 */
export default function SearchBox({ variant = 'hero', autoFocus = false, onDone, initialQuery = '' }) {
  const [q, setQ] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const navigate = useNavigate();
  const id = useId();
  const inputRef = useRef(null);
  const results = q.trim() ? search(q, 8) : [];

  useEffect(() => { if (autoFocus) inputRef.current?.focus(); }, [autoFocus]);
  useEffect(() => setActive(-1), [q]);

  const go = (path) => {
    track('search', { search_term: q.trim() });
    setOpen(false);
    setQ('');
    onDone?.();
    navigate(path);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
    else if (e.key === 'Escape') { if (open && q) { setOpen(false); e.stopPropagation(); } }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (active >= 0 && results[active]) go(results[active].path);
      else if (q.trim()) go(`/search/?q=${encodeURIComponent(q.trim())}`);
    }
  };

  const showList = open && q.trim() !== '';
  return (
    <div className={`searchbox searchbox--${variant}`}>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="searchbox__form">
        <Search className="searchbox__icon" aria-hidden="true" />
        <label htmlFor={`${id}-input`} className="sr-only">Search tools and guides</label>
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${id}-opt-${active}` : undefined}
          autoComplete="off"
          placeholder={variant === 'hero' ? `Search ${TOOLS.length} free tools… e.g. "pdf to word"` : 'Search tools and guides…'}
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKeyDown}
        />
        {variant === 'hero' && (
          <button type="button" className="btn btn--primary searchbox__btn" onClick={() => q.trim() && go(`/search/?q=${encodeURIComponent(q.trim())}`)}>
            Search
          </button>
        )}
      </form>
      <ul id={`${id}-list`} role="listbox" aria-label="Search suggestions" className="searchbox__list" hidden={!showList}>
        {results.map((r, i) => (
          <li
            key={r.path}
            id={`${id}-opt-${i}`}
            role="option"
            aria-selected={i === active}
            className="searchbox__opt"
            onMouseDown={(e) => { e.preventDefault(); go(r.path); }}
            onMouseEnter={() => setActive(i)}
          >
            <IconBadge icon={r.icon} color={r.color} size="sm" />
            <span className="searchbox__text">
              <span className="searchbox__title">{r.title}</span>
              <span className="searchbox__sub">{r.subtitle}</span>
            </span>
            <span className="searchbox__type">{r.type}</span>
          </li>
        ))}
        {showList && results.length === 0 && (
          <li className="searchbox__empty" role="option" aria-selected="false" aria-disabled="true">
            No tools match “{q}”. Try a simpler word like “pdf”, “image” or “percent”.
          </li>
        )}
        {showList && results.length > 0 && (
          <li className="searchbox__hint" aria-hidden="true">
            <kbd>↑</kbd><kbd>↓</kbd> to move · <kbd><CornerDownLeft size={11} /></kbd> to open · <kbd>Esc</kbd> to close
          </li>
        )}
      </ul>
    </div>
  );
}

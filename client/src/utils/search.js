import { BookOpen } from 'lucide-react';
import { CATEGORIES, TOOLS, categoryById } from '../data/tools';
import { POSTS } from '../data/posts';

/** One searchable list built from the registries — new tools appear automatically. */
export const SEARCH_INDEX = [
  ...TOOLS.map((t) => ({
    type: 'Tool', title: t.name, path: t.path, icon: t.icon, color: categoryById[t.category].color,
    subtitle: t.short, fields: [t.name, t.keywords.join(' '), categoryById[t.category].name, t.short],
  })),
  ...CATEGORIES.map((c) => ({
    type: 'Category', title: c.name, path: c.path, icon: c.icon, color: c.color, subtitle: c.short, fields: [c.name, '', c.id.replace('-', ' '), c.short],
  })),
  ...POSTS.map((p) => ({
    type: 'Guide', title: p.title, path: `/blog/${p.slug}/`, icon: BookOpen, color: 'slate', subtitle: p.description, fields: [p.title, '', p.category, p.description],
  })),
];

const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
const WEIGHTS = [10, 6, 4, 1]; // title, keywords, category, description
const TYPE_BONUS = { Tool: 3, Category: 1, Guide: 0 };

/**
 * Every word of the query must appear somewhere (prefix match on words).
 * Matches in the title count most, then keywords, category and description.
 */
export function search(query, limit = 8) {
  const terms = norm(query).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (!terms.length) return [];
  const results = [];
  for (const item of SEARCH_INDEX) {
    const fields = item.fields.map(norm);
    let score = 0, ok = true;
    for (const term of terms) {
      let best = 0;
      fields.forEach((field, i) => {
        const re = new RegExp(`(^|[^\\p{L}\\p{N}])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'u');
        if (re.test(field)) best = Math.max(best, WEIGHTS[i]);
      });
      if (!best) { ok = false; break; }
      score += best;
    }
    if (!ok) continue;
    if (norm(item.title).startsWith(terms.join(' '))) score += 8;
    results.push({ ...item, score: score + TYPE_BONUS[item.type] });
  }
  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * Parses page selections like "1-3, 5, 8-" for a document with `total` pages.
 * Returns zero-based page indexes in the order typed (duplicates removed), or
 * an { error } describing exactly what is wrong.
 *   "8-"  → page 8 to the last page
 *   "-3"  → first page to page 3
 *   "last"→ the last page
 */
export function parsePageRanges(input, total) {
  const text = String(input || '').trim();
  if (!text) return { error: 'Enter at least one page number or range, for example 1-3, 5.' };
  const seen = new Set();
  const pages = [];
  for (const raw of text.split(/[,;]+/)) {
    const part = raw.trim().toLowerCase().replace(/\s+/g, '').replace(/[–—]/g, '-');
    if (!part) continue;
    const num = (s, fallback) => (s === '' ? fallback : s === 'last' ? total : /^\d+$/.test(s) ? Number(s) : NaN);
    let start, end;
    if (part.includes('-')) {
      const [a, b, extra] = part.split('-');
      if (extra !== undefined) return { error: `"${raw.trim()}" is not a valid range. Use a format like 2-6.` };
      start = num(a, 1);
      end = num(b, total);
    } else {
      start = end = num(part, NaN);
    }
    if (Number.isNaN(start) || Number.isNaN(end)) return { error: `"${raw.trim()}" is not a page number. Use digits, commas and dashes only.` };
    if (start < 1 || end < 1) return { error: 'Page numbers start at 1.' };
    if (start > total || end > total) return { error: `"${raw.trim()}" is outside this document, which has ${total} page${total === 1 ? '' : 's'}.` };
    if (start > end) return { error: `In "${raw.trim()}" the first page is after the last page. Did you mean ${end}-${start}?` };
    for (let p = start; p <= end; p++) if (!seen.has(p)) { seen.add(p); pages.push(p - 1); }
  }
  if (!pages.length) return { error: 'No pages selected.' };
  return { pages };
}

/** Turns sorted zero-based indexes back into a compact string: [0,1,2,4] → "1-3, 5". */
export function formatPageRanges(indexes) {
  const nums = [...new Set(indexes)].sort((a, b) => a - b).map((i) => i + 1);
  const parts = [];
  for (let i = 0; i < nums.length; i++) {
    let j = i;
    while (j + 1 < nums.length && nums[j + 1] === nums[j] + 1) j++;
    parts.push(i === j ? `${nums[i]}` : `${nums[i]}-${nums[j]}`);
    i = j;
  }
  return parts.join(', ');
}

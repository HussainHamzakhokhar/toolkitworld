/**
 * Rebuilds document structure from positioned PDF text.
 *
 * A PDF stores text as small fragments placed at x/y coordinates, without
 * any notion of "paragraph" or "table". These pure functions reconstruct:
 *   items → lines → paragraphs/headings   (PDF to Word)
 *   items → lines → rows × columns        (PDF to Excel)
 * Item shape: { str, x, y, w, size, bold, italic } in PDF points (y grows upwards).
 */

/** Most common font size, weighted by number of characters — the "body text" size. */
export function bodySize(items) {
  const counts = new Map();
  for (const it of items) {
    const s = Math.round(it.size * 2) / 2;
    counts.set(s, (counts.get(s) || 0) + it.str.length);
  }
  let best = 11, max = 0;
  for (const [s, c] of counts) if (c > max) { max = c; best = s; }
  return best;
}

/** Groups items sharing a baseline into lines, left to right, top to bottom. */
export function groupLines(items) {
  const sorted = items.filter((i) => i.str.length).sort((a, b) => b.y - a.y || a.x - b.x);
  const lines = [];
  for (const it of sorted) {
    const line = lines.find((l) => Math.abs(l.y - it.y) <= Math.max(2, Math.min(l.size, it.size) * 0.45));
    if (line) { line.items.push(it); line.size = Math.max(line.size, it.size); }
    else lines.push({ y: it.y, size: it.size, items: [it] });
  }
  for (const l of lines) {
    l.items.sort((a, b) => a.x - b.x);
    l.x = l.items[0].x;
    l.right = Math.max(...l.items.map((i) => i.x + i.w));
  }
  return lines.sort((a, b) => b.y - a.y);
}

/** Joins a line's fragments into formatted runs, inserting spaces where fragments have a visible gap. */
export function lineRuns(line) {
  const runs = [];
  let prev = null;
  for (const it of line.items) {
    let text = it.str;
    if (prev) {
      const gap = it.x - (prev.x + prev.w);
      if (gap > it.size * 0.15 && !/\s$/.test(prev.str) && !/^\s/.test(text)) text = ' ' + text;
    }
    const last = runs[runs.length - 1];
    if (last && last.bold === !!it.bold && last.italic === !!it.italic) last.text += text;
    else runs.push({ text, bold: !!it.bold, italic: !!it.italic });
    prev = it;
  }
  return runs;
}

const BULLET = /^\s*([•●▪◦‣∙·\-–*]|\d{1,3}[.)]|[a-z][.)])\s+/i;
const runsText = (runs) => runs.map((r) => r.text).join('');

/**
 * Merges lines into paragraphs. A new paragraph starts after a larger vertical
 * gap, a change of font size, or at a bullet / numbered item. Lines whose text
 * is clearly larger than body text become headings.
 */
export function buildParagraphs(lines, body) {
  const paras = [];
  let cur = null, prevLine = null;
  for (const line of lines) {
    const runs = lineRuns(line);
    const text = runsText(runs).trim();
    if (!text) continue;
    const ratio = line.size / body;
    const heading = ratio >= 1.6 ? 1 : ratio >= 1.25 ? 2 : 0;
    const gap = prevLine ? prevLine.y - line.y : 0;
    const startsNew = !cur || heading !== cur.heading || Math.abs(line.size - prevLine.size) > body * 0.15
      || gap > Math.max(line.size, prevLine.size) * 1.65 || BULLET.test(text) || gap < 0;
    if (startsNew) {
      cur = { heading, runs: runs.map((r) => ({ ...r })), size: line.size };
      paras.push(cur);
    } else {
      const lastRun = cur.runs[cur.runs.length - 1];
      // Re-join words hyphenated across a line break ("infor-" + "mation").
      if (/[a-z]-$/.test(lastRun.text.trimEnd()) && /^[a-z]/.test(text)) lastRun.text = lastRun.text.trimEnd().slice(0, -1);
      else if (!/\s$/.test(lastRun.text)) runs[0] = { ...runs[0], text: ' ' + runs[0].text.trimStart() };
      for (const r of runs) {
        const last = cur.runs[cur.runs.length - 1];
        if (last.bold === r.bold && last.italic === r.italic) last.text += r.text;
        else cur.runs.push({ ...r });
      }
    }
    prevLine = line;
  }
  for (const p of paras) { p.runs[0].text = p.runs[0].text.trimStart(); p.runs[p.runs.length - 1].text = p.runs[p.runs.length - 1].text.trimEnd(); }
  return paras;
}

/** Splits a line into cells wherever there is a wide horizontal gap (or 2+ spaces inside one fragment). */
export function lineCells(line) {
  const parts = [];
  for (const it of line.items) {
    // Some PDFs store a whole row as one string separated by runs of spaces.
    const pieces = it.str.split(/\s{2,}/);
    if (pieces.length > 1) {
      const charW = it.w / Math.max(1, it.str.length);
      let offset = 0;
      for (const p of pieces) {
        const idx = it.str.indexOf(p, offset);
        if (p.trim()) parts.push({ str: p.trim(), x: it.x + idx * charW, w: p.length * charW, size: it.size });
        offset = idx + p.length;
      }
    } else if (it.str.trim()) parts.push({ str: it.str, x: it.x, w: it.w, size: it.size });
  }
  const cells = [];
  for (const p of parts) {
    const last = cells[cells.length - 1];
    const gap = last ? p.x - last.right : Infinity;
    if (last && gap < p.size * 0.9) {
      last.text += (gap > p.size * 0.15 && !/\s$/.test(last.text) ? ' ' : '') + p.str;
      last.right = p.x + p.w;
    } else cells.push({ text: p.str, x: p.x, right: p.x + p.w });
  }
  cells.forEach((c) => (c.text = c.text.trim()));
  return cells;
}

/**
 * Aligns cells of all lines into a grid. Column positions are found by
 * clustering the left edges of cells across the whole page.
 */
export function buildTable(lines) {
  const rows = lines.map(lineCells).filter((r) => r.length);
  const starts = rows.flat().map((c) => c.x).sort((a, b) => a - b);
  const anchors = [];
  for (const x of starts) {
    const a = anchors[anchors.length - 1];
    if (a && x - a.max < 12) { a.max = x; a.sum += x; a.n++; } else anchors.push({ min: x, max: x, sum: x, n: 1 });
  }
  // Drop rare anchors (e.g. a single wrapped word) by merging them into the previous column.
  const minHits = Math.max(1, Math.floor(rows.length * 0.08));
  const cols = anchors.filter((a, i) => i === 0 || a.n >= minHits).map((a) => a.min);
  const colOf = (x) => { let k = 0; for (let i = 0; i < cols.length; i++) if (x >= cols[i] - 6) k = i; return k; };
  return rows.map((cells) => {
    const out = new Array(cols.length).fill('');
    for (const c of cells) {
      const k = colOf(c.x);
      out[k] = out[k] ? `${out[k]} ${c.text}` : c.text;
    }
    while (out.length && out[out.length - 1] === '') out.pop();
    return out;
  });
}

/** Turns "1,234.50", "$99", "(12.5)", "45%" into numbers; leaves other text alone. */
export function toCellValue(text) {
  const t = text.trim();
  const neg = /^\(.*\)$/.test(t);
  const core = t.replace(/^\(|\)$/g, '').replace(/^[-+]?[$€£¥₹]\s?/, (m) => (m.startsWith('-') ? '-' : '')).replace(/^([-+])?\s*[$€£¥₹]\s?/, '$1');
  if (/^[-+]?(\d{1,3}(,\d{3})+|\d+)(\.\d+)?$/.test(core)) {
    const n = Number(core.replace(/,/g, ''));
    return { v: neg ? -n : n, t: 'n' };
  }
  if (/^[-+]?\d+(\.\d+)?%$/.test(core)) return { v: Number(core.slice(0, -1)) / 100, t: 'n', z: '0.00%' };
  return { v: t, t: 's' };
}

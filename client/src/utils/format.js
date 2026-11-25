/** Formats numbers for display: grouping, sensible decimals, scientific for huge values. */
export function formatNumber(n, maxDecimals = 6) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  if (!Number.isFinite(n)) return n > 0 ? '∞' : '−∞';
  const abs = Math.abs(n);
  if (abs !== 0 && (abs >= 1e15 || abs < 1e-6)) return n.toExponential(4);
  return n.toLocaleString('en-US', { maximumFractionDigits: maxDecimals });
}

export const formatMoney = (n) =>
  Number.isFinite(n) ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let v = bytes / 1024, i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v < 10 ? 2 : 1)} ${units[i]}`;
}

/**
 * Parses user input into a number. Accepts "1,234.5", " 12 ", "-3".
 * Returns null for empty input and NaN for invalid input.
 */
export function parseNum(raw) {
  if (raw === null || raw === undefined) return null;
  const s = String(raw).trim().replace(/,/g, '').replace(/\s+/g, '');
  if (s === '') return null;
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s)) return NaN;
  return Number(s);
}

export const plural = (n, word, pluralWord = word + 's') => `${formatNumber(n)} ${n === 1 ? word : pluralWord}`;

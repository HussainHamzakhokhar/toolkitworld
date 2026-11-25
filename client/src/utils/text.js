/**
 * Text statistics. Uses Intl.Segmenter (built into modern browsers) so that
 * emoji, accented letters and non-Latin scripts are counted the way people see
 * them, with a regex fallback for older browsers.
 */
const hasSegmenter = typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function';
const segmenters = {};
const seg = (granularity) => (segmenters[granularity] ||= new Intl.Segmenter(undefined, { granularity }));

/** Splits text into user-perceived characters (👍🏽 or é counts as 1). */
export function graphemes(text) {
  if (!text) return [];
  if (hasSegmenter) return Array.from(seg('grapheme').segment(text), (s) => s.segment);
  return Array.from(text);
}

// Scripts written without spaces between words.
const NO_SPACE_SCRIPTS = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}\p{Script=Lao}\p{Script=Khmer}\p{Script=Myanmar}]/u;
const HAS_WORD_CHAR = /[\p{L}\p{N}]/u;

/**
 * Word rule: a run of non-space characters containing at least one letter or
 * number is one word ("e-mail", "don't", "2026" = 1 word each; "—" = 0).
 * For scripts written without spaces (Chinese, Japanese, Thai…), the browser's
 * dictionary-based segmenter finds the words.
 */
export function countWords(text) {
  if (!text) return 0;
  let count = 0;
  for (const token of text.split(/\s+/)) {
    if (!token || !HAS_WORD_CHAR.test(token)) continue;
    if (NO_SPACE_SCRIPTS.test(token)) {
      if (hasSegmenter) {
        for (const s of seg('word').segment(token)) if (s.isWordLike) count++;
      } else count += Array.from(token).filter((c) => HAS_WORD_CHAR.test(c)).length;
    } else count++;
  }
  return count;
}

export function countSentences(text) {
  if (!text || !text.trim()) return 0;
  if (hasSegmenter) {
    let n = 0;
    for (const s of seg('sentence').segment(text)) if (HAS_WORD_CHAR.test(s.segment)) n++;
    return n;
  }
  return text.split(/[.!?。！？]+(?:\s|$)/).filter((s) => HAS_WORD_CHAR.test(s)).length;
}

/** Paragraph = a line (or block of lines) containing visible text, separated by line breaks. */
export const countParagraphs = (text) => (text ? text.split(/\r?\n/).filter((l) => l.trim()).length : 0);
export const countLines = (text) => (text ? text.split(/\r?\n/).length : 0);

export const READING_WPM = 238; // average silent reading speed for adults (Brysbaert, 2019)
export const SPEAKING_WPM = 140; // typical presentation pace

export function formatDuration(minutes) {
  if (minutes <= 0) return '0 sec';
  const totalSec = Math.max(1, Math.round(minutes * 60));
  const m = Math.floor(totalSec / 60), s = totalSec % 60;
  if (m === 0) return `${s} sec`;
  if (m >= 60) return `${Math.floor(m / 60)} hr ${m % 60} min`;
  return s ? `${m} min ${s} sec` : `${m} min`;
}

const STOPWORDS = new Set('a an and are as at be been but by for from has have he her his i if in into is it its me my no not of on or our she so than that the their them then there these they this to too was we were what when which who will with you your'.split(' '));

export function topKeywords(text, limit = 8) {
  const counts = new Map();
  const words = (text.toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).filter((w) => w.length > 2 && !STOPWORDS.has(w));
  words.forEach((w) => counts.set(w, (counts.get(w) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit)
    .map(([word, count]) => ({ word, count, density: (count / words.length) * 100 }));
}

export function textStats(text) {
  const g = graphemes(text);
  const words = countWords(text);
  return {
    words,
    characters: g.length,
    charactersNoSpaces: g.filter((c) => !/^\s+$/u.test(c)).length,
    sentences: countSentences(text),
    paragraphs: countParagraphs(text),
    readingMinutes: words / READING_WPM,
    speakingMinutes: words / SPEAKING_WPM,
  };
}

/** Classifies each visible character for the Character Counter. */
export function characterBreakdown(text) {
  const out = { total: 0, noSpaces: 0, letters: 0, digits: 0, punctuation: 0, symbols: 0, spaces: 0, lineBreaks: 0, other: 0 };
  for (const g of graphemes(text)) {
    out.total++;
    if (g === '\n' || g === '\r\n' || g === '\r') { out.lineBreaks++; continue; }
    if (/^\s+$/u.test(g)) { out.spaces++; continue; }
    out.noSpaces++;
    const first = g.codePointAt(0);
    const ch = String.fromCodePoint(first);
    if (/\p{L}/u.test(ch)) out.letters++;
    else if (/\p{N}/u.test(ch)) out.digits++;
    else if (/\p{P}/u.test(ch)) out.punctuation++;
    else if (/\p{S}|\p{Extended_Pictographic}/u.test(ch)) out.symbols++;
    else out.other++;
  }
  out.bytes = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(text).length : text.length;
  out.codeUnits = text.length; // what some platforms (e.g. JavaScript-based limits) count
  return out;
}

// ---------------- Case conversion ----------------
const SMALL_WORDS = new Set('a an and as at but by en for from if in nor of on or per the to v vs via with'.split(' '));
const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1);

export const toUpper = (t) => t.toUpperCase();
export const toLower = (t) => t.toLowerCase();

/** Capitalized Case: first letter of every word upper-case. Apostrophes do not start words (don't → Don't). */
export const toCapitalized = (t) => t.toLowerCase().replace(/(^|[\s\-‐(\[{"“‘/])(\p{Ll})/gu, (_, pre, ch) => pre + ch.toUpperCase());

/**
 * Title Case (headline style): capitalise words, but keep short articles,
 * conjunctions and prepositions lower-case unless they start or end the title
 * or follow a colon/full stop.
 */
export function toTitle(t) {
  return t.split(/(\r?\n)/).map((line) => {
    const lower = line.toLowerCase();
    const re = /[\p{L}\p{N}][\p{L}\p{M}\p{N}'’]*/gu;
    const matches = [...lower.matchAll(re)];
    let out = '', last = 0;
    matches.forEach((m, i) => {
      const before = lower.slice(last, m.index);
      const afterBreak = /[:.!?—–]\s*$/.test(lower.slice(0, m.index));
      const isEdge = i === 0 || i === matches.length - 1 || afterBreak;
      const word = SMALL_WORDS.has(m[0]) && !isEdge ? m[0] : cap(m[0]);
      out += before + word;
      last = m.index + m[0].length;
    });
    return out + lower.slice(last);
  }).join('');
}

/** Sentence case: lower-case everything, then capitalise the start of each sentence and the pronoun "I". */
export function toSentence(t) {
  return t
    .toLowerCase()
    .replace(/(^\s*|[.!?]["”’)]*\s+|\n\s*)(\p{Ll})/gu, (_, pre, ch) => pre + ch.toUpperCase())
    .replace(/(?<![\p{L}\p{N}'’])i(?=[\s'’,;:!?)]|$)/gu, 'I');
}

export const toToggle = (t) =>
  Array.from(t, (c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join('');

export const CASES = [
  { id: 'upper', label: 'UPPERCASE', fn: toUpper },
  { id: 'lower', label: 'lowercase', fn: toLower },
  { id: 'title', label: 'Title Case', fn: toTitle },
  { id: 'sentence', label: 'Sentence case', fn: toSentence },
  { id: 'capitalized', label: 'Capitalized Case', fn: toCapitalized },
  { id: 'toggle', label: 'tOGGLE cASE', fn: toToggle },
];

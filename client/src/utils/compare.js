import { diffChars, diffLines, diffWords } from 'diff';
import { countWords, graphemes } from './text';

/**
 * Compares two texts. mode: 'words' | 'chars' | 'lines'.
 * Returns the change list plus summary statistics.
 */
export function compareTexts(a, b, { mode = 'words', ignoreCase = false, ignoreWhitespace = false } = {}) {
  let left = a, right = b;
  if (ignoreWhitespace && mode !== 'lines') {
    left = a.replace(/[ \t]+/g, ' ').trim();
    right = b.replace(/[ \t]+/g, ' ').trim();
  }
  const changes =
    mode === 'chars' ? diffChars(left, right, { ignoreCase })
      : mode === 'lines' ? diffLines(left, right, { ignoreWhitespace, ignoreCase })
        : diffWords(left, right, { ignoreCase });

  let addedWords = 0, removedWords = 0, addedChars = 0, removedChars = 0, sameChars = 0;
  for (const c of changes) {
    const len = graphemes(c.value).length;
    if (c.added) { addedWords += countWords(c.value); addedChars += len; }
    else if (c.removed) { removedWords += countWords(c.value); removedChars += len; }
    else sameChars += len;
  }
  const totalA = graphemes(left).length, totalB = graphemes(right).length;
  const similarity = totalA + totalB === 0 ? 100 : ((2 * sameChars) / (totalA + totalB)) * 100;
  return {
    changes,
    identical: addedChars === 0 && removedChars === 0,
    stats: { addedWords, removedWords, addedChars, removedChars, similarity: Math.min(100, similarity) },
  };
}

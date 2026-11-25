import { describe, expect, it } from 'vitest';
import { textStats, characterBreakdown, countWords, toTitle, toSentence, toCapitalized, toToggle, formatDuration } from './text';
import { parsePageRanges, formatPageRanges } from './pages';
import { compareTexts } from './compare';
import { search } from './search';

describe('word counter', () => {
  it('empty and whitespace-only text', () => {
    expect(textStats('')).toMatchObject({ words: 0, characters: 0, sentences: 0, paragraphs: 0 });
    expect(textStats('   \n\n  ')).toMatchObject({ words: 0, sentences: 0, paragraphs: 0 });
  });
  it('multiple spaces, newlines, hyphens and apostrophes', () => {
    const t = "Hello   world.  It's a state-of-the-art e-mail!\n\nSecond   paragraph here?";
    const s = textStats(t);
    expect(s.words).toBe(9);
    expect(s.sentences).toBe(3);
    expect(s.paragraphs).toBe(2);
  });
  it('punctuation alone is not a word; numbers are', () => {
    expect(countWords('— – … 2026 !!')).toBe(1);
  });
  it('unicode and emoji', () => {
    expect(countWords('café naïve Ünïcödé')).toBe(3);
    expect(textStats('👍🏽👨‍👩‍👧').characters).toBe(2);
    expect(countWords('你好世界')).toBeGreaterThanOrEqual(2);
  });
  it('durations', () => {
    expect(formatDuration(0)).toBe('0 sec');
    expect(formatDuration(1.5)).toBe('1 min 30 sec');
  });
});

describe('character counter', () => {
  it('classifies characters', () => {
    const b = characterBreakdown('Hi, 42 🎉\nok');
    expect(b).toMatchObject({ letters: 4, digits: 2, punctuation: 1, symbols: 1, spaces: 2, lineBreaks: 1, total: 11, noSpaces: 8 });
    expect(b.bytes).toBe(14);
  });
});

describe('case converter', () => {
  it('title case keeps small words lower except at edges', () => {
    expect(toTitle('the lord of the rings: the return of the king')).toBe('The Lord of the Rings: The Return of the King');
    expect(toTitle("WHAT IT'S ALL ABOUT")).toBe("What It's All About");
  });
  it('sentence case', () => {
    expect(toSentence('HELLO THERE. i think i\'m READY! yes?\nnew line')).toBe("Hello there. I think I'm ready! Yes?\nNew line");
  });
  it('capitalized and toggle', () => {
    expect(toCapitalized("don't stop-me now")).toBe("Don't Stop-Me Now");
    expect(toToggle('Hello')).toBe('hELLO');
  });
});

describe('page ranges', () => {
  it('parses ranges in typed order without duplicates', () => {
    expect(parsePageRanges('1-3, 5, 2, 8-', 9).pages).toEqual([0, 1, 2, 4, 7, 8]);
    expect(parsePageRanges('-2,last', 5).pages).toEqual([0, 1, 4]);
    expect(parsePageRanges('3–4', 5).pages).toEqual([2, 3]);
  });
  it('rejects invalid input', () => {
    expect(parsePageRanges('', 5).error).toBeTruthy();
    expect(parsePageRanges('0', 5).error).toBeTruthy();
    expect(parsePageRanges('6', 5).error).toMatch(/outside/);
    expect(parsePageRanges('4-2', 5).error).toMatch(/2-4/);
    expect(parsePageRanges('a', 5).error).toBeTruthy();
    expect(parsePageRanges('1-2-3', 5).error).toBeTruthy();
  });
  it('formats back to text', () => {
    expect(formatPageRanges([4, 0, 1, 2, 7])).toBe('1-3, 5, 8');
  });
});

describe('text compare', () => {
  it('detects identical, added and removed', () => {
    expect(compareTexts('same text', 'same text').identical).toBe(true);
    const r = compareTexts('the quick brown fox', 'the slow brown fox jumps');
    expect(r.stats.addedWords).toBe(2);
    expect(r.stats.removedWords).toBe(1);
    expect(compareTexts('Hello', 'hello', { ignoreCase: true }).identical).toBe(true);
  });
});

describe('search', () => {
  it('finds tools by name, keyword and category', () => {
    expect(search('percent')[0].title).toBe('Percentage Calculator');
    expect(search('merge')[0].title).toBe('PDF Merger');
    expect(search('how old am i')[0].title).toBe('Age Calculator');
    expect(search('pdf').some((r) => r.type === 'Category')).toBe(true);
    expect(search('zzzqqq')).toEqual([]);
  });
});

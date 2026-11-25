import { describe, expect, it } from 'vitest';
import { percentOf, whatPercent, percentIncrease, percentDecrease, percentDifference, applyPercent } from './percentage';
import { ageDetails, calendarDiff, dateDifference, parseISODate as p, shiftDate, toISO, countWeekdays, isLeap } from './dates';
import { calculateGpa, GRADE_SCALES } from './gpa';
import { percentDiscount, amountDiscount, reverseDiscount, stackedDiscount, withTax } from './discount';
import { parseNum, formatNumber } from './format';

const rows = (k) => GRADE_SCALES[k].grades.map(([grade, points]) => ({ grade, points }));

describe('percentage', () => {
  it('basic formulas', () => {
    expect(percentOf(20, 150).value).toBe(30);
    expect(whatPercent(30, 150).value).toBe(20);
    expect(percentIncrease(50, 75).value).toBe(50);
    expect(percentDecrease(80, 60).value).toBe(25);
    expect(percentDifference(10, 20).value).toBeCloseTo(66.6667, 3);
    expect(applyPercent(200, 15, 1).value).toBe(230);
    expect(applyPercent(200, 15, -1).value).toBe(170);
  });
  it('zero denominators give errors, not Infinity', () => {
    expect(whatPercent(5, 0).error).toBeTruthy();
    expect(percentIncrease(0, 10).error).toBeTruthy();
    expect(percentDifference(0, 0).error).toBeTruthy();
  });
  it('negatives, decimals and wrong direction', () => {
    expect(percentIncrease(-50, -25).value).toBe(50); // relative to |original|
    expect(percentOf(12.5, 0.8).value).toBeCloseTo(0.1);
    expect(percentIncrease(100, 80).summary).toMatch(/decrease of 20%/);
    expect(percentOf(NaN, 3).error).toBeTruthy();
  });
  it('large values', () => {
    expect(percentOf(50, 1e20).value).toBe(5e19);
    expect(formatNumber(5e19)).toBe('5.0000e+19');
  });
});

describe('number parsing', () => {
  it('accepts grouping and rejects junk', () => {
    expect(parseNum('1,234.5')).toBe(1234.5);
    expect(parseNum('  -3 ')).toBe(-3);
    expect(parseNum('')).toBeNull();
    expect(Number.isNaN(parseNum('12abc'))).toBe(true);
    expect(Number.isNaN(parseNum('1.2.3'))).toBe(true);
  });
});

describe('dates', () => {
  it('leap years', () => {
    expect(isLeap(2000)).toBe(true);
    expect(isLeap(1900)).toBe(false);
    expect(isLeap(2024)).toBe(true);
    expect(p('2023-02-29')).toBeNull();
    expect(p('2024-02-29')).toEqual({ y: 2024, m: 2, d: 29 });
  });
  it('calendar difference never goes negative (Jan 31 → Mar 1)', () => {
    expect(calendarDiff(p('2023-01-31'), p('2023-03-01'))).toMatchObject({ years: 0, months: 1, days: 1 });
    expect(calendarDiff(p('2000-05-15'), p('2026-11-25'))).toMatchObject({ years: 26, months: 6, days: 10 });
  });
  it('age details', () => {
    const a = ageDetails(p('1990-07-04'), p('2026-11-25'));
    expect(a).toMatchObject({ years: 36, months: 4, days: 21, bornWeekday: 'Wednesday', turning: 37 });
    expect(toISO(a.nextBirthday)).toBe('2027-07-04');
    expect(a.totalDays).toBe(13293);
    expect(ageDetails(p('2030-01-01'), p('2026-11-25')).error).toBeTruthy();
  });
  it('Feb 29 birthdays', () => {
    const a = ageDetails(p('2000-02-29'), p('2026-02-28'));
    expect(a.isBirthdayToday).toBe(true);
    expect(a.years).toBe(26);
    const b = ageDetails(p('2000-02-29'), p('2027-03-01'));
    expect(toISO(b.nextBirthday)).toBe('2028-02-29');
  });
  it('birthday today', () => {
    const a = ageDetails(p('2000-11-25'), p('2026-11-25'));
    expect(a).toMatchObject({ years: 26, months: 0, days: 0, daysToNext: 0, isBirthdayToday: true });
  });
  it('days between dates, include end date, leap day', () => {
    expect(dateDifference(p('2024-01-01'), p('2025-01-01')).days).toBe(366);
    expect(dateDifference(p('2026-01-01'), p('2026-01-31'), true).days).toBe(31);
    expect(dateDifference(p('2026-03-10'), p('2026-03-01')).swapped).toBe(true);
    // DST in many zones happens 2026-03-08; day count must be unaffected
    expect(dateDifference(p('2026-03-07'), p('2026-03-09')).days).toBe(2);
  });
  it('weekdays', () => {
    expect(countWeekdays(p('2026-11-23'), p('2026-11-30'))).toBe(5); // Mon → next Mon
    expect(countWeekdays(p('2026-11-28'), p('2026-11-30'))).toBe(0); // Sat, Sun
  });
  it('shifting dates', () => {
    expect(toISO(shiftDate(p('2024-01-31'), 1, 'months'))).toBe('2024-02-29');
    expect(toISO(shiftDate(p('2026-03-01'), -1, 'days'))).toBe('2026-02-28');
    expect(toISO(shiftDate(p('2024-02-29'), 1, 'years'))).toBe('2025-02-28');
    expect(toISO(shiftDate(p('2026-11-25'), 100, 'days'))).toBe('2027-03-05');
    expect(toISO(shiftDate(p('0050-06-01'), 1, 'days'))).toBe('0050-06-02');
  });
});

describe('gpa', () => {
  it('weighted average', () => {
    const r = calculateGpa(
      [{ name: 'Maths', credits: '3', grade: 'A' }, { name: 'Physics', credits: '4', grade: 'B+' }, { name: 'Art', credits: '2', grade: 'C' }],
      rows('us-4.0'),
    );
    // (3*4 + 4*3.3 + 2*2) / 9 = 29.2 / 9
    expect(r.gpa).toBeCloseTo(3.2444, 3);
    expect(r.totalCredits).toBe(9);
  });
  it('skips invalid rows and reports them', () => {
    const r = calculateGpa([{ name: 'X', credits: '0', grade: 'A' }, { name: '', credits: '3', grade: '' }, { credits: '', grade: '' }], rows('us-4.0'));
    expect(r.gpa).toBeNull();
    expect(r.skipped).toHaveLength(2);
  });
  it('cumulative GPA and other scales', () => {
    const r = calculateGpa([{ credits: '3', grade: 'O' }, { credits: '3', grade: 'B' }], rows('scale-10'), { gpa: 7, credits: 20 });
    expect(r.gpa).toBe(8);
    expect(r.cumulative.gpa).toBeCloseTo((7 * 20 + 48) / 26, 6);
  });
});

describe('discount', () => {
  it('all modes', () => {
    expect(percentDiscount(80, 25)).toMatchObject({ saved: 20, final: 60 });
    expect(amountDiscount(50, 10).pct).toBe(20);
    expect(reverseDiscount(60, 25).original).toBe(80);
    const s = stackedDiscount(100, [20, 10]);
    expect(s.final).toBeCloseTo(72);
    expect(s.pct).toBeCloseTo(28);
    expect(withTax(percentDiscount(100, 10), 8).totalWithTax).toBeCloseTo(97.2);
  });
  it('validation', () => {
    expect(percentDiscount(100, 120).error).toBeTruthy();
    expect(reverseDiscount(50, 100).error).toBeTruthy();
    expect(amountDiscount(10, 20).error).toBeTruthy();
    expect(stackedDiscount(100, []).error).toBeTruthy();
  });
});

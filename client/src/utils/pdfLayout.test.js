import { describe, expect, it } from 'vitest';
import { bodySize, buildParagraphs, buildTable, groupLines, toCellValue } from './pdfLayout';

const item = (str, x, y, size = 11, extra = {}) => ({ str, x, y, w: str.length * size * 0.5, size, ...extra });

describe('PDF → Word structure', () => {
  const items = [
    item('Annual Report', 72, 750, 24, { bold: true }),
    item('This is the first line of a paragraph that', 72, 700),
    item('continues here with infor-', 72, 686),
    item('mation split by hyphen.', 72, 672),
    item('A new paragraph after a gap.', 72, 640),
    item('• First bullet', 72, 620),
    item('• Second bullet', 72, 606),
    item('Bold', 72, 580, 11, { bold: true }), item('and normal', 100, 580),
  ];
  const body = bodySize(items);
  const paras = buildParagraphs(groupLines(items), body);
  it('detects body size and heading', () => {
    expect(body).toBe(11);
    expect(paras[0]).toMatchObject({ heading: 1 });
    expect(paras[0].runs[0]).toMatchObject({ text: 'Annual Report', bold: true });
  });
  it('joins wrapped lines and hyphenated words', () => {
    expect(paras[1].runs.map((r) => r.text).join('')).toBe('This is the first line of a paragraph that continues here with information split by hyphen.');
  });
  it('splits on gaps and bullets, keeps bold runs', () => {
    expect(paras.map((p) => p.runs.map((r) => r.text).join(''))).toEqual([
      'Annual Report',
      'This is the first line of a paragraph that continues here with information split by hyphen.',
      'A new paragraph after a gap.', '• First bullet', '• Second bullet', 'Bold and normal',
    ]);
    expect(paras[5].runs[0]).toMatchObject({ text: 'Bold', bold: true });
  });
});

describe('PDF → Excel structure', () => {
  it('aligns cells into columns, including a missing cell', () => {
    const items = [
      item('Product', 50, 700), item('Qty', 250, 700), item('Price', 350, 700),
      item('Blue widget', 50, 686), item('12', 250, 686), item('$1,200.50', 350, 686),
      item('Red widget', 50, 672), item('$45', 350, 672),
    ];
    expect(buildTable(groupLines(items))).toEqual([
      ['Product', 'Qty', 'Price'], ['Blue widget', '12', '$1,200.50'], ['Red widget', '', '$45'],
    ]);
  });
  it('splits fragments that use runs of spaces as separators', () => {
    expect(buildTable(groupLines([item('Name    Age    City', 50, 700), item('Ann    31    Paris', 50, 686)]))[1]).toEqual(['Ann', '31', 'Paris']);
  });
  it('converts numbers, currency, negatives and percentages', () => {
    expect(toCellValue('1,234.50')).toEqual({ v: 1234.5, t: 'n' });
    expect(toCellValue('$99')).toEqual({ v: 99, t: 'n' });
    expect(toCellValue('(12.5)')).toEqual({ v: -12.5, t: 'n' });
    expect(toCellValue('45%')).toEqual({ v: 0.45, t: 'n', z: '0.00%' });
    expect(toCellValue('2026-11-25')).toEqual({ v: '2026-11-25', t: 's' });
    expect(toCellValue('ABC-12')).toEqual({ v: 'ABC-12', t: 's' });
  });
});

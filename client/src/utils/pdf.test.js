import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { mergePdfs, extractPages, splitEach, compressStructure, openPdf } from './pdf';

async function makePdf(pages, size = [595, 842]) {
  const d = await PDFDocument.create();
  for (let i = 0; i < pages; i++) d.addPage(size).drawText(`Page ${i + 1}`, { x: 50, y: 50 });
  return d.save();
}

describe('pdf tools', () => {
  it('merges in order, including unusual page sizes', async () => {
    const out = await mergePdfs([{ name: 'a', bytes: await makePdf(2) }, { name: 'b', bytes: await makePdf(3, [200, 2000]) }]);
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(5);
    expect(doc.getPage(4).getSize()).toEqual({ width: 200, height: 2000 });
  });
  it('extracts and splits pages', async () => {
    const src = await makePdf(6);
    const out = await PDFDocument.load(await extractPages(src, [4, 0]));
    expect(out.getPageCount()).toBe(2);
    expect((await splitEach(src, [0, 1, 2])).map((r) => r.page)).toEqual([1, 2, 3]);
  });
  it('compression never fails on a valid file', async () => {
    const src = await makePdf(3);
    const out = await compressStructure(src);
    expect((await PDFDocument.load(out)).getPageCount()).toBe(3);
  });
  it('rejects invalid files with a clear message', async () => {
    await expect(openPdf(new TextEncoder().encode('not a pdf'), '"x.pdf"')).rejects.toThrow(/could not be read/);
  });
});

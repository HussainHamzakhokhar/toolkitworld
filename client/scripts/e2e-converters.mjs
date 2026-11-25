/**
 * Browser tests for the 6 document converters (run `npm run preview` first).
 * Builds real DOCX/XLSX/PDF/image fixtures, converts them in the browser, then
 * opens the downloaded files to verify their actual contents.
 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, ExternalHyperlink } from 'docx';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { unzipSync } from 'fflate';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const BASE = process.env.BASE || 'http://localhost:4173';
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'tkw-conv-'));
const dl = path.join(tmp, 'dl');
await fs.mkdir(dl);

// ---------- fixtures ----------
// 1. A digital PDF with a heading, a wrapped paragraph and a table.
const pdf = await PDFDocument.create();
const font = await pdf.embedFont(StandardFonts.Helvetica);
const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
let pg = pdf.addPage([595, 842]);
pg.drawText('Quarterly Sales Report', { x: 72, y: 760, size: 24, font: bold });
pg.drawText('This report summarises sales for the third quarter and', { x: 72, y: 720, size: 11, font });
pg.drawText('compares them with the previous period.', { x: 72, y: 706, size: 11, font });
const rows = [['Product', 'Units', 'Revenue', 'Growth'], ['Blue widget', '1,250', '$18,750.00', '12.5%'], ['Red widget', '980', '$9,800.00', '-3.0%'], ['Green widget', '', '$4,200.00', '8%']];
rows.forEach((r, i) => [72, 250, 340, 460].forEach((x, j) => r[j] && pg.drawText(r[j], { x, y: 650 - i * 18, size: 11, font: i === 0 ? bold : font })));
pg = pdf.addPage([595, 842]);
pg.drawText('Page two text for the second page.', { x: 72, y: 760, size: 11, font });
const tablePdf = path.join(tmp, 'report.pdf');
await fs.writeFile(tablePdf, await pdf.save());

// 2. A scanned-style PDF (no text at all).
const scan = await PDFDocument.create();
scan.addPage([595, 842]).drawRectangle({ x: 50, y: 50, width: 200, height: 200 });
const scanPdf = path.join(tmp, 'scan.pdf');
await fs.writeFile(scanPdf, await scan.save());

// 3. A Word document.
const docx = new Document({ sections: [{ children: [
  new Paragraph({ text: 'Project Proposal', heading: HeadingLevel.HEADING_1 }),
  new Paragraph({ children: [new TextRun('This proposal describes a '), new TextRun({ text: 'new tool', bold: true }), new TextRun(' for converting documents.')] }),
  new Paragraph({ text: 'First point', bullet: { level: 0 } }),
  new Table({ rows: [new TableRow({ children: [new TableCell({ children: [new Paragraph('Cost')] }), new TableCell({ children: [new Paragraph('500')] })] })] }),
] }] });
const docxFile = path.join(tmp, 'proposal.docx');
await fs.writeFile(docxFile, await Packer.toBuffer(docx));

// 3b. A hostile Word document: a javascript: link and HTML-looking text.
const evil = new Document({ sections: [{ children: [
  new Paragraph({ children: [new ExternalHyperlink({ link: 'javascript:window.__pwned=1', children: [new TextRun('Click me')] })] }),
  new Paragraph('<img src=x onerror="window.__pwned=2"> <script>window.__pwned=3</script>'),
] }] });
const evilDocx = path.join(tmp, 'evil.docx');
await fs.writeFile(evilDocx, await Packer.toBuffer(evil));

// 4. An Excel workbook with two sheets, a merged cell and a wide sheet.
const wb = XLSX.utils.book_new();
const s1 = XLSX.utils.aoa_to_sheet([['Invoice report', ''], ['Client', 'Amount'], ['Acme Ltd', 1200.5], ['Globex', 875]]);
s1['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
XLSX.utils.book_append_sheet(wb, s1, 'Invoices');
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([Array.from({ length: 10 }, (_, i) => `Col${i + 1}`), Array.from({ length: 10 }, (_, i) => i * 10)]), 'Wide');
const xlsxFile = path.join(tmp, 'invoices.xlsx');
await fs.writeFile(xlsxFile, XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));

const pdfText = async (file) => {
  const doc = await getDocument({ data: new Uint8Array(await fs.readFile(file)) }).promise;
  let text = '';
  for (let i = 1; i <= doc.numPages; i++) text += (await (await doc.getPage(i)).getTextContent()).items.map((x) => x.str).join(' ') + '\n';
  return { text, pages: doc.numPages };
};

// ---------- browser ----------
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
const cdp = await page.createCDPSession();
await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: dl });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

// Two images made with the browser canvas (one landscape, one portrait).
await page.goto(BASE + '/');
for (const [name, w, h] of [['wide.jpg', 800, 400], ['tall.png', 300, 600]]) {
  const b64 = await page.evaluate((w, h, png) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.fillStyle = '#2563eb'; x.fillRect(0, 0, w, h); return c.toDataURL(png ? 'image/png' : 'image/jpeg').split(',')[1]; }, w, h, name.endsWith('png'));
  await fs.writeFile(path.join(tmp, name), Buffer.from(b64, 'base64'));
}

const results = [];
const test = async (name, fn) => { try { await fn(); results.push(`PASS  ${name}`); } catch (e) { results.push(`FAIL  ${name}: ${e.message.split('\n')[0]}`); } };
const go = (p) => page.goto(BASE + p, { waitUntil: 'networkidle0' });
const upload = async (...files) => (await page.$('input[type=file]')).uploadFile(...files);
const expect = (c, m) => { if (!c) throw new Error(m); };
const waitText = (sel, re, timeout = 30000) => page.waitForFunction((s, r) => [...document.querySelectorAll(s)].some((e) => new RegExp(r).test(e.innerText)), { timeout }, sel, re.source);
const clickText = async (sel, re) => {
  // Wait up to 10 s for the button to appear and be enabled (file checks are asynchronous).
  await page.waitForFunction((s, r) => [...document.querySelectorAll(s)].some((e) => new RegExp(r).test(e.innerText) && !e.disabled), { timeout: 10000 }, sel, re.source).catch(() => {});
  expect(await page.evaluate((s, r) => { const el = [...document.querySelectorAll(s)].find((e) => new RegExp(r).test(e.innerText) && !e.disabled); el?.click(); return !!el; }, sel, re.source), `nothing to click: ${re}`);
};
async function waitDownload(re, timeout = 30000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    const f = (await fs.readdir(dl)).find((n) => re.test(n) && !n.endsWith('.crdownload'));
    if (f) { await new Promise((r) => setTimeout(r, 300)); return path.join(dl, f); }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`no download matching ${re}`);
}

await test('PDF→Word: heading, joined paragraph, bold, page 2', async () => {
  await go('/pdf-tools/pdf-to-word/');
  await upload(tablePdf);
  await clickText('button', /Convert to Word/);
  await waitText('.download-box', /Ready!/);
  expect(await page.$eval('.doc-preview h2', (e) => e.innerText) === 'Quarterly Sales Report', 'heading not detected in preview');
  await clickText('.download-box button', /Download/);
  const { value: html } = await mammoth.convertToHtml({ path: await waitDownload(/^report\.docx$/) });
  expect(/<h1>(<strong>)?Quarterly Sales Report/.test(html), 'no Heading 1 in docx: ' + html.slice(0, 120));
  expect(html.includes('third quarter and compares them'), 'wrapped lines not joined');
  expect(html.includes('<strong>Product'), 'bold text lost');
  expect(html.includes('Page two text'), 'second page missing');
});
await test('PDF→Word: scanned PDF gives a clear message', async () => {
  await go('/pdf-tools/pdf-to-word/');
  await upload(scanPdf);
  await clickText('button', /Convert to Word/);
  await waitText('.alert--error', /scanned/);
});
await test('PDF→Excel: columns aligned, numbers and % are numeric', async () => {
  await go('/pdf-tools/pdf-to-excel/');
  await upload(tablePdf);
  await clickText('button', /Convert to Excel/);
  await waitText('.download-box', /Ready!/);
  await clickText('.download-box button', /Download/);
  const book = XLSX.read(await fs.readFile(await waitDownload(/^report\.xlsx$/)));
  expect(book.SheetNames.join() === 'Page 1,Page 2', 'sheets: ' + book.SheetNames);
  const data = XLSX.utils.sheet_to_json(book.Sheets['Page 1'], { header: 1, defval: '' });
  const header = data.findIndex((r) => r[0] === 'Product');
  expect(header >= 0, 'table header not found: ' + JSON.stringify(data));
  expect(JSON.stringify(data[header]) === '["Product","Units","Revenue","Growth"]', 'header: ' + JSON.stringify(data[header]));
  expect(JSON.stringify(data[header + 1]) === '["Blue widget",1250,18750,0.125]', 'row: ' + JSON.stringify(data[header + 1]));
  expect(JSON.stringify(data[header + 3]) === '["Green widget","",4200,0.08]', 'empty cell row: ' + JSON.stringify(data[header + 3]));
});
await test('Word→PDF: preview, text, bold and table in PDF', async () => {
  await go('/pdf-tools/word-to-pdf/');
  await upload(docxFile);
  await page.waitForSelector('.doc-preview h1');
  await clickText('button', /Convert to PDF/);
  await waitText('.download-box', /ready/);
  await clickText('.download-box button', /Download/);
  const { text } = await pdfText(await waitDownload(/^proposal\.pdf$/));
  for (const t of ['Project Proposal', 'new tool', 'First point', 'Cost', '500']) expect(text.includes(t), `missing "${t}" in PDF text: ${text.slice(0, 200)}`);
});
await test('Word→PDF: rejects .doc and non-docx files', async () => {
  await go('/pdf-tools/word-to-pdf/');
  const fake = path.join(tmp, 'old.doc'); await fs.writeFile(fake, 'x');
  await upload(fake);
  await waitText('.alert--error', /\.doc files are not supported/);
});
await test('Word→PDF: hostile document cannot run code in the preview', async () => {
  await go('/pdf-tools/word-to-pdf/');
  await upload(evilDocx);
  await page.waitForSelector('.doc-preview');
  await page.evaluate(() => document.querySelector('.doc-preview a')?.click());
  await new Promise((r) => setTimeout(r, 500));
  const r = await page.evaluate(() => ({ pwned: window.__pwned, html: document.querySelector('.doc-preview').innerHTML }));
  expect(!r.pwned, 'code executed: ' + r.pwned);
  expect(!/href=|<img|<script/i.test(r.html), 'unsafe markup survived: ' + r.html);
  expect(r.html.includes('&lt;script&gt;'), 'text should be shown escaped');
});
await test('Security headers are served (CSP, HSTS, nosniff, frame protection)', async () => {
  const res = await fetch(BASE + '/');
  for (const h of ['content-security-policy', 'strict-transport-security', 'x-content-type-options', 'x-frame-options', 'referrer-policy', 'permissions-policy']) expect(res.headers.get(h), 'missing header ' + h);
});
await test('Excel→PDF: sheets listed, merged title, both sheets in PDF', async () => {
  await go('/pdf-tools/excel-to-pdf/');
  await upload(xlsxFile);
  await waitText('.sheet-list', /Invoices[\s\S]*4 rows × 2 columns[\s\S]*Wide/);
  await clickText('button', /Convert 2 sheets/);
  await waitText('.download-box', /ready/);
  await clickText('.download-box button', /Download/);
  const { text, pages } = await pdfText(await waitDownload(/^invoices\.pdf$/));
  expect(pages === 2, 'expected 2 pages, got ' + pages);
  for (const t of ['Invoice report', 'Acme Ltd', '1200.5', 'Col10', '90']) expect(text.includes(t), `missing "${t}": ${text.slice(0, 200)}`);
});
await test('JPG→PDF: 2 images → 2 pages, orientation matches, reorder', async () => {
  await go('/pdf-tools/jpg-to-pdf/');
  await upload(path.join(tmp, 'wide.jpg'), path.join(tmp, 'tall.png'));
  await page.waitForFunction(() => document.querySelectorAll('.img-tile').length === 2);
  await page.click('[aria-label="Move tall.png earlier"]');
  await clickText('button', /Create PDF \(2 pages\)/);
  await waitText('.download-box', /2 pages/);
  await clickText('.download-box button', /Download/);
  const doc = await PDFDocument.load(await fs.readFile(await waitDownload(/^images\.pdf$/)));
  const [a, b] = doc.getPages().map((p) => p.getSize());
  expect(doc.getPageCount() === 2 && a.height > a.width && b.width > b.height, `pages wrong: ${JSON.stringify([a, b])}`);
});
await test('PDF→JPG: page range, 150 DPI size, ZIP with 2 images', async () => {
  await go('/pdf-tools/pdf-to-jpg/');
  await upload(tablePdf);
  await page.waitForSelector('#pj-r');
  await page.type('#pj-r', '1-2');
  await clickText('button', /Convert 2 pages to JPG/);
  await page.waitForFunction(() => document.querySelectorAll('.img-tile').length === 2, { timeout: 30000 });
  expect((await page.$eval('.img-tile__row', (e) => e.innerText)).startsWith('1239×1754'), 'unexpected pixel size');
  await clickText('button', /Download all as ZIP/);
  const zip = unzipSync(new Uint8Array(await fs.readFile(await waitDownload(/^report-jpg\.zip$/))));
  const names = Object.keys(zip);
  expect(names.length === 2 && zip[names[0]][0] === 0xff && zip[names[0]][1] === 0xd8, 'zip contents wrong: ' + names);
});
await test('PDF→JPG: invalid page range is explained', async () => {
  await page.$eval('#pj-r', (e) => { e.value = ''; });
  await page.click('#pj-r', { clickCount: 3 });
  await page.type('#pj-r', '9');
  await waitText('.field__error', /outside this document/);
});

await browser.close();
await fs.rm(tmp, { recursive: true, force: true });
console.log(results.join('\n'));
if (errors.length) console.log('Page errors:\n' + errors.join('\n'));
const failed = results.filter((r) => r.startsWith('FAIL')).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);

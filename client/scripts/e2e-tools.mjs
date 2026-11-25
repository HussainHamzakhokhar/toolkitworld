/**
 * Functional browser tests for all 15 tools against the production build.
 * Run `npm run preview` in another terminal first, then `node scripts/e2e-tools.mjs`.
 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { PDFDocument } from 'pdf-lib';

const BASE = process.env.BASE || 'http://localhost:4173';
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'tkw-e2e-'));
const dl = path.join(tmp, 'downloads');
await fs.mkdir(dl);

// ---------- fixtures ----------
async function makePdf(name, pages, size = [595, 842]) {
  const d = await PDFDocument.create();
  for (let i = 0; i < pages; i++) d.addPage(size).drawText(`${name} page ${i + 1}`, { x: 40, y: 40, size: 24 });
  const file = path.join(tmp, `${name}.pdf`);
  await fs.writeFile(file, await d.save());
  return file;
}
const pdfA = await makePdf('alpha', 3);
const pdfB = await makePdf('beta', 2, [300, 900]);
const fakePdf = path.join(tmp, 'fake.pdf');
await fs.writeFile(fakePdf, 'this is not a pdf');
const fakeJpg = path.join(tmp, 'notreally.jpg');
await fs.writeFile(fakeJpg, '\x89PNG not a jpeg');

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
const cdp = await page.createCDPSession();
await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: dl, eventsEnabled: true });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

// Make image fixtures with the browser's canvas (a photo-like JPG and a transparent PNG).
await page.goto(BASE + '/');
for (const [name, type] of [['photo.jpg', 'image/jpeg'], ['logo.png', 'image/png']]) {
  const b64 = await page.evaluate((type) => {
    const c = document.createElement('canvas'); c.width = 640; c.height = 480;
    const x = c.getContext('2d');
    if (type === 'image/jpeg') { const g = x.createLinearGradient(0, 0, 640, 480); g.addColorStop(0, '#2563eb'); g.addColorStop(1, '#14b8a6'); x.fillStyle = g; x.fillRect(0, 0, 640, 480); }
    x.fillStyle = '#dc2626'; x.beginPath(); x.arc(320, 240, 120, 0, 7); x.fill();
    return c.toDataURL(type, 0.9).split(',')[1];
  }, type);
  await fs.writeFile(path.join(tmp, name), Buffer.from(b64, 'base64'));
}

// ---------- helpers ----------
const results = [];
async function test(name, fn) {
  try { await fn(); results.push(`PASS  ${name}`); }
  catch (e) { results.push(`FAIL  ${name}: ${e.message.split('\n')[0]}`); }
}
const go = (p) => page.goto(BASE + p, { waitUntil: 'networkidle0' });
/** Sets an input's value the way a user would, so React sees the change. */
async function setValue(sel, value) {
  await page.$eval(sel, (el, v) => {
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
    el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
  }, value);
}
const text = (sel) => page.$eval(sel, (e) => e.innerText);
const expect = (cond, msg) => { if (!cond) throw new Error(msg); };
const waitText = (sel, re, timeout = 15000) => page.waitForFunction((s, r) => [...document.querySelectorAll(s)].some((e) => new RegExp(r).test(e.innerText)), { timeout }, sel, re.source);
const clickText = async (sel, re) => {
  const ok = await page.evaluate((s, r) => { const el = [...document.querySelectorAll(s)].find((e) => new RegExp(r).test(e.innerText) && !e.disabled); el?.click(); return !!el; }, sel, re.source);
  expect(ok, `no clickable ${sel} matching ${re}`);
};
const fieldsByLabel = async (label) => page.evaluate((l) => { const lab = [...document.querySelectorAll('label')].find((x) => x.innerText.trim().startsWith(l)); return lab ? '#' + CSS.escape(lab.htmlFor) : null; }, label);
async function waitDownload(re, timeout = 20000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    const f = (await fs.readdir(dl)).find((n) => re.test(n) && !n.endsWith('.crdownload'));
    if (f) return path.join(dl, f);
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`no download matching ${re}`);
}

// ---------- calculators ----------
await test('Percentage: 15% of 240 = 36, with steps', async () => {
  await go('/calculators/percentage-calculator/');
  await setValue(await fieldsByLabel('Percentage (P)'), '15');
  await setValue(await fieldsByLabel('Number (Y)'), '240');
  await waitText('.result__value', /^36$/);
  expect((await text('.result__steps')).includes('0.15 × 240'), 'steps missing');
});
await test('Percentage: division by zero is refused', async () => {
  await clickText('[role=tab]', /X is what/);
  await setValue(await fieldsByLabel('Part (X)'), '5');
  await setValue(await fieldsByLabel('Whole (Y)'), '0');
  await waitText('.alert--error', /cannot be 0/);
});
await test('Percentage: invalid input shows field error', async () => {
  await setValue(await fieldsByLabel('Whole (Y)'), '12abc');
  await waitText('.field__error', /valid number/);
});
await test('Age: 1990-07-04 on 2026-11-25 = 36y 4m 21d, Wednesday', async () => {
  await go('/calculators/age-calculator/');
  await setValue('#age-dob', '1990-07-04');
  await setValue('#age-asof', '2026-11-25');
  await waitText('.result__value', /36 years, 4 months, 21 days/);
  expect((await text('.result')).includes('Wednesday') && (await text('.result')).includes('13,293'), 'details wrong');
});
await test('Age: future birth date rejected', async () => {
  await setValue('#age-dob', '2030-01-01');
  await waitText('.alert--error', /after/);
});
await test('GPA: weighted 3.24 on 4.0 scale', async () => {
  await go('/calculators/gpa-calculator/');
  const rows = [['3', 'A'], ['4', 'B+'], ['2', 'C']];
  for (let i = 0; i < 3; i++) {
    await setValue(`input[aria-label="Course ${i + 1} credit hours"]`, rows[i][0]);
    await setValue(`select[aria-label="Course ${i + 1} grade"]`, rows[i][1]);
  }
  await waitText('.stat--highlight dd', /^3\.24$/);
});
await test('GPA: switch to 10-point scale', async () => {
  await setValue('#gpa-scale', 'scale-10');
  await setValue('select[aria-label="Course 1 grade"]', 'O');
  await waitText('.stat--highlight dd', /^10\.00$/);
});
await test('Date: Jan 1 → Nov 25 2026 = 328 days; inclusive = 329', async () => {
  await go('/calculators/date-calculator/');
  await setValue('#dc-start', '2026-01-01');
  await setValue('#dc-end', '2026-11-25');
  await waitText('.result__value', /^328 days$/);
  await page.click('.check input');
  await waitText('.result__value', /^329 days$/);
});
await test('Date: add 90 days → Tuesday, February 23, 2027', async () => {
  await clickText('[role=tab]', /Add or subtract/);
  await setValue('#dc-base', '2026-11-25');
  await setValue(await fieldsByLabel('Amount'), '90');
  await waitText('.result__value', /Tuesday, February 23, 2027/);
});
await test('Discount: 25% off 80 = 60.00; stacked 20%+10% = 28% off', async () => {
  await go('/calculators/discount-calculator/');
  await setValue(await fieldsByLabel('Original price'), '80');
  await setValue(await fieldsByLabel('Discount'), '25');
  await waitText('.stat--highlight dd', /\$60\.00/);
  await clickText('[role=tab]', /Multiple/);
  await setValue(await fieldsByLabel('Original price'), '100');
  await waitText('.stat__note', /28% off/);
});

// ---------- text tools ----------
await test('Word counter: words, sentences, emoji', async () => {
  await go('/text-tools/word-counter/');
  await setValue('#wc-text', "Hello   world. It's a state-of-the-art test! 👍🏽\n\nSecond paragraph here?");
  await waitText('.stat--highlight dd', /^9$/);
  const t = await text('.stats');
  expect(/Sentences\n3/.test(t) && /Paragraphs\n2/.test(t), 'sentence/paragraph counts wrong: ' + t.replace(/\n/g, ' '));
});
await test('Character counter: limit and over-limit warning', async () => {
  await go('/text-tools/character-counter/');
  await setValue('#cc-limit', 'title');
  await setValue('#cc-text', 'x'.repeat(65));
  await waitText('.limit-meter__text', /5 over the limit/);
});
await test('Case converter: Title Case', async () => {
  await go('/text-tools/case-converter/');
  await setValue('#cc-in', 'the lord of the rings: the return of the king');
  expect((await page.$eval('#cc-out', (e) => e.value)) === 'The Lord of the Rings: The Return of the King', 'wrong title case');
});
await test('Case converter: download .txt', async () => {
  await clickText('button', /Download \.txt/);
  const f = await waitDownload(/^text-title\.txt$/);
  expect((await fs.readFile(f, 'utf8')).startsWith('The Lord'), 'download content wrong');
});
await test('Text comparer: highlights added/removed', async () => {
  await go('/text-tools/text-comparer/');
  await setValue('#tc-a', 'the quick brown fox');
  await setValue('#tc-b', 'the slow brown fox jumps');
  await clickText('button', /Compare texts/);
  await page.waitForSelector('.diff-output ins');
  expect((await page.$$('.diff-output del')).length >= 1, 'no deletions shown');
});

// ---------- image tools ----------
await test('JPG→PNG: converts, rejects fake JPG, downloads valid PNG', async () => {
  await go('/image-tools/jpg-to-png/');
  const input = await page.$('input[type=file]');
  await input.uploadFile(path.join(tmp, 'photo.jpg'), fakeJpg);
  await waitText('.file-card__meta', /640×480px/);
  await waitText('.file-card__error', /not a supported image|is a PNG|Please choose a JPG/);
  await clickText('.file-card button', /PNG/);
  const f = await waitDownload(/^photo\.png$/);
  const head = (await fs.readFile(f)).subarray(0, 4);
  expect(head[0] === 0x89 && head[1] === 0x50, 'download is not a PNG');
});
await test('PNG→JPG: transparent PNG with background → valid JPG', async () => {
  await go('/image-tools/png-to-jpg/');
  await (await page.$('input[type=file]')).uploadFile(path.join(tmp, 'logo.png'));
  await waitText('.file-card__meta', /640×480px/);
  await clickText('.file-card button', /JPG/);
  const f = await waitDownload(/^logo\.jpg$/);
  const head = (await fs.readFile(f)).subarray(0, 3);
  expect(head[0] === 0xff && head[1] === 0xd8, 'download is not a JPEG');
});
await test('Image resizer: 640×480 → 320×240 with aspect lock', async () => {
  await go('/image-tools/image-resizer/');
  await (await page.$('input[type=file]')).uploadFile(path.join(tmp, 'photo.jpg'));
  await page.waitForSelector('#rs-w');
  await setValue('#rs-w', '320');
  expect((await page.$eval('#rs-h', (e) => e.value)) === '240', 'aspect ratio not kept');
  await clickText('button', /Resize image/);
  await waitText('.download-box', /320 × 240px/);
  await clickText('.download-box button', /Download/);
  await waitDownload(/^photo-320x240\.jpg$/);
});
await test('Image resizer: oversize output refused', async () => {
  await setValue('#rs-w', '30000');
  await waitText('.alert--error', /too large|at most/);
});

// ---------- PDF tools ----------
await test('PDF merger: merges 2 files (5 pages), skips invalid file', async () => {
  await go('/pdf-tools/pdf-merger/');
  await (await page.$('input[type=file]')).uploadFile(pdfA, pdfB, fakePdf);
  await waitText('.pdf-item__error', /not a PDF/);
  await waitText('button', /Merge 2 PDFs/);
  await page.click('.pdf-item:nth-child(2) [aria-label^="Move"][aria-label$="up"]'); // reorder: beta first
  await clickText('button', /Merge 2 PDFs/);
  await waitText('.download-box', /5 pages/);
  await clickText('.download-box button', /Download/);
  const doc = await PDFDocument.load(await fs.readFile(await waitDownload(/^merged\.pdf$/)));
  expect(doc.getPageCount() === 5, 'merged page count wrong');
  expect(doc.getPage(0).getSize().width === 300, 'reorder not applied');
});
await test('PDF splitter: thumbnails, range 2-3, invalid range error', async () => {
  await go('/pdf-tools/pdf-splitter/');
  await (await page.$('input[type=file]')).uploadFile(pdfA);
  await page.waitForSelector('.page-tile__img img', { timeout: 20000 });
  await setValue('#sp-range', '5');
  await waitText('.field__error', /outside this document/);
  await setValue('#sp-range', '2-3');
  await clickText('button', /Extract 2 pages/);
  const doc = await PDFDocument.load(await fs.readFile(await waitDownload(/^alpha-pages-2-3\.pdf$/)));
  expect(doc.getPageCount() === 2, 'extracted page count wrong');
});
await test('PDF compressor: basic + strong produce honest results', async () => {
  await go('/pdf-tools/pdf-compressor/');
  await (await page.$('input[type=file]')).uploadFile(pdfA);
  await waitText('.doc-bar', /3 pages/);
  await clickText('button', /Compress PDF/);
  await waitText('.result', /smaller|could not be made smaller/);
  await page.click('input[name=pc-level]:not(:checked)');
  await clickText('button', /Compress PDF/);
  await waitText('.result', /smaller|could not be made smaller/, 30000);
});

// ---------- search ----------
await test('Search: Ctrl+K, type, keyboard select', async () => {
  await go('/');
  await page.keyboard.down('Control'); await page.keyboard.press('k'); await page.keyboard.up('Control');
  await page.waitForSelector('dialog[open] input');
  await page.keyboard.type('merge');
  await page.waitForSelector('dialog [role=option]');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => location.pathname === '/pdf-tools/pdf-merger/');
});
await test('Search: empty state', async () => {
  await go('/search/?q=zzqqxx');
  await waitText('.empty-state', /Nothing matched/);
});

// ---------- mobile ----------
await test('Mobile: menu opens and navigates', async () => {
  await page.setViewport({ width: 390, height: 844 });
  await go('/');
  await page.click('.menu-toggle');
  await page.waitForSelector('.main-nav.is-open');
  await clickText('.main-nav a', /^PDF Tools$/);
  await page.waitForFunction(() => location.pathname === '/pdf-tools/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(!overflow, 'horizontal overflow on mobile');
});

await browser.close();
await fs.rm(tmp, { recursive: true, force: true });
console.log(results.join('\n'));
const relevant = errors.filter((e) => !/favicon|Failed to load resource/.test(e));
if (relevant.length) console.log('Browser errors:\n' + relevant.join('\n'));
const failed = results.filter((r) => r.startsWith('FAIL')).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);

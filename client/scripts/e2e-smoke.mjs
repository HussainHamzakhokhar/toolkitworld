/**
 * Browser smoke test against the production build (run `npm run preview` first).
 * Visits every page in the sitemap, then checks: HTTP status, console errors,
 * React hydration warnings, exactly one <h1>, canonical tag, and no broken internal links.
 */
import puppeteer from 'puppeteer-core';
const BASE = process.env.BASE || 'http://localhost:4173';
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const paths = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
const problems = [];
const links = new Set();
let current = '';
page.on('console', (m) => { if (m.type() === 'error' || /hydrat/i.test(m.text())) problems.push(`${current}: console ${m.type()}: ${m.text().slice(0, 200)}`); });
page.on('pageerror', (e) => problems.push(`${current}: page error: ${e.message}`));

for (const p of paths) {
  current = p;
  const res = await page.goto(BASE + p, { waitUntil: 'networkidle0' });
  if (res.status() !== 200) problems.push(`${p}: status ${res.status()}`);
  const info = await page.evaluate(() => ({
    h1: document.querySelectorAll('h1').length,
    canonical: document.querySelector('link[rel=canonical]')?.href,
    title: document.title,
    links: [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')),
  }));
  if (info.h1 !== 1) problems.push(`${p}: ${info.h1} <h1> elements`);
  if (!info.canonical?.endsWith(p)) problems.push(`${p}: canonical ${info.canonical}`);
  info.links.forEach((l) => links.add(l.split('#')[0]));
}
for (const l of links) {
  const r = await fetch(BASE + l);
  if (r.status !== 200) problems.push(`broken internal link ${l} (${r.status})`);
}
const nf = await fetch(`${BASE}/this-page-does-not-exist/`);
if (nf.status !== 404) problems.push(`404 page returned ${nf.status}`);
// Client-side navigation keeps head tags in sync
current = 'client-nav';
await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
await page.click('a[href="/text-tools/word-counter/"]');
await page.waitForFunction(() => location.pathname === '/text-tools/word-counter/' && document.title.startsWith('Word Counter'));
const canon = await page.$eval('link[rel=canonical]', (e) => e.href);
if (!canon.endsWith('/text-tools/word-counter/')) problems.push(`client nav canonical not updated: ${canon}`);
await browser.close();
console.log(`Checked ${paths.length} pages and ${links.size} internal links.`);
console.log(problems.length ? `PROBLEMS:\n${problems.join('\n')}` : 'All checks passed.');
process.exit(problems.length ? 1 : 0);

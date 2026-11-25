/**
 * Static site generation.
 * After `vite build` (browser bundle) and `vite build --ssr` (render function),
 * this script renders every route to real HTML, so pages are fully readable by
 * search engines and appear instantly for visitors. It also writes
 * sitemap.xml, robots.txt, 404.html and Cloudflare Pages headers.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const ssr = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);
const { render, ROUTES, moduleKeyFor } = ssr;

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
const manifest = JSON.parse(await fs.readFile(path.join(dist, '.vite', 'manifest.json'), 'utf8'));
const SITE_URL = (process.env.VITE_SITE_URL || 'https://toolkitworld.pages.dev').replace(/\/+$/, '');
const today = new Date().toISOString().slice(0, 10);

/** modulepreload links for a route's own chunk (and its imports) so hydration starts immediately. */
function preloadsFor(key) {
  const seen = new Set();
  const out = [];
  const walk = (k) => {
    const entry = manifest[k];
    if (!entry || seen.has(k)) return;
    seen.add(k);
    if (!entry.isEntry) out.push(`<link rel="modulepreload" crossorigin href="/${entry.file}">`);
    (entry.imports || []).forEach(walk);
  };
  walk(key);
  return out;
}

// Preload the Latin Inter font file used above the fold (prevents a late font swap).
const fontFile = (await fs.readdir(path.join(dist, 'assets'))).find((f) => /^inter-latin-wght-normal.*\.woff2$/.test(f));
const fontPreload = fontFile ? `<link rel="preload" href="/assets/${fontFile}" as="font" type="font/woff2" crossorigin>` : '';

// AdSense ownership verification meta tag (only with a real publisher ID).
const adClient = process.env.VITE_ADSENSE_CLIENT || '';
const adsMeta = /^ca-pub-\d{16}$/.test(adClient) ? `<meta name="google-adsense-account" content="${adClient}">` : '';

async function writePage(urlPath, file) {
  const { html, head } = await render(urlPath);
  const route = ROUTES.find((r) => r.path === urlPath);
  const preloads = route ? preloadsFor(moduleKeyFor(route)) : preloadsFor('src/pages/NotFound.jsx');
  const page = template
    .replace('<!--app-head-->', [head, fontPreload, adsMeta, ...preloads].filter(Boolean).join('\n    '))
    .replace('<!--app-html-->', html);
  const out = path.join(dist, file);
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, page);
}

let count = 0;
for (const r of ROUTES) {
  await writePage(r.path, path.join(r.path, 'index.html'));
  count++;
}
await writePage('/404/', '404.html'); // Cloudflare Pages serves this with a real 404 status
await fs.rm(path.join(dist, '404'), { recursive: true, force: true });

// ---------- sitemap.xml ----------
const urls = ROUTES.filter((r) => !r.noindex).map((r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${r.lastmod || today}</lastmod>
    <priority>${(r.priority ?? 0.5).toFixed(1)}</priority>
  </url>`);
await fs.writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`);

// ---------- robots.txt ----------
await fs.writeFile(path.join(dist, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /search/

Sitemap: ${SITE_URL}/sitemap.xml
`);

// ---------- ads.txt (only once a real publisher ID is configured) ----------
if (adsMeta) {
  const pub = adClient.replace('ca-', '');
  await fs.writeFile(path.join(dist, 'ads.txt'), `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`);
}

await fs.rm(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`Prerendered ${count} routes + 404.html, sitemap.xml (${urls.length} URLs), robots.txt${adsMeta ? ', ads.txt' : ''}. Site URL: ${SITE_URL}`);

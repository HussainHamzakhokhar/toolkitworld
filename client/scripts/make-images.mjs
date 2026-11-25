/** One-off: renders the social share image and PNG/ICO icons with the local Chrome. */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';
import path from 'node:path';
const [ogHtml, iconHtml] = process.argv.slice(2);
const pub = path.resolve(import.meta.dirname, '..', 'public');
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.goto('file://' + ogHtml);
await page.screenshot({ path: path.join(pub, 'og-image.png') });
for (const [size, name] of [[512, 'icon-512.png'], [180, 'apple-touch-icon.png'], [32, 'favicon-32.png']]) {
  await page.setViewport({ width: size, height: size });
  await page.goto('file://' + iconHtml);
  await page.evaluate((s) => { const svg = document.querySelector('svg'); svg.setAttribute('width', s); svg.setAttribute('height', s); }, size);
  await page.screenshot({ path: path.join(pub, name), omitBackground: true });
}
await browser.close();
// Wrap the 32px PNG in an .ico container (ICO files may embed PNG data directly).
const png = await fs.readFile(path.join(pub, 'favicon-32.png'));
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6); header.writeUInt8(32, 7); header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
await fs.writeFile(path.join(pub, 'favicon.ico'), Buffer.concat([header, png]));
await fs.rm(path.join(pub, 'favicon-32.png'));
console.log('images written');

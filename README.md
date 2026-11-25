# ToolKitWorld

**Free Tools. Smart Solutions. No Hassle.**

A fast, SEO-friendly, AdSense-ready website with 21 free online tools: calculators, text tools, image tools, PDF tools and document converters. Every tool runs **in the visitor's browser**, so files are never uploaded. That keeps hosting free and makes the privacy promise true.

| Category | Tools |
|---|---|
| Calculators | Percentage, Age, GPA (editable grade scales), Date, Discount |
| Text | Word Counter, Character Counter, Case Converter, Text Comparer |
| Images | JPG → PNG, PNG → JPG, Image Resizer |
| PDF converters | PDF → Word, Word → PDF, PDF → Excel, Excel → PDF, JPG → PDF, PDF → JPG |
| PDF | PDF Merger, PDF Splitter, PDF Compressor |

Also included: a homepage, all-tools and category pages, a blog with 9 original guides, About, Contact, Privacy Policy, Terms, Disclaimer, Cookie Policy, a custom 404 page, global search (Ctrl/⌘ K), a cookie consent banner, a sitemap, robots.txt and structured data.

---

## 1. Architecture

```
toolkitworld/
├── client/                 React 19 + Vite website (this is what visitors load)
│   ├── public/             favicon, icons, og-image, _headers (security), _redirects
│   ├── scripts/
│   │   ├── prerender.mjs   turns every route into static HTML + sitemap.xml, robots.txt, 404.html, ads.txt
│   │   ├── serve-dist.mjs  local production preview (mimics Cloudflare Pages)
│   │   ├── e2e-smoke.mjs   browser test: every page, links, H1, canonical, 404, hydration
│   │   ├── e2e-tools.mjs   browser test: uses all 15 tools with real files
│   │   └── make-images.mjs regenerates og-image.png and icons with local Chrome
│   └── src/
│       ├── config/         site.js, ads.js, analytics.js   ← all settings live here
│       ├── data/           tools.js (TOOL REGISTRY), posts.js (blog list)
│       ├── tools/          one folder per tool: <Tool>.jsx + content.jsx + index.jsx
│       ├── pages/          home, categories, blog, legal pages, search, 404
│       ├── layouts/        MainLayout, ToolLayout (standard tool page template), PageShell
│       ├── components/     header, footer, search, cards, AdSlot, ConsentBanner, UI kit
│       ├── utils/          calculation and file-processing logic (unit tested)
│       ├── seo/            head tags + JSON-LD builders
│       └── styles/         design system (plain CSS, CSS variables)
├── content/blog/           blog articles in Markdown (converted to HTML at build time)
└── server/                 OPTIONAL Express API, only for the contact form
```

**Key decisions**

- **Client-side processing.** Calculators, text tools, image conversion (Canvas API), PDF merge, split and compress (pdf-lib + Mozilla PDF.js), and document conversion (PDF.js text extraction → `docx` / SheetJS; `mammoth` + `pdfmake` for Word → PDF; SheetJS + `pdfmake` for Excel → PDF) all run on the visitor's device. No upload server is needed, so hosting costs nothing.
- **Prerendering (static site generation).** `npm run build` renders all 37 routes to real HTML. Search engines see full content, titles, meta tags and JSON-LD without running JavaScript. React then hydrates the page.
- **Code splitting.** Each tool and page is its own chunk. Heavy libraries (PDF.js, pdf-lib, pdfmake, SheetJS, mammoth, docx — about 3 MB in total) load only when a file is converted. The main bundle stays ~87 KB gzipped.
- **SheetJS** is installed from the official SheetJS CDN (version 0.20.3), because the old `xlsx` package on npm (0.18.5) has known security issues.
- **No database.** Tools, categories and posts are plain data files. MongoDB isn't needed. Add it only if you later build accounts or premium features.
- **A single registry.** `src/data/tools.js` feeds navigation, search, the sitemap, category pages and related links.

## 2. Run it locally

Requirements: **Node.js 22.13+** (needed by pdfjs-dist) and npm.

```bash
cd toolkitworld
npm run install:all      # installs client + server dependencies
npm run dev              # http://localhost:5173  (development, hot reload)
```

Production build and preview:

```bash
npm run build            # → client/dist  (static site, ready to upload)
npm run preview          # http://localhost:4173
```

## 3. Configuration (no code changes needed)

Copy `client/.env.example` to `client/.env.production` (or set the same variables in Cloudflare Pages):

| Variable | Purpose |
|---|---|
| `VITE_SITE_URL` | Your real domain, e.g. `https://toolkitworld.com`. Used for canonical URLs, the sitemap and Open Graph tags. **Set this before going live.** |
| `VITE_CONTACT_EMAIL` | Shown on the Contact page and in policies. Leave empty until you have a real one. |
| `VITE_API_URL` | URL of the optional API server. Turns on the contact form. |
| `VITE_OWNER_NAME` | Your name or business name for the legal pages. |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 ID (`G-…`). Empty = no analytics script at all. |
| `VITE_GSC_VERIFICATION` | Google Search Console "HTML tag" verification code. |
| `VITE_ADSENSE_CLIENT`, `VITE_ADSENSE_SLOT_*` | AdSense publisher and ad-unit IDs (after approval). |

Nothing fake is ever displayed: with empty values, pages show neutral wording ("Contact details coming soon").

## 4. Adding a new tool

1. Add an entry to `TOOLS` in `client/src/data/tools.js` (id, path, name, icon, SEO title and description, keywords, related tools, guides).
2. Create `client/src/tools/<category>/<name>/index.jsx`, `content.jsx` and the tool component (copy an existing tool as a template).
3. Run `npm run build`. Search, navigation, the category page, the sitemap and prerendering all pick it up automatically.

Adding a blog post: add metadata to `client/src/data/posts.js` and a Markdown file to `content/blog/<slug>.md`.

## 5. Testing

```bash
cd client
npm test                 # unit tests (Vitest): maths, dates, GPA, text, page ranges, diff, search, PDF
npm run build && npm run preview     # then, in a second terminal:
npm run test:smoke       # every page: status, console/hydration errors, 1×H1, canonical, links, 404
npm run test:e2e         # the 15 core tools with real JPG/PNG/PDF files and download checks
npm run test:converters  # the 6 converters: real DOCX/XLSX/PDF/image files; downloaded results are opened and checked
cd ../server && npm test # API: validation, Helmet headers, CORS, 404, bad JSON
```

The browser tests drive your installed Google Chrome. Set `CHROME=/path/to/chrome` if it is installed somewhere else.

**Results at the time of writing (25 Nov 2026):**

- Unit tests: **42/42 passed** (client, including PDF layout and table reconstruction), **2/2 passed** (server).
- Smoke test: **43 pages + 43 internal links**, no console or hydration errors, real 404 status: **passed**.
- Converter tests: **9/9 passed**. PDF → Word keeps Heading 1, bold text, rejoined wrapped lines and page 2. PDF → Excel aligns columns (including an empty cell) and turns 1,250 / $18,750.00 / 12.5% into real numbers. Word → PDF and Excel → PDF produce real searchable text, with merged cells and both sheets included. JPG → PDF keeps page order and orientation. PDF → JPG handles page ranges and ZIP download. Scanned PDFs, .doc files and bad page ranges get clear messages.
- Tool tests: **25/25 passed**. These cover zero denominators, invalid input, leap years, inclusive dates, emoji and Unicode counting, fake/renamed files, transparent PNGs, oversized output, invalid page ranges, merge order, and both compression modes.
- Lighthouse (mobile emulation, local gzip server): Performance **97–98**, Accessibility **100**, Best Practices **100**, SEO **100**; CLS **0**; LCP **2.1–2.3 s** on simulated slow 4G. Real-world numbers depend on hosting. Check PageSpeed Insights after deploying.

**Known limits of the converters (also explained on each tool page):** PDF → Word/Excel needs PDFs with real text, so scanned PDFs would need OCR, which isn't included. Layout is rebuilt, not copied pixel for pixel. Word → PDF uses a clean standard layout and its built-in font covers Latin, Greek and Cyrillic, but not Arabic, Urdu or CJK scripts. Old .doc/.ppt files and PowerPoint aren't supported, because no reliable in-browser library exists for them; that would need a server running LibreOffice.

**Manual checks worth doing on real devices:** an iPhone (Safari) and an Android phone (Chrome); a password-protected PDF (the tools show a clear message; this wasn't automated because pdf-lib can't create encrypted files); a very large PDF (100+ MB) on a phone; keyboard-only navigation (Tab, Enter, arrow keys in tabs and search).

## 6. Put it on GitHub

```bash
cd toolkitworld
git init
git add .
git commit -m "ToolKitWorld initial version"
# create an empty repository on github.com (no README), then:
git remote add origin https://github.com/<your-username>/toolkitworld.git
git branch -M main
git push -u origin main
```

`.env` files are git-ignored. Never commit real keys or webhook URLs.

## 7. Deploy free on Cloudflare Pages

1. Sign in at dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git**, and pick the repository.
2. Build settings:
   - Framework preset: **None**
   - Root directory: **`client`**
   - Build command: **`npm run build`**
   - Build output directory: **`dist`**
   - Environment variables: `NODE_VERSION` = `22`, `VITE_SITE_URL` = your final URL (plus any others from section 3).
3. **Save and Deploy.** Your site is live at `https://<project>.pages.dev`. Every `git push` redeploys automatically.

`public/_headers` adds security headers (HSTS, nosniff, frame protection) and long-term caching for hashed assets. `404.html` is served with a real 404 status.

### Optional: deploy the contact API (free)

On **Render.com**: New → Web Service → connect the repo → Root directory `server`, Build `npm install`, Start `npm start`, plan **Free**. Set environment variables `ALLOWED_ORIGINS` (your site URL) and `CONTACT_WEBHOOK_URL` (a Discord or Slack incoming-webhook URL that will receive messages). Then set `VITE_API_URL` in Cloudflare Pages to the Render URL and redeploy. Render's free tier sleeps when idle, so the first message after a quiet period takes ~30–60 seconds. If you'd rather not run a server, just set `VITE_CONTACT_EMAIL` instead.

## 8. Custom domain

1. Buy a domain (Cloudflare Registrar sells at cost; Namecheap and Porkbun are also fine).
2. In your Pages project → **Custom domains → Set up a custom domain** → enter `toolkitworld.com` and follow the DNS prompts. Repeat for `www`, and redirect one to the other (Cloudflare → Rules → Redirect Rules) so only one version gets indexed.
3. HTTPS certificates are issued automatically.
4. Update `VITE_SITE_URL` to the new domain and redeploy, so canonical URLs and the sitemap point to it.

## 9. Google Search Console

1. Go to search.google.com/search-console → **Add property**.
2. The **Domain** property is best: add the TXT record it gives you in Cloudflare DNS. Alternatively, use a URL-prefix property with the HTML tag method: put the code in `VITE_GSC_VERIFICATION` and redeploy.
3. **Sitemaps** → submit `sitemap.xml`.
4. Use **URL Inspection** on the homepage and a few tools, then **Request indexing**.
5. Check the **Pages** report weekly for crawl or indexing errors, and **Performance** for real queries, impressions and clicks. Use that real data to choose new tools and articles (no search volumes were assumed in this project).

## 10. Google Analytics 4

1. analytics.google.com → create a property and a **Web** data stream for your domain → copy the Measurement ID (`G-…`).
2. Set `VITE_GA_MEASUREMENT_ID` and redeploy. The consent banner then appears automatically.
3. GA loads **only after a visitor accepts analytics cookies**. Events sent: `page_view` (including in-app navigation), `tool_use` (once per tool page, with tool id), `search` (search term), `file_download` (tool + file type).
4. In GA4 → Admin → Events, mark `file_download` or `tool_use` as **key events** if you want to treat them as conversions.

## 11. Google AdSense

**How the code is prepared:** `src/config/ads.js` holds a *placeholder* publisher ID. While it is a placeholder, **no ad code loads at all**, and production pages show nothing where ads would go. Ad areas (`<AdSlot>`) are placed below tool results, between article sections and in the desktop sidebar. They are always labelled "Advertisement", never inside upload areas or next to download buttons, and they reserve space so they don't shift the layout.

**After approval:** set `VITE_ADSENSE_CLIENT=ca-pub-…` and the slot IDs (create "Display" ad units in AdSense), then redeploy. The build then adds the `google-adsense-account` meta tag and generates **`ads.txt`** automatically. To turn ads off entirely, set `enabled: false` in `ads.js`.

**Consent:** without ad consent, the site requests non-personalised ads. For visitors in the EEA, UK and Switzerland, Google requires a **Google-certified consent management platform (CMP)**. The simplest free option is AdSense's own **Privacy & messaging → European regulations message**. Turn it on when you enable ads. The built-in banner covers analytics and the remaining regions.

### AdSense application checklist

- [ ] Site is live on your own **custom domain** with HTTPS (not only `pages.dev`).
- [ ] `VITE_SITE_URL`, `VITE_OWNER_NAME` and a real contact method (`VITE_CONTACT_EMAIL` or the contact form) are set.
- [ ] About, Contact, Privacy Policy (with the Google advertising cookie disclosure, already included), Terms, Disclaimer and Cookie Policy pages are reachable from every page (they are linked in the footer).
- [ ] All 21 tools work on mobile and desktop (run the tests above, then try them on a phone).
- [ ] Original, useful content: 8 articles are included. Adding more genuinely helpful guides before applying strengthens the application.
- [ ] Search Console verified, sitemap submitted, pages being indexed.
- [ ] No broken links, no "coming soon" sections, no copied content.
- [ ] You are 18+ and the AdSense account details match you or your business.
- [ ] After approval: add the IDs, confirm `ads.txt` is live at `/ads.txt`, and enable the certified CMP message for European visitors.

Approval is decided by Google and is **not guaranteed**. Traffic, earnings and rankings depend on many factors, and none are promised here.

## 12. Security and privacy summary

- Files never leave the browser. Uploads are validated by **file signature** (magic bytes), size and pixel limits, and output names are sanitised.
- Static hosting with security headers (`public/_headers`). No secrets live in the client. All configuration comes from environment variables.
- API: Helmet, CORS restricted to your origins, a global rate limit plus 5 contact messages per 15 minutes per IP, JSON body limit 20 KB, input sanitising, a honeypot spam trap, and generic error messages (no stack traces). Messages are forwarded rather than stored.
- Analytics and personalised ads only run with consent. Consent is stored on the visitor's device.

## 13. Ideas for what to build next

PowerPoint → PDF and OCR (both need a server, e.g. LibreOffice / Tesseract on a paid or self-hosted machine), QR code generator, unit converter, BMI calculator, loan/EMI calculator, image compressor, JSON formatter, and a password generator. Each can be added with the steps in section 4. Use Search Console data to decide which to build first.

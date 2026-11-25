# ToolKitWorld: where we stopped (25 Nov 2026)

## Status
- **Built:** 21 tools (5 calculators, 4 text, 3 image, 3 PDF, 6 converters), 9 blog articles, all info and legal pages, search, SEO, a cookie banner, AdSense-ready ad areas, and an optional contact API.
- **Tested:** 46 unit tests, a check of every page (43), 25 tool tests and 11 converter/security tests all pass. Lighthouse: 97–98 Performance, 100 Accessibility, 100 Best Practices, 100 SEO.
- **Code:** `~/Desktop/toolkitworld` on this Mac, and on GitHub (public) at https://github.com/HussainHamzakhokhar/toolkitworld (branch `main`).
- **Not done yet:** the site is not online, no domain has been bought, and no Analytics or AdSense IDs are set.

## Decisions made
- **Hosting: Cloudflare Pages (free).** Not Vercel: Vercel's free plan is for non-commercial use only, and an AdSense site is commercial.
- **Domain:** buy your own (about $10–15 a year) through Cloudflare Registrar, so the domain and hosting are in one dashboard.
- **GitHub repo:** public, under the HussainHamzakhokhar account (this was your choice).

## Next steps, in order
1. **You:** buy the domain at dash.cloudflare.com → Domain Registration → Register Domains.
2. **You (Claude guides you):** Cloudflare → Workers & Pages → Create → Pages → Connect to Git → choose `toolkitworld`.
   - Framework preset: None · Root directory: `client` · Build command: `npm run build` · Output directory: `dist`
   - Environment variables: `NODE_VERSION=22`, `VITE_SITE_URL=https://<your-domain>`
3. Pages project → Custom domains → add your domain, and also `www` (redirect one to the other).
4. Add your real details as environment variables, then redeploy: `VITE_OWNER_NAME`, `VITE_CONTACT_EMAIL`.
5. Google Search Console: verify the domain and submit `sitemap.xml` (README section 9).
6. Optional: Google Analytics 4. Set `VITE_GA_MEASUREMENT_ID` (README section 10).
7. Optional: add a few more guide articles, then apply for AdSense using the checklist in README section 11.
8. **When AdSense is approved:** add the IDs (`VITE_ADSENSE_*`) and **turn on Google's European consent message** in AdSense → Privacy & messaging. This is mandatory for visitors from Europe, the UK and Switzerland.

## How to resume with Claude
Open Claude Code in your home folder and say something like:
> "Let's continue ToolKitWorld. I bought the domain ______."

Claude remembers this project and will read this file.

## Useful commands (run in `~/Desktop/toolkitworld`)
| Purpose | Command |
|---|---|
| Install everything (first time on a new computer) | `npm run install:all` |
| Development site at http://localhost:5173 | `npm run dev` |
| Production build | `npm run build` |
| Preview the build at http://localhost:4173 | `npm run preview` |
| Unit tests | `cd client && npm test` |
| Browser tests (run `npm run preview` first) | `cd client && npm run test:smoke && npm run test:e2e && npm run test:converters` |
| Save and publish changes | `git add -A && git commit -m "message" && git push` |

Once Cloudflare is connected, every `git push` updates the live site automatically.

## Ideas for later
PowerPoint → PDF and OCR for scanned PDFs (both need a paid server), QR code generator, unit converter, BMI and loan calculators, image compressor, JSON formatter, password generator. Use Search Console data to decide which to build first.

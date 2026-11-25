import { SITE } from '../config/site';

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const absUrl = (path = '/') => (path.startsWith('http') ? path : SITE.url + path);

/** Builds the full <title> so every page has a unique, branded title. */
export const fullTitle = (title) =>
  !title ? `${SITE.name} – ${SITE.tagline}` : title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;

/**
 * Turns page SEO data into head tags. Used by the prerenderer (static HTML)
 * and in the browser after client-side navigation, so both stay identical.
 * Every generated tag carries data-tkw so it can be replaced on navigation.
 */
export function headTags({ title, description, path = '/', type = 'website', image, noindex, jsonLd = [], article }) {
  const t = esc(fullTitle(title));
  const d = esc(description || '');
  const url = esc(absUrl(path));
  const img = esc(absUrl(image || SITE.ogImage));
  const tags = [
    `<title data-tkw>${t}</title>`,
    `<meta data-tkw name="description" content="${d}">`,
    `<link data-tkw rel="canonical" href="${url}">`,
    `<meta data-tkw name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">`,
    `<meta data-tkw property="og:site_name" content="${SITE.name}">`,
    `<meta data-tkw property="og:locale" content="${SITE.locale}">`,
    `<meta data-tkw property="og:type" content="${type}">`,
    `<meta data-tkw property="og:title" content="${t}">`,
    `<meta data-tkw property="og:description" content="${d}">`,
    `<meta data-tkw property="og:url" content="${url}">`,
    `<meta data-tkw property="og:image" content="${img}">`,
    `<meta data-tkw property="og:image:width" content="1200">`,
    `<meta data-tkw property="og:image:height" content="630">`,
    `<meta data-tkw name="twitter:card" content="summary_large_image">`,
    `<meta data-tkw name="twitter:title" content="${t}">`,
    `<meta data-tkw name="twitter:description" content="${d}">`,
    `<meta data-tkw name="twitter:image" content="${img}">`,
  ];
  if (article) {
    tags.push(`<meta data-tkw property="article:published_time" content="${article.published}">`);
    tags.push(`<meta data-tkw property="article:modified_time" content="${article.modified}">`);
  }
  if (SITE.gscVerification) tags.push(`<meta data-tkw name="google-site-verification" content="${esc(SITE.gscVerification)}">`);
  if (jsonLd.length) {
    const graph = jsonLd.map(({ '@context': _c, ...rest }) => rest); // one @context for the whole graph
    const json = JSON.stringify(jsonLd.length === 1 ? jsonLd[0] : { '@context': 'https://schema.org', '@graph': graph })
      .replace(/</g, '\\u003c');
    tags.push(`<script data-tkw type="application/ld+json">${json}</script>`);
  }
  return tags.join('\n    ');
}

// ---------- JSON-LD builders (only truthful, verifiable properties) ----------
export const ldOrganization = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url + '/',
  logo: absUrl('/icon-512.png'),
  ...(SITE.contactEmail ? { email: SITE.contactEmail } : {}),
});

export const ldWebsite = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  name: SITE.name,
  url: SITE.url + '/',
  description: 'Free online calculators, PDF tools, image tools and text tools that run in your browser.',
  publisher: { '@id': `${SITE.url}/#organization` },
  inLanguage: 'en',
});

export const ldBreadcrumbs = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: absUrl(it.path),
  })),
});

/** WebApplication with a free offer. No ratings or reviews are ever added. */
export const ldWebApp = (tool) => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: tool.name,
  url: absUrl(tool.path),
  description: tool.metaDescription,
  applicationCategory: tool.category === 'calculators' ? 'UtilitiesApplication' : 'ProductivityApplication',
  operatingSystem: 'Any (runs in a modern web browser)',
  browserRequirements: 'Requires JavaScript',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@id': `${SITE.url}/#organization` },
});

export const ldArticle = (post) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.description,
  datePublished: post.published,
  dateModified: post.modified,
  mainEntityOfPage: absUrl(`/blog/${post.slug}/`),
  image: absUrl(SITE.ogImage),
  author: { '@type': 'Organization', name: SITE.author.name, url: absUrl('/about/') },
  publisher: { '@id': `${SITE.url}/#organization`, '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: absUrl('/icon-512.png') } },
});

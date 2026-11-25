import { CATEGORIES, TOOLS } from './data/tools';
import { POSTS } from './data/posts';

/**
 * Every public URL of the site. Used by the router, the prerenderer and the
 * sitemap generator, so they can never disagree.
 * page = file in src/pages, tool = id in the tool registry.
 */
export const ROUTES = [
  { path: '/', page: 'Home', priority: 1.0 },
  { path: '/tools/', page: 'AllTools', priority: 0.9 },
  ...CATEGORIES.map((c) => ({ path: c.path, page: 'Category', props: { id: c.id }, priority: 0.8 })),
  ...TOOLS.map((t) => ({ path: t.path, tool: t.id, priority: 0.9 })),
  { path: '/blog/', page: 'Blog', priority: 0.7 },
  ...POSTS.map((p) => ({ path: `/blog/${p.slug}/`, page: 'BlogPost', props: { slug: p.slug }, priority: 0.6, lastmod: p.modified })),
  { path: '/about/', page: 'About', priority: 0.4 },
  { path: '/contact/', page: 'Contact', priority: 0.3 },
  { path: '/privacy-policy/', page: 'PrivacyPolicy', priority: 0.2 },
  { path: '/terms/', page: 'Terms', priority: 0.2 },
  { path: '/disclaimer/', page: 'Disclaimer', priority: 0.2 },
  { path: '/cookie-policy/', page: 'CookiePolicy', priority: 0.2 },
  { path: '/search/', page: 'Search', noindex: true },
];

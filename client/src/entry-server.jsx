/**
 * Used only at build time by scripts/prerender.mjs to turn every route into
 * static HTML, so search engines and visitors get full content instantly.
 */
import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import App, { moduleKeyFor } from './App';
import { HeadContext } from './seo/Seo';
import { headTags } from './seo/head';
import { ROUTES } from './routes';

export { ROUTES, moduleKeyFor };

async function streamToString(stream) {
  const chunks = [];
  for await (const c of stream) chunks.push(typeof c === 'string' ? Buffer.from(c) : c);
  return Buffer.concat(chunks).toString('utf8');
}

export async function render(url) {
  const collector = { data: null };
  const { prelude } = await prerenderToNodeStream(
    <HeadContext.Provider value={collector}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HeadContext.Provider>,
  );
  const html = await streamToString(prelude);
  const data = collector.data || {};
  return { html, head: headTags(data), status: data.status || 200, noindex: !!data.noindex };
}

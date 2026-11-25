import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { marked } from 'marked';
import path from 'node:path';

/** Turns heading text into a URL-friendly id (used for article table of contents). */
const slugify = (s) =>
  s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

marked.use({
  renderer: {
    heading(token) {
      const text = this.parser.parseInline(token.tokens);
      return `<h${token.depth} id="${slugify(token.text)}">${text}</h${token.depth}>\n`;
    },
    table(token) {
      // Wrap tables so they scroll horizontally on small screens.
      const html = marked.Renderer.prototype.table.call(this, token);
      return `<div class="table-wrap">${html}</div>`;
    },
  },
});

/**
 * Markdown is converted to HTML at BUILD time, so visitors never download a
 * markdown parser. `import html from './post.md'` gives an HTML string.
 */
function markdownPlugin() {
  return {
    name: 'tkw-markdown',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.md')) return null;
      return { code: `export default ${JSON.stringify(marked.parse(code))};`, map: null };
    },
  };
}

export default defineConfig({
  plugins: [markdownPlugin(), react()],
  resolve: { alias: { '@content': path.resolve(import.meta.dirname, '../content') } },
  server: { fs: { allow: ['..'] } },
  build: { manifest: true, target: 'es2022' },
  test: { environment: 'node', include: ['src/**/*.test.js'] },
});

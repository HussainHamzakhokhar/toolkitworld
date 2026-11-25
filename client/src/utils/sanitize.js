/**
 * Allowlist HTML sanitiser for content created from user-supplied files
 * (the Word → PDF preview). Only known-safe tags and attributes survive;
 * everything else is unwrapped (text kept) or removed entirely.
 * DOMParser documents are inert: nothing executes while we clean them.
 */
const ALLOWED = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'SUB', 'SUP', 'UL', 'OL', 'LI',
  'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'TD', 'TH', 'A', 'IMG', 'BR', 'SPAN', 'BLOCKQUOTE', 'PRE', 'CODE', 'HR']);
const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'FRAME', 'OBJECT', 'EMBED', 'SVG', 'MATH', 'FORM', 'INPUT', 'BUTTON', 'TEXTAREA',
  'SELECT', 'LINK', 'META', 'BASE', 'TEMPLATE', 'NOSCRIPT', 'AUDIO', 'VIDEO', 'SOURCE', 'CANVAS']);
const ATTRS = { A: ['href'], IMG: ['src', 'alt'], TD: ['colspan', 'rowspan'], TH: ['colspan', 'rowspan'] };
const SAFE_HREF = /^(https?:|mailto:|#)/i;
const SAFE_IMG = /^data:image\/(png|jpe?g);base64,[a-z0-9+/=\s]+$/i;

export function sanitizeHtml(html) {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  let droppedImages = 0;
  const walk = (node) => {
    for (const el of [...node.children]) {
      if (DROP.has(el.tagName)) { el.remove(); continue; }
      walk(el);
      if (!ALLOWED.has(el.tagName)) { el.replaceWith(...el.childNodes); continue; } // unwrap, keep text
      const keep = ATTRS[el.tagName] || [];
      for (const a of [...el.attributes]) if (!keep.includes(a.name.toLowerCase()) && a.name !== 'id') el.removeAttribute(a.name);
      if (el.id && !/^[\w-]{1,64}$/.test(el.id)) el.removeAttribute('id');
      if (el.tagName === 'A') {
        const href = (el.getAttribute('href') || '').trim();
        if (!SAFE_HREF.test(href)) el.removeAttribute('href');
        else if (/^https?:/i.test(href)) { el.setAttribute('rel', 'noopener noreferrer nofollow'); el.setAttribute('target', '_blank'); }
      }
      if (el.tagName === 'IMG' && !SAFE_IMG.test(el.getAttribute('src') || '')) { el.remove(); droppedImages++; }
    }
  };
  walk(doc.body);
  return { html: doc.body.innerHTML, text: doc.body.textContent || '', droppedImages };
}

// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { sanitizeHtml } from './sanitize';

const clean = (h) => sanitizeHtml(h).html;

describe('sanitizeHtml (allowlist)', () => {
  it('removes scripts, event handlers and dangerous elements', () => {
    const out = clean('<p onclick="x()">Hi<script>alert(1)</script></p><img src=x onerror=alert(1)><iframe src="https://evil"></iframe><svg><script>alert(1)</script></svg><style>*{}</style>');
    expect(out).toBe('<p>Hi</p>');
  });
  it('blocks javascript: and data: links but keeps safe links', () => {
    expect(clean('<a href="javascript:alert(1)">x</a>')).toBe('<a>x</a>');
    expect(clean('<a href=" JaVaScRiPt:alert(1)">x</a>')).toBe('<a>x</a>');
    expect(clean('<a href="data:text/html,<script>">x</a>')).toBe('<a>x</a>');
    expect(clean('<a href="https://example.com">x</a>')).toBe('<a href="https://example.com" rel="noopener noreferrer nofollow" target="_blank">x</a>');
  });
  it('keeps formatting, tables and PNG/JPEG data images only', () => {
    expect(clean('<h1>T</h1><p><strong>b</strong> <em>i</em></p><table><tbody><tr><td colspan="2" style="x">c</td></tr></tbody></table>'))
      .toBe('<h1>T</h1><p><strong>b</strong> <em>i</em></p><table><tbody><tr><td colspan="2">c</td></tr></tbody></table>');
    expect(clean('<img src="data:image/png;base64,iVBORw0KGgo=" alt="a">')).toBe('<img src="data:image/png;base64,iVBORw0KGgo=" alt="a">');
    const r = sanitizeHtml('<img src="data:image/svg+xml;base64,PHN2Zz4="><img src="https://tracker.example/p.gif">');
    expect(r.html).toBe('');
    expect(r.droppedImages).toBe(2);
  });
  it('unwraps unknown tags but keeps their text, and blocks form/meta/base', () => {
    expect(clean('<custom-tag>text</custom-tag><form action="https://evil"><input value="x"></form><base href="https://evil/"><meta http-equiv="refresh" content="0;url=https://evil">')).toBe('text');
  });
});

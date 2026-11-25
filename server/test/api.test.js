import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../server.js';
import { validateContact } from '../controllers/contact.js';

test('validation', () => {
  assert.ok(validateContact({ name: 'Sam', email: 'sam@example.com', message: 'Hello there, nice site!' }).data);
  assert.match(validateContact({ name: '', email: 'a@b.co', message: 'xxxxxxxxxxxx' }).error, /name/);
  assert.match(validateContact({ name: 'A', email: 'bad', message: 'xxxxxxxxxxxx' }).error, /email/);
  assert.match(validateContact({ name: 'A', email: 'a@b.co', message: 'short' }).error, /10 characters/);
  assert.equal(validateContact({ website: 'spam' }).spam, true);
});

test('HTTP: health, security headers, CORS, 404, bad JSON, unconfigured contact', async () => {
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;
  try {
    const h = await fetch(`${base}/api/health`);
    assert.equal(h.status, 200);
    assert.equal(h.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(h.headers.get('x-powered-by'), null);
    assert.equal((await fetch(`${base}/api/health`, { headers: { Origin: 'https://evil.example' } })).status, 403);
    assert.equal((await fetch(`${base}/nope`)).status, 404);
    const bad = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{oops' });
    assert.equal(bad.status, 400);
    const invalid = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'A' }) });
    assert.equal(invalid.status, 400);
    const ok = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Sam', email: 's@ex.com', message: 'A real message here.' }) });
    assert.equal(ok.status, 503); // no webhook configured in tests
  } finally {
    server.close();
  }
});

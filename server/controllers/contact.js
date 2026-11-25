import { config } from '../config/env.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TOPICS = new Set(['Question', 'Bug report', 'Tool suggestion', 'Content correction', 'Other']);
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);

/** Validates the message and returns { data } or { error }. Exported for tests. */
export function validateContact(body = {}) {
  if (body.website) return { spam: true }; // honeypot filled → silently accept, do nothing
  const data = {
    name: clean(body.name, 100),
    email: clean(body.email, 200),
    subject: TOPICS.has(body.subject) ? body.subject : 'Other',
    message: clean(body.message, 5000),
  };
  if (!data.name) return { error: 'Please enter your name.' };
  if (!EMAIL.test(data.email)) return { error: 'Please enter a valid email address.' };
  if (data.message.length < 10) return { error: 'Please write a message of at least 10 characters.' };
  return { data };
}

export async function postContact(req, res, next) {
  try {
    const { data, error, spam } = validateContact(req.body);
    if (spam) return res.json({ ok: true });
    if (error) return res.status(400).json({ error });

    if (!config.contactWebhookUrl) {
      // No destination configured: don't store personal data, just acknowledge in logs.
      console.log(`[contact] message received (${data.subject}); CONTACT_WEBHOOK_URL not set, so it was not forwarded.`);
      return res.status(503).json({ error: 'The contact form is not configured yet.' });
    }
    // Discord expects { content }, Slack expects { text }; sending both works for either.
    const summary = `New ToolKitWorld message (${data.subject})\nFrom: ${data.name} <${data.email}>\n\n${data.message}`.slice(0, 1900);
    const r = await fetch(config.contactWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: summary, text: summary }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) throw new Error(`webhook responded ${r.status}`);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import PageShell from '../layouts/PageShell';
import IconBadge from '../components/IconBadge';
import { Alert } from '../components/ui';
import { SITE } from '../config/site';

/**
 * The form posts to the optional Express API (server/). If no API is
 * configured, a mailto link is shown instead. Nothing fake is displayed.
 */
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Question', message: '', website: '' });
  const [status, setStatus] = useState({ state: 'idle', msg: '' });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) e.email = 'Please enter a valid email address so we can reply.';
    if (form.message.trim().length < 10) e.message = 'Please write at least 10 characters.';
    if (form.message.length > 5000) e.message = 'Please keep your message under 5,000 characters.';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus({ state: 'sending', msg: '' });
    try {
      const res = await fetch(`${SITE.apiUrl}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'The message could not be sent.');
      setStatus({ state: 'sent', msg: 'Thank you! Your message has been sent.' });
      setForm({ name: '', email: '', subject: 'Question', message: '', website: '' });
    } catch (err) {
      setStatus({ state: 'error', msg: `${err.message} Please try again later${SITE.contactEmail ? ` or email ${SITE.contactEmail}` : ''}.` });
    }
  };

  return (
    <PageShell title="Contact Us" path="/contact/" icon={<IconBadge icon={Mail} color="teal" size="lg" />}
      description="Contact ToolKitWorld with questions, bug reports or suggestions for new free online tools."
      lead="Found a bug, have a question or want to suggest a new tool? We’d like to hear from you.">
      {SITE.apiUrl ? (
        <form className="card contact-form" onSubmit={submit} noValidate>
          {status.state === 'sent' && <Alert type="success">{status.msg}</Alert>}
          {status.state === 'error' && <Alert type="error">{status.msg}</Alert>}
          <div className="form-row">
            <div className={`field${errors.name ? ' has-error' : ''}`}>
              <label className="field__label" htmlFor="c-name">Your name</label>
              <input id="c-name" value={form.name} onChange={set('name')} maxLength={100} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'c-name-e' : undefined} />
              {errors.name && <p className="field__error" id="c-name-e">{errors.name}</p>}
            </div>
            <div className={`field${errors.email ? ' has-error' : ''}`}>
              <label className="field__label" htmlFor="c-email">Email address</label>
              <input id="c-email" type="email" value={form.email} onChange={set('email')} maxLength={200} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'c-email-e' : undefined} />
              {errors.email && <p className="field__error" id="c-email-e">{errors.email}</p>}
            </div>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="c-subject">Topic</label>
            <select id="c-subject" value={form.subject} onChange={set('subject')}>
              <option>Question</option><option>Bug report</option><option>Tool suggestion</option><option>Content correction</option><option>Other</option>
            </select>
          </div>
          <div className={`field${errors.message ? ' has-error' : ''}`}>
            <label className="field__label" htmlFor="c-msg">Message</label>
            <textarea id="c-msg" rows={6} value={form.message} onChange={set('message')} maxLength={5000} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'c-msg-e' : undefined} />
            {errors.message && <p className="field__error" id="c-msg-e">{errors.message}</p>}
          </div>
          {/* Honeypot: hidden from people, often filled by spam bots. */}
          <div className="hp" aria-hidden="true">
            <label htmlFor="c-web">Website</label>
            <input id="c-web" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
          </div>
          <p className="field__hint">We use your details only to reply to you. See our <a href="/privacy-policy/">Privacy Policy</a>.</p>
          <button className="btn btn--primary" disabled={status.state === 'sending'}>
            <Send size={16} aria-hidden="true" /> {status.state === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      ) : SITE.contactEmail ? (
        <div className="card contact-card">
          <p>Email us and we’ll reply as soon as we can:</p>
          <p><a className="btn btn--primary" href={`mailto:${SITE.contactEmail}`}><Mail size={16} aria-hidden="true" /> {SITE.contactEmail}</a></p>
        </div>
      ) : (
        <Alert type="info" title="Contact details coming soon">
          Our contact channel is being set up. Please check back shortly.
        </Alert>
      )}
      <div className="prose mt-lg">
        <h2>Before you write</h2>
        <ul>
          <li><strong>Bug reports:</strong> tell us which tool, what you entered or uploaded (not the file itself), your browser and device, and what you expected to happen.</li>
          <li><strong>File questions:</strong> we never receive your files, so we can’t recover or look at them. All processing happens on your device.</li>
          <li><strong>Tool ideas:</strong> describe the task you want to do. Popular requests are prioritised.</li>
        </ul>
      </div>
    </PageShell>
  );
}

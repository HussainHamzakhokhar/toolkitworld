/**
 * Small shared UI building blocks used by every tool.
 */
import { useId, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Copy, Check, Info, UploadCloud, XCircle } from 'lucide-react';
import { copyText } from '../utils/download';

const ALERT_ICONS = { info: Info, warning: AlertTriangle, error: XCircle, success: CheckCircle2 };

/** Status message. The icon and title text mean colour is never the only signal. */
export function Alert({ type = 'info', title, children }) {
  const Icon = ALERT_ICONS[type];
  return (
    <div className={`alert alert--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <Icon className="alert__icon" aria-hidden="true" />
      <div>
        {title && <strong className="alert__title">{title}</strong>}
        <div className="alert__body">{children}</div>
      </div>
    </div>
  );
}

/** Text input for numbers that tolerates "1,000" and shows an accessible error. */
export function NumberField({ label, value, onChange, error, suffix, prefix, hint, placeholder = '0', id: idProp, ...rest }) {
  const auto = useId();
  const id = idProp || auto;
  const describedBy = [error && `${id}-err`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={id} className="field__label">{label}</label>
      <div className="field__control">
        {prefix && <span className="field__affix">{prefix}</span>}
        <input id={id} type="text" inputMode="decimal" autoComplete="off" value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={describedBy} {...rest} />
        {suffix && <span className="field__affix">{suffix}</span>}
      </div>
      {hint && <p id={`${id}-hint`} className="field__hint">{hint}</p>}
      {error && <p id={`${id}-err`} className="field__error">{error}</p>}
    </div>
  );
}

export function Field({ label, children, hint, error, htmlFor }) {
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={htmlFor} className="field__label">{label}</label>
      {children}
      {hint && <p className="field__hint">{hint}</p>}
      {error && <p className="field__error" role="alert">{error}</p>}
    </div>
  );
}

/** Accessible tab list (arrow keys move between tabs). */
export function Tabs({ tabs, value, onChange, label }) {
  const refs = useRef([]);
  const onKey = (e, i) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + tabs.length) % tabs.length;
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  };
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((t, i) => (
        <button key={t.id} ref={(el) => (refs.current[i] = el)} role="tab" type="button" id={`tab-${t.id}`}
          aria-selected={value === t.id} tabIndex={value === t.id ? 0 : -1}
          className={`tabs__tab${value === t.id ? ' is-active' : ''}`} onClick={() => onChange(t.id)} onKeyDown={(e) => onKey(e, i)}>
          {t.icon && <t.icon size={16} aria-hidden="true" />}{t.label}
        </button>
      ))}
    </div>
  );
}

export function CopyButton({ text, label = 'Copy', className = 'btn btn--secondary btn--sm', disabled }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className={className} disabled={disabled || !text}
      onClick={async () => { if (await copyText(text)) { setDone(true); setTimeout(() => setDone(false), 1600); } }}>
      {done ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      <span aria-live="polite">{done ? 'Copied!' : label}</span>
    </button>
  );
}

/** Large stat tiles. */
export function Stats({ items, size = 'md' }) {
  return (
    <dl className={`stats stats--${size}`}>
      {items.map((s) => (
        <div key={s.label} className={`stat${s.highlight ? ' stat--highlight' : ''}`}>
          <dt>{s.label}</dt>
          <dd>{s.value}</dd>
          {s.note && <span className="stat__note">{s.note}</span>}
        </div>
      ))}
    </dl>
  );
}

/**
 * File picker that also accepts drag-and-drop. The real <input type=file>
 * stays keyboard-focusable; the large label is the click target.
 */
export function Dropzone({ accept, multiple, onFiles, title, hint, disabled, compact }) {
  const id = useId();
  const [drag, setDrag] = useState(false);
  const handle = (list) => { const files = Array.from(list || []); if (files.length) onFiles(files); };
  return (
    <div className={`dropzone${drag ? ' is-drag' : ''}${compact ? ' dropzone--compact' : ''}${disabled ? ' is-disabled' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); if (!disabled) handle(e.dataTransfer.files); }}>
      <input id={id} type="file" accept={accept} multiple={multiple} disabled={disabled} className="dropzone__input"
        onChange={(e) => { handle(e.target.files); e.target.value = ''; }} />
      <label htmlFor={id} className="dropzone__label">
        <span className="dropzone__icon"><UploadCloud aria-hidden="true" /></span>
        <span className="dropzone__title">{title}</span>
        <span className="dropzone__or">Drag and drop here, or <span className="dropzone__browse">browse your device</span></span>
        {hint && <span className="dropzone__hint">{hint}</span>}
      </label>
    </div>
  );
}

export function Progress({ value, label }) {
  return (
    <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)} aria-label={label}>
      <span style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}

export function PrivacyNote({ children = 'Your files are processed on this device and are never uploaded to any server.' }) {
  return <p className="privacy-note"><CheckCircle2 size={16} aria-hidden="true" /> {children}</p>;
}

/** Shows the chosen file with a button to pick another. */
export function FileBar({ icon: Icon, color = 'red', name, meta, onClear, disabled, clearLabel = 'Choose another file' }) {
  return (
    <div className="doc-bar">
      <span className={`pdf-item__icon file-icon--${color}`}><Icon aria-hidden="true" /></span>
      <span className="doc-bar__info"><strong title={name}>{name}</strong><span>{meta}</span></span>
      <button type="button" className="btn btn--ghost btn--sm" onClick={onClear} disabled={disabled}>{clearLabel}</button>
    </div>
  );
}

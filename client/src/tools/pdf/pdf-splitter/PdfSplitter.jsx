import { useEffect, useRef, useState } from 'react';
import { Check, Download, FileText, Loader2, Scissors, Trash2 } from 'lucide-react';
import { Alert, Dropzone, PrivacyNote, Progress } from '../../../components/ui';
import { isPdfFile } from '../../../utils/files';
import { extractPages, pageCount, renderThumbnails, splitEach } from '../../../utils/pdf';
import { formatPageRanges, parsePageRanges } from '../../../utils/pages';
import { downloadBlob, safeBaseName } from '../../../utils/download';
import { formatBytes } from '../../../utils/format';
import { makeZip } from '../../../utils/zip';
import useTrackOnce from '../../../hooks/useTrackOnce';

const THUMB_LIMIT = 200; // pages beyond this show a number tile instead of a preview

export default function PdfSplitter() {
  const [doc, setDoc] = useState(null); // { file, bytes, pages }
  const [thumbs, setThumbs] = useState({});
  const [selected, setSelected] = useState(new Set());
  const [rangeText, setRangeText] = useState('');
  const [rangeError, setRangeError] = useState('');
  const [mode, setMode] = useState('single');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState('');
  const token = useRef(0);
  const trackUse = useTrackOnce('pdf-splitter');

  useEffect(() => () => { token.current++; }, []);

  async function onFiles([file]) {
    setError(''); setDone(''); setThumbs({}); setSelected(new Set()); setRangeText(''); setRangeError('');
    const my = ++token.current;
    if (!(await isPdfFile(file))) return setError(`"${file.name}" is not a PDF file.`);
    setLoading(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pages = await pageCount(bytes);
      setDoc({ file, bytes, pages });
      renderThumbnails(bytes, THUMB_LIMIT, 110, (i, url) => token.current === my && setThumbs((t) => ({ ...t, [i]: url })), () => token.current !== my)
        .catch(() => { /* previews are optional; page numbers still work */ });
    } catch (e) { setError(e.message); }
    setLoading(false);
  }

  const applySelection = (set) => { setSelected(set); setRangeText(formatPageRanges([...set])); setRangeError(''); setDone(''); };
  const toggle = (i) => { const s = new Set(selected); s.has(i) ? s.delete(i) : s.add(i); applySelection(s); };
  const onRangeChange = (v) => {
    setRangeText(v); setDone('');
    if (!v.trim()) { setSelected(new Set()); setRangeError(''); return; }
    const r = parsePageRanges(v, doc.pages);
    if (r.error) setRangeError(r.error); else { setRangeError(''); setSelected(new Set(r.pages)); }
  };
  const quick = (fn) => applySelection(new Set(Array.from({ length: doc.pages }, (_, i) => i).filter(fn)));

  async function run() {
    const r = parsePageRanges(rangeText, doc.pages);
    if (r.error) return setRangeError(r.error);
    setBusy(true); setError(''); setProgress(0);
    const base = safeBaseName(doc.file.name);
    try {
      if (mode === 'single') {
        const out = await extractPages(doc.bytes, r.pages);
        downloadBlob(new Blob([out], { type: 'application/pdf' }), `${base}-pages-${formatPageRanges(r.pages).replace(/, /g, '_')}.pdf`.slice(0, 120), 'pdf-splitter');
        setDone(`Extracted ${r.pages.length} page${r.pages.length === 1 ? '' : 's'} into one PDF (${formatBytes(out.byteLength)}).`);
      } else {
        const parts = await splitEach(doc.bytes, r.pages, setProgress);
        const zip = await makeZip(parts.map((p) => ({ name: `${base}-page-${p.page}.pdf`, data: p.bytes })));
        downloadBlob(zip, `${base}-pages.zip`, 'pdf-splitter');
        setDone(`Saved ${parts.length} separate PDF${parts.length === 1 ? '' : 's'} in a ZIP file (${formatBytes(zip.size)}).`);
      }
      trackUse({ mode, pages: r.pages.length });
    } catch (e) { setError(e.message || 'The pages could not be extracted.'); }
    setBusy(false);
  }

  if (!doc) {
    return (
      <div className="tool">
        <Dropzone accept="application/pdf,.pdf" onFiles={onFiles} title="Choose a PDF to split" hint="You’ll pick pages on the next step" disabled={loading} />
        <PrivacyNote />
        {loading && <p className="tool__placeholder"><Loader2 size={16} className="spin" aria-hidden="true" /> Reading PDF…</p>}
        {error && <Alert type="error">{error}</Alert>}
      </div>
    );
  }

  return (
    <div className="tool">
      <div className="doc-bar">
        <span className="pdf-item__icon"><FileText aria-hidden="true" /></span>
        <span className="doc-bar__info"><strong title={doc.file.name}>{doc.file.name}</strong><span>{doc.pages} page{doc.pages === 1 ? '' : 's'} · {formatBytes(doc.file.size)}</span></span>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => { token.current++; setDoc(null); setThumbs({}); setSelected(new Set()); setRangeText(''); setDone(''); }} disabled={busy}>
          <Trash2 size={16} aria-hidden="true" /> Choose another PDF
        </button>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="sp-range">Pages to extract</label>
        <input id="sp-range" value={rangeText} onChange={(e) => onRangeChange(e.target.value)} placeholder={`e.g. 1-3, 5, 8-${Math.min(doc.pages, 10)}`}
          aria-invalid={!!rangeError} aria-describedby="sp-hint sp-err" />
        <p id="sp-hint" className="field__hint">Type pages and ranges, or click pages below. “8-” means page 8 to the end. Pages are saved in the order typed.</p>
        {rangeError && <p id="sp-err" className="field__error" role="alert">{rangeError}</p>}
      </div>
      <div className="chip-row">
        <button type="button" className="chip" onClick={() => quick(() => true)}>Select all</button>
        <button type="button" className="chip" onClick={() => quick((i) => i % 2 === 0)}>Odd pages</button>
        <button type="button" className="chip" onClick={() => quick((i) => i % 2 === 1)}>Even pages</button>
        <button type="button" className="chip" onClick={() => applySelection(new Set())} disabled={!selected.size}>Clear selection</button>
        <span className="tool__meta" aria-live="polite">{selected.size} of {doc.pages} selected</span>
      </div>

      <ul className="page-grid" aria-label="Pages">
        {Array.from({ length: doc.pages }, (_, i) => (
          <li key={i}>
            <button type="button" className={`page-tile${selected.has(i) ? ' is-selected' : ''}`} aria-pressed={selected.has(i)} aria-label={`Page ${i + 1}`} onClick={() => toggle(i)}>
              <span className="page-tile__img">
                {thumbs[i] ? <img src={thumbs[i]} alt="" /> : i < THUMB_LIMIT ? <Loader2 className="spin" aria-hidden="true" /> : <FileText aria-hidden="true" />}
              </span>
              <span className="page-tile__num">{i + 1}</span>
              {selected.has(i) && <span className="page-tile__check" aria-hidden="true"><Check size={14} /></span>}
            </button>
          </li>
        ))}
      </ul>

      <fieldset className="radio-cards">
        <legend className="field__label">Output</legend>
        <label className={`radio-card${mode === 'single' ? ' is-active' : ''}`}>
          <input type="radio" name="sp-mode" checked={mode === 'single'} onChange={() => setMode('single')} />
          <span><strong>One PDF</strong><span>All selected pages in a single new file</span></span>
        </label>
        <label className={`radio-card${mode === 'each' ? ' is-active' : ''}`}>
          <input type="radio" name="sp-mode" checked={mode === 'each'} onChange={() => setMode('each')} />
          <span><strong>Separate PDFs</strong><span>Each selected page as its own file, in a ZIP</span></span>
        </label>
      </fieldset>

      {error && <Alert type="error">{error}</Alert>}
      {busy && mode === 'each' && <Progress value={progress} label="Splitting progress" />}
      <div className="tool__actions">
        <button type="button" className="btn btn--primary btn--lg" onClick={run} disabled={busy || !selected.size || !!rangeError}>
          {busy ? <Loader2 size={18} className="spin" aria-hidden="true" /> : <Scissors size={18} aria-hidden="true" />}
          {busy ? 'Working…' : `Extract ${selected.size || ''} page${selected.size === 1 ? '' : 's'}`}
        </button>
      </div>
      {done && <Alert type="success" title="Download started"><Download size={14} aria-hidden="true" /> {done}</Alert>}
    </div>
  );
}

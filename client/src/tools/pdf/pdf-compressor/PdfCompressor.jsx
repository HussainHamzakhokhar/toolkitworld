import { useState } from 'react';
import { Download, FileArchive, FileText, Loader2, Trash2 } from 'lucide-react';
import { Alert, Dropzone, PrivacyNote, Progress } from '../../../components/ui';
import { isPdfFile } from '../../../utils/files';
import { compressRasterize, compressStructure, pageCount } from '../../../utils/pdf';
import { downloadBlob, safeBaseName } from '../../../utils/download';
import { formatBytes } from '../../../utils/format';
import useTrackOnce from '../../../hooks/useTrackOnce';

const STRONG = {
  high: { label: 'High quality', dpi: 150, quality: 0.8, hint: 'Sharp text, moderate saving' },
  medium: { label: 'Balanced', dpi: 120, quality: 0.65, hint: 'Good for most scans' },
  low: { label: 'Smallest file', dpi: 85, quality: 0.5, hint: 'Readable on screen, noticeably softer' },
};

export default function PdfCompressor() {
  const [doc, setDoc] = useState(null);
  const [level, setLevel] = useState('basic');
  const [strong, setStrong] = useState('medium');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const trackUse = useTrackOnce('pdf-compressor');

  async function onFiles([file]) {
    setError(''); setResult(null);
    if (!(await isPdfFile(file))) return setError(`"${file.name}" is not a PDF file.`);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      setDoc({ file, bytes, pages: await pageCount(bytes) });
    } catch (e) { setError(e.message); }
  }

  async function compress() {
    setBusy(true); setError(''); setResult(null); setProgress(0);
    try {
      const out = level === 'basic'
        ? await compressStructure(doc.bytes)
        : await compressRasterize(doc.bytes, STRONG[strong], setProgress);
      const saved = doc.file.size - out.byteLength;
      setResult({ blob: new Blob([out], { type: 'application/pdf' }), size: out.byteLength, saved, pct: (saved / doc.file.size) * 100 });
      trackUse({ level: level === 'basic' ? 'basic' : strong });
    } catch (e) { setError(e.message || 'This PDF could not be compressed.'); }
    setBusy(false);
  }

  if (!doc) {
    return (
      <div className="tool">
        <Dropzone accept="application/pdf,.pdf" onFiles={onFiles} title="Choose a PDF to compress" hint="Your file stays on this device" />
        <PrivacyNote />
        {error && <Alert type="error">{error}</Alert>}
      </div>
    );
  }

  const smaller = result && result.saved > 0;
  const ratio = result ? Math.max(2, Math.min(100, (result.size / doc.file.size) * 100)) : 100;

  return (
    <div className="tool">
      <div className="doc-bar">
        <span className="pdf-item__icon"><FileText aria-hidden="true" /></span>
        <span className="doc-bar__info"><strong title={doc.file.name}>{doc.file.name}</strong><span>{doc.pages} page{doc.pages === 1 ? '' : 's'} · original size <b>{formatBytes(doc.file.size)}</b></span></span>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setDoc(null); setResult(null); }} disabled={busy}><Trash2 size={16} aria-hidden="true" /> Choose another PDF</button>
      </div>

      <fieldset className="radio-cards">
        <legend className="field__label">Compression method</legend>
        <label className={`radio-card${level === 'basic' ? ' is-active' : ''}`}>
          <input type="radio" name="pc-level" checked={level === 'basic'} onChange={() => { setLevel('basic'); setResult(null); }} />
          <span><strong>Basic — keep everything</strong><span>Rebuilds the file structure and removes unused data. Text stays selectable. Savings vary from none to moderate.</span></span>
        </label>
        <label className={`radio-card${level === 'strong' ? ' is-active' : ''}`}>
          <input type="radio" name="pc-level" checked={level === 'strong'} onChange={() => { setLevel('strong'); setResult(null); }} />
          <span><strong>Strong — convert pages to images</strong><span>Best for scans and photo-heavy PDFs. Text will no longer be selectable or searchable, and links stop working.</span></span>
        </label>
      </fieldset>

      {level === 'strong' && (
        <div className="seg seg--wide" role="radiogroup" aria-label="Image quality">
          {Object.entries(STRONG).map(([k, s]) => (
            <button type="button" key={k} role="radio" aria-checked={strong === k} className={strong === k ? 'is-active' : ''} onClick={() => { setStrong(k); setResult(null); }}>
              <strong>{s.label}</strong><small>{s.hint}</small>
            </button>
          ))}
        </div>
      )}

      {error && <Alert type="error">{error}</Alert>}
      {busy && level === 'strong' && <Progress value={progress} label="Compression progress" />}
      <div className="tool__actions">
        <button type="button" className="btn btn--primary btn--lg" onClick={compress} disabled={busy}>
          {busy ? <Loader2 size={18} className="spin" aria-hidden="true" /> : <FileArchive size={18} aria-hidden="true" />} {busy ? `Compressing… ${level === 'strong' ? Math.round(progress * 100) + '%' : ''}` : 'Compress PDF'}
        </button>
      </div>

      {result && (
        <div className="result" aria-live="polite">
          <div className="size-compare">
            <div className="size-compare__row"><span>Original</span><span className="size-compare__bar"><span style={{ width: '100%' }} /></span><strong>{formatBytes(doc.file.size)}</strong></div>
            <div className="size-compare__row"><span>Compressed</span><span className={`size-compare__bar${smaller ? ' is-good' : ' is-bad'}`}><span style={{ width: `${ratio}%` }} /></span><strong>{formatBytes(result.size)}</strong></div>
          </div>
          {smaller ? (
            <>
              <p className="result__summary"><strong>{result.pct.toFixed(1)}% smaller</strong> — you saved {formatBytes(result.saved)}.</p>
              {result.pct < 3 && <Alert type="info">The saving is small. This PDF was already efficiently stored{level === 'basic' ? '; try “Strong” if it contains scans or photos' : ''}.</Alert>}
              <button type="button" className="btn btn--accent" onClick={() => downloadBlob(result.blob, `${safeBaseName(doc.file.name)}-compressed.pdf`, 'pdf-compressor')}>
                <Download size={18} aria-hidden="true" /> Download compressed PDF
              </button>
            </>
          ) : (
            <Alert type="warning" title="This PDF could not be made smaller">
              The result would be {formatBytes(-result.saved)} larger than your original, so we recommend keeping the original file.
              {level === 'basic' ? ' Try the “Strong” method if the PDF contains scanned pages or large photos.' : ' This usually means the PDF is mostly text or already well compressed.'}
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}

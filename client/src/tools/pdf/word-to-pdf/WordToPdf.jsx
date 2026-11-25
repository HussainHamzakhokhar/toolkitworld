import { useState } from 'react';
import { ArrowRight, Download, FileType, Loader2, Wand2 } from 'lucide-react';
import { Alert, Dropzone, FileBar, PrivacyNote } from '../../../components/ui';
import { docxToHtml, htmlToPdf } from '../../../utils/convert';
import { detectType } from '../../../utils/files';
import { downloadBlob, safeBaseName } from '../../../utils/download';
import { formatBytes, formatNumber } from '../../../utils/format';
import useTrackOnce from '../../../hooks/useTrackOnce';

const MAX = 50 * 1024 * 1024;

export default function WordToPdf() {
  const [file, setFile] = useState(null);
  const [doc, setDoc] = useState(null); // { html, words, droppedImages, warnings }
  const [opts, setOpts] = useState({ pageSize: 'A4', margin: 56, fontSize: 11 });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const trackUse = useTrackOnce('word-to-pdf');

  async function onFiles([f]) {
    setError(''); setResult(null); setDoc(null);
    if (/\.doc$/i.test(f.name)) return setError('Old .doc files are not supported. Open the file in Word, Google Docs or LibreOffice and save it as .docx, then try again.');
    if (f.size === 0) return setError('This file is empty.');
    if (f.size > MAX) return setError('This document is larger than 50 MB.');
    const head = new Uint8Array(await f.slice(0, 4).arrayBuffer());
    if (!(head[0] === 0x50 && head[1] === 0x4b)) return setError(`"${f.name}" is not a .docx Word document.`);
    setFile(f); setBusy(true);
    try { setDoc(await docxToHtml(await f.arrayBuffer())); } catch (e) { setError(e.message); setFile(null); }
    setBusy(false);
  }

  async function convert() {
    setBusy(true); setError(''); setResult(null);
    try {
      const blob = await htmlToPdf(doc.html, { ...opts, title: safeBaseName(file.name) });
      setResult({ blob });
      trackUse();
    } catch (e) { setError(e.message || 'The PDF could not be created.'); }
    setBusy(false);
  }
  const set = (k, v) => { setOpts({ ...opts, [k]: v }); setResult(null); };

  if (!file) {
    return (
      <div className="tool">
        <Dropzone accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onFiles={onFiles} title="Choose a Word document (.docx)" hint="Text, headings, lists, tables, links and images are converted" disabled={busy} />
        <PrivacyNote />
        {busy && <p className="tool__placeholder"><Loader2 size={16} className="spin" aria-hidden="true" /> Reading document…</p>}
        {error && <Alert type="error">{error}</Alert>}
      </div>
    );
  }

  return (
    <div className="tool">
      <FileBar icon={FileType} color="blue" name={file.name} meta={`${formatBytes(file.size)}${doc ? ` · ${formatNumber(doc.words)} words` : ''}`} onClear={() => { setFile(null); setDoc(null); setResult(null); }} disabled={busy} clearLabel="Choose another file" />
      <div className="convert-flow" aria-hidden="true"><span className="convert-flow__badge">Word (.docx)</span><ArrowRight size={16} /><span className="convert-flow__badge">PDF</span></div>
      <div className="form-row">
        <div className="field">
          <label className="field__label" htmlFor="wp-size">Page size</label>
          <select id="wp-size" value={opts.pageSize} onChange={(e) => set('pageSize', e.target.value)}><option value="A4">A4 (210 × 297 mm)</option><option value="LETTER">US Letter (8.5 × 11 in)</option></select>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="wp-margin">Margins</label>
          <select id="wp-margin" value={opts.margin} onChange={(e) => set('margin', +e.target.value)}><option value={72}>Normal (2.54 cm / 1 in)</option><option value={56}>Moderate (2 cm)</option><option value={36}>Narrow (1.27 cm)</option></select>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="wp-font">Base text size</label>
          <select id="wp-font" value={opts.fontSize} onChange={(e) => set('fontSize', +e.target.value)}><option value={10}>10 pt</option><option value={11}>11 pt</option><option value={12}>12 pt</option></select>
        </div>
      </div>
      {doc?.droppedImages > 0 && <Alert type="info">{doc.droppedImages} image{doc.droppedImages === 1 ? '' : 's'} in an unsupported format (such as EMF, WMF or SVG) will be left out. PNG and JPG images are included.</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      <div className="tool__actions">
        <button type="button" className="btn btn--primary btn--lg" onClick={convert} disabled={busy || !doc}>
          {busy ? <Loader2 size={18} className="spin" aria-hidden="true" /> : <Wand2 size={18} aria-hidden="true" />} {busy ? 'Creating PDF…' : 'Convert to PDF'}
        </button>
      </div>
      {result && (
        <div className="download-box" aria-live="polite">
          <p><strong>Your PDF is ready</strong> ({formatBytes(result.blob.size)}).</p>
          <button type="button" className="btn btn--accent" onClick={() => downloadBlob(result.blob, `${safeBaseName(file.name)}.pdf`, 'word-to-pdf')}><Download size={18} aria-hidden="true" /> Download PDF</button>
        </div>
      )}
      {doc && (
        <>
          <p className="doc-preview__label">Content preview</p>
          {/* HTML generated by mammoth and sanitised in docxToHtml (no scripts, event handlers or unsafe links). */}
          <div className="doc-preview prose" dangerouslySetInnerHTML={{ __html: doc.html || '<p><em>This document has no text.</em></p>' }} />
          <p className="field__hint">The PDF uses a clean standard layout. Exact Word fonts, headers and footers, text boxes and page layout are not reproduced.</p>
        </>
      )}
    </div>
  );
}

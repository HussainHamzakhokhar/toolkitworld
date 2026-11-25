import { useState } from 'react';
import { ArrowRight, Download, FileText, Loader2, Wand2 } from 'lucide-react';
import { Alert, Dropzone, FileBar, PrivacyNote, Progress } from '../../../components/ui';
import { isPdfFile } from '../../../utils/files';
import { extractPdfText, pdfToDocx, pdfToXlsx } from '../../../utils/convert';
import { downloadBlob, safeBaseName } from '../../../utils/download';
import { formatBytes, formatNumber } from '../../../utils/format';
import useTrackOnce from '../../../hooks/useTrackOnce';

/**
 * Shared UI for PDF → Word and PDF → Excel: both read the PDF's text layer,
 * then rebuild either paragraphs or table rows.
 */
export default function PdfToOffice({ target = 'word' }) {
  const isWord = target === 'word';
  const toolId = isWord ? 'pdf-to-word' : 'pdf-to-excel';
  const ext = isWord ? 'docx' : 'xlsx';
  const [file, setFile] = useState(null);
  const [opts, setOpts] = useState({ pageBreaks: true, headings: true, onePerPage: true, numbers: true });
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const trackUse = useTrackOnce(toolId);

  async function onFiles([f]) {
    setError(''); setResult(null);
    if (f.size === 0) return setError('This file is empty.');
    if (!(await isPdfFile(f))) return setError(`"${f.name}" is not a PDF file.`);
    setFile(f);
  }

  async function convert() {
    setBusy(true); setError(''); setResult(null); setProgress(0);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const extracted = await extractPdfText(bytes, (p) => setProgress(p * 0.85));
      if (extracted.chars === 0) throw new Error('No text was found in this PDF. It is probably a scanned document (a picture of text), which would need OCR — that is not supported yet.');
      const out = isWord ? await pdfToDocx(extracted, opts) : await pdfToXlsx(extracted, opts);
      setProgress(1);
      setResult({ ...out, scanned: extracted.scanned, pages: extracted.pages.length });
      trackUse();
    } catch (e) { setError(e.message || 'The conversion failed.'); }
    setBusy(false);
  }

  const toggle = (k) => () => { setOpts({ ...opts, [k]: !opts[k] }); setResult(null); };

  if (!file) {
    return (
      <div className="tool">
        <Dropzone accept="application/pdf,.pdf" onFiles={onFiles} title={`Choose a PDF to convert to ${isWord ? 'Word' : 'Excel'}`} hint={`Works best with PDFs created digitally (not scans) · output: .${ext}`} />
        <PrivacyNote />
        {error && <Alert type="error">{error}</Alert>}
      </div>
    );
  }

  return (
    <div className="tool">
      <FileBar icon={FileText} name={file.name} meta={formatBytes(file.size)} onClear={() => { setFile(null); setResult(null); setError(''); }} disabled={busy} clearLabel="Choose another PDF" />
      <div className="convert-flow" aria-hidden="true">
        <span className="convert-flow__badge">PDF</span><ArrowRight size={16} /><span className="convert-flow__badge">{isWord ? 'Word (.docx)' : 'Excel (.xlsx)'}</span>
      </div>
      <fieldset className="form-row form-row--wrap" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="field__label">Options</legend>
        {isWord ? (
          <>
            <label className="check"><input type="checkbox" checked={opts.headings} onChange={toggle('headings')} /> Detect headings from larger text</label>
            <label className="check"><input type="checkbox" checked={opts.pageBreaks} onChange={toggle('pageBreaks')} /> Start each PDF page on a new page</label>
          </>
        ) : (
          <>
            <label className="check"><input type="checkbox" checked={opts.onePerPage} onChange={toggle('onePerPage')} /> One worksheet per PDF page</label>
            <label className="check"><input type="checkbox" checked={opts.numbers} onChange={toggle('numbers')} /> Convert numbers, currency and % to real numbers</label>
          </>
        )}
      </fieldset>

      {error && <Alert type="error" title="Couldn’t convert this PDF">{error}</Alert>}
      {busy && <Progress value={progress} label="Conversion progress" />}
      <div className="tool__actions">
        <button type="button" className="btn btn--primary btn--lg" onClick={convert} disabled={busy}>
          {busy ? <Loader2 size={18} className="spin" aria-hidden="true" /> : <Wand2 size={18} aria-hidden="true" />} {busy ? `Converting… ${Math.round(progress * 100)}%` : `Convert to ${isWord ? 'Word' : 'Excel'}`}
        </button>
      </div>

      {result && (
        <div className="result" aria-live="polite">
          {result.scanned && <Alert type="warning" title="Very little text found">Parts of this PDF may be scanned images. Only real text can be converted; images and scanned text are not included.</Alert>}
          <div className="download-box">
            <p>
              <strong>Ready!</strong> {result.pages} page{result.pages === 1 ? '' : 's'} converted —{' '}
              {isWord ? `${formatNumber(result.paragraphs)} paragraphs, ${formatNumber(result.words)} words` : `${formatNumber(result.rows)} rows, up to ${result.cols} columns`} ({formatBytes(result.blob.size)}).
            </p>
            <button type="button" className="btn btn--accent" onClick={() => downloadBlob(result.blob, `${safeBaseName(file.name)}.${ext}`, toolId)}>
              <Download size={18} aria-hidden="true" /> Download .{ext}
            </button>
          </div>
          <p className="doc-preview__label">{isWord ? 'Preview (start of the document)' : 'Preview (first rows of the first table)'}</p>
          {isWord ? (
            <div className="doc-preview">
              {result.preview.map((p, i) => (p.heading === 1 ? <h2 key={i}>{p.text}</h2> : p.heading === 2 ? <h3 key={i}>{p.text}</h3> : <p key={i}>{p.text}</p>))}
            </div>
          ) : (
            <div className="sheet-preview">
              <table><tbody>{result.preview.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={/^[-$€£₹(]?[\d,.]+%?\)?$/.test(c) ? 'num' : undefined}>{c}</td>)}</tr>)}</tbody></table>
            </div>
          )}
          <p className="field__hint">Layout is rebuilt from the PDF’s text, so fonts, columns and images may differ from the original. Check the file before sharing it.</p>
        </div>
      )}
    </div>
  );
}

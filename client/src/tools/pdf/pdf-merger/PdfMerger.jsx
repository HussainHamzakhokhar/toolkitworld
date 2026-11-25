import { useState } from 'react';
import { ArrowDown, ArrowDownAZ, ArrowUp, Download, FileText, GripVertical, Loader2, Merge, Trash2 } from 'lucide-react';
import { Alert, Dropzone, PrivacyNote, Progress } from '../../../components/ui';
import { isPdfFile } from '../../../utils/files';
import { mergePdfs, pageCount } from '../../../utils/pdf';
import { downloadBlob } from '../../../utils/download';
import { formatBytes } from '../../../utils/format';
import useTrackOnce from '../../../hooks/useTrackOnce';

let uid = 0;
const MAX_FILES = 50;

export default function PdfMerger() {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragIdx, setDragIdx] = useState(null);
  const trackUse = useTrackOnce('pdf-merger');

  const patch = (id, p) => setFiles((fs) => fs.map((f) => (f.id === id ? { ...f, ...p } : f)));
  const changed = () => { setResult(null); setError(''); };

  async function addFiles(list) {
    changed();
    const room = MAX_FILES - files.length;
    const fresh = list.slice(0, room).map((file) => ({ id: ++uid, file, name: file.name, size: file.size, pages: null, status: 'checking' }));
    if (list.length > room) setError(`Up to ${MAX_FILES} files can be merged at once.`);
    setFiles((fs) => [...fs, ...fresh]);
    for (const f of fresh) {
      if (f.size === 0) { patch(f.id, { status: 'error', error: 'This file is empty.' }); continue; }
      if (!(await isPdfFile(f.file))) { patch(f.id, { status: 'error', error: 'This is not a PDF file.' }); continue; }
      try {
        const bytes = new Uint8Array(await f.file.arrayBuffer());
        patch(f.id, { status: 'ok', pages: await pageCount(bytes) });
      } catch (e) { patch(f.id, { status: 'error', error: e.message }); }
    }
  }

  const move = (from, to) => {
    if (to < 0 || to >= files.length) return;
    changed();
    setFiles((fs) => { const next = [...fs]; const [it] = next.splice(from, 1); next.splice(to, 0, it); return next; });
  };

  const valid = files.filter((f) => f.status === 'ok');
  const checking = files.some((f) => f.status === 'checking');

  async function merge() {
    setBusy(true); setError(''); setProgress(0);
    try {
      const inputs = await Promise.all(valid.map(async (f) => ({ name: f.name, bytes: new Uint8Array(await f.file.arrayBuffer()) })));
      const out = await mergePdfs(inputs, setProgress);
      setResult({ blob: new Blob([out], { type: 'application/pdf' }), pages: valid.reduce((s, f) => s + f.pages, 0) });
      trackUse({ files: valid.length });
    } catch (e) { setError(e.message || 'The files could not be merged.'); }
    setBusy(false);
  }

  return (
    <div className="tool">
      <Dropzone accept="application/pdf,.pdf" multiple onFiles={addFiles} title="Choose PDF files to merge" hint="Add 2 or more PDFs · reorder them before merging" compact={files.length > 0} disabled={busy} />
      <PrivacyNote />

      {files.length > 0 && (
        <>
          <div className="list-toolbar">
            <p><strong>{files.length}</strong> file{files.length === 1 ? '' : 's'} · {valid.reduce((s, f) => s + f.pages, 0)} pages · merged in this order</p>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => { changed(); setFiles((fs) => [...fs].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))); }}>
              <ArrowDownAZ size={16} aria-hidden="true" /> Sort by name
            </button>
          </div>
          <ol className="pdf-list">
            {files.map((f, i) => (
              <li key={f.id} className={`pdf-item${f.status === 'error' ? ' is-error' : ''}${dragIdx === i ? ' is-dragging' : ''}`}
                draggable={!busy} onDragStart={() => setDragIdx(i)} onDragEnd={() => setDragIdx(null)}
                onDragOver={(e) => { e.preventDefault(); if (dragIdx !== null && dragIdx !== i) { move(dragIdx, i); setDragIdx(i); } }}>
                <GripVertical className="pdf-item__grip" aria-hidden="true" />
                <span className="pdf-item__num" aria-hidden="true">{i + 1}</span>
                <span className="pdf-item__icon"><FileText aria-hidden="true" /></span>
                <span className="pdf-item__info">
                  <span className="pdf-item__name" title={f.name}>{f.name}</span>
                  <span className="pdf-item__meta">
                    {formatBytes(f.size)}
                    {f.status === 'ok' && ` · ${f.pages} page${f.pages === 1 ? '' : 's'}`}
                    {f.status === 'checking' && <> · <Loader2 size={12} className="spin" aria-hidden="true" /> checking…</>}
                  </span>
                  {f.status === 'error' && <span className="pdf-item__error" role="alert">{f.error} It will be skipped.</span>}
                </span>
                <span className="pdf-item__actions">
                  <button type="button" className="icon-btn icon-btn--sm" aria-label={`Move ${f.name} up`} disabled={i === 0 || busy} onClick={() => move(i, i - 1)}><ArrowUp size={16} /></button>
                  <button type="button" className="icon-btn icon-btn--sm" aria-label={`Move ${f.name} down`} disabled={i === files.length - 1 || busy} onClick={() => move(i, i + 1)}><ArrowDown size={16} /></button>
                  <button type="button" className="icon-btn icon-btn--sm" aria-label={`Remove ${f.name}`} disabled={busy} onClick={() => { changed(); setFiles((fs) => fs.filter((x) => x.id !== f.id)); }}><Trash2 size={16} /></button>
                </span>
              </li>
            ))}
          </ol>

          {error && <Alert type="error">{error}</Alert>}
          {valid.length < 2 && !checking && <Alert type="info">Add at least two valid PDF files to merge.</Alert>}
          {busy && <Progress value={progress} label="Merging progress" />}

          <div className="tool__actions">
            <button type="button" className="btn btn--primary btn--lg" onClick={merge} disabled={busy || checking || valid.length < 2}>
              {busy ? <Loader2 size={18} className="spin" aria-hidden="true" /> : <Merge size={18} aria-hidden="true" />} {busy ? 'Merging…' : `Merge ${valid.length} PDFs`}
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => { setFiles([]); changed(); }} disabled={busy}><Trash2 size={16} aria-hidden="true" /> Clear all</button>
          </div>
        </>
      )}

      {result && (
        <div className="download-box" aria-live="polite">
          <p><strong>Done!</strong> Your merged PDF has {result.pages} pages ({formatBytes(result.blob.size)}).</p>
          <button type="button" className="btn btn--accent" onClick={() => downloadBlob(result.blob, 'merged.pdf', 'pdf-merger')}>
            <Download size={18} aria-hidden="true" /> Download merged PDF
          </button>
        </div>
      )}
    </div>
  );
}

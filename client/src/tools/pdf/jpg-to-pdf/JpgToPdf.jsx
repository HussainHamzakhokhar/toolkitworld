import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Download, FileImage, Loader2, Trash2, Wand2 } from 'lucide-react';
import { Alert, Dropzone, PrivacyNote, Progress } from '../../../components/ui';
import { loadImage } from '../../../utils/image';
import { imagesToPdf } from '../../../utils/convert';
import { downloadBlob, safeBaseName } from '../../../utils/download';
import { formatBytes } from '../../../utils/format';
import useTrackOnce from '../../../hooks/useTrackOnce';

let uid = 0;
const MAX_FILES = 100;

export default function JpgToPdf() {
  const [items, setItems] = useState([]);
  const [opts, setOpts] = useState({ pageSize: 'A4', orientation: 'auto', margin: 24 });
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [notice, setNotice] = useState('');
  const [dragIdx, setDragIdx] = useState(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const trackUse = useTrackOnce('jpg-to-pdf');

  useEffect(() => () => itemsRef.current.forEach((i) => { URL.revokeObjectURL(i.url); i.source?.close?.(); }), []);

  async function addFiles(files) {
    setResult(null); setNotice('');
    const room = MAX_FILES - itemsRef.current.length;
    if (files.length > room) setNotice(`Up to ${MAX_FILES} images per PDF. Only the first ${Math.max(0, room)} were added.`);
    const errors = [];
    for (const file of files.slice(0, Math.max(0, room))) {
      try {
        const img = await loadImage(file, ['jpeg', 'png', 'webp', 'gif', 'bmp']);
        const bytes = new Uint8Array(await file.arrayBuffer());
        setItems((list) => [...list, { id: ++uid, file, bytes, ...img, url: URL.createObjectURL(file) }]);
      } catch (e) { errors.push(e.message); }
    }
    if (errors.length) setNotice(errors.join(' '));
  }

  const move = (from, to) => {
    if (to < 0 || to >= items.length) return;
    setResult(null);
    setItems((l) => { const n = [...l]; const [x] = n.splice(from, 1); n.splice(to, 0, x); return n; });
  };
  const remove = (id) => { setResult(null); setItems((l) => { const it = l.find((x) => x.id === id); if (it) { URL.revokeObjectURL(it.url); it.source?.close?.(); } return l.filter((x) => x.id !== id); }); };
  const set = (k, v) => { setOpts({ ...opts, [k]: v }); setResult(null); };

  async function convert() {
    setBusy(true); setProgress(0); setResult(null);
    try {
      const out = await imagesToPdf(items, opts, setProgress);
      setResult({ blob: new Blob([out], { type: 'application/pdf' }) });
      trackUse({ images: items.length });
    } catch (e) { setNotice(e.message || 'The PDF could not be created.'); }
    setBusy(false);
  }

  return (
    <div className="tool">
      <Dropzone accept="image/jpeg,image/png,image/webp,image/gif,image/bmp" multiple onFiles={addFiles} title="Choose images to put in a PDF" hint="JPG, PNG, WebP, GIF or BMP · one image per page" compact={items.length > 0} disabled={busy} />
      <PrivacyNote />
      {notice && <Alert type="warning">{notice}</Alert>}
      {items.length > 0 && (
        <>
          <div className="form-row">
            <div className="field">
              <label className="field__label" htmlFor="jp-size">Page size</label>
              <select id="jp-size" value={opts.pageSize} onChange={(e) => set('pageSize', e.target.value)}><option value="A4">A4</option><option value="LETTER">US Letter</option><option value="FIT">Same as image</option></select>
            </div>
            {opts.pageSize !== 'FIT' && (
              <div className="field">
                <label className="field__label" htmlFor="jp-or">Orientation</label>
                <select id="jp-or" value={opts.orientation} onChange={(e) => set('orientation', e.target.value)}><option value="auto">Automatic (match each image)</option><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select>
              </div>
            )}
            <div className="field">
              <label className="field__label" htmlFor="jp-m">Margin</label>
              <select id="jp-m" value={opts.margin} onChange={(e) => set('margin', +e.target.value)}><option value={0}>None</option><option value={24}>Small</option><option value={48}>Large</option></select>
            </div>
          </div>
          <p className="field__hint">Drag images to reorder them, or use the arrows. The first image becomes page 1.</p>
          <ol className="img-grid">
            {items.map((it, i) => (
              <li key={it.id} className={`img-tile${dragIdx === i ? ' is-dragging' : ''}`} draggable={!busy}
                onDragStart={() => setDragIdx(i)} onDragEnd={() => setDragIdx(null)}
                onDragOver={(e) => { e.preventDefault(); if (dragIdx !== null && dragIdx !== i) { move(dragIdx, i); setDragIdx(i); } }}>
                <span className="img-tile__num" aria-hidden="true">{i + 1}</span>
                <span className="img-tile__img"><img src={it.url} alt={`Page ${i + 1}: ${it.file.name}`} loading="lazy" /></span>
                <span className="img-tile__name" title={it.file.name}>{it.file.name}</span>
                <span className="img-tile__row">
                  <span>{it.width}×{it.height}</span>
                  <span>
                    <button type="button" className="icon-btn icon-btn--sm" aria-label={`Move ${it.file.name} earlier`} disabled={i === 0 || busy} onClick={() => move(i, i - 1)}><ArrowLeft size={15} /></button>
                    <button type="button" className="icon-btn icon-btn--sm" aria-label={`Move ${it.file.name} later`} disabled={i === items.length - 1 || busy} onClick={() => move(i, i + 1)}><ArrowRight size={15} /></button>
                    <button type="button" className="icon-btn icon-btn--sm" aria-label={`Remove ${it.file.name}`} disabled={busy} onClick={() => remove(it.id)}><Trash2 size={15} /></button>
                  </span>
                </span>
              </li>
            ))}
          </ol>
          {busy && <Progress value={progress} label="PDF creation progress" />}
          <div className="tool__actions">
            <button type="button" className="btn btn--primary btn--lg" onClick={convert} disabled={busy}>
              {busy ? <Loader2 size={18} className="spin" aria-hidden="true" /> : <Wand2 size={18} aria-hidden="true" />} {busy ? 'Creating PDF…' : `Create PDF (${items.length} page${items.length === 1 ? '' : 's'})`}
            </button>
            <button type="button" className="btn btn--ghost" disabled={busy} onClick={() => { items.forEach((i) => URL.revokeObjectURL(i.url)); setItems([]); setResult(null); }}><Trash2 size={16} aria-hidden="true" /> Clear all</button>
          </div>
        </>
      )}
      {result && (
        <div className="download-box" aria-live="polite">
          <p><FileImage size={16} aria-hidden="true" style={{ display: 'inline', verticalAlign: '-3px' }} /> <strong>Your PDF is ready</strong> — {items.length} page{items.length === 1 ? '' : 's'}, {formatBytes(result.blob.size)}.</p>
          <button type="button" className="btn btn--accent" onClick={() => downloadBlob(result.blob, `${items.length === 1 ? safeBaseName(items[0].file.name) : 'images'}.pdf`, 'jpg-to-pdf')}><Download size={18} aria-hidden="true" /> Download PDF</button>
        </div>
      )}
    </div>
  );
}

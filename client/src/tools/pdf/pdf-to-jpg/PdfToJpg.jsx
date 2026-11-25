import { useEffect, useRef, useState } from 'react';
import { Download, FileArchive, FileText, Loader2, Wand2 } from 'lucide-react';
import { Alert, Dropzone, FileBar, PrivacyNote, Progress } from '../../../components/ui';
import { isPdfFile } from '../../../utils/files';
import { pdfPageCount, pdfToImages } from '../../../utils/convert';
import { parsePageRanges } from '../../../utils/pages';
import { downloadBlob, safeBaseName } from '../../../utils/download';
import { formatBytes } from '../../../utils/format';
import { makeZip } from '../../../utils/zip';
import useTrackOnce from '../../../hooks/useTrackOnce';

export default function PdfToJpg() {
  const [doc, setDoc] = useState(null); // { file, bytes, pages }
  const [opts, setOpts] = useState({ format: 'image/jpeg', dpi: 150, range: '' });
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const imagesRef = useRef(images);
  imagesRef.current = images;
  const trackUse = useTrackOnce('pdf-to-jpg');
  const clearImages = () => { imagesRef.current.forEach((i) => URL.revokeObjectURL(i.url)); setImages([]); };
  useEffect(() => () => imagesRef.current.forEach((i) => URL.revokeObjectURL(i.url)), []);

  async function onFiles([f]) {
    setError(''); clearImages();
    if (!(await isPdfFile(f))) return setError(`"${f.name}" is not a PDF file.`);
    try {
      const bytes = new Uint8Array(await f.arrayBuffer());
      setDoc({ file: f, bytes, pages: await pdfPageCount(bytes) });
    } catch (e) { setError(e.message); }
  }

  const range = opts.range.trim() ? parsePageRanges(opts.range, doc?.pages || 0) : { pages: Array.from({ length: doc?.pages || 0 }, (_, i) => i) };
  const ext = opts.format === 'image/png' ? 'png' : 'jpg';
  const set = (k, v) => { setOpts({ ...opts, [k]: v }); clearImages(); };

  async function convert() {
    if (range.error) return;
    setBusy(true); setError(''); clearImages(); setProgress(0);
    try {
      await pdfToImages(doc.bytes, range.pages, { dpi: opts.dpi, type: opts.format, quality: 0.9 }, (img, p) => {
        setImages((l) => [...l, { ...img, url: URL.createObjectURL(img.blob) }]);
        setProgress(p);
      });
      trackUse({ pages: range.pages.length, dpi: opts.dpi });
    } catch (e) { setError(e.message || 'The pages could not be converted.'); }
    setBusy(false);
  }

  const name = (img) => `${safeBaseName(doc.file.name)}-page-${img.page}.${ext}`;
  const zipAll = async () => {
    const entries = await Promise.all(images.map(async (i) => ({ name: name(i), data: new Uint8Array(await i.blob.arrayBuffer()) })));
    downloadBlob(await makeZip(entries), `${safeBaseName(doc.file.name)}-${ext}.zip`, 'pdf-to-jpg');
  };

  if (!doc) {
    return (
      <div className="tool">
        <Dropzone accept="application/pdf,.pdf" onFiles={onFiles} title="Choose a PDF to convert to images" hint="Each page becomes one JPG or PNG image" />
        <PrivacyNote />
        {error && <Alert type="error">{error}</Alert>}
      </div>
    );
  }

  return (
    <div className="tool">
      <FileBar icon={FileText} name={doc.file.name} meta={`${doc.pages} page${doc.pages === 1 ? '' : 's'} · ${formatBytes(doc.file.size)}`} onClear={() => { setDoc(null); clearImages(); }} disabled={busy} clearLabel="Choose another PDF" />
      <div className="form-row">
        <div className="field">
          <label className="field__label" htmlFor="pj-f">Image format</label>
          <select id="pj-f" value={opts.format} onChange={(e) => set('format', e.target.value)}><option value="image/jpeg">JPG (smaller files)</option><option value="image/png">PNG (sharpest text, larger)</option></select>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="pj-d">Resolution</label>
          <select id="pj-d" value={opts.dpi} onChange={(e) => set('dpi', +e.target.value)}><option value={72}>72 DPI — screen, small</option><option value={150}>150 DPI — recommended</option><option value={300}>300 DPI — print quality</option></select>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="pj-r">Pages (empty = all)</label>
          <input id="pj-r" value={opts.range} placeholder={`e.g. 1-3, 5 (of ${doc.pages})`} onChange={(e) => set('range', e.target.value)} aria-invalid={!!range.error} />
          {range.error && <p className="field__error" role="alert">{range.error}</p>}
        </div>
      </div>
      {error && <Alert type="error">{error}</Alert>}
      {busy && <Progress value={progress} label="Conversion progress" />}
      <div className="tool__actions">
        <button type="button" className="btn btn--primary btn--lg" onClick={convert} disabled={busy || !!range.error}>
          {busy ? <Loader2 size={18} className="spin" aria-hidden="true" /> : <Wand2 size={18} aria-hidden="true" />} {busy ? `Converting… ${images.length}/${range.pages?.length}` : `Convert ${range.pages?.length || 0} page${range.pages?.length === 1 ? '' : 's'} to ${ext.toUpperCase()}`}
        </button>
        {images.length > 1 && !busy && <button type="button" className="btn btn--accent" onClick={zipAll}><FileArchive size={18} aria-hidden="true" /> Download all as ZIP</button>}
      </div>
      {images.length > 0 && (
        <ul className="img-grid" aria-label="Converted pages">
          {images.map((img) => (
            <li key={img.page} className="img-tile">
              <span className="img-tile__img"><img src={img.url} alt={`Page ${img.page} as image`} loading="lazy" /></span>
              <span className="img-tile__name">Page {img.page}</span>
              <span className="img-tile__row">
                <span>{img.width}×{img.height} · {formatBytes(img.blob.size)}</span>
                <button type="button" className="icon-btn icon-btn--sm" aria-label={`Download page ${img.page}`} onClick={() => downloadBlob(img.blob, name(img), 'pdf-to-jpg')}><Download size={15} /></button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

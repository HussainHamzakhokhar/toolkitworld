import { useEffect, useRef, useState } from 'react';
import { Download, Lock, LockOpen, RefreshCw, Scaling, Trash2 } from 'lucide-react';
import { Alert, Dropzone, PrivacyNote } from '../../../components/ui';
import { canvasToBlob, drawScaled, EXT, loadImage, MAX_OUTPUT_PIXELS, supportsWebpExport } from '../../../utils/image';
import { downloadBlob, safeBaseName } from '../../../utils/download';
import { formatBytes } from '../../../utils/format';
import useTrackOnce from '../../../hooks/useTrackOnce';

const PRESETS = [
  { label: '50%', pct: 50 }, { label: '25%', pct: 25 },
  { label: '1920 × 1080', w: 1920, h: 1080 }, { label: '1280 × 720', w: 1280, h: 720 },
  { label: '1080 × 1080', w: 1080, h: 1080 }, { label: '1080 × 1350', w: 1080, h: 1350 },
  { label: '1200 × 630', w: 1200, h: 630 }, { label: '800 × 600', w: 800, h: 600 },
];
const MIME = { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

export default function ImageResizer() {
  const [img, setImg] = useState(null); // { file, source, width, height, kind, url }
  const [w, setW] = useState('');
  const [h, setH] = useState('');
  const [lock, setLock] = useState(true);
  const [fit, setFit] = useState('stretch');
  const [format, setFormat] = useState('same');
  const [quality, setQuality] = useState(90);
  const [out, setOut] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [webp, setWebp] = useState(false);
  const trackUse = useTrackOnce('image-resizer');
  const outRef = useRef(null);
  outRef.current = out;

  useEffect(() => setWebp(supportsWebpExport()), []);
  useEffect(() => () => { if (outRef.current?.url) URL.revokeObjectURL(outRef.current.url); }, []);

  const clearOut = () => setOut((o) => { if (o?.url) URL.revokeObjectURL(o.url); return null; });

  async function onFiles([file]) {
    setError(''); clearOut();
    try {
      const loaded = await loadImage(file, ['jpeg', 'png', 'webp', 'gif', 'bmp']);
      if (img?.url) URL.revokeObjectURL(img.url);
      img?.source?.close?.();
      setImg({ file, ...loaded, url: URL.createObjectURL(file) });
      setW(String(loaded.width)); setH(String(loaded.height));
      setFormat(['jpeg', 'png', 'webp'].includes(loaded.kind) ? 'same' : 'png');
    } catch (e) { setError(e.message); }
  }

  const ratio = img ? img.width / img.height : 1;
  const setWidth = (v) => { const n = v.replace(/\D/g, ''); setW(n); if (lock && n) setH(String(Math.max(1, Math.round(+n / ratio)))); clearOut(); };
  const setHeight = (v) => { const n = v.replace(/\D/g, ''); setH(n); if (lock && n) setW(String(Math.max(1, Math.round(+n * ratio)))); clearOut(); };
  const applyPreset = (p) => {
    clearOut();
    if (p.pct) { setW(String(Math.max(1, Math.round((img.width * p.pct) / 100)))); setH(String(Math.max(1, Math.round((img.height * p.pct) / 100)))); return; }
    if (lock) { // fit inside the preset box, keeping proportions
      const s = Math.min(p.w / img.width, p.h / img.height);
      setW(String(Math.max(1, Math.round(img.width * s)))); setH(String(Math.max(1, Math.round(img.height * s))));
    } else { setW(String(p.w)); setH(String(p.h)); }
  };

  const outKind = format === 'same' ? (['jpeg', 'png', 'webp'].includes(img?.kind) ? img.kind : 'png') : format;
  const tw = parseInt(w, 10), th = parseInt(h, 10);
  const sizeError = img && (!(tw > 0) || !(th > 0)) ? 'Enter a width and height of at least 1 pixel.'
    : img && tw * th > MAX_OUTPUT_PIXELS ? `${tw}×${th} is too large for browsers to create (limit about ${Math.round(MAX_OUTPUT_PIXELS / 1e6)} megapixels).`
      : img && (tw > 20000 || th > 20000) ? 'Width and height can be at most 20,000 pixels.' : '';

  async function resize() {
    if (sizeError) return;
    setBusy(true); setError('');
    try {
      let source = img.source;
      if (!lock && fit === 'crop') { // crop the centre to the target aspect ratio first
        const target = tw / th;
        let sw = img.width, sh = img.height;
        if (img.width / img.height > target) sw = Math.round(img.height * target); else sh = Math.round(img.width / target);
        const c = document.createElement('canvas');
        c.width = sw; c.height = sh;
        c.getContext('2d').drawImage(img.source, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, sw, sh);
        source = c;
      }
      const mime = MIME[outKind];
      const canvas = drawScaled(source, tw, th, mime === 'image/jpeg' ? '#FFFFFF' : undefined);
      const blob = await canvasToBlob(canvas, mime, mime === 'image/png' ? undefined : quality / 100);
      canvas.width = canvas.height = 0;
      clearOut();
      setOut({ blob, url: URL.createObjectURL(blob), w: tw, h: th, ext: EXT[mime] });
      trackUse({ format: outKind });
    } catch (e) { setError(e.message); }
    setBusy(false);
  }

  const reset = () => { clearOut(); if (img?.url) URL.revokeObjectURL(img.url); img?.source?.close?.(); setImg(null); setError(''); };

  if (!img) {
    return (
      <div className="tool">
        <Dropzone accept="image/jpeg,image/png,image/webp,image/gif,image/bmp" onFiles={onFiles} title="Choose an image to resize" hint="JPG, PNG, WebP, GIF or BMP · up to 40 MB" />
        <PrivacyNote />
        {error && <Alert type="error">{error}</Alert>}
      </div>
    );
  }

  return (
    <div className="tool">
      <div className="resizer">
        <div className="resizer__preview">
          <div className="resizer__img checker">
            <img src={out ? out.url : img.url} alt={out ? 'Resized image preview' : `Original image: ${img.file.name}`} />
          </div>
          <dl className="dims">
            <div><dt>Original</dt><dd>{img.width} × {img.height}px · {formatBytes(img.file.size)}</dd></div>
            <div><dt>Output</dt><dd>{out ? `${out.w} × ${out.h}px · ${formatBytes(out.blob.size)}` : `${tw || '?'} × ${th || '?'}px (not created yet)`}</dd></div>
          </dl>
        </div>

        <div className="resizer__controls">
          <div className="dim-inputs">
            <div className="field">
              <label className="field__label" htmlFor="rs-w">Width (px)</label>
              <input id="rs-w" inputMode="numeric" value={w} onChange={(e) => setWidth(e.target.value)} />
            </div>
            <button type="button" className={`icon-btn lock-btn${lock ? ' is-active' : ''}`} aria-pressed={lock} aria-label="Keep aspect ratio"
              title="Keep aspect ratio" onClick={() => { setLock(!lock); if (!lock && tw) setH(String(Math.max(1, Math.round(tw / ratio)))); clearOut(); }}>
              {lock ? <Lock size={18} /> : <LockOpen size={18} />}
            </button>
            <div className="field">
              <label className="field__label" htmlFor="rs-h">Height (px)</label>
              <input id="rs-h" inputMode="numeric" value={h} onChange={(e) => setHeight(e.target.value)} />
            </div>
          </div>
          <p className="field__hint">{lock ? 'Aspect ratio locked: changing one side updates the other. Size presets fit inside the box.' : 'Aspect ratio unlocked: you can set any width and height.'}</p>

          <div className="field">
            <span className="field__label">Presets</span>
            <div className="chip-row">{PRESETS.map((p) => <button type="button" key={p.label} className="chip" onClick={() => applyPreset(p)}>{p.label}</button>)}</div>
          </div>

          {!lock && (
            <div className="field">
              <label className="field__label" htmlFor="rs-fit">When proportions change</label>
              <select id="rs-fit" value={fit} onChange={(e) => { setFit(e.target.value); clearOut(); }}>
                <option value="stretch">Stretch to the exact size</option>
                <option value="crop">Crop the centre to fill the size</option>
              </select>
            </div>
          )}

          <div className="form-row">
            <div className="field">
              <label className="field__label" htmlFor="rs-fmt">Format</label>
              <select id="rs-fmt" value={format} onChange={(e) => { setFormat(e.target.value); clearOut(); }}>
                {['jpeg', 'png', 'webp'].includes(img.kind) && <option value="same">Same as original ({img.kind.toUpperCase()})</option>}
                <option value="jpeg">JPG</option>
                <option value="png">PNG</option>
                {webp && <option value="webp">WebP</option>}
              </select>
            </div>
            {outKind !== 'png' && (
              <div className="field">
                <label className="field__label" htmlFor="rs-q">Quality: <strong>{quality}%</strong></label>
                <input id="rs-q" type="range" min={10} max={100} value={quality} onChange={(e) => { setQuality(+e.target.value); clearOut(); }} />
              </div>
            )}
          </div>
          {outKind === 'jpeg' && img.kind === 'png' && <p className="field__hint">Transparent areas become white in JPG.</p>}

          {sizeError && <Alert type="error">{sizeError}</Alert>}
          {error && <Alert type="error">{error}</Alert>}

          <div className="tool__actions">
            <button type="button" className="btn btn--primary" onClick={resize} disabled={busy || !!sizeError}>
              {busy ? <RefreshCw size={18} className="spin" aria-hidden="true" /> : <Scaling size={18} aria-hidden="true" />} {busy ? 'Resizing…' : 'Resize image'}
            </button>
            <button type="button" className="btn btn--ghost" onClick={reset}><Trash2 size={16} aria-hidden="true" /> New image</button>
          </div>
          {out && (
            <div className="download-box" aria-live="polite">
              <p>Your resized image is ready: <strong>{out.w} × {out.h}px</strong>, {formatBytes(out.blob.size)}.</p>
              <button type="button" className="btn btn--accent" onClick={() => downloadBlob(out.blob, `${safeBaseName(img.file.name)}-${out.w}x${out.h}.${out.ext}`, 'image-resizer')}>
                <Download size={18} aria-hidden="true" /> Download {out.ext.toUpperCase()}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Download, FileArchive, Loader2, Trash2, X } from 'lucide-react';
import { Alert, Dropzone, PrivacyNote } from '../../../components/ui';
import { canvasToBlob, drawScaled, EXT, loadImage } from '../../../utils/image';
import { downloadBlob, safeBaseName } from '../../../utils/download';
import { formatBytes } from '../../../utils/format';
import { makeZip } from '../../../utils/zip';
import useTrackOnce from '../../../hooks/useTrackOnce';

const MAX_FILES = 30;
let uid = 0;

/**
 * Batch image format converter used by JPG→PNG and PNG→JPG.
 * Every image is decoded and re-encoded locally with the Canvas API.
 */
export default function ImageConverter({ toolId, accept, allowedKinds, inputLabel, outputType, background, quality, optionsKey = '' }) {
  const [items, setItems] = useState([]);
  const [notice, setNotice] = useState('');
  const [zipping, setZipping] = useState(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const trackUse = useTrackOnce(toolId);
  const ext = EXT[outputType];

  const update = (id, patch) => setItems((list) => list.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  async function convert(item) {
    update(item.id, { status: 'working', error: '' });
    try {
      const { source, width, height } = await loadImage(item.file, allowedKinds);
      const canvas = drawScaled(source, width, height, background);
      source.close?.();
      const blob = await canvasToBlob(canvas, outputType, quality);
      canvas.width = canvas.height = 0; // free memory early
      const prevUrl = itemsRef.current.find((i) => i.id === item.id)?.url;
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      update(item.id, { status: 'done', blob, url: URL.createObjectURL(blob), width, height });
      trackUse();
    } catch (e) {
      update(item.id, { status: 'error', error: e.message || 'This image could not be converted.' });
    }
  }

  async function addFiles(files) {
    setNotice('');
    const room = MAX_FILES - itemsRef.current.length;
    if (room <= 0) return setNotice(`You can convert up to ${MAX_FILES} images at a time. Remove some first.`);
    if (files.length > room) setNotice(`Only the first ${room} images were added (limit ${MAX_FILES} at a time).`);
    const fresh = files.slice(0, room).map((file) => ({ id: ++uid, file, name: file.name, size: file.size, status: 'queued' }));
    setItems((list) => [...list, ...fresh]);
    for (const it of fresh) await convert(it); // one at a time keeps memory use low on phones
  }

  // Re-convert existing images when an option (quality, background) changes.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    const t = setTimeout(async () => { for (const it of itemsRef.current.filter((i) => i.status === 'done')) await convert(it); }, 350);
    return () => clearTimeout(t);
  }, [optionsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => itemsRef.current.forEach((i) => i.url && URL.revokeObjectURL(i.url)), []);

  const remove = (id) => setItems((list) => { const it = list.find((i) => i.id === id); if (it?.url) URL.revokeObjectURL(it.url); return list.filter((i) => i.id !== id); });
  const done = items.filter((i) => i.status === 'done');
  const outName = (it) => `${safeBaseName(it.name)}.${ext}`;

  const downloadAll = async () => {
    setZipping(true);
    try {
      const entries = await Promise.all(done.map(async (it) => ({ name: outName(it), data: new Uint8Array(await it.blob.arrayBuffer()) })));
      downloadBlob(await makeZip(entries), `converted-${ext}-images.zip`, toolId);
    } finally { setZipping(false); }
  };

  return (
    <div className="tool">
      <Dropzone accept={accept} multiple onFiles={addFiles} title={`Choose ${inputLabel} images`} hint={`Up to ${MAX_FILES} files, 40 MB each`} compact={items.length > 0} />
      <PrivacyNote />
      {notice && <Alert type="warning">{notice}</Alert>}

      {items.length > 0 && (
        <>
          <ul className="file-cards">
            {items.map((it) => (
              <li key={it.id} className={`file-card is-${it.status}`}>
                <div className={`file-card__thumb${outputType === 'image/png' ? ' checker' : ''}`}>
                  {it.url ? <img src={it.url} alt={`Converted preview of ${it.name}`} loading="lazy" /> : it.status === 'error' ? <X aria-hidden="true" /> : <Loader2 className="spin" aria-hidden="true" />}
                </div>
                <div className="file-card__info">
                  <p className="file-card__name" title={it.name}>{it.name}</p>
                  {it.status === 'done' && (
                    <p className="file-card__meta">
                      {it.width}×{it.height}px · {formatBytes(it.size)} <ArrowRight size={12} aria-hidden="true" /> <strong>{formatBytes(it.blob.size)}</strong>
                    </p>
                  )}
                  {(it.status === 'working' || it.status === 'queued') && <p className="file-card__meta">{it.status === 'working' ? 'Converting…' : 'Waiting…'}</p>}
                  {it.status === 'error' && <p className="file-card__error" role="alert">{it.error}</p>}
                </div>
                <div className="file-card__actions">
                  {it.status === 'done' && (
                    <button type="button" className="btn btn--primary btn--sm" onClick={() => downloadBlob(it.blob, outName(it), toolId)}>
                      <Download size={16} aria-hidden="true" /> {ext.toUpperCase()}
                    </button>
                  )}
                  <button type="button" className="icon-btn" aria-label={`Remove ${it.name}`} onClick={() => remove(it.id)}><Trash2 size={18} /></button>
                </div>
              </li>
            ))}
          </ul>
          <div className="tool__actions">
            {done.length > 1 && (
              <button type="button" className="btn btn--primary" onClick={downloadAll} disabled={zipping}>
                <FileArchive size={18} aria-hidden="true" /> {zipping ? 'Preparing ZIP…' : `Download all (${done.length}) as ZIP`}
              </button>
            )}
            <button type="button" className="btn btn--ghost" onClick={() => { items.forEach((i) => i.url && URL.revokeObjectURL(i.url)); setItems([]); }}><Trash2 size={16} aria-hidden="true" /> Clear all</button>
          </div>
        </>
      )}
    </div>
  );
}

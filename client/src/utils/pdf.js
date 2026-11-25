/**
 * PDF processing — 100% in the browser (or Node for tests). Libraries are
 * imported on demand so they never slow down unrelated pages.
 *   pdf-lib : merge, extract, re-save (structure)
 *   pdf.js  : render pages for thumbnails and image-based compression
 */
const loadPdfLib = () => import('pdf-lib');

let pdfjsPromise;
export function loadPdfJs() {
  pdfjsPromise ||= Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')]).then(([lib, worker]) => {
    lib.GlobalWorkerOptions.workerSrc = worker.default;
    return lib;
  });
  return pdfjsPromise;
}

export class PdfError extends Error {}

/** Loads a PDF with pdf-lib and converts low-level errors into clear messages. */
export async function openPdf(bytes, name = 'This file') {
  const { PDFDocument } = await loadPdfLib();
  try {
    const doc = await PDFDocument.load(bytes, { updateMetadata: false });
    if (doc.getPageCount() === 0) throw new PdfError(`${name} has no pages.`);
    return doc;
  } catch (err) {
    if (err instanceof PdfError) throw err;
    if (/encrypt/i.test(err?.message || '') || err?.name === 'EncryptedPDFError') {
      throw new PdfError(`${name} is password-protected or encrypted. Remove the protection in your PDF reader (you need the password), then try again.`);
    }
    throw new PdfError(`${name} could not be read. It may be damaged or not a real PDF.`);
  }
}

const saveOpts = { useObjectStreams: true, addDefaultPage: false };

/** Merges PDFs in the given order. `files` = [{ name, bytes }]. */
export async function mergePdfs(files, onProgress = () => {}) {
  const { PDFDocument } = await loadPdfLib();
  const out = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const src = await openPdf(files[i].bytes, `"${files[i].name}"`);
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
    onProgress((i + 1) / files.length);
  }
  out.setProducer('ToolKitWorld PDF Merger');
  return out.save(saveOpts);
}

/** Copies the given zero-based page indexes (in order) into a new PDF. */
export async function extractPages(bytes, indexes) {
  const { PDFDocument } = await loadPdfLib();
  const src = await openPdf(bytes);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, indexes);
  pages.forEach((p) => out.addPage(p));
  out.setProducer('ToolKitWorld PDF Splitter');
  return out.save(saveOpts);
}

/** Saves each selected page as its own PDF. Returns [{ page, bytes }]. */
export async function splitEach(bytes, indexes, onProgress = () => {}) {
  const { PDFDocument } = await loadPdfLib();
  const src = await openPdf(bytes);
  const results = [];
  for (let i = 0; i < indexes.length; i++) {
    const out = await PDFDocument.create();
    const [p] = await out.copyPages(src, [indexes[i]]);
    out.addPage(p);
    results.push({ page: indexes[i] + 1, bytes: await out.save(saveOpts) });
    onProgress((i + 1) / indexes.length);
  }
  return results;
}

export async function pageCount(bytes) {
  return (await openPdf(bytes)).getPageCount();
}

/**
 * Lossless "structure" compression: rewrites the file with compressed object
 * streams and, when safe, rebuilds it from its pages only, which drops unused
 * objects, old edit history and embedded metadata. Text, images and links
 * are untouched. Returns the smallest result.
 */
export async function compressStructure(bytes) {
  const { PDFDocument, PDFName } = await loadPdfLib();
  const src = await openPdf(bytes);
  const candidates = [await src.save(saveOpts)];
  const catalog = src.catalog;
  const hasFormsOrOutline = catalog.has(PDFName.of('AcroForm')) || catalog.has(PDFName.of('Outlines'));
  if (!hasFormsOrOutline) {
    const out = await PDFDocument.create();
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
    candidates.push(await out.save(saveOpts));
  }
  return candidates.reduce((a, b) => (b.byteLength < a.byteLength ? b : a));
}

const MAX_CANVAS_PIXELS = 16_000_000; // safe on iOS Safari

/**
 * Strong compression: renders every page to a JPEG image and rebuilds the
 * PDF from those images. Very effective for scans and photo-heavy files,
 * but text is no longer selectable or searchable. Browser only.
 */
export async function compressRasterize(bytes, { dpi = 120, quality = 0.7 } = {}, onProgress = () => {}) {
  const [pdfjs, { PDFDocument }] = await Promise.all([loadPdfJs(), loadPdfLib()]);
  let doc;
  const task = pdfjs.getDocument({ data: bytes.slice(0) });
  try {
    doc = await task.promise;
  } catch (err) {
    if (err?.name === 'PasswordException') throw new PdfError('This PDF is password-protected. Remove the protection first, then try again.');
    throw new PdfError('This PDF could not be read. It may be damaged.');
  }
  const out = await PDFDocument.create();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const base = page.getViewport({ scale: 1 });
    let scale = dpi / 72;
    if (base.width * base.height * scale * scale > MAX_CANVAS_PIXELS) scale = Math.sqrt(MAX_CANVAS_PIXELS / (base.width * base.height));
    const vp = page.getViewport({ scale });
    canvas.width = Math.floor(vp.width);
    canvas.height = Math.floor(vp.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvas, canvasContext: ctx, viewport: vp }).promise;
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
    const jpg = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
    const p = out.addPage([base.width, base.height]);
    p.drawImage(jpg, { x: 0, y: 0, width: base.width, height: base.height });
    page.cleanup();
    onProgress(i / doc.numPages);
  }
  canvas.width = canvas.height = 0;
  await task.destroy(); // pdf.js v6: destroy via the loading task
  out.setProducer('ToolKitWorld PDF Compressor');
  return out.save(saveOpts);
}

/**
 * Renders small page thumbnails one by one, calling onThumb(index, dataUrl).
 * Stops early when `isCancelled()` returns true (e.g. the user picked another file).
 */
export async function renderThumbnails(bytes, maxPages, width, onThumb, isCancelled = () => false) {
  const pdfjs = await loadPdfJs();
  const task = pdfjs.getDocument({ data: bytes.slice(0) });
  const doc = await task.promise;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  try {
    for (let i = 1; i <= Math.min(doc.numPages, maxPages); i++) {
      if (isCancelled()) break;
      const page = await doc.getPage(i);
      const base = page.getViewport({ scale: 1 });
      const vp = page.getViewport({ scale: (width * (window.devicePixelRatio || 1)) / base.width });
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvas, canvasContext: ctx, viewport: vp }).promise;
      onThumb(i - 1, canvas.toDataURL('image/jpeg', 0.7));
      page.cleanup();
    }
  } finally {
    await task.destroy();
  }
}

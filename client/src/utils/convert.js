/**
 * Document converters. Everything runs in the browser; each heavy library is
 * loaded only when a conversion actually starts.
 *   PDF → Word   : pdf.js (text + positions) → pdfLayout → docx
 *   PDF → Excel  : pdf.js → pdfLayout table detection → SheetJS
 *   Word → PDF   : mammoth (DOCX → HTML) → html-to-pdfmake → pdfmake
 *   Excel → PDF  : SheetJS (XLSX/XLS/ODS/CSV) → pdfmake tables
 *   Images → PDF : pdf-lib;  PDF → Images : pdf.js rendering
 */
import { loadPdfJs, PdfError } from './pdf';
import { bodySize, buildParagraphs, buildTable, groupLines, toCellValue } from './pdfLayout';

export async function loadPdfMake() {
  const [pm, vfs] = await Promise.all([import('pdfmake/build/pdfmake'), import('pdfmake/build/vfs_fonts')]);
  const pdfMake = pm.default || pm;
  pdfMake.addVirtualFileSystem(vfs.default || vfs);
  return pdfMake;
}

async function openWithPdfJs(bytes) {
  const pdfjs = await loadPdfJs();
  const task = pdfjs.getDocument({ data: bytes.slice(0) });
  try {
    return { task, doc: await task.promise };
  } catch (err) {
    await task.destroy();
    if (err?.name === 'PasswordException') throw new PdfError('This PDF is password-protected. Remove the protection in a PDF reader first (you need the password).');
    throw new PdfError('This PDF could not be read. It may be damaged or not a real PDF.');
  }
}

/** Extracts positioned text from every page, with bold/italic detected from font names. */
export async function extractPdfText(bytes, onProgress = () => {}) {
  const { task, doc } = await openWithPdfJs(bytes);
  const pages = [];
  try {
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const vp = page.getViewport({ scale: 1 });
      const content = await page.getTextContent();
      let fontInfo = () => ({});
      try {
        await page.getOperatorList(); // loads fonts so their real names (e.g. "Arial-BoldMT") are known
        fontInfo = (id) => { try { const f = page.commonObjs.get(id); return { name: f?.name || '', bold: !!f?.bold, italic: !!f?.italic }; } catch { return {}; } };
      } catch { /* styling is optional */ }
      const items = [];
      for (const it of content.items) {
        if (!it.str || !it.str.trim()) continue;
        const [a, b, , d, x, y] = it.transform;
        const size = Math.hypot(a, b) || Math.abs(d) || 10;
        const f = fontInfo(it.fontName);
        items.push({
          str: it.str, x, y, w: it.width, size,
          bold: f.bold || /bold|black|heavy|semibold|demi/i.test(f.name || ''),
          italic: f.italic || /italic|oblique/i.test(f.name || ''),
        });
      }
      pages.push({ width: vp.width, height: vp.height, items });
      page.cleanup();
      onProgress(n / doc.numPages);
    }
  } finally {
    await task.destroy();
  }
  const chars = pages.reduce((s, p) => s + p.items.reduce((t, i) => t + i.str.length, 0), 0);
  return { pages, chars, scanned: chars < pages.length * 15 };
}

// ---------------- PDF → Word ----------------
export async function pdfToDocx(extracted, { pageBreaks = true, headings = true } = {}) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak } = await import('docx');
  const all = extracted.pages.flatMap((p) => p.items);
  const body = bodySize(all);
  const children = [];
  let paragraphs = 0, words = 0;
  extracted.pages.forEach((page, i) => {
    const paras = buildParagraphs(groupLines(page.items), body);
    paras.forEach((p, j) => {
      const level = headings ? p.heading : 0;
      const halfPts = Math.round(Math.min(72, Math.max(8, level ? p.size : body)) * 2);
      const runs = p.runs.map((r) => new TextRun({ text: r.text, bold: r.bold || undefined, italics: r.italic || undefined, size: level ? undefined : halfPts }));
      if (pageBreaks && i > 0 && j === 0) runs.unshift(new PageBreak());
      children.push(new Paragraph({ children: runs, heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : undefined, spacing: { after: 120 } }));
      paragraphs++;
      words += p.runs.map((r) => r.text).join('').split(/\s+/).filter(Boolean).length;
    });
  });
  if (!children.length) children.push(new Paragraph(''));
  const document = new Document({
    creator: 'ToolKitWorld PDF to Word',
    styles: { default: { document: { run: { font: 'Calibri' } } } },
    sections: [{ properties: {}, children }],
  });
  return { blob: await Packer.toBlob(document), paragraphs, words, preview: previewParas(extracted, body) };
}

function previewParas(extracted, body) {
  const out = [];
  for (const page of extracted.pages) {
    for (const p of buildParagraphs(groupLines(page.items), body)) {
      out.push({ heading: p.heading, text: p.runs.map((r) => r.text).join('') });
      if (out.length >= 12) return out;
    }
  }
  return out;
}

// ---------------- PDF → Excel ----------------
export async function pdfToXlsx(extracted, { onePerPage = true, numbers = true } = {}) {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();
  const tables = extracted.pages.map((p) => buildTable(groupLines(p.items)));
  const toSheet = (rows) => {
    const aoa = rows.map((r) => r.map((c) => {
      if (!numbers) return c;
      const v = toCellValue(c);
      return v.t === 'n' ? v : c;
    }));
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const widths = [];
    rows.forEach((r) => r.forEach((c, i) => (widths[i] = Math.min(60, Math.max(widths[i] || 8, String(c).length + 2)))));
    ws['!cols'] = widths.map((wch) => ({ wch }));
    return ws;
  };
  if (onePerPage) tables.forEach((rows, i) => XLSX.utils.book_append_sheet(wb, toSheet(rows.length ? rows : [['(no text on this page)']]), `Page ${i + 1}`));
  else XLSX.utils.book_append_sheet(wb, toSheet(tables.flatMap((rows, i) => (i ? [[], ...rows] : rows))), 'Sheet1');
  const out = XLSX.write(wb, { type: 'array', bookType: 'xlsx', compression: true });
  return {
    blob: new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    rows: tables.reduce((s, t) => s + t.length, 0),
    cols: Math.max(0, ...tables.flat().map((r) => r.length)),
    preview: tables.find((t) => t.length)?.slice(0, 15) || [],
  };
}

// ---------------- Word → PDF ----------------
const SAFE_IMG = /^data:image\/(png|jpe?g);base64,/i;

/** Converts .docx to clean, safe HTML (also used for the on-page preview). */
export async function docxToHtml(arrayBuffer) {
  const mod = await import('mammoth/mammoth.browser.js');
  const mammoth = mod.default || mod;
  let result;
  try {
    result = await mammoth.convertToHtml({ arrayBuffer });
  } catch {
    throw new Error('This file could not be read as a Word document. Only .docx files are supported — open .doc files in Word or LibreOffice and save them as .docx first.');
  }
  // Sanitise: keep only safe links and PNG/JPEG images; drop anything executable.
  const doc = new DOMParser().parseFromString(`<div>${result.value}</div>`, 'text/html');
  doc.querySelectorAll('script,style,iframe,object,embed').forEach((n) => n.remove());
  let droppedImages = 0;
  doc.querySelectorAll('*').forEach((el) => {
    for (const a of [...el.attributes]) if (/^on/i.test(a.name)) el.removeAttribute(a.name);
    if (el.tagName === 'A' && !/^(https?:|mailto:|#)/i.test(el.getAttribute('href') || '')) el.removeAttribute('href');
    if (el.tagName === 'IMG' && !SAFE_IMG.test(el.getAttribute('src') || '')) { el.remove(); droppedImages++; }
  });
  const html = doc.body.firstElementChild.innerHTML;
  const text = doc.body.textContent || '';
  return { html, words: text.split(/\s+/).filter(Boolean).length, droppedImages, warnings: result.messages.filter((m) => m.type === 'warning').length };
}

const PAGE_SIZES = { A4: [595.28, 841.89], LETTER: [612, 792] };

export async function htmlToPdf(html, { pageSize = 'A4', margin = 56, fontSize = 11, title = 'Document' } = {}) {
  const [pdfMake, h2p] = await Promise.all([loadPdfMake(), import('html-to-pdfmake')]);
  const htmlToPdfmake = h2p.default || h2p;
  const content = htmlToPdfmake(html || '<p></p>', { window, tableAutoSize: true });
  const [w, h] = PAGE_SIZES[pageSize];
  const maxW = w - margin * 2, maxH = h - margin * 2;
  const fitImages = (node) => {
    if (Array.isArray(node)) return node.forEach(fitImages);
    if (!node || typeof node !== 'object') return;
    if (node.image) { delete node.width; delete node.height; node.fit = [maxW, maxH]; }
    Object.values(node).forEach((v) => typeof v === 'object' && fitImages(v));
  };
  fitImages(content);
  const def = {
    info: { title, creator: 'ToolKitWorld Word to PDF' },
    pageSize, pageMargins: margin, content,
    defaultStyle: { fontSize, lineHeight: 1.25 },
    styles: { 'html-h1': { fontSize: fontSize * 2, bold: true, marginBottom: 8 }, 'html-h2': { fontSize: fontSize * 1.6, bold: true, marginBottom: 6 }, 'html-h3': { fontSize: fontSize * 1.3, bold: true, marginBottom: 4 }, 'html-p': { marginBottom: 6 } },
  };
  return pdfMake.createPdf(def).getBlob();
}

// ---------------- Excel → PDF ----------------
export async function readWorkbook(arrayBuffer) {
  const XLSX = await import('xlsx');
  let wb;
  try {
    wb = XLSX.read(arrayBuffer, { type: 'array', cellDates: true, dense: false });
  } catch (err) {
    if (/password|encrypt/i.test(err?.message || '')) throw new Error('This spreadsheet is password-protected. Remove the password in Excel first.');
    throw new Error('This file could not be read as a spreadsheet. Supported formats: XLSX, XLS, ODS and CSV.');
  }
  const sheets = wb.SheetNames.map((name) => {
    const ws = wb.Sheets[name];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '', blankrows: true });
    // Trim empty trailing rows and columns.
    while (rows.length && rows[rows.length - 1].every((c) => String(c).trim() === '')) rows.pop();
    let cols = 0;
    rows.forEach((r) => r.forEach((c, i) => { if (String(c).trim() !== '') cols = Math.max(cols, i + 1); }));
    const range = ws['!ref'] ? XLSX.utils.decode_range(ws['!ref']) : { s: { r: 0, c: 0 } };
    return { name, rows: rows.map((r) => Array.from({ length: cols }, (_, i) => String(r[i] ?? ''))), cols, merges: ws['!merges'] || [], origin: range.s };
  });
  return sheets;
}

export async function sheetsToPdf(sheets, { orientation = 'auto', pageSize = 'A4', gridlines = true, headerRow = true } = {}) {
  const pdfMake = await loadPdfMake();
  const content = [];
  sheets.forEach((s, si) => {
    if (!s.rows.length || !s.cols) return;
    const landscape = orientation === 'landscape' || (orientation === 'auto' && s.cols > 6);
    const fontSize = s.cols > 16 ? 5.5 : s.cols > 12 ? 6.5 : s.cols > 8 ? 8 : 9;
    const body = s.rows.map((r, ri) => r.map((c) => ({ text: c, bold: headerRow && ri === 0, fillColor: headerRow && ri === 0 ? '#EFF6FF' : undefined })));
    // Merged cells → colSpan/rowSpan (covered cells must stay as empty placeholders).
    for (const m of s.merges) {
      const r0 = m.s.r - s.origin.r, c0 = m.s.c - s.origin.c;
      if (body[r0]?.[c0]) {
        if (m.e.c > m.s.c) body[r0][c0].colSpan = Math.min(m.e.c - m.s.c + 1, s.cols - c0);
        if (m.e.r > m.s.r) body[r0][c0].rowSpan = Math.min(m.e.r - m.s.r + 1, body.length - r0);
      }
    }
    content.push({
      stack: [
        { text: s.name, bold: true, fontSize: 12, margin: [0, 0, 0, 8], color: '#0F172A' },
        {
          table: { headerRows: headerRow ? 1 : 0, dontBreakRows: true, widths: Array(s.cols).fill(s.cols > 6 ? '*' : 'auto'), body },
          layout: gridlines ? { hLineColor: '#CBD5E1', vLineColor: '#CBD5E1', hLineWidth: () => 0.5, vLineWidth: () => 0.5 } : 'noBorders',
          fontSize,
        },
      ],
      pageOrientation: landscape ? 'landscape' : 'portrait',
      pageBreak: si > 0 && content.length ? 'before' : undefined,
    });
  });
  if (!content.length) throw new Error('The selected sheets are empty.');
  return pdfMake.createPdf({
    info: { title: 'Spreadsheet', creator: 'ToolKitWorld Excel to PDF' },
    pageSize, pageOrientation: content[0].pageOrientation, // later sheets switch orientation at their page break
    pageMargins: 32, content, defaultStyle: { fontSize: 9 },
    footer: (page, pages) => ({ text: `${page} / ${pages}`, alignment: 'center', fontSize: 7, color: '#64748B', margin: [0, 10, 0, 0] }),
  }).getBlob();
}

// ---------------- Images → PDF ----------------
/** Reads the EXIF orientation of a JPEG (1 = normal). Phones often store photos rotated. */
export function jpegOrientation(bytes) {
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (v.getUint16(0) !== 0xffd8) return 1;
  let off = 2;
  while (off + 4 < v.byteLength) {
    const marker = v.getUint16(off);
    const len = v.getUint16(off + 2);
    if (marker === 0xffe1 && v.getUint32(off + 4) === 0x45786966) {
      const tiff = off + 10;
      const le = v.getUint16(tiff) === 0x4949;
      const entries = v.getUint16(tiff + v.getUint32(tiff + 4, le), le);
      const dir = tiff + v.getUint32(tiff + 4, le) + 2;
      for (let i = 0; i < entries; i++) {
        const e = dir + i * 12;
        if (e + 10 > v.byteLength) break;
        if (v.getUint16(e, le) === 0x0112) return v.getUint16(e + 8, le);
      }
      return 1;
    }
    if ((marker & 0xff00) !== 0xff00) break;
    off += 2 + len;
  }
  return 1;
}

const PAGE = { A4: [595.28, 841.89], LETTER: [612, 792] };

/** images: [{ bytes, kind, source(ImageBitmap|canvas), width, height }] in order. */
export async function imagesToPdf(images, { pageSize = 'A4', orientation = 'auto', margin = 24 } = {}, onProgress = () => {}) {
  const { PDFDocument } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  for (let i = 0; i < images.length; i++) {
    const im = images[i];
    let embedded;
    if (im.kind === 'jpeg' && jpegOrientation(im.bytes) === 1) embedded = await pdf.embedJpg(im.bytes); // original quality, no re-encoding
    else if (im.kind === 'png') embedded = await pdf.embedPng(im.bytes);
    else {
      // Rotated JPEGs, WebP, GIF, BMP: redraw upright via canvas, then embed as high-quality JPEG.
      const c = document.createElement('canvas');
      c.width = im.width; c.height = im.height;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(im.source, 0, 0);
      const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.92));
      embedded = await pdf.embedJpg(new Uint8Array(await blob.arrayBuffer()));
      c.width = c.height = 0;
    }
    const iw = im.width, ih = im.height;
    let pw, ph;
    if (pageSize === 'FIT') { pw = iw * 0.75 + margin * 2; ph = ih * 0.75 + margin * 2; } // 96 dpi → points
    else {
      [pw, ph] = PAGE[pageSize];
      const land = orientation === 'landscape' || (orientation === 'auto' && iw > ih);
      if (land) [pw, ph] = [ph, pw];
    }
    const scale = Math.min((pw - margin * 2) / iw, (ph - margin * 2) / ih, pageSize === 'FIT' ? 0.75 : Infinity);
    const w = iw * scale, h = ih * scale;
    pdf.addPage([pw, ph]).drawImage(embedded, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
    onProgress((i + 1) / images.length);
  }
  pdf.setProducer('ToolKitWorld JPG to PDF');
  return pdf.save({ useObjectStreams: true });
}

// ---------------- PDF → Images ----------------
export async function pdfToImages(bytes, pageIndexes, { dpi = 150, type = 'image/jpeg', quality = 0.9 } = {}, onImage = () => {}) {
  const { task, doc } = await openWithPdfJs(bytes);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  try {
    for (let i = 0; i < pageIndexes.length; i++) {
      const page = await doc.getPage(pageIndexes[i] + 1);
      const base = page.getViewport({ scale: 1 });
      let scale = dpi / 72;
      if (base.width * base.height * scale * scale > 16_000_000) scale = Math.sqrt(16_000_000 / (base.width * base.height));
      const vp = page.getViewport({ scale });
      canvas.width = Math.floor(vp.width); canvas.height = Math.floor(vp.height);
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvas, canvasContext: ctx, viewport: vp }).promise;
      const blob = await new Promise((r) => canvas.toBlob(r, type, quality));
      onImage({ page: pageIndexes[i] + 1, blob, width: canvas.width, height: canvas.height }, (i + 1) / pageIndexes.length);
      page.cleanup();
    }
  } finally {
    canvas.width = canvas.height = 0;
    await task.destroy();
  }
}

export const pdfPageCount = async (bytes) => {
  const { task, doc } = await openWithPdfJs(bytes);
  const n = doc.numPages;
  await task.destroy();
  return n;
};

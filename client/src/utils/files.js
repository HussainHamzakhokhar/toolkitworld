/**
 * File validation helpers. We check the real file signature ("magic bytes"),
 * not just the extension or the MIME type the browser reports, because both
 * can be wrong or spoofed.
 */
const SIGNATURES = {
  jpeg: [[0xff, 0xd8, 0xff]],
  png: [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  webp: [[0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50]],
  gif: [[0x47, 0x49, 0x46, 0x38]],
  bmp: [[0x42, 0x4d]],
  pdf: [[0x25, 0x50, 0x44, 0x46]], // %PDF
};

export function matchesSignature(bytes, kind) {
  return (SIGNATURES[kind] || []).some((sig) => sig.every((b, i) => b === null || bytes[i] === b));
}

export async function detectType(file) {
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  return Object.keys(SIGNATURES).find((k) => matchesSignature(head, k)) || null;
}

/** For PDFs the header may appear within the first 1KB (allowed by the spec). */
export async function isPdfFile(file) {
  const head = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
  for (let i = 0; i < head.length - 4; i++) {
    if (head[i] === 0x25 && head[i + 1] === 0x50 && head[i + 2] === 0x44 && head[i + 3] === 0x46 && head[i + 4] === 0x2d) return true;
  }
  return false;
}

export const MB = 1024 * 1024;

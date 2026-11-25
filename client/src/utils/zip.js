/** Builds a ZIP file in the browser (fflate is loaded only when needed). */
export async function makeZip(entries) {
  const { zipSync } = await import('fflate');
  const files = {};
  const used = new Set();
  for (const { name, data } of entries) {
    let n = name, i = 1;
    while (used.has(n)) n = name.replace(/(\.[^.]+)?$/, ` (${i++})$1`);
    used.add(n);
    files[n] = [data instanceof Uint8Array ? data : new Uint8Array(data), { level: 0 }]; // already-compressed formats
  }
  return new Blob([zipSync(files)], { type: 'application/zip' });
}

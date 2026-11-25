import { track } from './analytics';

/** Triggers a browser download for a Blob, then frees the memory. */
export function downloadBlob(blob, filename, toolId) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
  track('file_download', { tool: toolId, file_extension: filename.split('.').pop() });
}

export const downloadText = (text, filename, toolId) =>
  downloadBlob(new Blob([text], { type: 'text/plain;charset=utf-8' }), filename, toolId);

/** Makes a safe output file name from an untrusted uploaded name. */
export function safeBaseName(name = 'file') {
  const base = name.replace(/\.[^.]+$/, '').replace(/[^\p{L}\p{N}._ -]+/gu, '').trim().slice(0, 80);
  return base || 'file';
}

/** Copies text to the clipboard. Returns true on success. */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

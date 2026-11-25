/**
 * Image processing with the browser's Canvas API. Nothing is uploaded.
 */
import { detectType, MB } from './files';

export const MAX_FILE_SIZE = 40 * MB;
export const MAX_PIXELS = 50_000_000; // 50 megapixels — beyond this many phones run out of memory
export const MAX_OUTPUT_PIXELS = 16_700_000; // iOS Safari canvas limit

const TYPE_LABEL = { jpeg: 'JPG', png: 'PNG', webp: 'WebP', gif: 'GIF', bmp: 'BMP' };

/**
 * Validates and decodes an uploaded image.
 * `allowed` = array of detected kinds, e.g. ['jpeg'].
 */
export async function loadImage(file, allowed) {
  if (!file || file.size === 0) throw new Error(`"${file?.name || 'File'}" is empty.`);
  if (file.size > MAX_FILE_SIZE) throw new Error(`"${file.name}" is larger than ${MAX_FILE_SIZE / MB} MB.`);
  const kind = await detectType(file);
  if (!kind || !allowed.includes(kind)) {
    const expected = allowed.map((k) => TYPE_LABEL[k]).join(' or ');
    const actual = kind ? `a ${TYPE_LABEL[kind]} image` : 'not a supported image';
    throw new Error(`"${file.name}" is ${actual}. Please choose a ${expected} file.`);
  }
  let source;
  try {
    source = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    source = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`"${file.name}" could not be decoded. The file may be damaged.`));
      img.src = URL.createObjectURL(file);
    });
  }
  const width = source.width || source.naturalWidth, height = source.height || source.naturalHeight;
  if (width * height > MAX_PIXELS) {
    source.close?.();
    throw new Error(`"${file.name}" is ${width}×${height} pixels, which is too large to process safely in a browser (limit ${MAX_PIXELS / 1e6} megapixels).`);
  }
  return { source, width, height, kind };
}

/**
 * Draws `source` onto a new canvas at the target size. For big reductions the
 * image is halved in steps first, which gives noticeably sharper results than
 * a single large downscale.
 */
export function drawScaled(source, width, height, background) {
  if (width * height > MAX_OUTPUT_PIXELS) {
    throw new Error(`The output size ${width}×${height} is too large for browsers to create. Keep it under about ${Math.round(MAX_OUTPUT_PIXELS / 1e6)} megapixels.`);
  }
  let src = source, sw = source.width, sh = source.height;
  while (sw / 2 >= width && sh / 2 >= height) {
    const step = document.createElement('canvas');
    step.width = Math.round(sw / 2);
    step.height = Math.round(sh / 2);
    const sctx = step.getContext('2d');
    sctx.imageSmoothingQuality = 'high';
    sctx.drawImage(src, 0, 0, step.width, step.height);
    src = step; sw = step.width; sh = step.height;
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(src, 0, 0, width, height);
  return canvas;
}

export function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Your browser could not create the image. Try a smaller size.'))), type, quality));
}

let webp;
export function supportsWebpExport() {
  if (webp === undefined) {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    webp = c.toDataURL('image/webp').startsWith('data:image/webp');
  }
  return webp;
}

export const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };

export default {
  intro: 'Convert PNG images to JPG with your choice of quality and background colour. JPG files are usually much smaller, which makes them ideal for email, websites and uploads with size limits.',
  howTo: [
    'Pick a background colour. It fills any transparent parts of your PNG, because JPG cannot store transparency.',
    'Set the JPG quality. Around 85–90% looks almost identical to the original at a much smaller size.',
    'Choose or drop your PNG files. They convert instantly; changing quality or background re-converts them.',
    'Download each JPG, or all of them as a ZIP.',
  ],
  explanationTitle: 'How PNG to JPG conversion works',
  explanation: (
    <>
      <p>
        The browser first paints your chosen background colour onto a canvas, then draws the PNG on top, so transparent and semi-transparent pixels blend
        with the background instead of turning black. The result is encoded as a JPG at the quality you selected.
      </p>
      <p>
        JPG uses <em>lossy</em> compression: it discards fine detail that the eye notices least. That makes photos far smaller, but sharp edges — text,
        line art, logos and screenshots — can show slight blur or “ringing” at lower quality. For those images, keep quality high or stay with PNG.
      </p>
      <p>Each file’s contents are checked to make sure it really is a PNG. Images never leave your device.</p>
    </>
  ),
  examples: [
    { title: 'Shrinking a photo for email', body: 'A 6.8 MB PNG photo saved as JPG at 85% quality is often under 1 MB, with no visible difference.' },
    { title: 'Logo on white', body: 'A transparent logo converted with a white background is ready for documents and forms that need JPG.' },
    { title: 'Dark theme graphics', body: 'Choose a black background for an image that will appear on a dark web page.' },
  ],
  benefits: [
    'Much smaller files for faster websites and easier sharing.',
    'You control how transparency is handled, instead of getting black backgrounds.',
    'Quality slider to balance size and sharpness.',
    'Converts in batches with a ZIP download.',
  ],
  faqs: [
    ['Why does my transparent PNG get a background?', 'JPG has no transparency channel, so every pixel needs a colour. Choose the background that matches where the image will be used.'],
    ['What quality should I choose?', 'For photos, 80–90% is usually indistinguishable from the original. For text or screenshots, use 90% or more.'],
    ['Will converting reduce the file size?', 'Almost always for photos. Simple graphics with few colours can occasionally be smaller as PNG.'],
    ['Can I convert JPG back to PNG later?', 'Yes, but detail removed by JPG compression cannot be restored.'],
    ['Is there a limit on how many files I can convert?', 'You can convert up to 30 images at once and repeat as often as you like.'],
  ],
};

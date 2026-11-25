export default {
  intro: 'Resize photos and graphics to an exact width and height in pixels, by percentage, or to common sizes for social media and websites. Keep the aspect ratio or crop to fill.',
  howTo: [
    'Choose an image (JPG, PNG, WebP, GIF or BMP). Its original dimensions and file size are shown.',
    'Type a new width or height. With the lock on, the other side updates automatically to keep proportions.',
    'Or pick a preset such as 50% or 1080 × 1080. Unlock the ratio to set any size, then choose to stretch or crop.',
    'Choose the output format and quality, press “Resize image”, check the preview and download the result.',
  ],
  explanationTitle: 'How resizing works',
  explanation: (
    <>
      <p>
        Resizing redraws the image at the new number of pixels using your browser’s high-quality smoothing. For big reductions, the image is halved in steps
        before the final resize, which keeps edges sharper than one large jump. Everything happens on your device.
      </p>
      <p>
        <strong>Aspect ratio</strong> is the relationship between width and height. Keeping it locked avoids stretched or squashed results. When you need an
        exact shape that differs from your photo — such as a square from a landscape photo — “Crop the centre” trims the edges instead of distorting the image.
      </p>
      <p>
        Making an image smaller always discards detail; making it larger cannot add real detail, so enlarged images look softer. To make a file smaller in
        megabytes, reduce the dimensions and choose JPG or WebP with a quality around 80%.
      </p>
    </>
  ),
  examples: [
    { title: 'Instagram square', body: 'Unlock the ratio, choose 1080 × 1080 and “Crop the centre” to turn a 4000 × 3000 photo into a perfect square.' },
    { title: 'Faster website', body: 'A 6000 × 4000 camera photo resized to 1600 × 1067 as JPG at 80% typically drops from several megabytes to a few hundred kilobytes.' },
    { title: 'Document upload limit', body: 'A form needs an image under 1 MB. Use the 50% preset and JPG at 85% quality, then check the output size before downloading.' },
  ],
  benefits: [
    'Exact pixel control plus handy presets for social media and the web.',
    'Keeps proportions automatically, or crops cleanly to a new shape.',
    'Export as JPG, PNG or WebP (where your browser supports it).',
    'Private and instant — no upload queue.',
  ],
  faqs: [
    ['Will resizing reduce the quality of my image?', 'Reducing size discards some detail but usually looks sharp. Enlarging beyond the original makes images softer because no new detail can be created.'],
    ['How do I reduce the file size in KB or MB?', 'Make the dimensions smaller and save as JPG or WebP with quality around 75–85%. The output size is shown before you download.'],
    ['What is the best size for social media?', 'Common sizes include 1080 × 1080 (square posts), 1080 × 1350 (portrait posts) and 1200 × 630 (link previews). Platforms change their recommendations, so check their help pages.'],
    ['Why is WebP not offered?', 'Some browsers, especially older Safari versions, cannot create WebP images. Use JPG or PNG instead.'],
    ['Does resizing keep my photo’s metadata?', 'No. The resized image does not contain camera or GPS metadata.'],
  ],
};

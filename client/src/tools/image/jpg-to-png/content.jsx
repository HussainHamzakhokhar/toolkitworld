export default {
  intro: 'Convert JPG and JPEG photos to PNG right in your browser. Add several images at once, preview the results and download them one by one or together as a ZIP file.',
  howTo: [
    'Click “Choose JPG images” or drag your .jpg / .jpeg files onto the box. You can add up to 30 at a time.',
    'Each image is converted to PNG straight away. Check the preview and the file size.',
    'Press the PNG button next to an image to download it, or “Download all as ZIP” for several.',
    'Use the bin icon to remove an image, or “Clear all” to start again.',
  ],
  explanationTitle: 'What happens during conversion',
  explanation: (
    <>
      <p>
        Your browser decodes the JPG into pixels, draws them onto an invisible canvas, and saves that canvas as a PNG. The whole process happens on your device;
        nothing is uploaded. The tool checks each file’s actual contents, not just its name, and rejects files that are not real JPEGs.
      </p>
      <p>
        PNG is <em>lossless</em>, so the PNG keeps every pixel of the JPG exactly. However, it cannot bring back detail that JPG compression already removed, and
        PNG files of photographs are usually <strong>larger</strong> than the original JPG — often 2 to 5 times. Converting makes sense when you need PNG
        specifically: for further editing without additional quality loss, for software that only accepts PNG, or as a base for adding transparency.
      </p>
      <p>Photo orientation from the camera is applied, and metadata such as camera model and GPS location is not carried over to the PNG.</p>
    </>
  ),
  examples: [
    { title: 'Uploading to a system that requires PNG', body: 'A form only accepts PNG files. Convert your 2 MB scan.jpg to scan.png and upload that instead.' },
    { title: 'Editing without further loss', body: 'Convert to PNG before repeated edits, so re-saving does not add new JPG compression artefacts each time.' },
    { title: 'Batch conversion', body: 'Convert 12 product photos at once and download them all in one ZIP.' },
  ],
  benefits: [
    'No upload and no waiting for a server — conversion is instant.',
    'Batch conversion with a single ZIP download.',
    'Removes location and camera metadata from photos.',
    'No watermark, account or file count limit per day.',
  ],
  faqs: [
    ['Does converting JPG to PNG improve quality?', 'No. PNG preserves the image exactly as it is, but cannot restore detail lost when the JPG was saved.'],
    ['Why is my PNG bigger than the JPG?', 'JPG uses lossy compression designed for photos; PNG stores every pixel exactly. For photos, PNG files are almost always larger.'],
    ['Will the PNG have a transparent background?', 'No. JPG has no transparency, so the PNG will have the same solid background. You would need an editor to remove the background.'],
    ['Can I convert on my phone?', 'Yes. The converter works in mobile browsers. Very large photos (over about 50 megapixels) are rejected to avoid running out of memory.'],
    ['Are my photos uploaded?', 'No. Conversion uses your browser’s built-in graphics engine on your own device.'],
  ],
};

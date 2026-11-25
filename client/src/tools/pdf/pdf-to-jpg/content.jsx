export default {
  intro: 'Save the pages of a PDF as JPG or PNG images — one image per page. Choose the resolution and which pages to convert, then download images individually or all together as a ZIP.',
  howTo: [
    'Choose a PDF. The number of pages is shown.',
    'Pick JPG (smaller files) or PNG (sharpest text), and a resolution: 150 DPI suits screens; 300 DPI suits printing.',
    'Leave the page box empty to convert every page, or type pages such as 1-3, 5.',
    'Press “Convert”, then download single pages or “Download all as ZIP”.',
  ],
  explanationTitle: 'How PDF pages become images',
  explanation: (
    <>
      <p>
        Each page is drawn by Mozilla’s PDF.js — the same engine Firefox uses to display PDFs — at the resolution you choose, then saved as an image. DPI (dots
        per inch) controls the pixel size: an A4 page is about 1240 × 1754 pixels at 150 DPI and 2480 × 3508 pixels at 300 DPI.
      </p>
      <p>
        JPG gives much smaller files and is ideal for photos and slides; PNG keeps text and line drawings perfectly crisp but files are larger. Images contain
        the page as a picture, so the text in them is no longer selectable. Very large pages are reduced automatically to stay within browser memory limits.
      </p>
    </>
  ),
  examples: [
    { title: 'A slide for social media', body: 'Convert page 4 of a presentation PDF to JPG at 150 DPI and post it as an image.' },
    { title: 'Inserting a page into a document', body: 'Turn a PDF diagram into a PNG to paste into Word or PowerPoint.' },
    { title: 'Print-quality images', body: 'Export all pages of a brochure at 300 DPI as a ZIP of images for a print shop.' },
  ],
  benefits: [
    'Choose exactly which pages to convert.',
    'Screen or print resolution with a clear size trade-off.',
    'Preview every page before downloading.',
    'Private: the PDF is rendered on your device.',
  ],
  faqs: [
    ['Which resolution should I choose?', '150 DPI is a good default for screens and sharing. Use 300 DPI for printing, and 72 DPI for small previews.'],
    ['JPG or PNG?', 'JPG for smaller files and photos; PNG for text-heavy pages and diagrams where you want perfectly sharp edges.'],
    ['Can I convert only one page?', 'Yes. Type its number, for example 4, in the Pages box.'],
    ['Will the text in the image be searchable?', 'No. Images are pictures of the page; text in them can’t be selected.'],
    ['Is my PDF uploaded?', 'No. The pages are drawn in your browser.'],
  ],
};

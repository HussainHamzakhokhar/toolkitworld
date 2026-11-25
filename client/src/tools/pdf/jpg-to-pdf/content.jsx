export default {
  intro: 'Combine JPG, PNG and other images into a single PDF — perfect for scanned pages, receipts and photos of documents. Put the pages in any order and keep the original image quality.',
  howTo: [
    'Choose one or more images (JPG, PNG, WebP, GIF or BMP). You can add more at any time.',
    'Drag the thumbnails, or use the arrows, to put the pages in order.',
    'Choose the page size (A4, US Letter or the same size as each image), orientation and margin.',
    'Press “Create PDF” and download your document.',
  ],
  explanationTitle: 'How images become a PDF',
  explanation: (
    <>
      <p>
        Each image becomes one page. JPG photos are placed into the PDF <strong>as they are</strong>, without re-compressing, so there is no loss of quality.
        Photos taken on phones often store their rotation separately; those images are turned upright first, so pages never come out sideways. PNG images
        keep their full quality; WebP, GIF and BMP images are converted to high-quality JPEG first.
      </p>
      <p>
        With A4 or Letter pages, every image is scaled to fit inside the margins and centred, and “Automatic” orientation turns the page to landscape for wide
        images. “Same as image” makes each page exactly the size of its picture. The PDF is created with pdf-lib entirely in your browser.
      </p>
    </>
  ),
  examples: [
    { title: 'Phone photos of a document', body: 'Take a photo of each page, add them in order and create a single PDF to email or upload.' },
    { title: 'Expense receipts', body: 'Combine 15 receipt photos into one PDF for your expense claim.' },
    { title: 'A photo portfolio', body: 'Use “Same as image” and no margin to turn photos into a borderless PDF portfolio.' },
  ],
  benefits: [
    'No quality loss for JPG photos.',
    'Automatic rotation fix for phone photos.',
    'Easy drag-and-drop page ordering.',
    'Private: photos of IDs and documents never leave your device.',
  ],
  faqs: [
    ['Does converting JPG to PDF reduce quality?', 'No. JPG images are embedded unchanged. Only rotated photos and WebP/GIF/BMP images are re-encoded, at high quality.'],
    ['How many images can I add?', 'Up to 100 images per PDF. Very large photos use more memory, especially on phones.'],
    ['Why is my PDF large?', 'Because original photos are kept at full quality. Use the PDF Compressor afterwards, or resize the photos first with the Image Resizer.'],
    ['Can I add more pages to an existing PDF?', 'Create a PDF from your images, then combine it with the existing PDF using the PDF Merger.'],
    ['Are my photos uploaded?', 'No. The PDF is created in your browser.'],
  ],
};

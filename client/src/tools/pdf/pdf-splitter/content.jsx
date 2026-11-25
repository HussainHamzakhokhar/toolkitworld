export default {
  intro: 'Extract the pages you need from a PDF. Click pages to select them or type ranges like 1-3, 7, then save them as one new PDF or as separate files — all without uploading.',
  howTo: [
    'Choose the PDF you want to split. The page count and page previews appear.',
    'Select pages by clicking them, using “Odd”, “Even” or “Select all”, or by typing ranges such as 1-3, 5, 9-.',
    'Choose “One PDF” to combine the selected pages, or “Separate PDFs” to save each page as its own file in a ZIP.',
    'Press “Extract pages”. The download starts automatically and your original PDF is unchanged.',
  ],
  explanationTitle: 'How page ranges and splitting work',
  explanation: (
    <>
      <p>
        Page numbers start at 1. Separate items with commas and use a dash for ranges: <code>1-3, 5, 8-10</code>. Leave the end open to mean “to the last page”
        (<code>12-</code>), or the start open for “from the first page” (<code>-4</code>). Numbers outside the document, reversed ranges like <code>9-4</code>
        and letters are rejected with an explanation of what to fix.
      </p>
      <p>
        Pages are copied — not re-printed — into the new file using the open-source <em>pdf-lib</em> library, so text stays selectable and image quality is
        unchanged. Because you control the order you type, <code>5, 1-4</code> moves page 5 to the front. Page previews are created with Mozilla’s PDF.js.
      </p>
    </>
  ),
  examples: [
    { title: 'Send only the relevant pages', body: 'A 40-page contract needs only the signature pages. Type 38-40 and download a 3-page PDF.' },
    { title: 'Split a combined scan', body: 'Choose “Select all” and “Separate PDFs” to turn a 12-page scan into 12 single-page files.' },
    { title: 'Remove a cover page', body: 'Type 2- to keep everything except page 1.' },
  ],
  benefits: [
    'Visual page picker with thumbnails, plus precise range typing.',
    'Lossless: pages are copied exactly, without re-compression.',
    'Files never leave your device.',
    'Handles unusual page sizes and mixed orientations.',
  ],
  faqs: [
    ['How do I extract specific pages from a PDF?', 'Load the PDF, type the pages you need (for example 2, 4-6) or click them, choose “One PDF” and press Extract.'],
    ['Can I split every page into a separate file?', 'Yes. Press “Select all”, choose “Separate PDFs” and you will get a ZIP with one PDF per page.'],
    ['Does splitting reduce quality?', 'No. Pages are copied as they are, so text and images are unchanged.'],
    ['Can I split a password-protected PDF?', 'Not until the protection is removed in a PDF reader using the password.'],
    ['Why don’t some pages show previews?', 'Previews are created for the first 200 pages to save memory. You can still select any page by number.'],
  ],
};

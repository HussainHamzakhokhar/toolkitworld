export default {
  intro: 'Convert Word documents (.docx) to PDF in your browser. Headings, paragraphs, bold and italic text, lists, tables, links and images are converted into a clean, shareable PDF.',
  howTo: [
    'Choose a .docx file. A preview of its content appears straight away.',
    'Pick the page size (A4 or US Letter), margins and base text size.',
    'Press “Convert to PDF”.',
    'Download your PDF. The original Word file is not changed.',
  ],
  explanationTitle: 'How Word to PDF conversion works',
  explanation: (
    <>
      <p>
        A .docx file is a ZIP archive of XML describing the document’s content. The open-source <em>mammoth</em> library reads that content — headings,
        paragraphs, lists, tables, links and embedded pictures — and the converter lays it out on PDF pages with real, selectable and searchable text using
        <em> pdfmake</em>. Everything runs in your browser.
      </p>
      <p>
        The PDF follows a clean, consistent layout rather than recreating Word’s exact page design. Exact fonts, line and page breaks, headers and footers,
        text boxes, footnote positions, comments and tracked changes are not reproduced, and images in EMF, WMF or SVG format are skipped. If your document
        must look identical to Word, use “Save as PDF” or “Export to PDF” in Word, Google Docs or LibreOffice. Old binary .doc files must be saved as .docx first.
      </p>
      <p>The built-in font supports Latin, Greek and Cyrillic alphabets. Right-to-left scripts such as Arabic, Urdu and Hebrew, and Chinese, Japanese or Korean text, are not yet displayed correctly.</p>
    </>
  ),
  examples: [
    { title: 'Sending an assignment', body: 'Your university portal accepts PDF only. Convert essay.docx to essay.pdf in a few seconds.' },
    { title: 'Sharing a letter', body: 'Convert a cover letter to PDF so it can’t be edited accidentally and opens the same on any device.' },
    { title: 'On a computer without Word', body: 'On a shared or library computer, convert a .docx to PDF without installing any software.' },
  ],
  benefits: [
    'Real text in the PDF — selectable, searchable and accessible.',
    'Preview the content before converting.',
    'Works without Microsoft Word installed.',
    'Private: your document never leaves your device.',
  ],
  faqs: [
    ['Will the PDF look exactly like my Word document?', 'The content and structure are kept, but the layout is standardised. For a pixel-perfect copy, use Export to PDF inside Word, Google Docs or LibreOffice.'],
    ['Can I convert .doc files?', 'Not directly. Open the .doc file in Word, Google Docs or LibreOffice and save it as .docx first.'],
    ['Are images included?', 'Yes, PNG and JPG images are included and scaled to fit the page. EMF, WMF and SVG images are skipped, and you will be told how many.'],
    ['Does it support Urdu, Arabic or Chinese text?', 'Not yet. The built-in font covers Latin, Greek and Cyrillic alphabets. For other scripts, use your word processor’s Export to PDF option.'],
    ['Is my document uploaded?', 'No. The conversion runs entirely in your browser.'],
  ],
};

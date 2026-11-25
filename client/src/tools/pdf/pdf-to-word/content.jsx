export default {
  intro: 'Convert a PDF into an editable Word document (.docx). Paragraphs, headings, bold and italic text are rebuilt so you can edit the content in Word, Google Docs or LibreOffice — without uploading your file.',
  howTo: [
    'Choose the PDF you want to edit.',
    'Keep “Detect headings” on to turn larger text into Word headings, and choose whether each PDF page starts a new Word page.',
    'Press “Convert to Word” and check the preview of the first paragraphs.',
    'Download the .docx file and open it in Word, Google Docs, Pages or LibreOffice.',
  ],
  explanationTitle: 'How PDF to Word conversion works — and its limits',
  explanation: (
    <>
      <p>
        A PDF doesn’t store paragraphs. It stores small pieces of text, each placed at an exact position on the page. The converter reads these pieces with
        Mozilla’s PDF.js and rebuilds the structure: pieces on the same baseline become lines, lines close together become paragraphs, words split across lines
        with a hyphen are rejoined, and text noticeably larger than the body text becomes a heading. Bold and italic come from the font names in the PDF.
      </p>
      <p>
        The result is a clean, editable document that is easy to work with — not a pixel-perfect copy. Things that are <strong>not</strong> reproduced
        include multi-column layouts (columns are read top to bottom), exact fonts and spacing, images, tables (use <a href="/pdf-tools/pdf-to-excel/">PDF to Excel</a> for those),
        headers and footers. <strong>Scanned PDFs</strong> are pictures of text and contain no real text, so they would need OCR, which this tool doesn’t do; you will be told if that’s the case.
      </p>
    </>
  ),
  examples: [
    { title: 'Updating an old CV', body: 'You only have your CV as a PDF. Convert it to Word, edit your latest job, and export it to PDF again with Word to PDF.' },
    { title: 'Reusing report text', body: 'Pull the text of a 20-page PDF report into Word so you can quote and edit sections without retyping.' },
    { title: 'Editing a letter', body: 'A one-page PDF letter converts into a few clean paragraphs, ready to change the date and recipient.' },
  ],
  benefits: [
    'Editable text with headings and paragraphs, not one text box per line.',
    'Private — contracts and CVs are never uploaded to a server.',
    'Honest warnings for scanned PDFs, instead of an empty document.',
    'Free, with no page limit, watermark or sign-up.',
  ],
  faqs: [
    ['Will my Word file look exactly like the PDF?', 'Not exactly. The text, paragraphs, headings and bold/italic styling are kept, but fonts, spacing, images and complex layouts are simplified so the document is easy to edit.'],
    ['Can I convert a scanned PDF to Word?', 'Not with this tool. Scanned pages are images and need OCR (optical character recognition) to become text. The converter detects this and tells you.'],
    ['Are tables converted?', 'Table text is included as paragraphs. To get tables into rows and columns, use the PDF to Excel converter.'],
    ['Is it safe for confidential documents?', 'Yes. The PDF is read and converted entirely by your browser; nothing is sent to a server.'],
    ['Which programs can open the .docx file?', 'Microsoft Word, Google Docs, Apple Pages, LibreOffice and most other word processors.'],
  ],
};

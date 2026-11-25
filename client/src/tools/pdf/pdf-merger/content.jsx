export default {
  intro: 'Combine several PDF files into a single document in the order you choose. Your files are merged inside your browser and are never uploaded to a server.',
  howTo: [
    'Click “Choose PDF files to merge” or drag several PDFs onto the box. You can add more at any time.',
    'Put the files in the right order: drag them, use the up and down arrows, or “Sort by name”.',
    'Press “Merge PDFs”. Large files may take a few seconds.',
    'Download the merged PDF. Your original files are not changed.',
  ],
  explanationTitle: 'How merging works',
  explanation: (
    <>
      <p>
        Each PDF is opened with <em>pdf-lib</em>, an open-source PDF library running in your browser. The pages of every file are copied — with their text,
        images, fonts and links — into a new document, one file after another. Page sizes and orientations are kept exactly, so a mix of A4, Letter and
        landscape pages is fine.
      </p>
      <p>
        Every file is checked first. Files that are not real PDFs, are damaged, or are password-protected are marked with a clear message and skipped.
        Interactive form fields and the bookmark outline of the original files may not carry over to the merged document; page content always does.
      </p>
    </>
  ),
  examples: [
    { title: 'Job application', body: 'Merge cover-letter.pdf, cv.pdf and certificates.pdf into one file in that order for a single upload.' },
    { title: 'Scanned pages', body: 'Your scanner saved each page as a separate PDF. Add them all, click “Sort by name”, and merge them into one document.' },
    { title: 'Monthly statements', body: 'Combine 12 monthly bank statements into one annual PDF for your records.' },
  ],
  benefits: [
    'Completely private — no upload, so it is suitable for confidential documents.',
    'Easy reordering with drag-and-drop or arrow buttons, including on phones.',
    'Keeps original page quality and sizes; nothing is re-compressed.',
    'No watermark, no account and no daily limit.',
  ],
  faqs: [
    ['Is it safe to merge confidential PDFs here?', 'Yes. Your files are processed by your own browser and never sent to our servers.'],
    ['How many PDFs can I merge at once?', 'Up to 50 files at a time. The total size you can handle depends on your device’s memory.'],
    ['Can I merge password-protected PDFs?', 'No. Remove the password in a PDF reader first (you need to know it), then merge the unlocked copy.'],
    ['Will the merged PDF lose quality?', 'No. Pages are copied as they are, without re-compressing images or text.'],
    ['Are bookmarks and form fields kept?', 'Page content is always kept. Bookmark outlines and interactive form fields may not be carried over.'],
  ],
};

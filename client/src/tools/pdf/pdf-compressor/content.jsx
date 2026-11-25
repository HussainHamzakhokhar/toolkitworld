export default {
  intro: 'Reduce the size of a PDF so it is easier to email or upload. Choose a safe clean-up that keeps text intact, or stronger compression for scanned documents — with an honest before-and-after comparison.',
  howTo: [
    'Choose the PDF to compress. Its page count and original size are shown.',
    'Pick “Basic” to keep everything (text, links, quality) or “Strong” to convert pages to compressed images.',
    'For Strong, choose a quality level. “Balanced” suits most scans.',
    'Press “Compress PDF”, compare the sizes, and download the result if it is smaller.',
  ],
  explanationTitle: 'How PDF compression works — and its limits',
  explanation: (
    <>
      <p>
        <strong>Basic</strong> re-saves the document with compressed object streams and, when it is safe to do so, rebuilds it from its pages only — dropping
        unused objects, leftovers from previous edits and embedded metadata. Text, fonts, images and links are untouched, so quality cannot get worse. Savings
        depend on how the file was made: PDFs exported by some scanners or edited many times can shrink noticeably, while files already optimised may not
        shrink at all.
      </p>
      <p>
        <strong>Strong</strong> renders each page as a picture at a lower resolution and saves it as a JPEG inside a new PDF. This can shrink scanned
        documents and photo-heavy files dramatically, but it is <em>lossy</em>: the text becomes part of the image, so it can no longer be selected, searched
        or read aloud by screen readers, and links and form fields are lost. Text-only PDFs may even get larger, because a picture of text is bigger than the
        text itself.
      </p>
      <p>
        No compressor can guarantee a smaller file for every PDF. This tool always shows the real sizes and will tell you when the original is the better choice.
        Everything happens in your browser; your document is not uploaded.
      </p>
    </>
  ),
  examples: [
    { title: 'Scanned contract for email', body: 'A 24 MB scanned contract compressed with Strong → Balanced is often reduced to around 2–4 MB, under most email limits.' },
    { title: 'A Word export', body: 'A 900 KB report exported from a word processor may shrink only a little with Basic, because it is already efficient — keeping it as it is is fine.' },
    { title: 'Photo portfolio', body: 'A portfolio of high-resolution photos can be shrunk with Strong → High quality while still looking good on screen.' },
  ],
  benefits: [
    'Honest results: real before-and-after sizes, with no “guaranteed” claims.',
    'Choice between a lossless clean-up and strong compression.',
    'Private — confidential documents never leave your device.',
    'Shrink files to meet email and upload limits.',
  ],
  faqs: [
    ['Why didn’t my PDF get smaller?', 'If a PDF is mostly text or was already optimised, there is little to remove. Basic will not reduce quality to force a saving, and Strong may make text-only files larger.'],
    ['Will compression reduce quality?', 'Basic does not change quality. Strong reduces image resolution and quality according to the level you choose.'],
    ['Can I still copy text after compressing?', 'With Basic, yes. With Strong, no — pages become images. Keep your original if you need searchable text.'],
    ['Is compression safe for confidential files?', 'Yes. The PDF is processed by your browser and never uploaded.'],
    ['What about password-protected PDFs?', 'They need to be unlocked with the password in a PDF reader before they can be compressed.'],
  ],
};

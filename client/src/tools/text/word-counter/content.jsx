export default {
  intro: 'Count words, characters, sentences and paragraphs as you type, and see how long your text takes to read or say aloud. Ideal for essays, articles and applications with a word limit.',
  howTo: [
    'Type in the box or paste text from any document, email or web page.',
    'Watch the counts update live at the top: words, characters with and without spaces, sentences and paragraphs.',
    'Check the estimated reading and speaking time, and the most frequent words for overused terms.',
    'Use “Copy text” to take your edited text back, or “Clear” to start over.',
  ],
  explanationTitle: 'What counts as a word, sentence and paragraph',
  explanation: (
    <>
      <p>
        <strong>Words:</strong> any group of characters between spaces or line breaks that contains at least one letter or number. “Don’t”, “e-mail” and “2026”
        each count as one word; a lone dash or emoji does not. This matches how most word processors count. For languages written without spaces, such as
        Chinese, Japanese and Thai, your browser’s built-in dictionary is used to find word boundaries.
      </p>
      <p>
        <strong>Characters</strong> are counted as you see them, so an emoji or accented letter counts as one. <strong>Sentences</strong> are detected using
        your browser’s Unicode sentence rules, which understand most abbreviations and punctuation. <strong>Paragraphs</strong> are lines that contain text.
      </p>
      <p>
        Reading time assumes an average silent reading speed of 238 words per minute, from a 2019 review of reading-rate research. Speaking time assumes
        about 140 words per minute, a typical pace for presentations. Your own speed may be faster or slower.
      </p>
    </>
  ),
  examples: [
    { title: 'Essay limit', body: 'Your assignment allows 1,500 words ± 10%. Paste your draft to confirm you are between 1,350 and 1,650.' },
    { title: 'Speech timing', body: 'A 5-minute wedding toast is roughly 700 words at a speaking pace of 140 words per minute.' },
    { title: 'Blog post planning', body: 'A 1,200-word article takes about 5 minutes to read — useful for “5 min read” labels.' },
  ],
  benefits: [
    'Live counts with no button to press, even for long documents.',
    'Spot repeated words with the frequency list.',
    'Works offline once loaded; your text never leaves the page.',
    'Handles emoji, accents and non-Latin scripts correctly.',
  ],
  faqs: [
    ['Does the word counter count numbers as words?', 'Yes. A number such as 2026 or 3.5 counts as one word, as in most word processors.'],
    ['Are hyphenated words one word or two?', 'One. “Well-known” counts as a single word because it has no space in it.'],
    ['Why is my count different from Microsoft Word or Google Docs?', 'Each program has slightly different rules, especially for symbols, URLs and footnotes. Differences are usually very small.'],
    ['Do headings and references count toward my essay limit?', 'That depends on your institution. Many exclude the title, reference list and appendices — remove them before counting if so.'],
    ['Is there a length limit?', 'No fixed limit. Very long texts (hundreds of thousands of words) still work, but counting may slow slightly on older devices.'],
  ],
};

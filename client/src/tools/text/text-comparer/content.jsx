export default {
  intro: 'Paste two versions of a text to see exactly what changed. Added text is highlighted and underlined, removed text is struck through, and a summary shows how much changed.',
  howTo: [
    'Paste the original text on the left (or top on mobile) and the changed version on the right.',
    'Choose whether to compare by words, characters or whole lines, and whether to ignore case or extra spaces.',
    'Press “Compare texts”.',
    'Review the highlighted differences and the summary of words added, removed and overall similarity.',
  ],
  explanationTitle: 'How the comparison works',
  explanation: (
    <>
      <p>
        The tool uses the well-known diff algorithm by Eugene Myers (via the open-source <em>jsdiff</em> library) to find the smallest set of insertions and
        deletions that turns the original text into the changed one. Everything else is shown as unchanged.
      </p>
      <ul>
        <li><strong>Words</strong> is best for prose such as essays, contracts and articles.</li>
        <li><strong>Characters</strong> catches small typos and punctuation changes inside words.</li>
        <li><strong>Lines</strong> suits lists, code, configuration files and data.</li>
      </ul>
      <p>
        Similarity is the share of characters that are unchanged, relative to the length of both texts. It is a quick indicator of how much was edited, not a
        plagiarism score. The comparison happens in your browser, so confidential drafts are never uploaded.
      </p>
    </>
  ),
  examples: [
    { title: 'Contract revision', body: 'Compare the version you sent with the one returned to spot a changed date or an added clause.' },
    { title: 'Essay feedback', body: 'Paste your draft and your edited version to see every change your editor made.' },
    { title: 'Configuration files', body: 'Use “Lines” mode to find which settings differ between two config files.' },
  ],
  benefits: [
    'See changes at a glance instead of reading both versions line by line.',
    'Changes are shown with underline and strikethrough as well as colour, for accessibility.',
    'Options to ignore capitalisation and spacing differences.',
    'Private: both texts stay on your device.',
  ],
  faqs: [
    ['Can this tool check plagiarism?', 'No. It compares two texts you provide. It does not search the web or other documents.'],
    ['What is the difference between word and character mode?', 'Word mode highlights whole words that changed. Character mode shows the exact letters that changed, which is better for typos.'],
    ['Why are some unchanged words highlighted?', 'When a passage is heavily rewritten, the algorithm may show a block as removed and re-added. Character mode can give a finer view.'],
    ['How large can the texts be?', 'Up to 300,000 characters each. Very different long texts take longer to compare.'],
    ['Are my texts saved?', 'No. They are compared in your browser and disappear when you leave the page.'],
  ],
};

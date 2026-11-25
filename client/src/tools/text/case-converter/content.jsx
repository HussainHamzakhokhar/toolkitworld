export default {
  intro: 'Change text to UPPERCASE, lowercase, Title Case, Sentence case, Capitalized Case or tOGGLE cASE in one click — handy when text was typed with Caps Lock on or needs a consistent style.',
  howTo: [
    'Type or paste your text into the top box.',
    'Choose a case style. The converted text appears straight away in the result box.',
    'Copy the result, download it as a .txt file, or use it as the new input for further editing.',
    'Press Clear to start with new text.',
  ],
  explanationTitle: 'What each case style does',
  explanation: (
    <>
      <ul>
        <li><strong>UPPERCASE</strong> — every letter capitalised. Useful for headings and labels, but hard to read in long passages.</li>
        <li><strong>lowercase</strong> — every letter small. Handy for normalising email addresses, tags or code identifiers.</li>
        <li><strong>Title Case</strong> — headline style: main words capitalised, while short words such as “a”, “and”, “of”, “the” and “to” stay lowercase unless they begin or end the title or follow a colon.</li>
        <li><strong>Sentence case</strong> — only the first letter of each sentence capitalised, plus the word “I”. Proper nouns such as names must be fixed by hand, because the tool cannot know which words are names.</li>
        <li><strong>Capitalized Case</strong> — the first letter of every word capitalised, including small words.</li>
        <li><strong>tOGGLE cASE</strong> — every letter’s case flipped, which fixes text typed with Caps Lock accidentally on.</li>
      </ul>
      <p>Conversion uses Unicode rules, so accented and non-Latin letters are converted correctly. Scripts without upper and lower case (such as Chinese or Arabic) are unchanged.</p>
    </>
  ),
  examples: [
    { title: 'Fixing a headline', body: '“the lord of the rings: the return of the king” in Title Case becomes “The Lord of the Rings: The Return of the King”.' },
    { title: 'Caps Lock accident', body: '“hELLO, mY NAME IS sAM” with tOGGLE cASE becomes “Hello, My name is Sam”.' },
    { title: 'Tidying shouted text', body: '“PLEASE READ THE INSTRUCTIONS. THEN SIGN.” in Sentence case becomes “Please read the instructions. Then sign.”' },
  ],
  benefits: [
    'Fix capitalisation without retyping.',
    'Consistent headline style for blogs, papers and presentations.',
    'Download the result as a text file.',
    'Runs entirely in your browser — nothing is uploaded.',
  ],
  faqs: [
    ['What is the difference between Title Case and Capitalized Case?', 'Title Case leaves short words like “of” and “the” in lowercase (except at the start or end). Capitalized Case capitalises every word.'],
    ['Which title case style does this use?', 'A general headline style similar to common style guides. Guides such as APA, Chicago and AP differ in small details, so check yours for formal work.'],
    ['Will Sentence case keep names capitalised?', 'No. It lowercases everything except sentence starts and “I”. Re-capitalise names and places afterwards.'],
    ['Does it work with other languages?', 'Yes, for any script with upper and lower case, including accented Latin, Greek and Cyrillic letters.'],
    ['Is there a length limit?', 'No practical limit. Even very long documents convert instantly.'],
  ],
};

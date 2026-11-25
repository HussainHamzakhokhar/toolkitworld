export default {
  intro: 'Count characters with and without spaces, plus letters, numbers, punctuation and emoji. Set a limit for social posts, SMS or SEO tags and see how many characters you have left.',
  howTo: [
    'Choose a character limit preset, or “Custom…” to set your own. Choose “No limit” to just count.',
    'Type or paste your text. The meter shows how many characters remain, or how many you are over.',
    'Untick “Count spaces toward the limit” if your platform counts only visible characters.',
    'Check the breakdown of letters, numbers, punctuation, spaces and bytes below the text box.',
  ],
  explanationTitle: 'How characters are counted',
  explanation: (
    <>
      <p>
        The counter counts <em>user-perceived characters</em> (Unicode grapheme clusters). An emoji made of several code points — like a family emoji or a
        thumbs-up with a skin tone — and letters with combining accents each count as one character, which is how they appear on screen.
      </p>
      <p>
        Letters include all alphabets, not only A–Z. Line breaks are counted as characters, since most platforms do. The UTF-8 byte size shows how much storage
        or database space the text needs: plain English letters use 1 byte each, accented letters 2, and most emoji 4.
      </p>
      <p>
        Platforms do not all count the same way. X (Twitter) gives some characters double weight and counts links as 23 characters, and SMS messages drop to
        70 characters per message when they contain emoji or non-Latin letters. Use the presets as a guide and check the platform’s own counter before posting.
      </p>
    </>
  ),
  examples: [
    { title: 'Meta description', body: 'Write a page description under the 160-character preset so search results are less likely to cut it off.' },
    { title: 'Username or form field', body: 'A sign-up form allows 30 characters. Set a custom limit of 30 and spaces off to check quickly.' },
    { title: 'Emoji count', body: '“Good luck 👍🏽” is 11 characters here, though some systems count the emoji as 2 or 4 because of how it is stored.' },
  ],
  benefits: [
    'Live remaining-character meter with a clear over-limit warning in text, not only colour.',
    'Presets for common limits, plus custom limits.',
    'Accurate emoji and Unicode counting.',
    'Developers can check UTF-8 byte length for database fields and APIs.',
  ],
  faqs: [
    ['Do spaces count as characters?', 'Usually yes. Social networks and SMS count spaces. Some forms and assignments count only visible characters — untick the spaces option for that.'],
    ['How many characters is an emoji?', 'Here it counts as 1, as you see it. Some platforms count 2 or more because of how emoji are encoded.'],
    ['What is the character limit for a meta description?', 'There is no official limit. Search engines truncate by pixel width, which is often around 150–160 characters on desktop.'],
    ['Does a line break count as a character?', 'Yes. Each line break is counted, and shown separately in the breakdown.'],
    ['Is my text stored?', 'No. Everything is counted in your browser and nothing is sent anywhere.'],
  ],
};

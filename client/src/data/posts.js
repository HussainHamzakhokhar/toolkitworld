/**
 * Blog post metadata. Article bodies live in /content/blog/<slug>.md and are
 * converted to HTML at build time. Add a post = add an entry here + a .md file.
 */
export const BLOG_CATEGORIES = ['Calculators', 'Text', 'Images', 'PDF'];

export const POSTS = [
  {
    slug: 'how-to-calculate-percentage',
    title: 'How to Calculate Percentage: A Complete Guide with Examples',
    description:
      'Learn the three basic percentage formulas, how to find a percent of a number, what percent one number is of another, and how to avoid common mistakes.',
    category: 'Calculators',
    published: '2026-11-18',
    modified: '2026-11-25',
    readMinutes: 7,
    tools: ['percentage-calculator', 'discount-calculator'],
  },
  {
    slug: 'how-to-calculate-age-online',
    title: 'How to Calculate Your Age Online (Years, Months and Days)',
    description:
      'How exact age is calculated, why months make it tricky, how leap-year birthdays work and how to count the total days you have been alive.',
    category: 'Calculators',
    published: '2026-11-18',
    modified: '2026-11-25',
    readMinutes: 6,
    tools: ['age-calculator', 'date-calculator'],
  },
  {
    slug: 'how-to-calculate-gpa',
    title: 'How to Calculate GPA Step by Step (Weighted by Credit Hours)',
    description:
      'A clear walk-through of grade points, credit hours and weighted averages, with a worked semester example and how to compute cumulative GPA.',
    category: 'Calculators',
    published: '2026-11-19',
    modified: '2026-11-25',
    readMinutes: 7,
    tools: ['gpa-calculator', 'percentage-calculator'],
  },
  {
    slug: 'how-to-calculate-percentage-increase',
    title: 'How to Calculate Percentage Increase (and Decrease)',
    description:
      'The percentage change formula explained with prices, salaries and population examples, plus the difference between percent and percentage points.',
    category: 'Calculators',
    published: '2026-11-20',
    modified: '2026-11-25',
    readMinutes: 6,
    tools: ['percentage-calculator', 'discount-calculator'],
  },
  {
    slug: 'how-to-compress-pdf-files',
    title: 'How to Compress PDF Files: What Actually Makes Them Smaller',
    description:
      'Why some PDFs are huge, which compression methods work, when compression will not help, and how to shrink a PDF for email without losing quality.',
    category: 'PDF',
    published: '2026-11-21',
    modified: '2026-11-25',
    readMinutes: 8,
    tools: ['pdf-compressor', 'pdf-splitter', 'pdf-merger'],
  },
  {
    slug: 'how-to-convert-jpg-to-png',
    title: 'How to Convert JPG to PNG (and When You Should)',
    description:
      'The real differences between JPG and PNG, when converting helps, what it cannot fix, and how to convert images on any device for free.',
    category: 'Images',
    published: '2026-11-22',
    modified: '2026-11-25',
    readMinutes: 6,
    tools: ['jpg-to-png', 'png-to-jpg', 'image-resizer'],
  },
  {
    slug: 'how-to-count-words-in-an-essay',
    title: 'How to Count Words in an Essay (and What Counts as a Word)',
    description:
      'How word counters decide what a word is, what usually counts toward an essay limit, and practical ways to hit a word count without padding.',
    category: 'Text',
    published: '2026-11-23',
    modified: '2026-11-25',
    readMinutes: 6,
    tools: ['word-counter', 'character-counter'],
  },
  {
    slug: 'how-to-calculate-days-between-two-dates',
    title: 'How to Calculate Days Between Two Dates',
    description:
      'Count the days between two dates by hand or online, decide whether to include the end date, and handle months, leap years and business days.',
    category: 'Calculators',
    published: '2026-11-24',
    modified: '2026-11-25',
    readMinutes: 6,
    tools: ['date-calculator', 'age-calculator'],
  },
  {
    slug: 'how-to-convert-pdf-to-word-and-excel',
    title: 'How to Convert PDF to Word or Excel (and What to Expect)',
    description:
      'Why PDF conversion is never perfect, which PDFs convert well, how to get the best result for documents and tables, and how to go back from Word or Excel to PDF.',
    category: 'PDF',
    published: '2026-11-25',
    modified: '2026-11-25',
    readMinutes: 7,
    tools: ['pdf-to-word', 'pdf-to-excel', 'word-to-pdf', 'excel-to-pdf'],
  },
];

export const postBySlug = Object.fromEntries(POSTS.map((p) => [p.slug, p]));
export const latestPosts = (n = 3) =>
  [...POSTS].sort((a, b) => b.published.localeCompare(a.published)).slice(0, n);

export default {
  intro: 'Turn Excel, OpenDocument or CSV spreadsheets into clean, printable PDF tables. Choose which sheets to include, page orientation and gridlines; header rows repeat on every page.',
  howTo: [
    'Choose a spreadsheet: .xlsx, .xls, .ods or .csv.',
    'Tick the sheets you want. Each sheet starts on a new page with its name as a title.',
    'Choose orientation (automatic uses landscape for wide sheets), page size, gridlines and whether the first row is a header.',
    'Press “Convert to PDF” and download the result.',
  ],
  explanationTitle: 'How Excel to PDF conversion works',
  explanation: (
    <>
      <p>
        The spreadsheet is opened in your browser with SheetJS, a widely used open-source spreadsheet library. Each cell is shown as it is formatted in the
        file — dates, currency and percentages look the same as in Excel — and the results of formulas are used, not the formulas themselves. Empty rows
        and columns at the edges are trimmed, and merged cells are kept.
      </p>
      <p>
        The sheet is then laid out as a PDF table with real text. Text size adapts to the number of columns so wide sheets still fit across the page, and long
        tables continue across pages with the header row repeated. Charts, pictures, cell colours and conditional formatting are not included, and very wide
        sheets (more than about 20 columns) may become hard to read — consider hiding unneeded columns first.
      </p>
    </>
  ),
  examples: [
    { title: 'Sending an invoice list', body: 'Convert invoices.xlsx to a PDF your accountant can open on any device, with headings repeated on each page.' },
    { title: 'Printing a timetable', body: 'A wide class timetable is automatically placed in landscape so all columns fit.' },
    { title: 'CSV export to PDF', body: 'Turn a CSV export from a website into a readable PDF table in one step.' },
  ],
  benefits: [
    'Works with XLSX, XLS, ODS and CSV — no Excel needed.',
    'Choose exactly which sheets to include.',
    'Header rows repeat on every page for long tables.',
    'Private: spreadsheets stay on your device.',
  ],
  faqs: [
    ['Are formulas included?', 'The calculated values are shown, exactly as Excel last saved them. The formulas themselves are not part of a PDF.'],
    ['Are charts and images converted?', 'No, only cell contents. To include charts, use Excel’s own Export to PDF.'],
    ['Can I convert a password-protected workbook?', 'No. Remove the password in Excel first; the tool tells you if a file is protected.'],
    ['My sheet is too wide — what can I do?', 'Choose landscape and hide or delete columns you don’t need before converting. Text automatically gets smaller for wide sheets.'],
    ['Is my spreadsheet uploaded?', 'No. It is read and converted in your browser.'],
  ],
};

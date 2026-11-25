export default {
  intro: 'Extract tables from a PDF into an Excel spreadsheet (.xlsx). Columns are detected from the layout, and numbers, currency amounts and percentages become real values you can calculate with.',
  howTo: [
    'Choose a PDF that contains a table — for example a price list, statement or report.',
    'Choose one worksheet per PDF page, or everything on a single sheet.',
    'Keep “Convert numbers” on to turn values like 1,234.50, $99 or 45% into numbers.',
    'Press “Convert to Excel”, check the preview, and download the .xlsx file.',
  ],
  explanationTitle: 'How tables are detected',
  explanation: (
    <>
      <p>
        PDFs don’t contain real tables — just text placed at positions on the page. The converter reads every piece of text and its position, groups pieces
        on the same line into rows, and splits each row wherever there is a wide horizontal gap. It then lines up the cells of all rows by finding where
        columns start across the whole page, so an empty cell lands in the right column instead of shifting values to the left.
      </p>
      <p>
        This works well for PDFs created digitally from spreadsheets, accounting software or reports with clear columns. Results are less reliable for
        tables with merged cells, cells containing several lines of text, or pages that mix paragraphs and tables. Scanned PDFs contain no text and can’t be
        converted. Always check totals in the spreadsheet against the original.
      </p>
    </>
  ),
  examples: [
    { title: 'Bank or card statement', body: 'Convert a statement to Excel, then sort and total your spending by category.' },
    { title: 'Supplier price list', body: 'A 6-page PDF price list becomes six worksheets with product names, codes and prices as numbers.' },
    { title: 'Report data', body: 'Pull a results table out of a PDF report to build your own chart.' },
  ],
  benefits: [
    'Numbers become real numbers, ready for formulas and charts.',
    'Columns stay aligned even when some cells are empty.',
    'Private — financial documents are never uploaded.',
    'Opens in Excel, Google Sheets, Numbers and LibreOffice Calc.',
  ],
  faqs: [
    ['Can it convert scanned bank statements?', 'No. Scanned pages are images and contain no text. The tool tells you if no text is found.'],
    ['Why are some values in the wrong column?', 'Tables with merged cells or wrapped text can confuse column detection. Try the single-sheet option or fix the few affected cells in Excel.'],
    ['Are dates converted to Excel dates?', 'Dates are kept as text so their format is never misread (for example 03/04 as March or April). Use Excel’s Text to Columns or DATEVALUE to convert them.'],
    ['Does it keep cell colours and borders?', 'No. Only the text and numbers are extracted.'],
    ['Is my PDF uploaded?', 'No. Everything happens in your browser.'],
  ],
};

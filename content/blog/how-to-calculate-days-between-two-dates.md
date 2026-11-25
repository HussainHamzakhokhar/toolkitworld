How many days until a deadline? How long was a project? How many days have passed since a contract started? Counting days between two dates sounds easy, but months of different lengths, leap years and the question of whether to include the end date can trip anyone up. This guide shows how to count days by hand and with a calculator, and how to handle the tricky cases.

## The quick method

The simplest reliable way to count days by hand is to work month by month.

**Example:** how many days from 1 January 2026 to 25 November 2026?

1. Add the full months from January to October: 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 = **304** days. This brings you to 1 November.
2. Add the remaining days in November: from 1 November to 25 November is **24** days.
3. Total: 304 + 24 = **328 days**.

Remember the month lengths with the knuckle trick: make two fists and count the months across your knuckles and the gaps between them. Knuckles are 31-day months; gaps are 30-day months (or February).

## To include the end date or not?

This is the most common source of "off by one" errors.

- **Excluding the end date** measures elapsed time. From Monday to Wednesday is 2 days. Most calculators do this by default, and it is the right choice for "how many days until…" questions.
- **Including the end date** counts both the first and last days. A holiday from 1 to 7 August is 7 days of holiday, even though only 6 days elapse.

Hotel stays are a good illustration: arriving on the 1st and leaving on the 7th is 6 nights but 7 calendar days. The [Date Calculator](/calculators/date-calculator/) has a checkbox for including the end date so you can match your situation.

## Handling leap years

February has 29 days in leap years. The rules are:

- Years divisible by 4 are leap years (2024, 2028)...
- ...except years divisible by 100 (2100 will not be a leap year)...
- ...unless also divisible by 400 (2000 was a leap year).

So 1 February to 1 March is 29 days in 2024 but 28 days in 2025. Any count that crosses the end of February needs to check the year.

## Converting days into weeks and months

- **Weeks:** divide by 7. 328 days is 46 weeks and 6 days.
- **Months:** months vary in length, so "how many months" is best counted on the calendar rather than by dividing. From 15 March to 10 June 2026 is 2 months and 26 days (87 days in total).

When adding months to a date, be careful at month ends. One month after 31 January 2025 is not "31 February" — most calculators, including ours, move to the last day of February.

## Counting business days

For work deadlines, delivery estimates and notice periods, you often need weekdays only.

**Example:** from 1 December 2026 to 1 January 2027 (excluding the end date) there are 31 days, of which **23 are weekdays** (Monday to Friday) and 8 are weekend days.

Public holidays are not included in that number, because they differ between countries, regions and even employers. Subtract the holidays that apply to you — in this example, many people would subtract 25 December, and some would also subtract 24 or 26 December.

## Finding a date in the future or past

The reverse question — "what date is 45 days from today?" — is common for payment terms, trial periods and medical schedules. Starting from Wednesday, 25 November 2026, adding 45 days gives **Saturday, 9 January 2027**.

By hand, subtract the days left in the current month (5 days to 30 November), then work through each month (31 in December brings you to 36 days), and the remaining 9 days land on 9 January.

In the [Date Calculator](/calculators/date-calculator/), choose "Add or subtract", enter the amount, and pick days, weeks, months or years.

## Avoiding time-zone mistakes

If you calculate days using times as well as dates — for example in a spreadsheet or code — daylight-saving changes can make a "day" 23 or 25 hours long, which sometimes produces answers like 29.96 days. Working with calendar dates only, without times, avoids this. Our calculator uses calendar dates, so the result is always a whole number of days.

## Frequently asked questions

### How do I count days between dates in Excel or Google Sheets?

Subtract the earlier date from the later one: `=B1-A1`. Add 1 if you want to include the end date. For weekdays, use `=NETWORKDAYS(A1,B1)`, which includes both start and end dates.

### How many days are in a year?

365, or 366 in a leap year. Over a long period, the average is 365.2425 days.

### How many weeks are in a year?

52 weeks and 1 day (or 2 days in a leap year).

### How do I calculate someone's age in days?

Count the days between their birth date and today. The [Age Calculator](/calculators/age-calculator/) does this directly and also shows years, months and days.

## Conclusion

Counting days is a matter of adding month lengths, checking for leap years and deciding whether the end date counts. For weekdays, remember to subtract local holidays. When accuracy matters — or when you just want the answer — a date calculator removes the guesswork.

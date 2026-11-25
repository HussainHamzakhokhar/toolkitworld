export default {
  intro: 'Count the days between two dates — with or without the end date — or add and subtract days, weeks, months or years from any date. Leap years and month lengths are handled for you.',
  howTo: [
    'Pick “Days between dates” to measure a period, or “Add or subtract” to find a future or past date.',
    'For a period, choose the start and end dates. Tick “Include the end date” if both the first and last day should count, as with hotel nights versus holiday days.',
    'For adding or subtracting, choose a start date, the operation, an amount and a unit.',
    'Read the result in days, weeks, calendar months and weekdays, then copy it if you need it.',
  ],
  explanationTitle: 'How dates are counted',
  explanation: (
    <>
      <p>
        Each date is converted to a day number in the calendar, and the result is the difference between the two numbers. This counts every real day,
        including 29 February in leap years (years divisible by 4, except century years not divisible by 400 — so 2000 was a leap year and 1900 was not).
      </p>
      <p>
        By default the end date is not counted: from Monday to Wednesday is 2 days. Including the end date adds one day, which is how people usually count
        inclusive periods such as “1 to 31 January” (31 days).
      </p>
      <p>
        Adding months keeps the same day of the month where possible. If that day does not exist in the target month, the result is the month’s last day.
        Weekdays are Monday to Friday; public holidays differ between countries and are not removed.
      </p>
    </>
  ),
  examples: [
    { title: 'Countdown to an event', body: 'From 25 November 2026 to 25 December 2026 is 30 days, or 4 weeks and 2 days.' },
    { title: 'Deadline 90 days from today', body: 'Add 90 days to 25 November 2026 and you get Tuesday, 23 February 2027.' },
    { title: 'Inclusive period', body: 'A course runs from 1 March to 31 May. With “Include the end date” ticked that is 92 days.' },
    { title: 'Working days', body: 'From Monday 23 November to Monday 30 November 2026 there are 5 weekdays (the end date is not counted).' },
  ],
  benefits: [
    'Plan project deadlines, notice periods, visa stays, pregnancies or holidays.',
    'See the same duration as days, weeks, months and weekdays at once.',
    'No time-zone or daylight-saving errors — calendar dates only.',
    'Works for historical and future dates from year 1 to 9999.',
  ],
  faqs: [
    ['How do I calculate the number of days between two dates?', 'Enter both dates in “Days between dates”. The calculator subtracts the calendar day numbers. Tick “Include the end date” to count both the first and last day.'],
    ['Should I include the end date?', 'Include it when both days are part of the period (for example, a holiday from 1st to 7th is 7 days). Leave it out when measuring elapsed time (7 nights).'],
    ['Does it count business days?', 'Yes, it shows weekdays (Monday to Friday). It does not know your public holidays, so subtract those yourself.'],
    ['What happens when I add a month to 31 January?', 'February has no 31st, so the result is the last day of February — 28th, or 29th in a leap year.'],
    ['Can I subtract days to find a past date?', 'Yes. Choose “Add or subtract”, select Subtract, and enter the number of days.'],
  ],
};

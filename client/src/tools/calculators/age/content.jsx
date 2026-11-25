export default {
  intro: 'Find an exact age in years, months and days, the total days lived, the weekday of birth and a countdown to the next birthday. Leap years are handled correctly.',
  howTo: [
    'Enter the date of birth using the date picker (or type it in).',
    'Leave “Age on this date” as today, or change it to find an age on another date — useful for forms that ask for age on a specific day.',
    'Read the exact age, totals in months, weeks, days and hours, and the next-birthday countdown.',
    'Copy the result or press Reset to calculate another age.',
  ],
  explanationTitle: 'How the age is calculated',
  explanation: (
    <>
      <p>
        The calculator counts the largest number of whole calendar months from the birth date that fit before the target date, then counts the leftover days.
        Twelve months make a year. This matches how people normally state age (“36 years, 4 months and 21 days”) and never produces negative parts.
      </p>
      <p>
        When a month is shorter than the birth day — for example, someone born on 31 January — the anniversary that month falls on the last day of the
        month. Total days are counted exactly from the calendar, including every 29 February in between. Hours are an approximation (days × 24) because the
        time of birth is not known.
      </p>
      <p>
        Dates are treated as calendar dates without time zones, so daylight-saving changes cannot add or remove a day. People born on 29 February are treated
        as having their birthday on 28 February in non-leap years; some countries legally use 1 March instead.
      </p>
    </>
  ),
  examples: [
    { title: 'Age today', body: 'Born on 4 July 1990, on 25 November 2026 you are 36 years, 4 months and 21 days old — 13,293 days in total.' },
    { title: 'Age on a deadline', body: 'A scholarship requires applicants to be under 25 on 1 September 2027. Enter that date as “Age on this date” to check eligibility.' },
    { title: 'Leap-day birthday', body: 'Someone born on 29 February 2000 turns 26 on 28 February 2026 in this calculator, and has a true 29 February birthday again in 2028.' },
  ],
  benefits: [
    'Exact age for application forms, insurance, visas, sports age groups and school admissions.',
    'Shows the weekday you were born and the days remaining until your next birthday.',
    'Calculates ages on any date — past or future — not just today.',
    'Private: dates are processed in your browser and never stored.',
  ],
  faqs: [
    ['How do I calculate my age in years, months and days?', 'Count the full years since your birth date, then the full months since your last birthday, then the remaining days. The calculator does this automatically using real month lengths.'],
    ['How are leap years handled?', 'Every 29 February between the two dates is included in the day totals. For people born on 29 February, the birthday is treated as 28 February in non-leap years.'],
    ['Why does my age in days differ from years × 365?', 'Because leap years add an extra day roughly every four years. The calculator counts every actual calendar day.'],
    ['Can I calculate the age of someone who has died, or an age in the future?', 'Yes. Set “Age on this date” to any date after the birth date.'],
    ['Is my date of birth saved?', 'No. The calculation happens in your browser and nothing is sent or stored.'],
  ],
};

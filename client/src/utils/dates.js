/**
 * Calendar-date maths. Dates are plain {y, m, d} objects and all arithmetic is
 * done in UTC "day numbers", so daylight-saving changes and the visitor's time
 * zone can never shift a result by a day.
 */
export const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
export const daysInMonth = (y, m) => [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];

const DAY = 86_400_000;
function utcMs({ y, m, d }) {
  const dt = new Date(0);
  dt.setUTCFullYear(y, m - 1, d); // setUTCFullYear handles years < 100 correctly
  return dt.getTime();
}

export const toDayNumber = (date) => Math.round(utcMs(date) / DAY);
export function fromDayNumber(n) {
  const dt = new Date(n * DAY);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}
export const compareDates = (a, b) => toDayNumber(a) - toDayNumber(b);
export const addDays = (date, n) => fromDayNumber(toDayNumber(date) + n);
export const weekday = (date) => new Date(utcMs(date)).getUTCDay(); // 0 = Sunday

/** Parses "YYYY-MM-DD" (the format of <input type="date">). Returns null when invalid. */
export function parseISODate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3];
  if (y < 1 || mo < 1 || mo > 12 || d < 1 || d > daysInMonth(y, mo)) return null;
  return { y, m: mo, d };
}

const pad = (n, w = 2) => String(n).padStart(w, '0');
export const toISO = ({ y, m, d }) => `${pad(y, 4)}-${pad(m)}-${pad(d)}`;

export function todayLocal() {
  const n = new Date();
  return { y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate() };
}

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const formatDate = (date, withWeekday = true) =>
  new Date(utcMs(date)).toLocaleDateString('en-US', {
    timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric', ...(withWeekday ? { weekday: 'long' } : {}),
  });

/**
 * Adds whole months. If the target month is shorter, the day is clamped
 * (Jan 31 + 1 month = Feb 28, or Feb 29 in a leap year).
 */
export function addMonths({ y, m, d }, n) {
  const total = y * 12 + (m - 1) + n;
  const ny = Math.floor(total / 12);
  const nm = (((total % 12) + 12) % 12) + 1;
  return { y: ny, m: nm, d: Math.min(d, daysInMonth(ny, nm)) };
}

/**
 * Difference in calendar years, months and days from a to b (a <= b).
 * Finds the largest whole number of months that fits, then counts the
 * remaining days. This never produces negative parts.
 */
export function calendarDiff(a, b) {
  let months = (b.y - a.y) * 12 + (b.m - a.m);
  if (compareDates(addMonths(a, months), b) > 0) months--;
  const days = toDayNumber(b) - toDayNumber(addMonths(a, months));
  return { years: Math.floor(months / 12), months: months % 12, days, totalMonths: months };
}

/** Counts Monday–Friday days in the half-open range [a, b). */
export function countWeekdays(a, b) {
  const start = toDayNumber(a), end = toDayNumber(b);
  if (end <= start) return 0;
  const total = end - start;
  let count = Math.floor(total / 7) * 5;
  const startDow = weekday(a);
  for (let i = 0; i < total % 7; i++) {
    const dow = (startDow + i) % 7;
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
}

/** Everything the Age Calculator shows. */
export function ageDetails(dob, asOf) {
  if (compareDates(dob, asOf) > 0) return { error: 'The date of birth is after the "age on" date. Please check both dates.' };
  const diff = calendarDiff(dob, asOf);
  const totalDays = toDayNumber(asOf) - toDayNumber(dob);
  // Birthday in a given year. Feb 29 birthdays fall on Feb 28 in non-leap years.
  const birthdayIn = (y) => ({ y, m: dob.m, d: dob.m === 2 && dob.d === 29 && !isLeap(y) ? 28 : dob.d });
  let next = birthdayIn(asOf.y);
  if (compareDates(next, asOf) < 0) next = birthdayIn(asOf.y + 1);
  const daysToNext = toDayNumber(next) - toDayNumber(asOf);
  return {
    ...diff,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    remainderDays: totalDays % 7,
    totalHoursApprox: totalDays * 24,
    bornWeekday: WEEKDAYS[weekday(dob)],
    nextBirthday: next,
    nextBirthdayWeekday: WEEKDAYS[weekday(next)],
    daysToNext,
    turning: next.y - dob.y,
    isBirthdayToday: daysToNext === 0,
    leapDayBirth: dob.m === 2 && dob.d === 29,
  };
}

/** Everything the "difference between dates" mode shows. */
export function dateDifference(a, b, includeEnd = false) {
  const swapped = compareDates(a, b) > 0;
  const [start, end0] = swapped ? [b, a] : [a, b];
  const end = includeEnd ? addDays(end0, 1) : end0;
  const days = toDayNumber(end) - toDayNumber(start);
  return {
    swapped,
    days,
    weeks: Math.floor(days / 7),
    weekRemainder: days % 7,
    calendar: calendarDiff(start, end),
    weekdays: countWeekdays(start, end),
    weekendDays: days - countWeekdays(start, end),
    hours: days * 24,
  };
}

/** Adds (or subtracts, with negative amount) days, weeks, months or years. */
export function shiftDate(date, amount, unit) {
  switch (unit) {
    case 'days': return addDays(date, amount);
    case 'weeks': return addDays(date, amount * 7);
    case 'months': return addMonths(date, amount);
    case 'years': return addMonths(date, amount * 12);
    default: throw new Error('Unknown unit');
  }
}

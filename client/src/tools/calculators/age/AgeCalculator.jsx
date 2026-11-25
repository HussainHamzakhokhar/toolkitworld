import { useEffect, useState } from 'react';
import { Cake, RotateCcw } from 'lucide-react';
import { Alert, Stats } from '../../../components/ui';
import ResultCard from '../../../components/ResultCard';
import { ageDetails, formatDate, parseISODate, toISO, todayLocal } from '../../../utils/dates';
import { formatNumber, plural } from '../../../utils/format';
import useTrackOnce from '../../../hooks/useTrackOnce';

export default function AgeCalculator() {
  const [dob, setDob] = useState('');
  const [asOf, setAsOf] = useState('');
  const [today, setToday] = useState('');
  const trackUse = useTrackOnce('age-calculator');
  // "Today" is read after hydration, so the prerendered HTML never contains a stale date.
  useEffect(() => { const t = toISO(todayLocal()); setToday(t); setAsOf(t); }, []);

  const d1 = parseISODate(dob), d2 = parseISODate(asOf);
  let error = '';
  if (dob && !d1) error = 'Please enter a complete, valid date of birth.';
  else if (asOf && !d2) error = 'Please enter a valid “age on” date.';
  const r = !error && d1 && d2 ? ageDetails(d1, d2) : null;
  if (r?.error) error = r.error;
  if (r && !r.error) trackUse();
  const ageText = r && !r.error ? `${plural(r.years, 'year')}, ${plural(r.months, 'month')}, ${plural(r.days, 'day')}` : '';

  return (
    <div className="tool">
      <div className="form-row">
        <div className="field">
          <label className="field__label" htmlFor="age-dob">Date of birth</label>
          <input id="age-dob" type="date" value={dob} max={today || undefined} min="0001-01-01" onChange={(e) => setDob(e.target.value)} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="age-asof">Age on this date</label>
          <input id="age-asof" type="date" value={asOf} min="0001-01-01" onChange={(e) => setAsOf(e.target.value)} />
          <p className="field__hint">Defaults to today. Change it to find an age on any past or future date.</p>
        </div>
      </div>
      <div className="tool__actions">
        <button type="button" className="btn btn--ghost" onClick={() => { setDob(''); setAsOf(today); }} disabled={!dob}>
          <RotateCcw size={16} aria-hidden="true" /> Reset
        </button>
      </div>

      {error && <Alert type="error" title="Check the dates">{error}</Alert>}
      {r && !r.error && (
        <ResultCard label="Age" value={ageText} copyText={ageText}
          summary={`Born on a ${r.bornWeekday}, ${formatDate(d1, false)}.`}>
          {r.years > 130 && <Alert type="warning">That’s an age of over 130 years. Please check the year of birth.</Alert>}
          <Stats items={[
            { label: 'Total months', value: formatNumber(r.totalMonths) },
            { label: 'Total weeks', value: formatNumber(r.totalWeeks), note: r.remainderDays ? `+ ${plural(r.remainderDays, 'day')}` : undefined },
            { label: 'Total days', value: formatNumber(r.totalDays), highlight: true },
            { label: 'Approx. hours', value: formatNumber(r.totalHoursApprox) },
          ]} />
          <div className="birthday-box">
            <Cake aria-hidden="true" />
            <p>
              {r.isBirthdayToday ? <><strong>Happy birthday!</strong> Today is the {r.turning === 0 ? 'day of birth' : `${formatNumber(r.turning)}${ordinal(r.turning)} birthday`}.</> : (
                <>Next birthday: <strong>{formatDate(r.nextBirthday)}</strong> — in <strong>{plural(r.daysToNext, 'day')}</strong>, turning {formatNumber(r.turning)}.</>
              )}
              {r.leapDayBirth && <> Born on 29 February: in years without a leap day, this calculator treats 28 February as the birthday.</>}
            </p>
          </div>
        </ResultCard>
      )}
      {!dob && <p className="tool__placeholder">Choose a date of birth to see the exact age.</p>}
    </div>
  );
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

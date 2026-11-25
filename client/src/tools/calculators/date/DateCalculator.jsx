import { useEffect, useState } from 'react';
import { ArrowLeftRight, CalendarPlus, CalendarRange, RotateCcw } from 'lucide-react';
import { Alert, NumberField, Stats, Tabs } from '../../../components/ui';
import ResultCard from '../../../components/ResultCard';
import { dateDifference, formatDate, parseISODate, shiftDate, toISO, todayLocal } from '../../../utils/dates';
import { formatNumber, parseNum, plural } from '../../../utils/format';
import useTrackOnce from '../../../hooks/useTrackOnce';

const TABS = [
  { id: 'between', label: 'Days between dates', icon: CalendarRange },
  { id: 'add', label: 'Add or subtract', icon: CalendarPlus },
];

export default function DateCalculator() {
  const [mode, setMode] = useState('between');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [includeEnd, setIncludeEnd] = useState(false);
  const [base, setBase] = useState('');
  const [amount, setAmount] = useState('30');
  const [unit, setUnit] = useState('days');
  const [sign, setSign] = useState(1);
  const trackUse = useTrackOnce('date-calculator');

  useEffect(() => { const t = toISO(todayLocal()); setStart(t); setBase(t); }, []);
  const today = () => toISO(todayLocal());

  // ---- between ----
  const a = parseISODate(start), b = parseISODate(end);
  const diff = a && b ? dateDifference(a, b, includeEnd) : null;
  // ---- add ----
  const baseDate = parseISODate(base);
  const n = parseNum(amount);
  const amountError = Number.isNaN(n) || (n !== null && !Number.isInteger(n)) ? 'Enter a whole number, such as 30.' : n !== null && Math.abs(n) > 100000 ? 'Please use a number up to 100,000.' : '';
  let shifted = null;
  if (baseDate && n !== null && !amountError) {
    shifted = shiftDate(baseDate, sign * n, unit);
    if (shifted.y < 1 || shifted.y > 9999) shifted = { error: 'The result is outside the supported range (years 1 to 9999).' };
  }
  if ((diff && mode === 'between') || (shifted && !shifted.error && mode === 'add')) trackUse({ mode });

  return (
    <div className="tool">
      <Tabs label="Date calculation" tabs={TABS} value={mode} onChange={setMode} />
      <div role="tabpanel" aria-labelledby={`tab-${mode}`} className="tool__body">
        {mode === 'between' ? (
          <>
            <div className="form-row form-row--dates">
              <div className="field">
                <label className="field__label" htmlFor="dc-start">Start date</label>
                <input id="dc-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <button type="button" className="icon-btn swap-btn" aria-label="Swap start and end dates" onClick={() => { setStart(end); setEnd(start); }}><ArrowLeftRight size={18} /></button>
              <div className="field">
                <label className="field__label" htmlFor="dc-end">End date</label>
                <input id="dc-end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
            </div>
            <label className="check"><input type="checkbox" checked={includeEnd} onChange={(e) => setIncludeEnd(e.target.checked)} /> Include the end date (count both the first and last day)</label>
            <div className="tool__actions">
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setStart(today())}>Start = today</button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setEnd(today())}>End = today</button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setStart(today()); setEnd(''); setIncludeEnd(false); }}><RotateCcw size={16} aria-hidden="true" /> Reset</button>
            </div>
            {(start && !a) || (end && !b) ? <Alert type="error">Please enter complete, valid dates.</Alert> : null}
            {diff ? (
              <ResultCard label="Duration" value={plural(diff.days, 'day')} copyText={`${diff.days} days`}
                summary={`${diff.swapped ? 'The end date is before the start date, so the dates were swapped. ' : ''}From ${formatDate(diff.swapped ? b : a)} to ${formatDate(diff.swapped ? a : b)}${includeEnd ? ', counting both dates' : ''}.`}>
                <Stats items={[
                  { label: 'Weeks and days', value: `${formatNumber(diff.weeks)} wk ${diff.weekRemainder} d` },
                  { label: 'Calendar time', value: `${diff.calendar.years} y ${diff.calendar.months} m ${diff.calendar.days} d` },
                  { label: 'Weekdays (Mon–Fri)', value: formatNumber(diff.weekdays), highlight: true },
                  { label: 'Weekend days', value: formatNumber(diff.weekendDays) },
                  { label: 'Total months', value: formatNumber(diff.calendar.totalMonths), note: diff.calendar.days ? `+ ${plural(diff.calendar.days, 'day')}` : undefined },
                  { label: 'Hours', value: formatNumber(diff.hours) },
                ]} />
                <p className="field__hint">Weekday counts do not exclude public holidays, which vary by country.</p>
              </ResultCard>
            ) : <p className="tool__placeholder">Choose an end date to count the days.</p>}
          </>
        ) : (
          <>
            <div className="form-row">
              <div className="field">
                <label className="field__label" htmlFor="dc-base">Start date</label>
                <input id="dc-base" type="date" value={base} onChange={(e) => setBase(e.target.value)} />
              </div>
              <div className="field">
                <span className="field__label" id="dc-op">Operation</span>
                <div className="seg" role="radiogroup" aria-labelledby="dc-op">
                  <button type="button" role="radio" aria-checked={sign === 1} className={sign === 1 ? 'is-active' : ''} onClick={() => setSign(1)}>Add</button>
                  <button type="button" role="radio" aria-checked={sign === -1} className={sign === -1 ? 'is-active' : ''} onClick={() => setSign(-1)}>Subtract</button>
                </div>
              </div>
            </div>
            <div className="form-row">
              <NumberField label="Amount" value={amount} onChange={setAmount} error={amountError} placeholder="30" />
              <div className="field">
                <label className="field__label" htmlFor="dc-unit">Unit</label>
                <select id="dc-unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
                  <option value="days">Days</option><option value="weeks">Weeks</option><option value="months">Months</option><option value="years">Years</option>
                </select>
              </div>
            </div>
            {base && !baseDate && <Alert type="error">Please enter a complete, valid start date.</Alert>}
            {shifted?.error && <Alert type="error">{shifted.error}</Alert>}
            {shifted && !shifted.error && (
              <ResultCard label="Result date" value={formatDate(shifted)} copyText={toISO(shifted)}
                summary={`${formatDate(baseDate, false)} ${sign > 0 ? '+' : '−'} ${plural(n, unit.slice(0, -1))} = ${formatDate(shifted, false)}`}>
                {(unit === 'months' || unit === 'years') && baseDate.d > 28 && (
                  <p className="field__hint">When the target month is shorter, the date moves to that month’s last day (for example, 31 January + 1 month = 28 or 29 February).</p>
                )}
              </ResultCard>
            )}
          </>
        )}
      </div>
    </div>
  );
}

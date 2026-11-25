import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Alert, NumberField, Tabs } from '../../../components/ui';
import ResultCard from '../../../components/ResultCard';
import { formatNumber, parseNum } from '../../../utils/format';
import { applyPercent, percentDecrease, percentDifference, percentIncrease, percentOf, whatPercent } from '../../../utils/percentage';
import useTrackOnce from '../../../hooks/useTrackOnce';

const MODES = [
  { id: 'of', label: 'X% of Y', a: 'Percentage (P)', b: 'Number (Y)', aSuffix: '%', fn: percentOf, before: 'What is', mid: '% of', after: '?' },
  { id: 'what', label: 'X is what % of Y', a: 'Part (X)', b: 'Whole (Y)', fn: whatPercent, before: '', mid: 'is what percent of', after: '?' },
  { id: 'increase', label: '% Increase', a: 'Original value', b: 'New value', fn: percentIncrease, before: 'From', mid: 'to', after: '— what is the increase?' },
  { id: 'decrease', label: '% Decrease', a: 'Original value', b: 'New value', fn: percentDecrease, before: 'From', mid: 'to', after: '— what is the decrease?' },
  { id: 'difference', label: '% Difference', a: 'Value A', b: 'Value B', fn: percentDifference, before: 'Difference between', mid: 'and', after: '' },
  { id: 'apply', label: 'Add / subtract %', a: 'Number (Y)', b: 'Percentage (P)', bSuffix: '%', fn: null, before: '', mid: '±', after: '' },
];

export default function PercentageCalculator() {
  const [mode, setMode] = useState('of');
  const [values, setValues] = useState({});
  const [direction, setDirection] = useState(1);
  const trackUse = useTrackOnce('percentage-calculator');
  const m = MODES.find((x) => x.id === mode);
  const v = values[mode] || { a: '', b: '' };
  const set = (k) => (val) => setValues({ ...values, [mode]: { ...v, [k]: val } });

  const a = parseNum(v.a), b = parseNum(v.b);
  const errA = Number.isNaN(a) ? 'Enter a valid number, for example 25 or 12.5.' : '';
  const errB = Number.isNaN(b) ? 'Enter a valid number, for example 200 or 0.75.' : '';
  let result = null;
  if (a !== null && b !== null && !errA && !errB) {
    result = mode === 'apply' ? applyPercent(a, b, direction) : m.fn(a, b);
    if (!result.error) trackUse({ mode });
  }
  const display = result && !result.error ? `${formatNumber(result.value)}${result.unit || ''}` : '';

  return (
    <div className="tool">
      <Tabs label="Calculation type" tabs={MODES} value={mode} onChange={setMode} />
      <div role="tabpanel" aria-labelledby={`tab-${mode}`} className="tool__body">
        <div className="sentence-form">
          {m.before && <span className="sentence-form__word">{m.before}</span>}
          <NumberField label={m.a} value={v.a} onChange={set('a')} suffix={m.aSuffix} error={errA} />
          {mode === 'apply' ? (
            <div className="field">
              <span className="field__label" id="dir-l">Operation</span>
              <div className="seg" role="radiogroup" aria-labelledby="dir-l">
                <button type="button" role="radio" aria-checked={direction === 1} className={direction === 1 ? 'is-active' : ''} onClick={() => setDirection(1)}>Increase by</button>
                <button type="button" role="radio" aria-checked={direction === -1} className={direction === -1 ? 'is-active' : ''} onClick={() => setDirection(-1)}>Decrease by</button>
              </div>
            </div>
          ) : (
            <span className="sentence-form__word">{m.mid}</span>
          )}
          <NumberField label={m.b} value={v.b} onChange={set('b')} suffix={m.bSuffix} error={errB} />
          {m.after && <span className="sentence-form__word">{m.after}</span>}
        </div>

        <div className="tool__actions">
          <button type="button" className="btn btn--ghost" onClick={() => setValues({ ...values, [mode]: { a: '', b: '' } })} disabled={!v.a && !v.b}>
            <RotateCcw size={16} aria-hidden="true" /> Reset
          </button>
        </div>

        {result?.error && <Alert type="error" title="Can’t calculate">{result.error}</Alert>}
        {result && !result.error && (
          <ResultCard value={display} summary={result.summary} formula={result.formula} steps={result.steps} copyText={display} />
        )}
        {!result && !errA && !errB && <p className="tool__placeholder">Enter both values — the answer appears instantly.</p>}
      </div>
    </div>
  );
}

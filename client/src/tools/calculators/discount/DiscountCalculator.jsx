import { useState } from 'react';
import { Plus, RotateCcw, X } from 'lucide-react';
import { Alert, NumberField, Stats, Tabs } from '../../../components/ui';
import { amountDiscount, percentDiscount, reverseDiscount, stackedDiscount, withTax } from '../../../utils/discount';
import { formatMoney, formatNumber, parseNum } from '../../../utils/format';
import useTrackOnce from '../../../hooks/useTrackOnce';

const TABS = [
  { id: 'percent', label: '% off' },
  { id: 'amount', label: 'Amount off' },
  { id: 'reverse', label: 'Original price' },
  { id: 'stacked', label: 'Multiple discounts' },
];
const CURRENCIES = ['$', '€', '£', '₹', '¥', 'Rs', ''];
const err = (n) => (Number.isNaN(n) ? 'Enter a valid number.' : '');

export default function DiscountCalculator() {
  const [mode, setMode] = useState('percent');
  const [cur, setCur] = useState('$');
  const [price, setPrice] = useState('');
  const [pct, setPct] = useState('');
  const [amount, setAmount] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stack, setStack] = useState(['20', '10']);
  const [tax, setTax] = useState('');
  const trackUse = useTrackOnce('discount-calculator');

  const p = parseNum(price), d = parseNum(pct), a = parseNum(amount), s = parseNum(salePrice), t = parseNum(tax);
  const money = (v) => `${cur}${cur.length > 1 ? ' ' : ''}${formatMoney(v)}`;

  let r = null;
  if (mode === 'percent' && p !== null && d !== null && !err(p) && !err(d)) r = percentDiscount(p, d);
  if (mode === 'amount' && p !== null && a !== null && !err(p) && !err(a)) r = amountDiscount(p, a);
  if (mode === 'reverse' && s !== null && d !== null && !err(s) && !err(d)) r = reverseDiscount(s, d);
  if (mode === 'stacked' && p !== null && !err(p)) {
    const list = stack.map(parseNum);
    r = list.some((x) => Number.isNaN(x)) ? { error: 'Each discount must be a number.' } : stackedDiscount(p, list);
  }
  if (r && !r.error && mode !== 'reverse' && t !== null && !err(t)) r = withTax(r, t);
  if (r && !r.error) trackUse({ mode });

  const reset = () => { setPrice(''); setPct(''); setAmount(''); setSalePrice(''); setStack(['20', '10']); setTax(''); };

  return (
    <div className="tool">
      <Tabs label="Discount type" tabs={TABS} value={mode} onChange={setMode} />
      <div role="tabpanel" aria-labelledby={`tab-${mode}`} className="tool__body">
        <div className="form-row">
          {mode === 'reverse' ? (
            <NumberField label="Sale price (after discount)" value={salePrice} onChange={setSalePrice} prefix={cur || undefined} error={err(s)} />
          ) : (
            <NumberField label="Original price" value={price} onChange={setPrice} prefix={cur || undefined} error={err(p)} />
          )}
          {(mode === 'percent' || mode === 'reverse') && <NumberField label="Discount" value={pct} onChange={setPct} suffix="%" error={err(d)} />}
          {mode === 'amount' && <NumberField label="Amount off" value={amount} onChange={setAmount} prefix={cur || undefined} error={err(a)} />}
          <div className="field field--narrow">
            <label className="field__label" htmlFor="dc-cur">Currency</label>
            <select id="dc-cur" value={cur} onChange={(e) => setCur(e.target.value)}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c || 'None'}</option>)}
            </select>
          </div>
        </div>

        {mode === 'stacked' && (
          <fieldset className="stack-list">
            <legend className="field__label">Discounts, applied in order</legend>
            {stack.map((v, i) => (
              <div key={i} className="stack-item">
                <span className="stack-item__n" aria-hidden="true">{i + 1}</span>
                <NumberField label={`Discount ${i + 1}`} value={v} onChange={(val) => setStack(stack.map((x, j) => (j === i ? val : x)))} suffix="%" />
                <button type="button" className="icon-btn" aria-label={`Remove discount ${i + 1}`} disabled={stack.length === 1} onClick={() => setStack(stack.filter((_, j) => j !== i))}><X size={18} /></button>
              </div>
            ))}
            <button type="button" className="btn btn--secondary btn--sm" onClick={() => setStack([...stack, ''])} disabled={stack.length >= 6}><Plus size={16} aria-hidden="true" /> Add another discount</button>
          </fieldset>
        )}

        {mode !== 'reverse' && (
          <div className="form-row">
            <NumberField label="Sales tax / VAT (optional)" value={tax} onChange={setTax} suffix="%" placeholder="0" error={err(t)} hint="Added after the discount." />
          </div>
        )}

        <div className="tool__actions">
          <button type="button" className="btn btn--ghost" onClick={reset}><RotateCcw size={16} aria-hidden="true" /> Reset</button>
        </div>

        {r?.error && <Alert type="error" title="Can’t calculate">{r.error}</Alert>}
        {r && !r.error && (
          <div className="result" aria-live="polite">
            <Stats size="lg" items={[
              mode === 'reverse'
                ? { label: 'Original price', value: money(r.original), highlight: true }
                : { label: 'Final price', value: money(r.final), highlight: true },
              { label: 'You save', value: money(r.saved), note: `${formatNumber(r.pct, 2)}% off` },
              ...(r.tax !== undefined ? [{ label: `Total with ${formatNumber(r.taxPct)}% tax`, value: money(r.totalWithTax), note: `tax ${money(r.tax)}` }] : []),
            ]} />
            <div className="result__work">
              {mode === 'percent' && <p className="result__formula">Final = {money(r.original)} × (1 − {formatNumber(r.pct)}% ) = {money(r.final)}</p>}
              {mode === 'amount' && <p className="result__formula">Discount % = {money(r.saved)} ÷ {money(r.original)} × 100 = {formatNumber(r.pct, 2)}%</p>}
              {mode === 'reverse' && <p className="result__formula">Original = {money(r.final)} ÷ (1 − {formatNumber(r.pct)}%) = {money(r.original)}</p>}
              {mode === 'stacked' && (
                <>
                  <ol className="result__steps">
                    {r.steps.map((st, i) => <li key={i}>{formatNumber(st.pct)}% off {money(st.before)} saves {money(st.saved)} → {money(st.after)}</li>)}
                  </ol>
                  {r.steps.length > 1 && (
                    <p className="field__hint">The combined discount is {formatNumber(r.pct, 2)}%, not {formatNumber(r.naiveSum)}%, because each discount applies to an already-reduced price.</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        {!r && <p className="tool__placeholder">Enter the price and discount to see the final price.</p>}
      </div>
    </div>
  );
}

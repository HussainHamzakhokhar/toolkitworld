import { formatNumber as f } from './format';

/**
 * Percentage maths. Every function returns { value, formula, steps } or
 * { error } so the UI can always explain how a result was reached.
 */
const need = (...nums) => nums.every((n) => typeof n === 'number' && Number.isFinite(n));
const invalid = { error: 'Please enter valid numbers in both fields.' };

export function percentOf(p, y) {
  if (!need(p, y)) return invalid;
  const value = (p / 100) * y;
  return {
    value,
    formula: 'Result = (P ÷ 100) × Y',
    steps: [`Convert ${f(p)}% to a decimal: ${f(p)} ÷ 100 = ${f(p / 100)}`, `Multiply by ${f(y)}: ${f(p / 100)} × ${f(y)} = ${f(value)}`],
    summary: `${f(p)}% of ${f(y)} is ${f(value)}`,
  };
}

export function whatPercent(x, y) {
  if (!need(x, y)) return invalid;
  if (y === 0) return { error: 'The second number (the whole) cannot be 0, because dividing by zero is undefined.' };
  const value = (x / y) * 100;
  return {
    value,
    unit: '%',
    formula: 'Percentage = (X ÷ Y) × 100',
    steps: [`Divide the part by the whole: ${f(x)} ÷ ${f(y)} = ${f(x / y)}`, `Multiply by 100: ${f(x / y)} × 100 = ${f(value)}%`],
    summary: `${f(x)} is ${f(value)}% of ${f(y)}`,
  };
}

/** Signed percentage change from a to b, relative to |a|. */
export function percentChange(a, b) {
  if (!need(a, b)) return invalid;
  if (a === 0) return { error: 'The original value cannot be 0. A change from zero has no defined percentage (it would be infinite).' };
  const diff = b - a;
  const value = (diff / Math.abs(a)) * 100;
  return {
    value,
    unit: '%',
    formula: 'Change % = (New − Original) ÷ |Original| × 100',
    steps: [
      `Find the difference: ${f(b)} − ${f(a)} = ${f(diff)}`,
      `Divide by the original value: ${f(diff)} ÷ ${f(Math.abs(a))} = ${f(diff / Math.abs(a))}`,
      `Multiply by 100: ${f(value)}%`,
    ],
  };
}

export function percentIncrease(a, b) {
  const r = percentChange(a, b);
  if (r.error) return r;
  r.summary =
    r.value >= 0
      ? `From ${f(a)} to ${f(b)} is an increase of ${f(r.value)}%`
      : `From ${f(a)} to ${f(b)} is not an increase — it is a decrease of ${f(-r.value)}%`;
  return r;
}

export function percentDecrease(a, b) {
  const r = percentChange(a, b);
  if (r.error) return r;
  const dec = -r.value;
  return {
    ...r,
    value: dec,
    formula: 'Decrease % = (Original − New) ÷ |Original| × 100',
    steps: [
      `Find the drop: ${f(a)} − ${f(b)} = ${f(a - b)}`,
      `Divide by the original value: ${f(a - b)} ÷ ${f(Math.abs(a))} = ${f((a - b) / Math.abs(a))}`,
      `Multiply by 100: ${f(dec)}%`,
    ],
    summary: dec >= 0
      ? `From ${f(a)} to ${f(b)} is a decrease of ${f(dec)}%`
      : `From ${f(a)} to ${f(b)} is not a decrease — it is an increase of ${f(-dec)}%`,
  };
}

/** Symmetric percentage difference, relative to the average of both values. */
export function percentDifference(a, b) {
  if (!need(a, b)) return invalid;
  const avg = (Math.abs(a) + Math.abs(b)) / 2;
  if (avg === 0) return { error: 'Both values are 0, so there is no difference to measure.' };
  const diff = Math.abs(a - b);
  const value = (diff / avg) * 100;
  return {
    value,
    unit: '%',
    formula: 'Difference % = |A − B| ÷ ((|A| + |B|) ÷ 2) × 100',
    steps: [
      `Absolute difference: |${f(a)} − ${f(b)}| = ${f(diff)}`,
      `Average of the two values: (${f(Math.abs(a))} + ${f(Math.abs(b))}) ÷ 2 = ${f(avg)}`,
      `Divide and multiply by 100: ${f(diff)} ÷ ${f(avg)} × 100 = ${f(value)}%`,
    ],
    summary: `The percentage difference between ${f(a)} and ${f(b)} is ${f(value)}%`,
  };
}

/** Increase (sign=+1) or decrease (sign=-1) a value by p percent. */
export function applyPercent(y, p, sign = 1) {
  if (!need(y, p)) return invalid;
  const amount = (p / 100) * y;
  const value = y + sign * amount;
  const word = sign > 0 ? 'Increasing' : 'Decreasing';
  return {
    value,
    formula: sign > 0 ? 'Result = Y × (1 + P ÷ 100)' : 'Result = Y × (1 − P ÷ 100)',
    steps: [
      `${f(p)}% of ${f(y)} = ${f(amount)}`,
      `${sign > 0 ? 'Add it to' : 'Subtract it from'} ${f(y)}: ${f(y)} ${sign > 0 ? '+' : '−'} ${f(amount)} = ${f(value)}`,
    ],
    summary: `${word} ${f(y)} by ${f(p)}% gives ${f(value)}`,
  };
}

/** Discount maths. Money values are rounded only for display, never mid-calculation. */
export function percentDiscount(price, pct) {
  if (!(price >= 0)) return { error: 'Enter an original price of 0 or more.' };
  if (!(pct >= 0 && pct <= 100)) return { error: 'The discount must be between 0% and 100%.' };
  const saved = (price * pct) / 100;
  return { original: price, saved, final: price - saved, pct };
}

export function amountDiscount(price, amount) {
  if (!(price > 0)) return { error: 'Enter an original price greater than 0.' };
  if (!(amount >= 0)) return { error: 'The discount amount cannot be negative.' };
  if (amount > price) return { error: 'The discount amount cannot be larger than the original price.' };
  return { original: price, saved: amount, final: price - amount, pct: (amount / price) * 100 };
}

/** Original price before a percentage discount was applied. */
export function reverseDiscount(final, pct) {
  if (!(final >= 0)) return { error: 'Enter a sale price of 0 or more.' };
  if (!(pct >= 0 && pct < 100)) return { error: 'The discount must be at least 0% and less than 100% to work backwards.' };
  const original = final / (1 - pct / 100);
  return { original, saved: original - final, final, pct };
}

/** Applies discounts one after another (e.g. 20% off, then an extra 10% off). */
export function stackedDiscount(price, pcts) {
  if (!(price >= 0)) return { error: 'Enter an original price of 0 or more.' };
  const list = pcts.filter((p) => p !== null);
  if (!list.length) return { error: 'Add at least one discount percentage.' };
  if (list.some((p) => !(p >= 0 && p <= 100))) return { error: 'Each discount must be between 0% and 100%.' };
  let current = price;
  const steps = list.map((p) => {
    const before = current;
    current = current * (1 - p / 100);
    return { pct: p, before, after: current, saved: before - current };
  });
  return { original: price, final: current, saved: price - current, pct: price > 0 ? ((price - current) / price) * 100 : 0, steps, naiveSum: list.reduce((a, b) => a + b, 0) };
}

export function withTax(result, taxPct) {
  if (!result || result.error || !(taxPct > 0)) return result;
  const tax = (result.final * taxPct) / 100;
  return { ...result, tax, taxPct, totalWithTax: result.final + tax };
}

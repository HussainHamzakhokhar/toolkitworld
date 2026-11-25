export default {
  intro: 'Work out any everyday percentage: a percent of a number, what percent one number is of another, increases, decreases and differences. Each answer shows the formula and steps.',
  howTo: [
    'Choose the type of calculation from the tabs, such as “X% of Y” or “% Increase”.',
    'Type your two numbers. You can use decimals, negative numbers and thousands separators like 1,250.',
    'Read the answer, which updates as you type, together with the formula and each step used.',
    'Use “Copy result” to paste the answer elsewhere, or “Reset” to start again.',
  ],
  explanationTitle: 'The percentage formulas used',
  explanation: (
    <>
      <p>A percentage is a fraction of 100: 25% means 25 out of every 100, or 0.25. Every mode of the calculator is based on that idea.</p>
      <ul>
        <li><strong>P% of Y</strong> = (P ÷ 100) × Y. For example, 15% of 80 = 0.15 × 80 = 12.</li>
        <li><strong>X is what % of Y</strong> = (X ÷ Y) × 100. For example, 12 out of 80 = 0.15 × 100 = 15%.</li>
        <li><strong>Percentage change</strong> = (New − Original) ÷ |Original| × 100. A positive result is an increase and a negative result is a decrease.</li>
        <li><strong>Percentage difference</strong> = |A − B| ÷ ((|A| + |B|) ÷ 2) × 100. It compares two values without treating either as the starting point.</li>
        <li><strong>Add or subtract P%</strong> = Y × (1 ± P ÷ 100), used for price rises, tax, tips and discounts.</li>
      </ul>
      <p>
        The calculator refuses to divide by zero rather than showing a misleading result: a change from 0 has no defined percentage, and “what percent of 0”
        has no answer. Results are shown with up to six decimal places, and very large or small numbers use scientific notation.
      </p>
    </>
  ),
  examples: [
    { title: 'Tip at a restaurant', body: 'Your bill is 64.50 and you want to leave 18%. Using “X% of Y”: 18% of 64.50 = 11.61, so the total is 76.11.' },
    { title: 'Exam score', body: 'You scored 42 out of 56. Using “X is what % of Y”: 42 ÷ 56 × 100 = 75%.' },
    { title: 'Rent increase', body: 'Rent rises from 1,200 to 1,290. Using “% Increase”: (1,290 − 1,200) ÷ 1,200 × 100 = 7.5%.' },
    { title: 'Comparing two prices', body: 'One shop charges 45 and another 55 for the same item. The percentage difference is 10 ÷ 50 × 100 = 20%.' },
  ],
  benefits: [
    'Six calculation types in one place, so you don’t need a separate calculator for each question.',
    'Step-by-step working helps students learn the method and lets anyone double-check the answer.',
    'Clear warnings for impossible inputs, such as division by zero, instead of confusing results.',
    'Useful for shopping, budgeting, pay rises, grades, statistics, business reports and investments.',
  ],
  faqs: [
    ['How do I calculate a percentage of a number?', 'Divide the percentage by 100 and multiply by the number. For example, 30% of 250 is 0.30 × 250 = 75.'],
    ['What is the difference between percentage change and percentage difference?', 'Percentage change measures a change from an original value to a new value, so direction matters. Percentage difference compares two values on equal terms, using their average as the base.'],
    ['Why is a 50% decrease followed by a 50% increase not back to the start?', 'Each percentage applies to a different base. 100 decreased by 50% is 50, and 50 increased by 50% is only 75.'],
    ['Can percentages be more than 100%?', 'Yes. If a value more than doubles, the increase is over 100%. For example, going from 40 to 100 is a 150% increase.'],
    ['Can I use negative numbers?', 'Yes. For percentage change, the calculator divides by the absolute value of the original number, which is the standard convention when the starting value is negative.'],
  ],
};

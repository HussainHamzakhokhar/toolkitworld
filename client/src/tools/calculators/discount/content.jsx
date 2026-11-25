export default {
  intro: 'Find the sale price and how much you save from a percentage or fixed discount, work backwards to the original price, or combine several discounts. Optional sales tax included.',
  howTo: [
    'Choose a tab: “% off”, “Amount off”, “Original price” (reverse discount) or “Multiple discounts”.',
    'Enter the price and discount. Select your currency symbol if you like — it only changes the display.',
    'Optionally add a sales tax or VAT rate to see the total you will pay at the checkout.',
    'Read the final price, savings and the formula used. For stacked discounts, each step is listed.',
  ],
  explanationTitle: 'How discounts are calculated',
  explanation: (
    <>
      <ul>
        <li><strong>Percentage discount:</strong> savings = price × discount ÷ 100, and final price = price − savings.</li>
        <li><strong>Fixed amount off:</strong> discount % = amount ÷ price × 100.</li>
        <li><strong>Reverse discount:</strong> original price = sale price ÷ (1 − discount ÷ 100). A 25% discount leaving 60 means the original was 60 ÷ 0.75 = 80.</li>
        <li><strong>Multiple discounts:</strong> each discount applies to the already-reduced price, so “20% off, then an extra 10% off” is 28% off overall, not 30%.</li>
      </ul>
      <p>Tax is applied after the discount, which is how most shops calculate it. Amounts are rounded to two decimals only for display; calculations keep full precision.</p>
    </>
  ),
  examples: [
    { title: 'Simple sale', body: 'A jacket costs 80 with 25% off. You save 20 and pay 60.' },
    { title: 'Was it really a bargain?', body: 'A TV is 450 after a 40% discount. The original price was 450 ÷ 0.6 = 750.' },
    { title: 'Stacked offers', body: '200 with 30% off and a further 15% off coupon: 200 → 140 → 119. Total saving 81, or 40.5%.' },
    { title: 'Adding tax', body: '120 with 10% off is 108. With 8% sales tax the total is 116.64.' },
  ],
  benefits: [
    'Check shop discounts and coupon codes before you buy.',
    'See the real combined value of “extra % off” offers.',
    'Work out original prices from sale tags.',
    'Useful for retailers setting sale prices and margins.',
  ],
  faqs: [
    ['How do I calculate a discount?', 'Multiply the price by the discount percentage and divide by 100 to get the saving, then subtract it from the price. 30% off 50 = 15 saved, so you pay 35.'],
    ['Are two discounts of 20% the same as 40% off?', 'No. 20% off then 20% off is 36% off in total, because the second discount applies to the reduced price.'],
    ['How do I find the original price before a discount?', 'Divide the sale price by (1 − discount ÷ 100). The “Original price” tab does this for you.'],
    ['Is tax calculated before or after the discount?', 'Usually after. Rules vary by country and shop, so check your receipt if the totals differ.'],
    ['What does 100% off mean?', 'The item is free. Reverse discounts cannot be calculated at 100% because any original price would give a sale price of 0.'],
  ],
};

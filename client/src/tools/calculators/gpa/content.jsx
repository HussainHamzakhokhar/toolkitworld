export default {
  intro: 'Calculate a weighted semester or cumulative GPA from your courses, credit hours and grades. Pick a common grading scale or edit every grade value to match your institution.',
  howTo: [
    'Choose the grading scale your school uses. Open “View or edit grade points” to check the values and change any that differ.',
    'For each course, enter the credit hours (or units) and select the grade. Course names are optional.',
    'Use “Add course” for more rows, or the bin icon to remove one. Your GPA updates as you go.',
    'To include earlier semesters, open “Add previous semesters” and enter your current cumulative GPA and the credits it covers.',
  ],
  explanationTitle: 'How weighted GPA is calculated',
  explanation: (
    <>
      <p>
        Each grade is converted to grade points using your scale (for example, A = 4.0 and B+ = 3.3 on a common 4.0 scale). Each course’s grade points are
        multiplied by its credit hours to give <em>quality points</em>. Your GPA is the total quality points divided by the total credit hours:
      </p>
      <p className="formula-block">GPA = Σ (grade points × credit hours) ÷ Σ credit hours</p>
      <p>
        Weighting by credits means a 4-credit course affects your GPA twice as much as a 2-credit course. A cumulative GPA works the same way across
        semesters: previous GPA × previous credits gives your earlier quality points, which are added to this semester’s before dividing by all credits.
      </p>
      <p>
        Grading systems vary widely between countries and institutions — some use 4.0, 4.3, 5.0 or 10-point scales, some do not use plus and minus grades,
        and some exclude pass/fail or repeated courses. Always check your institution’s official rules; this calculator lets you match them by editing the scale.
      </p>
    </>
  ),
  examples: [
    { title: 'A typical semester (4.0 scale)', body: 'Maths, 3 credits, A (4.0); Physics, 4 credits, B+ (3.3); Art, 2 credits, C (2.0). Quality points: 12 + 13.2 + 4 = 29.2. GPA = 29.2 ÷ 9 = 3.24.' },
    { title: 'Cumulative GPA', body: 'You had a 3.10 GPA over 60 credits and earned a 3.60 this semester over 15 credits. Cumulative = (3.10 × 60 + 3.60 × 15) ÷ 75 = 3.20.' },
    { title: '10-point scale', body: 'Two 3-credit courses graded O (10) and B (6) give (30 + 18) ÷ 6 = 8.0 on a 10-point scale.' },
  ],
  benefits: [
    'Correctly weights grades by credit hours, which simple averages get wrong.',
    'Works with many grading systems, and every grade value is editable.',
    'Shows a course-by-course breakdown and the exact formula used.',
    'Plan ahead: try different grades to see what you need to reach a target GPA.',
  ],
  faqs: [
    ['What is the difference between GPA and CGPA?', 'GPA usually refers to one term or semester. CGPA (cumulative GPA) covers all terms completed so far, weighted by credits.'],
    ['Do pass/fail courses count toward GPA?', 'At most institutions they do not. Leave them out of the calculator unless your institution says otherwise.'],
    ['Is an A+ worth more than 4.0?', 'It depends on the institution. Many cap A+ at 4.0, while others use 4.3. Choose the matching scale or edit the value.'],
    ['How do I convert my GPA to a percentage?', 'There is no universal conversion. Institutions publish their own formulas, so use the one your school or the receiving organisation specifies.'],
    ['Why is my result different from my transcript?', 'Your institution may exclude some courses, handle repeats differently, or round differently. Check their policy and adjust your inputs.'],
  ],
};

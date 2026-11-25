/**
 * Grade scales. These are common examples only — institutions differ, so the
 * calculator lets users edit every grade and point value.
 */
export const GRADE_SCALES = {
  'us-4.0': {
    name: '4.0 scale with + / − (A+ = 4.0)',
    grades: [['A+', 4.0], ['A', 4.0], ['A-', 3.7], ['B+', 3.3], ['B', 3.0], ['B-', 2.7], ['C+', 2.3], ['C', 2.0], ['C-', 1.7], ['D+', 1.3], ['D', 1.0], ['D-', 0.7], ['F', 0]],
  },
  'us-4.3': {
    name: '4.3 scale (A+ = 4.3)',
    grades: [['A+', 4.3], ['A', 4.0], ['A-', 3.7], ['B+', 3.3], ['B', 3.0], ['B-', 2.7], ['C+', 2.3], ['C', 2.0], ['C-', 1.7], ['D+', 1.3], ['D', 1.0], ['D-', 0.7], ['F', 0]],
  },
  'simple-4.0': {
    name: 'Simple 4.0 scale (A, B, C, D, F)',
    grades: [['A', 4], ['B', 3], ['C', 2], ['D', 1], ['F', 0]],
  },
  'scale-5.0': {
    name: '5.0 scale (A = 5 … F = 0)',
    grades: [['A', 5], ['B', 4], ['C', 3], ['D', 2], ['E', 1], ['F', 0]],
  },
  'scale-10': {
    name: '10-point scale (O = 10 … F = 0)',
    grades: [['O', 10], ['A+', 9], ['A', 8], ['B+', 7], ['B', 6], ['C', 5], ['P', 4], ['F', 0]],
  },
};

/**
 * Weighted GPA = Σ(grade points × credits) ÷ Σ credits.
 * Courses with missing grade or non-positive credits are ignored and reported.
 */
export function calculateGpa(courses, scaleRows, previous = null) {
  const points = new Map(scaleRows.filter((r) => r.grade.trim() !== '').map((r) => [r.grade.trim().toUpperCase(), Number(r.points)]));
  let totalCredits = 0, totalPoints = 0;
  const skipped = [];
  const counted = [];
  courses.forEach((c, i) => {
    const credits = Number(c.credits);
    const gp = points.get(String(c.grade || '').trim().toUpperCase());
    const label = c.name?.trim() || `Course ${i + 1}`;
    if (c.credits === '' && !c.grade) return; // empty row, ignore silently
    if (!Number.isFinite(credits) || credits <= 0) return skipped.push(`${label}: credit hours must be greater than 0`);
    if (gp === undefined || !Number.isFinite(gp)) return skipped.push(`${label}: choose a grade`);
    totalCredits += credits;
    totalPoints += credits * gp;
    counted.push({ label, credits, gp, quality: credits * gp });
  });
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : null;
  let cumulative = null;
  if (previous && previous.credits > 0 && Number.isFinite(previous.gpa)) {
    const credits = previous.credits + totalCredits;
    cumulative = { gpa: (previous.gpa * previous.credits + totalPoints) / credits, credits };
  }
  const maxPoints = Math.max(0, ...points.values());
  return { gpa, totalCredits, totalPoints, skipped, counted, cumulative, maxPoints };
}

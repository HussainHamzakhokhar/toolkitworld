import { useMemo, useRef, useState } from 'react';
import { Plus, RotateCcw, Settings2, Trash2, X } from 'lucide-react';
import { Alert, Stats } from '../../../components/ui';
import { GRADE_SCALES, calculateGpa } from '../../../utils/gpa';
import { formatNumber, parseNum } from '../../../utils/format';
import useTrackOnce from '../../../hooks/useTrackOnce';

const toRows = (key) => GRADE_SCALES[key].grades.map(([grade, points]) => ({ grade, points: String(points) }));

export default function GpaCalculator() {
  const nextId = useRef(5);
  const blank = () => ({ id: nextId.current++, name: '', credits: '', grade: '' });
  const [scaleKey, setScaleKey] = useState('us-4.0');
  const [scaleRows, setScaleRows] = useState(() => toRows('us-4.0'));
  const [customised, setCustomised] = useState(false);
  const [courses, setCourses] = useState(() => [1, 2, 3, 4].map((id) => ({ id, name: '', credits: '', grade: '' })));
  const [prev, setPrev] = useState({ gpa: '', credits: '' });
  const trackUse = useTrackOnce('gpa-calculator');

  const gradeOptions = scaleRows.filter((r) => r.grade.trim());
  const scaleForCalc = scaleRows.map((r) => ({ grade: r.grade, points: parseNum(r.points) }));
  const prevGpa = parseNum(prev.gpa), prevCredits = parseNum(prev.credits);
  const previous = prevGpa !== null && prevCredits ? { gpa: prevGpa, credits: prevCredits } : null;
  const r = useMemo(() => calculateGpa(courses, scaleForCalc, previous), [courses, scaleRows, prev]); // eslint-disable-line
  if (r.gpa !== null) trackUse({ scale: scaleKey });

  const scaleErrors = scaleRows.some((row) => row.grade.trim() && (parseNum(row.points) === null || Number.isNaN(parseNum(row.points))));
  const prevError = (prev.gpa || prev.credits) && (Number.isNaN(prevGpa) || Number.isNaN(prevCredits) || prevGpa === null || !prevCredits || prevCredits < 0)
    ? 'Enter both your previous GPA and the total credit hours it covers.' : '';

  const updateCourse = (id, key, value) => setCourses((cs) => cs.map((c) => (c.id === id ? { ...c, [key]: value } : c)));
  const pickScale = (key) => { setScaleKey(key); setScaleRows(toRows(key)); setCustomised(false); setCourses((cs) => cs.map((c) => ({ ...c, grade: '' }))); };
  const editScale = (i, key, value) => { setScaleRows((rows) => rows.map((row, j) => (j === i ? { ...row, [key]: value } : row))); setCustomised(true); };

  return (
    <div className="tool">
      <div className="form-row">
        <div className="field">
          <label className="field__label" htmlFor="gpa-scale">Grading scale</label>
          <select id="gpa-scale" value={scaleKey} onChange={(e) => pickScale(e.target.value)}>
            {Object.entries(GRADE_SCALES).map(([k, s]) => <option key={k} value={k}>{s.name}</option>)}
          </select>
          <p className="field__hint">{customised ? 'You have customised this scale.' : 'Institutions differ — check your scale and edit it below if needed.'}</p>
        </div>
      </div>

      <details className="scale-editor">
        <summary><Settings2 size={16} aria-hidden="true" /> View or edit grade points</summary>
        <div className="scale-editor__body">
          <table className="mini-table">
            <thead><tr><th scope="col">Grade</th><th scope="col">Points</th><th scope="col"><span className="sr-only">Remove</span></th></tr></thead>
            <tbody>
              {scaleRows.map((row, i) => (
                <tr key={i}>
                  <td><input aria-label={`Grade ${i + 1} label`} value={row.grade} maxLength={4} onChange={(e) => editScale(i, 'grade', e.target.value)} /></td>
                  <td><input aria-label={`Points for grade ${row.grade || i + 1}`} inputMode="decimal" value={row.points} onChange={(e) => editScale(i, 'points', e.target.value)} /></td>
                  <td><button type="button" className="icon-btn icon-btn--sm" aria-label={`Remove grade ${row.grade}`} onClick={() => { setScaleRows((rs) => rs.filter((_, j) => j !== i)); setCustomised(true); }}><X size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="tool__actions">
            <button type="button" className="btn btn--secondary btn--sm" onClick={() => { setScaleRows((rs) => [...rs, { grade: '', points: '' }]); setCustomised(true); }}><Plus size={16} aria-hidden="true" /> Add grade</button>
            {customised && <button type="button" className="btn btn--ghost btn--sm" onClick={() => pickScale(scaleKey)}><RotateCcw size={16} aria-hidden="true" /> Restore preset</button>}
          </div>
          {scaleErrors && <Alert type="warning">Every grade needs a numeric point value.</Alert>}
        </div>
      </details>

      <div className="course-table" role="table" aria-label="Courses">
        <div className="course-row course-row--head" role="row">
          <span role="columnheader">Course (optional)</span><span role="columnheader">Credit hours</span><span role="columnheader">Grade</span><span role="columnheader"><span className="sr-only">Remove</span></span>
        </div>
        {courses.map((c, i) => (
          <div className="course-row" role="row" key={c.id}>
            <span role="cell"><input aria-label={`Course ${i + 1} name`} placeholder={`Course ${i + 1}`} value={c.name} maxLength={60} onChange={(e) => updateCourse(c.id, 'name', e.target.value)} /></span>
            <span role="cell"><input aria-label={`Course ${i + 1} credit hours`} inputMode="decimal" placeholder="3" value={c.credits} onChange={(e) => updateCourse(c.id, 'credits', e.target.value.replace(/[^\d.]/g, ''))} /></span>
            <span role="cell">
              <select aria-label={`Course ${i + 1} grade`} value={c.grade} onChange={(e) => updateCourse(c.id, 'grade', e.target.value)}>
                <option value="">Grade</option>
                {gradeOptions.map((g) => <option key={g.grade} value={g.grade}>{g.grade} ({g.points})</option>)}
              </select>
            </span>
            <span role="cell"><button type="button" className="icon-btn" aria-label={`Remove course ${i + 1}`} onClick={() => setCourses((cs) => cs.filter((x) => x.id !== c.id))} disabled={courses.length === 1}><Trash2 size={18} /></button></span>
          </div>
        ))}
      </div>
      <div className="tool__actions">
        <button type="button" className="btn btn--secondary" onClick={() => setCourses((cs) => [...cs, blank()])}><Plus size={16} aria-hidden="true" /> Add course</button>
        <button type="button" className="btn btn--ghost" onClick={() => { setCourses([blank(), blank(), blank(), blank()]); setPrev({ gpa: '', credits: '' }); }}><RotateCcw size={16} aria-hidden="true" /> Reset</button>
      </div>

      <details className="scale-editor">
        <summary>Add previous semesters (cumulative GPA)</summary>
        <div className="scale-editor__body form-row">
          <div className="field">
            <label className="field__label" htmlFor="gpa-prev">Current cumulative GPA</label>
            <input id="gpa-prev" inputMode="decimal" placeholder="e.g. 3.2" value={prev.gpa} onChange={(e) => setPrev({ ...prev, gpa: e.target.value })} />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="gpa-prevc">Credit hours completed</label>
            <input id="gpa-prevc" inputMode="decimal" placeholder="e.g. 45" value={prev.credits} onChange={(e) => setPrev({ ...prev, credits: e.target.value })} />
          </div>
          {prevError && <Alert type="warning">{prevError}</Alert>}
        </div>
      </details>

      {r.skipped.length > 0 && (
        <Alert type="warning" title="Some courses were not counted">
          <ul>{r.skipped.map((s) => <li key={s}>{s}</li>)}</ul>
        </Alert>
      )}
      {r.gpa !== null ? (
        <div className="result" aria-live="polite">
          <Stats size="lg" items={[
            { label: 'Semester GPA', value: r.gpa.toFixed(2), highlight: true, note: `out of ${formatNumber(r.maxPoints)}` },
            ...(r.cumulative ? [{ label: 'Cumulative GPA', value: r.cumulative.gpa.toFixed(2), note: `${formatNumber(r.cumulative.credits)} credits total` }] : []),
            { label: 'Credit hours', value: formatNumber(r.totalCredits) },
            { label: 'Quality points', value: formatNumber(r.totalPoints, 2) },
          ]} />
          <div className="gpa-bar" aria-hidden="true"><span style={{ width: `${Math.min(100, (r.gpa / (r.maxPoints || 4)) * 100)}%` }} /></div>
          <div className="result__work">
            <p className="result__formula">GPA = Σ (grade points × credit hours) ÷ Σ credit hours = {formatNumber(r.totalPoints, 2)} ÷ {formatNumber(r.totalCredits)} = {r.gpa.toFixed(3)}</p>
            <div className="table-wrap">
              <table className="mini-table mini-table--striped">
                <thead><tr><th scope="col">Course</th><th scope="col">Credits</th><th scope="col">Points</th><th scope="col">Credits × points</th></tr></thead>
                <tbody>{r.counted.map((c, i) => <tr key={i}><td>{c.label}</td><td>{formatNumber(c.credits)}</td><td>{formatNumber(c.gp)}</td><td>{formatNumber(c.quality, 2)}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p className="tool__placeholder">Enter credit hours and a grade for at least one course to see your GPA.</p>
      )}
    </div>
  );
}

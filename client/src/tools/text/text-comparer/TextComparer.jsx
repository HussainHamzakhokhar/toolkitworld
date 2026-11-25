import { useState } from 'react';
import { ArrowLeftRight, GitCompare, Trash2 } from 'lucide-react';
import { Alert, Stats } from '../../../components/ui';
import { compareTexts } from '../../../utils/compare';
import { textStats } from '../../../utils/text';
import { formatNumber } from '../../../utils/format';
import useTrackOnce from '../../../hooks/useTrackOnce';

const MAX = 300_000; // characters per side; beyond this a diff can freeze the page

export default function TextComparer() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [opts, setOpts] = useState({ mode: 'words', ignoreCase: false, ignoreWhitespace: false });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const trackUse = useTrackOnce('text-comparer');
  const sa = textStats(a), sb = textStats(b);

  const compare = () => {
    setError('');
    if (!a.trim() && !b.trim()) { setResult(null); return setError('Paste some text into both boxes first.'); }
    if (a.length > MAX || b.length > MAX) { setResult(null); return setError(`Each text can be up to ${formatNumber(MAX)} characters.`); }
    setResult(compareTexts(a, b, opts));
    trackUse({ mode: opts.mode });
  };

  return (
    <div className="tool">
      <div className="compare-inputs">
        <div className="field">
          <label className="field__label" htmlFor="tc-a">Original text</label>
          <textarea id="tc-a" rows={10} value={a} onChange={(e) => { setA(e.target.value); setResult(null); }} placeholder="Paste the original version…" />
          <p className="field__hint">{formatNumber(sa.words)} words · {formatNumber(sa.characters)} characters</p>
        </div>
        <button type="button" className="icon-btn swap-btn" aria-label="Swap the two texts" onClick={() => { setA(b); setB(a); setResult(null); }}><ArrowLeftRight size={18} /></button>
        <div className="field">
          <label className="field__label" htmlFor="tc-b">Changed text</label>
          <textarea id="tc-b" rows={10} value={b} onChange={(e) => { setB(e.target.value); setResult(null); }} placeholder="Paste the new version…" />
          <p className="field__hint">{formatNumber(sb.words)} words · {formatNumber(sb.characters)} characters</p>
        </div>
      </div>

      <div className="form-row form-row--wrap">
        <div className="field field--narrow">
          <label className="field__label" htmlFor="tc-mode">Compare by</label>
          <select id="tc-mode" value={opts.mode} onChange={(e) => { setOpts({ ...opts, mode: e.target.value }); setResult(null); }}>
            <option value="words">Words</option><option value="chars">Characters</option><option value="lines">Lines</option>
          </select>
        </div>
        <label className="check"><input type="checkbox" checked={opts.ignoreCase} onChange={(e) => { setOpts({ ...opts, ignoreCase: e.target.checked }); setResult(null); }} /> Ignore upper/lower case</label>
        <label className="check"><input type="checkbox" checked={opts.ignoreWhitespace} onChange={(e) => { setOpts({ ...opts, ignoreWhitespace: e.target.checked }); setResult(null); }} /> Ignore extra spaces</label>
      </div>

      <div className="tool__actions">
        <button type="button" className="btn btn--primary" onClick={compare}><GitCompare size={18} aria-hidden="true" /> Compare texts</button>
        <button type="button" className="btn btn--ghost" onClick={() => { setA(''); setB(''); setResult(null); setError(''); }} disabled={!a && !b}><Trash2 size={16} aria-hidden="true" /> Clear both</button>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {result && (
        <div className="result" aria-live="polite">
          {result.identical ? (
            <Alert type="success" title="No differences found">The two texts are identical{opts.ignoreCase || opts.ignoreWhitespace ? ' with the selected options' : ''}.</Alert>
          ) : (
            <>
              <Stats items={[
                { label: 'Words added', value: `+${formatNumber(result.stats.addedWords)}` },
                { label: 'Words removed', value: `−${formatNumber(result.stats.removedWords)}` },
                { label: 'Characters added', value: `+${formatNumber(result.stats.addedChars)}` },
                { label: 'Characters removed', value: `−${formatNumber(result.stats.removedChars)}` },
                { label: 'Similarity', value: `${result.stats.similarity.toFixed(1)}%`, highlight: true },
              ]} />
              <div className="diff-legend" aria-hidden="true">
                <span><ins>added text</ins></span><span><del>removed text</del></span>
              </div>
              <div className={`diff-output${opts.mode === 'lines' ? ' diff-output--lines' : ''}`} aria-label="Differences: insertions marked as added, deletions marked as removed">
                {result.changes.map((c, i) =>
                  c.added ? <ins key={i}><span className="sr-only">[added: </span>{c.value}<span className="sr-only">]</span></ins>
                    : c.removed ? <del key={i}><span className="sr-only">[removed: </span>{c.value}<span className="sr-only">]</span></del>
                      : <span key={i}>{c.value}</span>,
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

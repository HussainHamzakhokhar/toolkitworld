import { useDeferredValue, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { CopyButton, Stats } from '../../../components/ui';
import { formatDuration, textStats, topKeywords } from '../../../utils/text';
import { formatNumber } from '../../../utils/format';
import useTrackOnce from '../../../hooks/useTrackOnce';

export default function WordCounter() {
  const [text, setText] = useState('');
  const deferred = useDeferredValue(text); // keeps typing smooth on very long texts
  const s = textStats(deferred);
  const kw = s.words >= 20 ? topKeywords(deferred, 8) : [];
  const trackUse = useTrackOnce('word-counter');

  return (
    <div className="tool">
      <Stats items={[
        { label: 'Words', value: formatNumber(s.words), highlight: true },
        { label: 'Characters', value: formatNumber(s.characters) },
        { label: 'Characters (no spaces)', value: formatNumber(s.charactersNoSpaces) },
        { label: 'Sentences', value: formatNumber(s.sentences) },
        { label: 'Paragraphs', value: formatNumber(s.paragraphs) },
        { label: 'Reading time', value: formatDuration(s.readingMinutes) },
        { label: 'Speaking time', value: formatDuration(s.speakingMinutes) },
      ]} />
      <div className="field">
        <label className="field__label" htmlFor="wc-text">Your text</label>
        <textarea id="wc-text" className="textarea-lg" rows={12} value={text} placeholder="Start typing or paste your text here…"
          onChange={(e) => { setText(e.target.value); trackUse(); }} spellCheck />
      </div>
      <div className="tool__actions">
        <CopyButton text={text} label="Copy text" />
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setText('')} disabled={!text}><Trash2 size={16} aria-hidden="true" /> Clear</button>
        <span className="tool__meta" aria-live="polite">{s.words ? `${formatNumber(s.words)} words` : ''}</span>
      </div>
      {kw.length > 0 && (
        <div className="keywords">
          <h3 className="keywords__title">Most frequent words</h3>
          <ul>
            {kw.map((k) => <li key={k.word}><span>{k.word}</span><span className="keywords__n">{k.count} · {k.density.toFixed(1)}%</span></li>)}
          </ul>
          <p className="field__hint">Common short words such as “the” and “and” are ignored.</p>
        </div>
      )}
    </div>
  );
}

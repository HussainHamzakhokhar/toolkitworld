import { useDeferredValue, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { CopyButton, NumberField, Stats } from '../../../components/ui';
import { characterBreakdown } from '../../../utils/text';
import { formatNumber, parseNum } from '../../../utils/format';
import useTrackOnce from '../../../hooks/useTrackOnce';

const PRESETS = [
  { id: 'none', label: 'No limit', n: null },
  { id: 'x', label: 'X / Twitter post (280)', n: 280 },
  { id: 'title', label: 'SEO title tag (60)', n: 60 },
  { id: 'meta', label: 'Meta description (160)', n: 160 },
  { id: 'sms', label: 'Single SMS, plain text (160)', n: 160 },
  { id: 'insta', label: 'Instagram caption (2,200)', n: 2200 },
  { id: 'custom', label: 'Custom…', n: null },
];

export default function CharacterCounter() {
  const [text, setText] = useState('');
  const [preset, setPreset] = useState('none');
  const [custom, setCustom] = useState('500');
  const [countSpaces, setCountSpaces] = useState(true);
  const deferred = useDeferredValue(text);
  const b = characterBreakdown(deferred);
  const trackUse = useTrackOnce('character-counter');

  const p = PRESETS.find((x) => x.id === preset);
  const customN = parseNum(custom);
  const limit = preset === 'custom' ? (customN > 0 && Number.isInteger(customN) ? customN : null) : p.n;
  const used = countSpaces ? b.total : b.noSpaces;
  const remaining = limit ? limit - used : null;
  const over = remaining !== null && remaining < 0;

  return (
    <div className="tool">
      <div className="form-row">
        <div className="field">
          <label className="field__label" htmlFor="cc-limit">Character limit</label>
          <select id="cc-limit" value={preset} onChange={(e) => setPreset(e.target.value)}>
            {PRESETS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
        </div>
        {preset === 'custom' && (
          <NumberField label="Custom limit" value={custom} onChange={setCustom} error={customN !== null && !(customN > 0 && Number.isInteger(customN)) ? 'Enter a whole number above 0.' : ''} />
        )}
        <div className="field field--center">
          <label className="check"><input type="checkbox" checked={countSpaces} onChange={(e) => setCountSpaces(e.target.checked)} /> Count spaces toward the limit</label>
        </div>
      </div>

      {limit && (
        <div className={`limit-meter${over ? ' is-over' : remaining <= limit * 0.1 ? ' is-near' : ''}`} aria-live="polite">
          <div className="limit-meter__bar"><span style={{ width: `${Math.min(100, (used / limit) * 100)}%` }} /></div>
          <p className="limit-meter__text">
            <strong>{formatNumber(used)}</strong> / {formatNumber(limit)} —{' '}
            {over ? <span className="text-danger">{formatNumber(-remaining)} over the limit</span> : <span>{formatNumber(remaining)} remaining</span>}
          </p>
        </div>
      )}

      <div className="field">
        <label className="field__label" htmlFor="cc-text">Your text</label>
        <textarea id="cc-text" className="textarea-lg" rows={9} value={text} placeholder="Type or paste text to count its characters…"
          onChange={(e) => { setText(e.target.value); trackUse(); }} aria-describedby="cc-count" />
        <p id="cc-count" className="field__hint">{formatNumber(b.total)} characters including spaces</p>
      </div>
      <div className="tool__actions">
        <CopyButton text={text} label="Copy text" />
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setText('')} disabled={!text}><Trash2 size={16} aria-hidden="true" /> Clear</button>
      </div>

      <Stats items={[
        { label: 'Characters (with spaces)', value: formatNumber(b.total), highlight: true },
        { label: 'Characters (no spaces)', value: formatNumber(b.noSpaces) },
        { label: 'Letters', value: formatNumber(b.letters) },
        { label: 'Numbers', value: formatNumber(b.digits) },
        { label: 'Punctuation', value: formatNumber(b.punctuation) },
        { label: 'Symbols & emoji', value: formatNumber(b.symbols) },
        { label: 'Spaces', value: formatNumber(b.spaces) },
        { label: 'Line breaks', value: formatNumber(b.lineBreaks) },
        { label: 'Size (UTF-8 bytes)', value: formatNumber(b.bytes) },
      ]} />
    </div>
  );
}

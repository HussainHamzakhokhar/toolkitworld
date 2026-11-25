import { useState } from 'react';
import { ArrowDownUp, Download, Trash2 } from 'lucide-react';
import { CopyButton } from '../../../components/ui';
import { CASES } from '../../../utils/text';
import { downloadText } from '../../../utils/download';
import useTrackOnce from '../../../hooks/useTrackOnce';

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('title');
  const trackUse = useTrackOnce('case-converter');
  const current = CASES.find((c) => c.id === mode);
  const output = current.fn(text);

  return (
    <div className="tool">
      <div className="field">
        <label className="field__label" htmlFor="cc-in">Your text</label>
        <textarea id="cc-in" rows={7} value={text} placeholder="Type or paste the text you want to convert…" onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="case-buttons" role="radiogroup" aria-label="Convert to">
        {CASES.map((c) => (
          <button type="button" key={c.id} role="radio" aria-checked={mode === c.id} className={`chip chip--lg${mode === c.id ? ' is-active' : ''}`}
            onClick={() => { setMode(c.id); if (text) trackUse({ case: c.id }); }}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="field">
        <label className="field__label" htmlFor="cc-out">Result — {current.label}</label>
        <textarea id="cc-out" rows={7} value={output} readOnly placeholder="The converted text appears here." className="textarea-output" />
      </div>
      <div className="tool__actions">
        <CopyButton text={output} label="Copy result" className="btn btn--primary btn--sm" />
        <button type="button" className="btn btn--secondary btn--sm" disabled={!output} onClick={() => downloadText(output, `text-${mode}.txt`, 'case-converter')}>
          <Download size={16} aria-hidden="true" /> Download .txt
        </button>
        <button type="button" className="btn btn--ghost btn--sm" disabled={!output || output === text} onClick={() => setText(output)}>
          <ArrowDownUp size={16} aria-hidden="true" /> Use result as input
        </button>
        <button type="button" className="btn btn--ghost btn--sm" disabled={!text} onClick={() => setText('')}><Trash2 size={16} aria-hidden="true" /> Clear</button>
      </div>
    </div>
  );
}

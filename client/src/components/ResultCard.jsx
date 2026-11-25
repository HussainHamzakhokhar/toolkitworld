import { Sigma } from 'lucide-react';
import { CopyButton } from './ui';

/** Shows a calculation result with its formula and numbered steps. aria-live announces changes. */
export default function ResultCard({ label = 'Result', value, summary, formula, steps, children, copyText }) {
  return (
    <div className="result" aria-live="polite">
      <div className="result__top">
        <div>
          <p className="result__label">{label}</p>
          <p className="result__value">{value}</p>
          {summary && <p className="result__summary">{summary}</p>}
        </div>
        {copyText && <CopyButton text={copyText} label="Copy result" />}
      </div>
      {children}
      {(formula || steps?.length) && (
        <div className="result__work">
          {formula && <p className="result__formula"><Sigma size={16} aria-hidden="true" /> <span><span className="sr-only">Formula: </span>{formula}</span></p>}
          {steps?.length > 0 && (
            <ol className="result__steps">{steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
          )}
        </div>
      )}
    </div>
  );
}

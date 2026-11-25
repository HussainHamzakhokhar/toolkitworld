import { ChevronDown } from 'lucide-react';

export default function Faq({ items, headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  return (
    <div className="faq">
      {items.map(([q, a]) => (
        <details key={q} className="faq__item">
          <summary>
            <H className="faq__q">{q}</H>
            <ChevronDown className="faq__chev" aria-hidden="true" />
          </summary>
          <div className="faq__a">{typeof a === 'string' ? <p>{a}</p> : a}</div>
        </details>
      ))}
    </div>
  );
}

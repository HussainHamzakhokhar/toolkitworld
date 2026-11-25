import { Calculator, FileText, Image, Type } from 'lucide-react';

const MAP = {
  Calculators: { icon: Calculator, color: 'blue' },
  PDF: { icon: FileText, color: 'red' },
  Images: { icon: Image, color: 'violet' },
  Text: { icon: Type, color: 'teal' },
};

/** Lightweight decorative header for article cards (CSS + SVG, no image download). */
export default function PostArt({ category, large = false }) {
  const { icon: Icon, color } = MAP[category] || MAP.Calculators;
  return (
    <div className={`post-art post-art--${color}${large ? ' post-art--large' : ''}`} aria-hidden="true">
      <svg className="post-art__grid" viewBox="0 0 200 100" preserveAspectRatio="none">
        <circle cx="170" cy="18" r="46" fill="currentColor" opacity=".12" />
        <circle cx="24" cy="96" r="38" fill="currentColor" opacity=".10" />
        <path d="M0 70 Q50 40 100 62 T200 48" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".25" />
      </svg>
      <span className="post-art__icon"><Icon strokeWidth={1.75} /></span>
    </div>
  );
}

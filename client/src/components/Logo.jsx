import { Link } from 'react-router';

export default function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo${light ? ' logo--light' : ''}`} aria-label="ToolKitWorld home">
      <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="lg-logo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2563EB" />
            <stop offset="1" stopColor="#14B8A6" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#lg-logo)" />
        <rect x="14" y="14" width="15" height="15" rx="4" fill="#fff" />
        <rect x="35" y="14" width="15" height="15" rx="4" fill="#fff" opacity=".7" />
        <rect x="14" y="35" width="15" height="15" rx="4" fill="#fff" opacity=".7" />
        <circle cx="42.5" cy="42.5" r="7.5" fill="#fff" />
      </svg>
      <span>ToolKit<b>World</b></span>
    </Link>
  );
}

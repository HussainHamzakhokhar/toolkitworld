/** Hand-built SVG illustration for the homepage hero: tiny, crisp at any size, no image request. */
export default function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 520 420" role="img" aria-label="Illustration of ToolKitWorld tools: a calculator, a merged PDF, a converted image and a word count">
      <defs>
        <linearGradient id="ha-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#DBEAFE" />
          <stop offset="1" stopColor="#CCFBF1" />
        </linearGradient>
        <linearGradient id="ha-pri" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2563EB" />
          <stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
        <filter id="ha-sh" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0F172A" floodOpacity=".12" />
        </filter>
      </defs>
      <circle cx="300" cy="200" r="180" fill="url(#ha-bg)" />
      <circle cx="455" cy="70" r="26" fill="#14B8A6" opacity=".18" />
      <circle cx="70" cy="330" r="18" fill="#2563EB" opacity=".18" />

      {/* Main window: calculator */}
      <g filter="url(#ha-sh)">
        <rect x="120" y="70" width="280" height="270" rx="22" fill="#fff" />
      </g>
      <rect x="120" y="70" width="280" height="44" rx="22" fill="#F1F5F9" />
      <rect x="120" y="96" width="280" height="18" fill="#F1F5F9" />
      <circle cx="146" cy="92" r="6" fill="#F87171" /><circle cx="166" cy="92" r="6" fill="#FBBF24" /><circle cx="186" cy="92" r="6" fill="#34D399" />
      <rect x="146" y="132" width="228" height="58" rx="12" fill="url(#ha-pri)" />
      <text x="160" y="155" fill="#fff" opacity=".85" fontSize="13" fontFamily="Inter, sans-serif">25% of 80</text>
      <text x="360" y="180" fill="#fff" fontSize="26" fontWeight="700" textAnchor="end" fontFamily="Inter, sans-serif">= 20</text>
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect key={`${r}${c}`} x={146 + c * 59} y={204 + r * 32} width="51" height="24" rx="7"
            fill={c === 3 ? (r === 3 ? '#2563EB' : '#DBEAFE') : '#F1F5F9'} />
        )),
      )}

      {/* PDF card */}
      <g className="hero-art__float hero-art__float--1">
        <g filter="url(#ha-sh)"><rect x="330" y="30" width="170" height="78" rx="16" fill="#fff" /></g>
        <rect x="346" y="46" width="34" height="44" rx="6" fill="#FEE2E2" />
        <text x="363" y="73" fill="#DC2626" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="Inter, sans-serif">PDF</text>
        <text x="392" y="62" fill="#0F172A" fontSize="13" fontWeight="600" fontFamily="Inter, sans-serif">merged.pdf</text>
        <rect x="392" y="74" width="92" height="7" rx="3.5" fill="#F1F5F9" />
        <rect x="392" y="74" width="70" height="7" rx="3.5" fill="#DC2626" />
      </g>

      {/* Image card */}
      <g className="hero-art__float hero-art__float--2">
        <g filter="url(#ha-sh)"><rect x="24" y="214" width="168" height="84" rx="16" fill="#fff" /></g>
        <rect x="40" y="230" width="52" height="52" rx="10" fill="#EDE9FE" />
        <circle cx="56" cy="246" r="6" fill="#A78BFA" />
        <path d="M44 278 L62 258 L74 270 L80 264 L90 278 Z" fill="#7C3AED" />
        <text x="104" y="250" fill="#0F172A" fontSize="13" fontWeight="600" fontFamily="Inter, sans-serif">photo.png</text>
        <circle cx="111" cy="268" r="7" fill="#14B8A6" />
        <path d="M107.5 268 l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
        <text x="124" y="272" fill="#64748B" fontSize="11" fontFamily="Inter, sans-serif">Converted</text>
      </g>

      {/* Word count card */}
      <g className="hero-art__float hero-art__float--3">
        <g filter="url(#ha-sh)"><rect x="300" y="300" width="190" height="82" rx="16" fill="#fff" /></g>
        <text x="318" y="330" fill="#64748B" fontSize="11" fontFamily="Inter, sans-serif">Words</text>
        <text x="318" y="360" fill="#0F172A" fontSize="24" fontWeight="700" fontFamily="Inter, sans-serif">1,248</text>
        <rect x="410" y="322" width="10" height="40" rx="3" fill="#CCFBF1" />
        <rect x="426" y="334" width="10" height="28" rx="3" fill="#99F6E4" />
        <rect x="442" y="314" width="10" height="48" rx="3" fill="#14B8A6" />
        <rect x="458" y="328" width="10" height="34" rx="3" fill="#5EEAD4" />
      </g>
    </svg>
  );
}

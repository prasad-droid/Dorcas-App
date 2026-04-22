export function Logo({ className = "" }) {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <mask id="logoMask">
        {/* Everything white is kept, everything black is cut out */}
        <rect width="240" height="240" fill="white" />
        
        {/* Wrench Handle */}
        <path d="M-20 220 L135 90" stroke="black" strokeWidth="42" strokeLinecap="butt" />
        
        {/* Wrench Head (Outer circle) */}
        <circle cx="135" cy="90" r="38" fill="black" />
        
        {/* Wrench Head Inner Cutout (Making it a C shape) */}
        <circle cx="135" cy="90" r="18" fill="white" />
        {/* Opening for the C shape (cutting towards right) */}
        <polygon points="135,90 200,45 200,135" fill="white" />
        
        {/* Door */}
        <rect x="115" y="150" width="36" height="60" rx="8" fill="black" />
      </mask>
      
      <g mask="url(#logoMask)">
        {/* Solid House Base */}
        <path d="M120 20 L220 100 H190 V210 H50 V100 H20 L120 20Z" fill="currentColor" />
      </g>

      {/* Door detail dot (doorknob) added back over the mask */}
      <circle cx="140" cy="180" r="4" fill="currentColor" />
    </svg>
  );
}

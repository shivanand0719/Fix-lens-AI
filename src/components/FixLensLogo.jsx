import React from 'react';

export function FixLensLogo({ size = 36, glow = true }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        filter: glow ? 'drop-shadow(0 0 12px rgba(249, 115, 22, 0.45))' : 'none',
        flexShrink: 0
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="flOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="flAmberGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        {/* Outer Lens Ring */}
        <circle
          cx="24"
          cy="24"
          r="19"
          stroke="url(#flOrangeGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="95 20"
        />

        {/* Inner Aperture / Iris Ring */}
        <circle
          cx="24"
          cy="24"
          r="12"
          stroke="#3f3f46"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Central Vision Core */}
        <circle
          cx="24"
          cy="24"
          r="6"
          fill="url(#flOrangeGrad)"
        />

        {/* Crosshair / Scan Lines */}
        <line x1="24" y1="5" x2="24" y2="10" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="24" y1="38" x2="24" y2="43" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="5" y1="24" x2="10" y2="24" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="24" x2="43" y2="24" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" />

        {/* AI Sparkle / Star at top-right */}
        <path
          d="M38 7 C38 11, 41 11, 42 11 C41 11, 38 11, 38 15 C38 11, 35 11, 34 11 C35 11, 38 11, 38 7 Z"
          fill="#fed7aa"
        />
      </svg>
    </div>
  );
}

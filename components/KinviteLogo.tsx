import React from "react";

interface KinviteLogoProps {
  className?: string;
  showText?: boolean;
  theme?: "light" | "dark" | "colored";
}

export function KinviteLogo({ className = "size-8", showText = false, theme = "dark" }: KinviteLogoProps) {
  // Gradients and Colors matching the new brand identity
  const textClass = theme === "light" ? "text-neutral-950" : "text-white";

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Vertical Stem Gradient */}
          <linearGradient id="stem-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" /> {/* Indigo / Purple */}
            <stop offset="100%" stopColor="#3B22B2" />
          </linearGradient>

          {/* Overlapping Ribbon Gradient */}
          <linearGradient id="ribbon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" /> {/* Bright Lavender */}
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>

          {/* Sparkles Glow Filter */}
          <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Left Vertical Stem */}
        <path
          d="M 28 20 C 28 16 36 16 36 20 L 36 76 C 36 80 28 80 28 76 Z"
          fill="url(#stem-gradient)"
        />

        {/* 2. Top-Right Folded Ribbon Loop */}
        <path
          d="M 28 36 C 34 32 46 18 62 18 C 70 18 74 24 66 32 L 36 60"
          stroke="url(#ribbon-gradient)"
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3. Bottom-Right Loop */}
        <path
          d="M 36 48 L 58 74 C 64 80 72 76 66 70 C 58 62 46 48 40 42"
          stroke="url(#stem-gradient)"
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 4. Twinkling Sparkles Group */}
        <g className="animate-twinkle" style={{ transformOrigin: "65px 38px" }}>
          {/* Sparkle 1 (Large - Top Right) */}
          <path
            d="M 68 20 Q 68 28 76 28 Q 68 28 68 36 Q 68 28 60 28 Q 68 28 68 20 Z"
            fill="#C084FC"
            filter="url(#glow-filter)"
          />
          
          {/* Sparkle 2 (Medium - Center Right) */}
          <path
            d="M 60 38 Q 60 44 66 44 Q 60 44 60 50 Q 60 44 54 44 Q 60 44 60 38 Z"
            fill="#D8B4FE"
          />

          {/* Sparkle 3 (Small - Bottom Right) */}
          <path
            d="M 72 46 Q 72 50 76 50 Q 72 50 72 54 Q 72 50 68 50 Q 72 50 72 46 Z"
            fill="#E9D5FF"
          />

          {/* Tiny Ambient Dots */}
          <circle cx="78" cy="38" r="1" fill="#C084FC" />
          <circle cx="53" cy="32" r="0.75" fill="#E9D5FF" />
        </g>
      </svg>

      {showText && (
        <span className={`font-outfit font-bold tracking-tight ${textClass}`}>
          Kinvite
        </span>
      )}

    </div>
  );
}

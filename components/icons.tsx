/**
 * The interface icon set.
 *
 * Hand-drawn on a 24-unit grid at a single stroke weight, so they sit together
 * as one family rather than as borrowed pieces. Stroked, not filled, which
 * keeps them legible at the small sizes most of them are used at and lets them
 * inherit colour and weight from the text they sit beside.
 */

type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

const base = (size: number, strokeWidth: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: "false" as const,
});

export const ArrowRight = ({ size = 16, className, strokeWidth = 1.6 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const ArrowUpRight = ({ size = 14, className, strokeWidth = 1.6 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const ChevronLeft = ({ size = 18, className, strokeWidth = 1.6 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const ChevronRight = ({ size = 18, className, strokeWidth = 1.6 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const Close = ({ size = 18, className, strokeWidth = 1.6 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Document = ({ size = 16, className, strokeWidth = 1.5 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </svg>
);

export const Camera = ({ size = 16, className, strokeWidth = 1.5 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2L8 5h8l1.5 2h2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
    <circle cx="12" cy="13" r="3.2" />
  </svg>
);

export const Boot = ({ size = 16, className, strokeWidth = 1.5 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M4 20V4h4v9l7 3 4 1.6V20z" />
    <path d="M8 13h3" />
  </svg>
);

export const Book = ({ size = 16, className, strokeWidth = 1.5 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
    <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H19" />
  </svg>
);

export const Terminal = ({ size = 16, className, strokeWidth = 1.5 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <rect x="3" y="4.5" width="18" height="15" rx="2" />
    <path d="M7.5 10l2.5 2-2.5 2M12.5 14.5h4" />
  </svg>
);

export const Sparkle = ({ size = 16, className, strokeWidth = 1.5 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" />
  </svg>
);

export const Cap = ({ size = 16, className, strokeWidth = 1.5 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M2.5 9 12 5l9.5 4L12 13z" />
    <path d="M6.5 11v4.5c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5V11M21.5 9v5" />
  </svg>
);

export const Dots = ({ size = 20, className, strokeWidth = 2 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <circle cx="5" cy="12" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="19" cy="12" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

export const Github = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
  </svg>
);

export const LinkedIn = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5M2.4 21h5.2V9H2.4zM9.6 9h5v1.6h.1c.7-1.2 2.4-2 4.1-2 4.4 0 5.2 2.6 5.2 6.2V21h-5.2v-5.5c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9.6z" />
  </svg>
);

export const Instagram = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9s.7.8.9 1.4c.1.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4s-.8.7-1.4.9c-.4.1-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9s-.7-.8-.9-1.4c-.1-.4-.3-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4s.8-.7 1.4-.9c.4-.1 1-.3 2.2-.4 1.3-.1 1.7-.1 4.9-.1m0 5.8a4 4 0 1 0 0 8 4 4 0 0 0 0-8m0 6.6a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2m5.1-6.7a.94.94 0 1 1-1.9 0 .94.94 0 0 1 1.9 0" />
  </svg>
);

export const Mail = ({ size = 16, className, strokeWidth = 1.5 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <rect x="2.5" y="5" width="19" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const Play = ({ size = 18, className, strokeWidth = 1.6 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
);

export const Globe = ({ size = 16, className, strokeWidth = 1.5 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
  </svg>
);

export const Calendar = ({ size = 16, className, strokeWidth = 1.5 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
    <path d="M8 14.5h3" />
  </svg>
);

export const Compass = ({ size = 16, className, strokeWidth = 1.5 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.4 8.6l-2 4.8-4.8 2 2-4.8z" />
  </svg>
);

export const Layers = ({ size = 16, className, strokeWidth = 1.5 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M12 3.5l8.5 4.4L12 12.3 3.5 7.9z" />
    <path d="M3.5 12.3l8.5 4.4 8.5-4.4" />
    <path d="M3.5 16.4l8.5 4.4 8.5-4.4" />
  </svg>
);

export const Flame = ({ size = 16, className, strokeWidth = 1.5 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M12 21c3.6 0 6-2.4 6-5.6 0-3.7-3-5.4-3.6-9.4-1.9 1.2-2.6 3-2.6 4.6-1-.6-1.6-1.7-1.6-3C8.3 9 6 11.5 6 15.4 6 18.6 8.4 21 12 21z" />
  </svg>
);

export const Ranking = ({ size = 16, className, strokeWidth = 1.5 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M4 19.5h4V11H4zM10 19.5h4V4h-4zM16 19.5h4v-5.5h-4z" />
  </svg>
);

export const Letterform = ({ size = 16, className, strokeWidth = 1.5 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M3.5 18.5L8.5 5.5l5 13M5.2 14.5h6.6" />
    <path d="M20.5 11.5v7M20.5 13.4a3.4 3.4 0 1 0 0 3.4" />
  </svg>
);

export const Cache = ({ size = 16, className, strokeWidth = 1.5 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <ellipse cx="12" cy="6" rx="7.5" ry="3" />
    <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
    <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
  </svg>
);

export const Bell = ({ size = 16, className, strokeWidth = 1.5 }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M6 9.5a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13.5 6 9.5z" />
    <path d="M10 18.5a2.2 2.2 0 0 0 4 0" />
  </svg>
);

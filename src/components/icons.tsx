import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base: P = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
  width: 20,
  height: 20,
};

export const IconPlay = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 4.8v14.4L19 12z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPause = (p: P) => (
  <svg {...base} {...p}>
    <rect x="6.2" y="4.5" width="4" height="15" rx="1.2" fill="currentColor" stroke="none" />
    <rect x="13.8" y="4.5" width="4" height="15" rx="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconReset = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 12a9 9 0 1 0 2.9-6.6L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export const IconSkip = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 5.5v13l9.5-6.5z" fill="currentColor" stroke="none" />
    <line x1="18.5" y1="5.5" x2="18.5" y2="18.5" />
  </svg>
);

export const IconGear = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z" />
  </svg>
);

export const IconX = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4.5 12.5l5 5L19.5 7" />
  </svg>
);

export const IconMinus = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
);

export const IconPlus = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconVolume = (p: P) => (
  <svg {...base} {...p}>
    <path d="M11 5L6.5 9H3v6h3.5L11 19z" fill="currentColor" stroke="none" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12" />
  </svg>
);

export const IconVolumeOff = (p: P) => (
  <svg {...base} {...p}>
    <path d="M11 5L6.5 9H3v6h3.5L11 19z" fill="currentColor" stroke="none" />
    <path d="M16 9.5l5 5M21 9.5l-5 5" />
  </svg>
);

export const IconEraser = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 20h13" />
    <path d="M5.5 15.5L15 6a2.1 2.1 0 0 1 3 0l2 2a2.1 2.1 0 0 1 0 3l-7.5 7.5a2 2 0 0 1-1.4.6H8.3a2 2 0 0 1-1.4-.6l-1.4-1.4a2.1 2.1 0 0 1 0-3z" />
  </svg>
);

export const TomatoMark = ({ size = 30 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
    <circle cx="16" cy="18" r="12" fill="#ff6b4a" />
    <circle cx="12" cy="15" r="3" fill="#ff8a6e" opacity="0.75" />
    <path
      d="M16 7c-2.2 1.8-5 1.6-6.5 3.4 2.6.2 4.3.9 6.5.9s3.9-.7 6.5-.9C21 8.6 18.2 8.8 16 7z"
      fill="#6fbf73"
    />
    <rect x="15" y="3" width="2" height="5" rx="1" fill="#4c8a50" />
  </svg>
);

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="160 50 360 360"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="160" y="50" width="360" height="360" rx="72" fill="#15304C" />
      <rect x="250" y="132" width="180" height="34" rx="10" fill="#FFFFFF" />
      <rect x="322" y="132" width="36" height="96" rx="10" fill="#FFFFFF" />
      <path
        d="M340,228 C298,228 298,262 340,272 C382,282 382,316 340,316"
        fill="none"
        stroke="#3FAE9A"
        strokeWidth="36"
        strokeLinecap="round"
      />
      <circle cx="340" cy="230" r="18" fill="#15304C" />
    </svg>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark size={size} />
      <span className="text-lg font-semibold">TodoServicios</span>
    </span>
  );
}

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
      <circle
        cx="340"
        cy="230"
        r="150"
        fill="none"
        stroke="#3FAE9A"
        strokeWidth="22"
      />
      <path
        d="M260,235 L315,290 L420,175"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="34"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark size={size} />
      <span className="font-serif text-lg font-semibold">Verifiko</span>
    </span>
  );
}

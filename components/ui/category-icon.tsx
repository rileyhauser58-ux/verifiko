const ICONS: Record<string, React.ReactNode> = {
  gasfiteria: (
    <path d="M16.5 7.5a3 3 0 10-4.24 4.24L5.5 18.5 7 20l6.74-6.74a3 3 0 004.24-4.24l-1.5 1.5-2-2 1.5-1.5z" />
  ),
  electricidad: <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />,
  carpinteria: (
    <>
      <path d="M14.5 3.5l4 4-2.5 2.5-4-4z" />
      <path d="M14 8l-9 9a1.5 1.5 0 002.12 2.12L16 10" />
    </>
  ),
  "mecanica-automotriz": (
    <>
      <path d="M4 17v-4.5l2-5h12l2 5V17" />
      <path d="M4 17h16" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="16.5" cy="17" r="1.5" />
    </>
  ),
  pintura: (
    <>
      <rect x="4" y="6" width="10" height="5" rx="1.5" />
      <path d="M9 11v2.5a1.5 1.5 0 001.5 1.5H13a2 2 0 012 2V20" />
    </>
  ),
  jardineria: (
    <path d="M6 20C6 11 12 4 20 4c0 8-7 14-16 16z M6.5 19.5c2-4 5-7 9-9" />
  ),
  cerrajeria: (
    <>
      <circle cx="8" cy="8" r="4" />
      <path d="M11 11l9 9" />
      <path d="M16 16l2-2M13 19l2-2" />
    </>
  ),
  "aseo-limpieza": (
    <>
      <path d="M15 4L5 14" />
      <path d="M13 6l3 3" />
      <path d="M3.5 20.5l3-3M6.5 17.5l2 2M9 15l3 3" />
    </>
  ),
  "fletes-escombros": (
    <>
      <path d="M3 16V7a1 1 0 011-1h9v10" />
      <path d="M13 10h4l3 3v3h-7" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="17" cy="17" r="1.5" />
    </>
  ),
};

export function CategoryIcon({
  slug,
  className = "h-4 w-4",
}: {
  slug: string;
  className?: string;
}) {
  const icon = ICONS[slug];
  if (!icon) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icon}
    </svg>
  );
}

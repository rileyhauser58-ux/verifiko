function initialsOf(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

export function Avatar({
  src,
  name,
  size = 40,
}: {
  src: string | null;
  name: string;
  size?: number;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary"
    >
      {initialsOf(name)}
    </div>
  );
}

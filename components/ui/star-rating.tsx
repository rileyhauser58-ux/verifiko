function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
      className="h-4 w-4"
    >
      <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.9l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
    </svg>
  );
}

export function StarRating({
  rating,
  reviewCount,
  size = "md",
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
}) {
  const rounded = Math.round(rating);

  return (
    <div className={`flex items-center gap-1.5 ${size === "sm" ? "text-xs" : "text-sm"}`}>
      <div className="flex text-primary">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} filled={i < rounded} />
        ))}
      </div>
      <span className="font-medium">{rating > 0 ? rating.toFixed(1) : "Nuevo"}</span>
      {typeof reviewCount === "number" && (
        <span className="text-muted">
          ({reviewCount} {reviewCount === 1 ? "reseña" : "reseñas"})
        </span>
      )}
    </div>
  );
}

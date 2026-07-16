export default function Loading() {
  return (
    <div>
      <div className="h-8 w-52 animate-pulse rounded bg-black/5 dark:bg-white/10" />

      <div className="mt-6 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-lg border border-border bg-black/5 dark:bg-white/10"
          />
        ))}
      </div>
    </div>
  );
}

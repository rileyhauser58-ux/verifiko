export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="h-8 w-64 animate-pulse rounded bg-black/5 dark:bg-white/10" />
      <div className="mt-2 h-5 w-96 animate-pulse rounded bg-black/5 dark:bg-white/10" />

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-10 animate-pulse rounded-md bg-black/5 dark:bg-white/10"
          />
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-lg border border-border bg-black/5 dark:bg-white/10"
          />
        ))}
      </div>
    </div>
  );
}

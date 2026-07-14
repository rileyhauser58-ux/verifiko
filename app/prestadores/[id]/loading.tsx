export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
        <div className="space-y-2">
          <div className="h-6 w-48 animate-pulse rounded bg-black/5 dark:bg-white/10" />
          <div className="h-4 w-32 animate-pulse rounded bg-black/5 dark:bg-white/10" />
        </div>
      </div>

      <div className="mt-6 h-4 w-40 animate-pulse rounded bg-black/5 dark:bg-white/10" />

      <div className="mt-8 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-black/5 dark:bg-white/10" />
        <div className="h-4 w-full animate-pulse rounded bg-black/5 dark:bg-white/10" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-black/5 dark:bg-white/10" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="h-32 animate-pulse rounded-lg border border-border bg-black/5 dark:bg-white/10" />
      <div className="h-64 animate-pulse rounded-lg border border-border bg-black/5 dark:bg-white/10" />
    </div>
  );
}

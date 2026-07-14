import { type SelectHTMLAttributes } from "react";

export function Select({
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${className}`}
      {...props}
    />
  );
}

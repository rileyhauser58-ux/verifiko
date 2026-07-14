import { type ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "verified";
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  if (variant === "verified") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-trust/10 px-2.5 py-1 text-xs font-medium text-trust">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
          <path
            fillRule="evenodd"
            d="M10 1.5a1 1 0 01.9.56l1.2 2.43 2.68.39a1 1 0 01.55 1.7l-1.94 1.9.46 2.67a1 1 0 01-1.45 1.05L10 10.9l-2.4 1.3a1 1 0 01-1.45-1.05l.46-2.67-1.94-1.9a1 1 0 01.55-1.7l2.68-.39L9.1 2.06a1 1 0 01.9-.56z"
            clipRule="evenodd"
          />
        </svg>
        Verificado
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted">
      {children}
    </span>
  );
}

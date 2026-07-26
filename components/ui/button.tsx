import { type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_2px_8px_-2px_rgba(21,48,76,0.45)] hover:bg-primary-hover hover:shadow-[0_4px_14px_-2px_rgba(21,48,76,0.5)] active:scale-[0.98]",
  secondary:
    "bg-card border border-border text-foreground hover:border-primary/40 hover:bg-primary-tint active:scale-[0.98]",
  ghost:
    "bg-transparent text-foreground hover:bg-primary-tint active:scale-[0.98]",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

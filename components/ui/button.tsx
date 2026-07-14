import { type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary:
    "bg-transparent border border-border text-foreground hover:bg-black/5 dark:hover:bg-white/5",
  ghost: "bg-transparent text-foreground hover:bg-black/5 dark:hover:bg-white/5",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

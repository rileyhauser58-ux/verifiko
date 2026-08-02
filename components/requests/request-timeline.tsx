import { Fragment } from "react";
import type { RequestStatus } from "@/types/domain";

const STEPS: { key: RequestStatus; label: string }[] = [
  { key: "pending", label: "Solicitada" },
  { key: "accepted", label: "Aceptada" },
  { key: "completed", label: "Completada" },
];

export function RequestTimeline({ status }: { status: RequestStatus }) {
  const isTerminalAlt = status === "declined" || status === "cancelled";
  const currentIndex = isTerminalAlt ? 0 : STEPS.findIndex((s) => s.key === status);

  return (
    <div className="flex items-start">
      {STEPS.map((step, i) => {
        const done =
          i < currentIndex ||
          (isTerminalAlt && i === 0) ||
          (status === "completed" && i === currentIndex);
        const current = !isTerminalAlt && i === currentIndex && status !== "completed";
        const isLast = i === STEPS.length - 1;

        return (
          <Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : current
                      ? "bg-primary/15 text-primary ring-2 ring-primary"
                      : "bg-border/60 text-muted"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span
                className={`w-16 text-xs font-medium ${
                  done || current ? "text-foreground" : "text-muted"
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`mt-3.5 h-0.5 flex-1 ${i < currentIndex ? "bg-primary" : "bg-border"}`}
              />
            )}
          </Fragment>
        );
      })}

      {isTerminalAlt && (
        <>
          <div className="mt-3.5 h-0.5 flex-1 bg-border" />
          <div className="flex flex-col items-center gap-1.5 text-center">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-600">
              ✕
            </span>
            <span className="w-16 text-xs font-medium text-foreground">
              {status === "declined" ? "Rechazada" : "Cancelada"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

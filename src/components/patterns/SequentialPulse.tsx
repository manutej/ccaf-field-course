import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function SequentialPulse({
  steps,
  accent = "var(--color-accent)",
  intervalMs = 1600,
}: {
  steps: string[];
  accent?: string;
  intervalMs?: number;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const t = setInterval(() => setI((x) => (x + 1) % steps.length), intervalMs);
    return () => clearInterval(t);
  }, [steps.length, intervalMs]);

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-4 shadow-[var(--shadow-card)]"
      role="list"
      aria-label="Sequential steps"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
          Sequential pulse
        </p>
        <p className="font-mono text-xs text-[var(--color-muted)]">
          {i + 1}/{steps.length}
        </p>
      </div>
      <ol className="space-y-2">
        {steps.map((step, idx) => {
          const active = idx === i;
          return (
            <li key={step}>
              <button
                type="button"
                onClick={() => setI(idx)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-[var(--radius)] border px-3 py-2.5 text-left transition-colors",
                  active
                    ? "border-transparent text-[var(--color-ink)]"
                    : "border-transparent text-[var(--color-ink-soft)] opacity-70 hover:opacity-100",
                )}
                style={
                  active
                    ? {
                        background: "color-mix(in srgb, " + accent + " 12%, white)",
                        boxShadow: "inset 3px 0 0 " + accent,
                      }
                    : undefined
                }
                role="listitem"
                aria-current={active ? "step" : undefined}
              >
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold"
                  style={{
                    background: active ? accent : "var(--color-paper-deep)",
                    color: active ? "white" : "var(--color-muted)",
                  }}
                >
                  {idx + 1}
                </span>
                <span className="text-sm leading-snug md:text-[0.95rem]">{step}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

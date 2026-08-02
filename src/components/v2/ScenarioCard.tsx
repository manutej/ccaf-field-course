import type { Scenario } from "@/data/v2/scenarios";
import { DOMAIN_META } from "@/data/v2/scenarios";
import { cn } from "@/lib/utils";

export function ScenarioCard({
  scenario,
  compact,
  className,
}: {
  scenario: Scenario;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)]",
        compact ? "px-3 py-2.5" : "px-4 py-4",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-ink)] px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--color-paper)]">
          {scenario.family === "signature" ? "SIG" : "OFF"} · {scenario.id}
        </span>
        <span
          className={cn(
            "font-semibold text-[var(--color-ink)]",
            compact ? "text-sm" : "text-base font-[family-name:var(--font-display)]",
          )}
        >
          {scenario.name}
        </span>
      </div>
      {!compact && (
        <>
          <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-ink-soft)]">
            {scenario.narrative}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {scenario.primaryDomains.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--color-line)] bg-[var(--color-surface-2)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-ink-soft)]"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: DOMAIN_META[d].color }}
                />
                {d} · {DOMAIN_META[d].weight}%
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

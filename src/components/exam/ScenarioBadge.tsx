import { DOMAIN_META, type Scenario } from "@/data/scenarios";
import { cn } from "@/lib/utils";

export function ScenarioBadge({
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
        "rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)]",
        compact ? "px-2.5 py-1.5" : "px-4 py-3",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-[var(--color-ink)] px-1.5 font-mono text-[10px] font-medium text-[var(--color-paper)]">
          SC{scenario.number}
        </span>
        <span
          className={cn(
            "font-semibold text-[var(--color-ink)]",
            compact ? "text-sm" : "text-base",
          )}
        >
          {scenario.name}
        </span>
      </div>
      {!compact && (
        <>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
            {scenario.narrative}
          </p>
          {scenario.toolsHint && (
            <p className="mt-2 font-mono text-[11px] text-[var(--color-muted)]">
              Tools: {scenario.toolsHint}
            </p>
          )}
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

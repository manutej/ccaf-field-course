export function FailureModeTable({
  rows,
}: {
  rows: Array<{ bad: string; good: string }>;
}) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] shadow-[var(--shadow-card)]">
      <div className="grid grid-cols-2 border-b border-[var(--color-line)] bg-[var(--color-paper-deep)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
        <div className="px-4 py-2.5">Anti-pattern</div>
        <div className="px-4 py-2.5">Do this instead</div>
      </div>
      <ul className="divide-y divide-[var(--color-line)]">
        {rows.map((r) => (
          <li key={r.bad} className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-[var(--color-danger-soft)]/40 px-4 py-3 text-sm text-[var(--color-danger)]">
              <span className="mr-2 font-mono text-[10px] uppercase tracking-wider opacity-70">
                skip
              </span>
              {r.bad}
            </div>
            <div className="bg-[var(--color-accent-soft)]/50 px-4 py-3 text-sm text-[var(--color-accent-ink)]">
              <span className="mr-2 font-mono text-[10px] uppercase tracking-wider opacity-70">
                use
              </span>
              {r.good}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

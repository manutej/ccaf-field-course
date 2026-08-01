import { course } from "@/data/course";

const colors: Record<string, string> = {
  D1: "#0f6b5c",
  D2: "#1e4d7b",
  D3: "#6b4c9a",
  D4: "#9a5b1a",
  D5: "#8b2e4a",
};

export function WeightRing({ activeId }: { activeId?: string }) {
  const modules = course.modules;
  const r = 54;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const segments = modules.map((m) => {
    const len = (m.weight_pct / 100) * c;
    const seg = { ...m, len, offset };
    offset += len;
    return seg;
  });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-8">
      <svg viewBox="0 0 140 140" className="h-40 w-40 shrink-0" aria-hidden>
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--color-paper-deep)" strokeWidth="16" />
        {segments.map((s) => (
          <circle
            key={s.id}
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke={colors[s.id]}
            strokeWidth={activeId === s.id ? 20 : 16}
            strokeDasharray={`${s.len} ${c - s.len}`}
            strokeDashoffset={-s.offset}
            strokeLinecap="butt"
            transform="rotate(-90 70 70)"
            opacity={activeId && activeId !== s.id ? 0.35 : 1}
          />
        ))}
        <text
          x="70"
          y="66"
          textAnchor="middle"
          className="fill-[var(--color-ink)]"
          style={{ fontSize: "11px", fontFamily: "var(--font-mono)" }}
        >
          60 items
        </text>
        <text
          x="70"
          y="82"
          textAnchor="middle"
          className="fill-[var(--color-muted)]"
          style={{ fontSize: "10px", fontFamily: "var(--font-mono)" }}
        >
          120 min
        </text>
      </svg>
      <ul className="grid w-full gap-2 text-sm">
        {modules.map((m) => (
          <li key={m.id} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: colors[m.id] }}
            />
            <span className="font-mono text-xs text-[var(--color-muted)]">{m.id}</span>
            <span className="min-w-0 flex-1 truncate text-[var(--color-ink-soft)]">
              {m.name}
            </span>
            <span className="font-mono text-xs font-semibold text-[var(--color-ink)]">
              {m.weight_pct}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

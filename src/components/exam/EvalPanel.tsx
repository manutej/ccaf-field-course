import type { AdversarialReport } from "@/lib/exam/adversarial";
import { cn } from "@/lib/utils";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

export function EvalPanel({ report, compact }: { report: AdversarialReport; compact?: boolean }) {
  const Icon =
    report.grade === "exam-ready"
      ? ShieldCheck
      : report.grade === "needs-hardening"
        ? ShieldAlert
        : ShieldX;
  const tone =
    report.grade === "exam-ready"
      ? "text-[var(--color-accent)] bg-[var(--color-accent-soft)]"
      : report.grade === "needs-hardening"
        ? "text-[var(--color-warn)] bg-[var(--color-warn-soft)]"
        : "text-[var(--color-danger)] bg-[var(--color-danger-soft)]";

  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-medium",
          tone,
        )}
        title={report.hardnessNotes.join(" · ")}
      >
        <Icon className="h-3 w-3" aria-hidden />
        {report.score} · {report.grade}
      </span>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-full", tone)}>
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--color-ink)]">Adversarial evaluator</p>
            <p className="font-mono text-[11px] text-[var(--color-muted)]">
              Spec gate · {report.grade} · {report.score}/100
            </p>
          </div>
        </div>
      </div>
      <ul className="mt-3 space-y-1.5">
        {report.criteria.map((c) => (
          <li key={c.id} className="flex items-start gap-2 text-xs text-[var(--color-ink-soft)]">
            <span
              className={cn(
                "mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full",
                c.pass ? "bg-[var(--color-accent)]" : "bg-[var(--color-danger)]",
              )}
            />
            <span>
              <span className="font-medium text-[var(--color-ink)]">{c.label}</span>
              {" — "}
              {c.detail}
            </span>
          </li>
        ))}
      </ul>
      {report.hardnessNotes.length > 0 && (
        <div className="mt-3 border-t border-[var(--color-line)] pt-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
            Hardness notes
          </p>
          <ul className="mt-1 space-y-1 text-xs text-[var(--color-ink-soft)]">
            {report.hardnessNotes.map((n) => (
              <li key={n}>· {n}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

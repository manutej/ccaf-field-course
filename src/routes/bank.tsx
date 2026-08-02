import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EXAM_BANK } from "@/data/exam-bank";
import { SCENARIOS, DOMAIN_META, type ScenarioId, type DomainId } from "@/data/scenarios";
import { evaluateBank, evaluateItem } from "@/lib/exam/adversarial";
import { EvalPanel } from "@/components/exam/EvalPanel";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bank")({
  component: BankPage,
});

function BankPage() {
  const stats = useMemo(() => evaluateBank(EXAM_BANK), []);
  const [scenario, setScenario] = useState<ScenarioId | "all">("all");
  const [domain, setDomain] = useState<DomainId | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return EXAM_BANK.filter((q) => {
      if (scenario !== "all" && q.scenarioId !== scenario) return false;
      if (domain !== "all" && q.domain !== domain) return false;
      return true;
    });
  }, [scenario, domain]);

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
          Item bank · adversarial QA
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold md:text-4xl">
          Hard items gated by spec evaluators
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-soft)]">
          Every practice item is scored for scenario framing, plausible distractors, in-scope
          topics, judgment pressure, and explanation quality — the same hardness bar the Foundations
          guide implies for production tradeoff questions.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["Total", String(stats.total)],
          ["Exam-ready", String(stats.ready)],
          ["Avg score", `${stats.avg}/100`],
          ["Official-style", String(EXAM_BANK.filter((q) => q.officialSample).length)],
        ].map(([k, v]) => (
          <div
            key={k}
            className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-3"
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
              {k}
            </p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold">
              {v}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="text-xs text-[var(--color-muted)]">
          Scenario
          <select
            className="ml-2 rounded-md border border-[var(--color-line)] bg-[var(--color-surface-2)] px-2 py-1.5 text-sm text-[var(--color-ink)]"
            value={scenario}
            onChange={(e) => setScenario(e.target.value as ScenarioId | "all")}
          >
            <option value="all">All six</option>
            {SCENARIOS.map((s) => (
              <option key={s.id} value={s.id}>
                SC{s.number} · {s.short}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-[var(--color-muted)]">
          Domain
          <select
            className="ml-2 rounded-md border border-[var(--color-line)] bg-[var(--color-surface-2)] px-2 py-1.5 text-sm text-[var(--color-ink)]"
            value={domain}
            onChange={(e) => setDomain(e.target.value as DomainId | "all")}
          >
            <option value="all">All domains</option>
            {(Object.keys(DOMAIN_META) as DomainId[]).map((d) => (
              <option key={d} value={d}>
                {d} · {DOMAIN_META[d].name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ul className="space-y-2">
        {filtered.map((q) => {
          const r = evaluateItem(q);
          const open = openId === q.id;
          return (
            <li
              key={q.id}
              className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)]"
            >
              <button
                type="button"
                className="flex w-full items-start gap-3 p-4 text-left"
                onClick={() => setOpenId(open ? null : q.id)}
              >
                <span
                  className={cn(
                    "mt-0.5 shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-medium",
                    r.grade === "exam-ready"
                      ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-ink)]"
                      : "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
                  )}
                >
                  {r.score}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] text-[var(--color-muted)]">
                    {q.id} · {q.scenarioId} · {q.domain} · TS {q.taskStatement}
                    {q.officialSample ? " · §9 sample" : ""}
                  </p>
                  <p className="mt-1 text-sm font-medium leading-snug">{q.stem}</p>
                </div>
              </button>
              {open && (
                <div className="space-y-3 border-t border-[var(--color-line)] px-4 pb-4">
                  <ol className="mt-3 list-decimal space-y-1 pl-5 text-xs text-[var(--color-ink-soft)]">
                    {q.options.map((o, i) => (
                      <li
                        key={i}
                        className={cn(i === q.correctIndex && "font-semibold text-[var(--color-accent-ink)]")}
                      >
                        {o}
                      </li>
                    ))}
                  </ol>
                  <p className="text-xs leading-relaxed text-[var(--color-muted)]">{q.explanation}</p>
                  <EvalPanel report={r} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

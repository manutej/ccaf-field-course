import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EXAM_BANK_V2 } from "@/data/v2/exam-bank";
import { SCENARIOS_V2, type ScenarioId } from "@/data/v2/scenarios";
import { ScenarioCard } from "@/components/v2/ScenarioCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/v2/bank")({
  component: V2BankPage,
});

function V2BankPage() {
  const [sid, setSid] = useState<ScenarioId | "all">("all");
  const [open, setOpen] = useState<string | null>(null);
  const filtered = useMemo(
    () => EXAM_BANK_V2.filter((q) => (sid === "all" ? true : q.scenarioId === sid)),
    [sid],
  );

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-accent)]">
          <Link to="/v2" className="hover:underline">
            v2
          </Link>{" "}
          · dense item bank
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold">
          Skilljar-style stems, full narratives
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--color-ink-soft)]">
          {EXAM_BANK_V2.length} items · {EXAM_BANK_V2.filter((q) => q.skilljarStyle).length} marked
          dense · includes multi-select. Filter by signature or official scenario.
        </p>
      </header>

      <label className="text-xs text-[var(--color-muted)]">
        Scenario
        <select
          className="ml-2 rounded-md border border-[var(--color-line)] bg-[var(--color-surface-2)] px-2 py-1.5 text-sm"
          value={sid}
          onChange={(e) => setSid(e.target.value as ScenarioId | "all")}
        >
          <option value="all">All</option>
          {SCENARIOS_V2.map((s) => (
            <option key={s.id} value={s.id}>
              {s.family === "signature" ? "SIG" : "OFF"} · {s.short}
            </option>
          ))}
        </select>
      </label>

      <ul className="space-y-3">
        {filtered.map((q) => {
          const sc = SCENARIOS_V2.find((s) => s.id === q.scenarioId)!;
          const isOpen = open === q.id;
          return (
            <li
              key={q.id}
              className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)]"
            >
              <button
                type="button"
                className="w-full p-4 text-left"
                onClick={() => setOpen(isOpen ? null : q.id)}
              >
                <p className="font-mono text-[10px] text-[var(--color-muted)]">
                  {q.id} · {q.domain} · TS {q.taskStatement}
                  {q.skilljarStyle ? " · dense" : ""}
                  {q.format === "multi" ? ` · select ${q.selectCount}` : ""}
                </p>
                <p className="mt-1 text-sm font-medium leading-snug">{q.stem}</p>
              </button>
              {isOpen && (
                <div className="space-y-3 border-t border-[var(--color-line)] px-4 pb-4">
                  <ScenarioCard scenario={sc} />
                  <ol className="list-decimal space-y-1.5 pl-5 text-xs text-[var(--color-ink-soft)]">
                    {q.options.map((o, i) => (
                      <li
                        key={i}
                        className={cn(
                          q.correct.includes(i) && "font-semibold text-[var(--color-accent-ink)]",
                        )}
                      >
                        {o}
                      </li>
                    ))}
                  </ol>
                  <p className="text-xs leading-relaxed text-[var(--color-muted)]">{q.explanation}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { course } from "@/data/course";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/drill")({
  component: DrillPage,
});

function DrillPage() {
  const pool = useMemo(() => {
    const all = course.modules.flatMap((m) =>
      m.quiz.map((q) => ({ ...q, moduleId: m.id, moduleName: m.name })),
    );
    // stable shuffle
    const arr = [...all];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (i * 17 + 3) % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 12);
  }, []);

  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(0);
  const q = pool[i];

  function next() {
    if (picked === null || !q) return;
    if (picked === q.correctIndex) setCorrect((c) => c + 1);
    setDone((d) => d + 1);
    setPicked(null);
    if (i + 1 < pool.length) setI(i + 1);
    else setI(pool.length);
  }

  if (!q || i >= pool.length) {
    return (
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
          Drill complete
        </h1>
        <p className="text-lg text-[var(--color-ink-soft)]">
          {correct} of {done} correct on a mixed high-yield set.
        </p>
        <p className="text-sm text-[var(--color-muted)]">
          One-in-eight wrong is not none — re-open the domain lessons where you missed and re-read
          the anti-pattern table.
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            className="rounded-[var(--radius)] bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-[var(--color-paper)]"
            onClick={() => {
              setI(0);
              setPicked(null);
              setCorrect(0);
              setDone(0);
            }}
          >
            Run again
          </button>
          <Link
            to="/modules"
            className="rounded-[var(--radius)] border border-[var(--color-line)] px-4 py-2 text-sm"
          >
            Back to modules
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
          Mixed high-yield drill · {i + 1}/{pool.length}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold">
          Twelve leaves. Any scenario.
        </h1>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
          From {q.moduleName} · {q.id}
        </p>
      </header>

      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-paper-deep)]">
        <div
          className="h-full bg-[var(--color-accent)] transition-all"
          style={{ width: `${(i / pool.length) * 100}%` }}
        />
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-6 shadow-[var(--shadow-card)]">
        <p className="text-lg font-medium leading-snug">{q.prompt}</p>
        <div className="mt-5 space-y-2">
          {q.options.map((opt, oi) => {
            const show = picked !== null;
            const isCorrect = oi === q.correctIndex;
            const isPick = picked === oi;
            return (
              <button
                key={oi}
                type="button"
                disabled={picked !== null}
                onClick={() => setPicked(oi)}
                className={cn(
                  "w-full rounded-[var(--radius)] border px-3 py-3 text-left text-sm",
                  show && isCorrect && "border-[var(--color-accent)] bg-[var(--color-accent-soft)]/50",
                  show && isPick && !isCorrect && "border-[var(--color-danger)] bg-[var(--color-danger-soft)]/50",
                  !show && "border-[var(--color-line)] hover:border-[var(--color-ink)]/30",
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <p className="mt-4 text-sm text-[var(--color-ink-soft)]">
            <span className="font-semibold text-[var(--color-ink)]">Model answer: </span>
            {q.explain}
          </p>
        )}
      </div>

      <button
        type="button"
        disabled={picked === null}
        onClick={next}
        className="rounded-[var(--radius)] bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-paper)] disabled:opacity-40"
      >
        {i + 1 === pool.length ? "Finish" : "Next"}
      </button>
    </div>
  );
}

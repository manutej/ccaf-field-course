import { createFileRoute, Link } from "@tanstack/react-router";
import { course, domainColor } from "@/data/course";
import { useProgress } from "@/lib/course/progress";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/modules/")({
  component: ModulesIndex,
});

function ModulesIndex() {
  const { completedLessons, quizScores } = useProgress();
  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
          Curriculum
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold md:text-4xl">
          Five modules. Thirty task statements. Full blueprint coverage.
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--color-ink-soft)]">
          Study in order. Domain 1 teaches the loop every other domain assumes. Each lesson ends
          with a high-yield drill drawn from the operadic question tree.
        </p>
      </header>
      <ol className="space-y-4">
        {course.modules.map((m, idx) => {
          const done = completedLessons.includes(m.id);
          const quiz = quizScores[m.id];
          return (
            <li key={m.id}>
              <Link
                to="/modules/$moduleId"
                params={{ moduleId: m.id }}
                className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-5 shadow-[var(--shadow-card)] transition hover:border-[var(--color-ink)]/25 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-semibold text-white"
                      style={{ background: domainColor[m.id] }}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-mono text-xs text-[var(--color-muted)]">
                      {m.weight_pct}% of exam
                    </span>
                    {done && (
                      <CheckCircle2 className="h-4 w-4 text-[var(--color-accent)]" />
                    )}
                  </div>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold">
                    {m.name}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{m.one_liner}</p>
                </div>
                <div className="shrink-0 text-left md:text-right">
                  <p className="font-mono text-xs text-[var(--color-muted)]">
                    {m.tasks.length} tasks · {m.quiz.length} drill items
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--color-accent)]">
                    {quiz ? `Last quiz ${quiz.correct}/${quiz.total}` : "Open lesson →"}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

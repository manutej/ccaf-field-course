import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react";
import { FailureModeTable } from "@/components/patterns/FailureModeTable";
import { SequentialPulse } from "@/components/patterns/SequentialPulse";
import { WeightRing } from "@/components/patterns/WeightRing";
import { course, domainColor, getModule } from "@/data/course";
import { useProgress } from "@/lib/course/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/modules/$moduleId")({
  component: ModuleLesson,
});

function ModuleLesson() {
  const { moduleId } = Route.useParams();
  const found = getModule(moduleId);
  if (!found) throw notFound();
  const mod = found;

  const idx = course.modules.findIndex((m) => m.id === mod.id);
  const prev = course.modules[idx - 1];
  const next = course.modules[idx + 1];
  const { markLesson, setQuizScore, completedLessons, quizScores } = useProgress();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const accent = domainColor[mod.id] || "var(--color-accent)";

  const score = useMemo(() => {
    if (!submitted) return null;
    let correct = 0;
    for (const q of mod.quiz) {
      if (answers[q.id] === q.correctIndex) correct += 1;
    }
    return { correct, total: mod.quiz.length };
  }, [submitted, answers, mod.quiz]);

  function submitQuiz() {
    setSubmitted(true);
    let correct = 0;
    for (const q of mod.quiz) {
      if (answers[q.id] === q.correctIndex) correct += 1;
    }
    setQuizScore(mod.id, correct, mod.quiz.length);
    markLesson(mod.id);
  }

  return (
    <article className="space-y-12">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link
          to="/modules"
          className="inline-flex items-center gap-1 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Modules
        </Link>
        <span className="text-[var(--color-line)]">/</span>
        <span className="font-mono text-xs text-[var(--color-muted)]">{mod.id}</span>
        {completedLessons.includes(mod.id) && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-accent-ink)]">
            <Check className="h-3 w-3" /> Completed
          </span>
        )}
      </div>

      <header className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p
            className="font-mono text-xs uppercase tracking-[0.16em]"
            style={{ color: accent }}
          >
            Domain {mod.number ?? idx + 1} · {mod.weight_pct}% of exam
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight md:text-4xl">
            {mod.name}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[var(--color-ink-soft)]">
            {mod.open}
          </p>
          <p className="mt-4 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium leading-relaxed text-[var(--color-ink)]">
            The one move: {mod.one_liner}
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-5 shadow-[var(--shadow-card)]">
          <WeightRing activeId={mod.id} />
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-semibold">
            Procedure — enact it
          </h2>
          <SequentialPulse steps={mod.loop_steps} accent={accent} />
        </div>
        <div>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-semibold">
            Failure modes
          </h2>
          <FailureModeTable rows={mod.anti} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
          Teach blocks
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {mod.teach.map((t, i) => (
            <div
              key={t.h}
              className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-5 shadow-[var(--shadow-card)]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-semibold text-[var(--color-ink)]">{t.h}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">{t.b}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-semibold">
          Task statements from the public guide
        </h2>
        <div className="space-y-3">
          {mod.tasks.map((ts) => (
            <details
              key={ts.id}
              className="group rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] open:shadow-[var(--shadow-card)]"
            >
              <summary className="cursor-pointer list-none px-4 py-3 font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="mr-2 font-mono text-xs text-[var(--color-muted)]">
                  TS {ts.id}
                </span>
                {ts.title}
              </summary>
              <div className="grid gap-4 border-t border-[var(--color-line)] px-4 py-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                    Knowledge of
                  </p>
                  <ul className="space-y-1.5 text-sm text-[var(--color-ink-soft)]">
                    {ts.knowledge.map((k) => (
                      <li key={k.slice(0, 40)} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                    Skills in
                  </p>
                  <ul className="space-y-1.5 text-sm text-[var(--color-ink-soft)]">
                    {ts.skills.map((k) => (
                      <li key={k.slice(0, 40)} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-warn)]" />
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
              High-yield drill
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Leaves from the operadic tree. Explain it back before you mark complete.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {mod.quiz.map((q, qi) => {
            const picked = answers[q.id];
            const show = submitted;
            return (
              <fieldset
                key={q.id}
                className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-5"
              >
                <legend className="px-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                  Q{qi + 1} · {q.difficulty} · {q.id}
                </legend>
                <p className="mt-1 text-[0.95rem] font-medium leading-snug text-[var(--color-ink)]">
                  {q.prompt}
                </p>
                <div className="mt-4 space-y-2" role="radiogroup" aria-label={q.prompt}>
                  {q.options.map((opt, oi) => {
                    const isCorrect = oi === q.correctIndex;
                    const isPick = picked === oi;
                    return (
                      <label
                        key={oi}
                        className={cn(
                          "flex cursor-pointer gap-3 rounded-[var(--radius)] border px-3 py-2.5 text-sm transition",
                          show && isCorrect && "border-[var(--color-accent)] bg-[var(--color-accent-soft)]/40",
                          show && isPick && !isCorrect && "border-[var(--color-danger)] bg-[var(--color-danger-soft)]/40",
                          !show && isPick && "border-[var(--color-ink)] bg-[var(--color-paper-deep)]",
                          !show && !isPick && "border-[var(--color-line)] hover:border-[var(--color-ink)]/30",
                        )}
                      >
                        <input
                          type="radio"
                          className="mt-1"
                          name={q.id}
                          checked={picked === oi}
                          disabled={submitted}
                          onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                        />
                        <span className="min-w-0 flex-1 leading-snug">{opt}</span>
                      </label>
                    );
                  })}
                </div>
                {show && (
                  <p className="mt-3 rounded-[var(--radius)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink-soft)]">
                    <span className="font-semibold text-[var(--color-ink)]">Why: </span>
                    {q.explain}
                  </p>
                )}
              </fieldset>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!submitted ? (
            <button
              type="button"
              onClick={submitQuiz}
              disabled={Object.keys(answers).length < mod.quiz.length}
              className="rounded-[var(--radius)] bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-paper)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Check answers & mark lesson
            </button>
          ) : (
            <p className="rounded-[var(--radius)] bg-[var(--color-accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-ink)]">
              Score {score?.correct}/{score?.total}. Lesson marked complete on this device.
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
            className="rounded-[var(--radius)] border border-[var(--color-line)] px-4 py-2.5 text-sm"
          >
            Retry quiz
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-semibold">
          Official sources
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {mod.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-2 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm hover:border-[var(--color-accent)]"
              >
                <span className="min-w-0 truncate">{s.title}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[var(--color-muted)]" />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          Fallibility stamp: first pass from live official docs as of {course.meta.verified_at}.
          Docs may lag shipped behavior and may postdate the July 2026 exam baseline.
        </p>
      </section>

      <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-line)] pt-6">
        {prev ? (
          <Link
            to="/modules/$moduleId"
            params={{ moduleId: prev.id }}
            className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
          >
            <ArrowLeft className="h-4 w-4" /> {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/modules/$moduleId"
            params={{ moduleId: next.id }}
            className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-[var(--color-paper)]"
          >
            {next.name} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            to="/drill"
            className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white"
          >
            Mixed drill <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </nav>
    </article>
  );
}

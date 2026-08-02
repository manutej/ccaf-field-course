import { useEffect, useMemo, useState } from "react";
import { assembleExam, type ExamForm } from "@/lib/exam/assemble";
import { evaluateItem } from "@/lib/exam/adversarial";
import { DOMAIN_META } from "@/data/scenarios";
import { ScenarioBadge } from "./ScenarioBadge";
import { EvalPanel } from "./EvalPanel";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  RefreshCw,
  XCircle,
  Sparkles,
  BarChart3,
} from "lucide-react";

const LETTERS = ["A", "B", "C", "D"] as const;

type AnswerMap = Record<string, number>;

/** Fixed seed for SSR + first paint; reshuffle after mount for variety. */
const SSR_SEED = 20260801;

export function ExamRunner() {
  const [seed, setSeed] = useState(SSR_SEED);
  const [form, setForm] = useState<ExamForm>(() => assembleExam(SSR_SEED, 4));
  const [phase, setPhase] = useState<"intro" | "run" | "results">("intro");
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [revealed, setRevealed] = useState(false);
  const [showEval, setShowEval] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Client-only: draw a fresh form after hydration to avoid SSR mismatch
    const s = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
    setSeed(s);
    setForm(assembleExam(s, 4));
    setHydrated(true);
  }, []);

  const q = form.questions[qi];
  const report = useMemo(() => (q ? evaluateItem(q) : null), [q]);

  function reshuffle() {
    const s = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
    setSeed(s);
    setForm(assembleExam(s, 4));
    setPhase("intro");
    setQi(0);
    setAnswers({});
    setRevealed(false);
    setShowEval(false);
    setStartedAt(null);
  }

  function start() {
    setPhase("run");
    setStartedAt(Date.now());
    setQi(0);
    setAnswers({});
    setRevealed(false);
  }

  function pick(oi: number) {
    if (!q || revealed) return;
    setAnswers((a) => ({ ...a, [q.id]: oi }));
    setRevealed(true);
  }

  function next() {
    if (qi + 1 >= form.questions.length) {
      setPhase("results");
      return;
    }
    setQi((i) => i + 1);
    setRevealed(false);
    setShowEval(false);
  }

  const score = useMemo(() => {
    let correct = 0;
    for (const item of form.questions) {
      if (answers[item.id] === item.correctIndex) correct += 1;
    }
    return { correct, total: form.questions.length };
  }, [answers, form.questions]);

  const scaled = useMemo(() => {
    if (score.total === 0) return 100;
    const raw = score.correct / score.total;
    return Math.round(100 + raw * 900);
  }, [score]);

  const byDomain = useMemo(() => {
    const m: Record<string, { c: number; t: number }> = {};
    for (const item of form.questions) {
      m[item.domain] ??= { c: 0, t: 0 };
      m[item.domain].t += 1;
      if (answers[item.id] === item.correctIndex) m[item.domain].c += 1;
    }
    return m;
  }, [answers, form.questions]);

  if (phase === "intro") {
    return (
      <div className="space-y-8">
        <header className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Scenario exam · randomized form
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight md:text-4xl">
            Four scenarios. Drawn like the real sitting.
          </h1>
          <p className="max-w-2xl text-[var(--color-ink-soft)] leading-relaxed">
            The CCAR-F exam presents{" "}
            <strong className="text-[var(--color-ink)]">4 scenarios from a bank of 6</strong>. This
            simulator draws a fresh set, loads hard judgment items (including official sample stems
            from the public guide), and runs an adversarial evaluator so every item meets exam-style
            hardness gates.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Sparkles,
              t: hydrated ? `Seed ${seed}` : "Drawing form…",
              d: `${form.meta.bankUsed} items · avg eval ${form.meta.avgEvalScore}/100`,
            },
            {
              icon: Clock,
              t: "~25–35 min",
              d: "Practice form (real exam is 60 items / 120 min)",
            },
            {
              icon: BarChart3,
              t: `${form.meta.officialSampleCount} official-style`,
              d: "Guide §9 samples mixed with original hard items",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-4 shadow-[var(--shadow-card)]"
            >
              <c.icon className="mb-2 h-4 w-4 text-[var(--color-accent)]" aria-hidden />
              <p className="font-semibold text-[var(--color-ink)]">{c.t}</p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">{c.d}</p>
            </div>
          ))}
        </div>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-semibold">
            This form’s scenarios
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {form.scenarios.map((sc) => (
              <ScenarioBadge key={sc.id} scenario={sc} />
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)] transition-transform duration-150 active:scale-[0.96]"
          >
            Begin exam
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={reshuffle}
            className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface-2)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition-transform duration-150 active:scale-[0.96]"
          >
            <RefreshCw className="h-4 w-4" />
            Draw new scenarios
          </button>
        </div>
      </div>
    );
  }

  if (phase === "results") {
    const pass = scaled >= 720;
    const elapsed =
      startedAt != null ? Math.round((Date.now() - startedAt) / 60000) : null;
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <div
          className={cn(
            "rounded-[var(--radius-lg)] border p-8 text-center",
            pass
              ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]/40"
              : "border-[var(--color-danger)] bg-[var(--color-danger-soft)]/40",
          )}
        >
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Illustrative scaled score
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-5xl font-semibold tabular-nums">
            {scaled}
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            {score.correct}/{score.total} correct · cut score 720
            {elapsed != null ? ` · ~${elapsed} min` : ""}
          </p>
          <p className="mt-4 text-lg font-semibold">
            {pass
              ? "Above practice cut — keep domain weak spots honest."
              : "Below practice cut — reopen tree leaves you missed."}
          </p>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
            Percent-correct by domain
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Real score reports show domain % for study guidance (not pass determination).
          </p>
          <ul className="mt-4 space-y-2">
            {Object.entries(byDomain).map(([d, v]) => {
              const pct = Math.round((v.c / v.t) * 100);
              const meta = DOMAIN_META[d as keyof typeof DOMAIN_META];
              return (
                <li key={d}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">
                      {d} · {meta?.name}
                    </span>
                    <span className="font-mono text-xs">
                      {v.c}/{v.t} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--color-paper-deep)]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: meta?.color }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
            Item review
          </h2>
          {form.questions.map((item) => {
            const ok = answers[item.id] === item.correctIndex;
            return (
              <div
                key={item.id}
                className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-4"
              >
                <div className="flex items-start gap-2">
                  {ok ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-danger)]" />
                  )}
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-[var(--color-muted)]">
                      {item.id} · SC{item.scenario.number} · {item.domain} · TS{" "}
                      {item.taskStatement}
                    </p>
                    <p className="mt-1 text-sm font-medium leading-snug">{item.stem}</p>
                    {!ok && (
                      <p className="mt-2 text-xs text-[var(--color-ink-soft)]">
                        <span className="font-semibold text-[var(--color-ink)]">Model: </span>
                        {item.options[item.correctIndex]}
                      </p>
                    )}
                    <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)]">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={reshuffle}
          className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)]"
        >
          <RefreshCw className="h-4 w-4" />
          New random form
        </button>
      </div>
    );
  }

  if (!q || !report) return null;
  const picked = answers[q.id];
  const progress = ((qi + (revealed ? 1 : 0)) / form.questions.length) * 100;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
          Item {qi + 1} / {form.questions.length} · seed {form.seed}
        </p>
        <EvalPanel report={report} compact />
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-paper-deep)]">
        <div
          className="h-full bg-[var(--color-accent)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ScenarioBadge scenario={q.scenario} compact />

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-5 shadow-[var(--shadow-card)] md:p-6">
        <p className="font-mono text-[10px] text-[var(--color-muted)]">
          {q.id}
          {q.officialSample ? " · official sample stem" : ""} · {q.domain} · TS {q.taskStatement} ·{" "}
          {q.difficulty}
        </p>
        <p className="mt-3 text-lg font-medium leading-snug text-[var(--color-ink)]">{q.stem}</p>

        <div className="mt-5 space-y-2" role="listbox" aria-label="Answer choices">
          {q.options.map((opt, oi) => {
            const show = revealed;
            const isCorrect = oi === q.correctIndex;
            const isPick = picked === oi;
            return (
              <button
                key={oi}
                type="button"
                role="option"
                aria-selected={isPick}
                disabled={revealed}
                onClick={() => pick(oi)}
                className={cn(
                  "flex w-full gap-3 rounded-[var(--radius)] border px-3 py-3 text-left text-sm transition-colors duration-150",
                  !show &&
                    "border-[var(--color-line)] hover:border-[var(--color-ink)]/25 hover:bg-[var(--color-paper)]",
                  show && isCorrect && "border-[var(--color-accent)] bg-[var(--color-accent-soft)]/50",
                  show &&
                    isPick &&
                    !isCorrect &&
                    "border-[var(--color-danger)] bg-[var(--color-danger-soft)]/50",
                  show && !isCorrect && !isPick && "border-[var(--color-line)] opacity-60",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-semibold",
                    show && isCorrect
                      ? "bg-[var(--color-accent)] text-white"
                      : show && isPick
                        ? "bg-[var(--color-danger)] text-white"
                        : "bg-[var(--color-paper-deep)] text-[var(--color-ink-soft)]",
                  )}
                >
                  {LETTERS[oi]}
                </span>
                <span className="leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="mt-5 space-y-3 border-t border-[var(--color-line)] pt-4">
            <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
              <span className="font-semibold text-[var(--color-ink)]">Why: </span>
              {q.explanation}
            </p>
            <ul className="space-y-1 text-xs text-[var(--color-muted)]">
              {q.distractorNotes.map((n, i) => (
                <li key={i}>
                  <span className="font-mono text-[var(--color-ink-soft)]">
                    {LETTERS.filter((_, j) => j !== q.correctIndex)[i] ?? "·"} trap:
                  </span>{" "}
                  {n}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setShowEval((v) => !v)}
              className="text-xs font-semibold text-[var(--color-accent)] underline-offset-2 hover:underline"
            >
              {showEval ? "Hide" : "Show"} adversarial spec gate
            </button>
            {showEval && <EvalPanel report={report} />}
          </div>
        )}
      </div>

      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={reshuffle}
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]"
        >
          Abort & reshuffle
        </button>
        <button
          type="button"
          disabled={!revealed}
          onClick={next}
          className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-paper)] disabled:opacity-40 transition-transform duration-150 active:scale-[0.96]"
        >
          {qi + 1 >= form.questions.length ? "See results" : "Next item"}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

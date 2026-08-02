import { useEffect, useMemo, useState } from "react";
import {
  assembleV2,
  isCorrect,
  SSR_SEED,
  type ExamFormV2,
} from "@/lib/exam/v2/assemble";
import { DOMAIN_META } from "@/data/v2/scenarios";
import { ScenarioCard } from "./ScenarioCard";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  XCircle,
  Layers,
  Sparkles,
  ListChecks,
} from "lucide-react";

const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

export function ExamRunnerV2() {
  const [form, setForm] = useState<ExamFormV2>(() => assembleV2(SSR_SEED, 4));
  const [phase, setPhase] = useState<"intro" | "run" | "results">("intro");
  const [qi, setQi] = useState(0);
  /** selected option indices for current + past answers */
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [revealed, setRevealed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [pending, setPending] = useState<number[]>([]);

  useEffect(() => {
    const s = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
    setForm(assembleV2(s, 4));
    setHydrated(true);
  }, []);

  const q = form.questions[qi];

  function reshuffle() {
    const s = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
    setForm(assembleV2(s, 4));
    setPhase("intro");
    setQi(0);
    setAnswers({});
    setRevealed(false);
    setPending([]);
  }

  function start() {
    setPhase("run");
    setQi(0);
    setAnswers({});
    setRevealed(false);
    setPending([]);
  }

  function toggleOption(oi: number) {
    if (!q || revealed) return;
    if (q.format === "single") {
      setPending([oi]);
      return;
    }
    setPending((prev) => {
      if (prev.includes(oi)) return prev.filter((x) => x !== oi);
      const max = q.selectCount ?? 2;
      if (prev.length >= max) return [...prev.slice(1), oi];
      return [...prev, oi];
    });
  }

  function lockAnswer() {
    if (!q || pending.length === 0) return;
    if (q.format === "multi" && pending.length !== (q.selectCount ?? 2)) return;
    setAnswers((a) => ({ ...a, [q.id]: [...pending] }));
    setRevealed(true);
  }

  function next() {
    if (qi + 1 >= form.questions.length) {
      setPhase("results");
      return;
    }
    setQi((i) => i + 1);
    setRevealed(false);
    setPending([]);
  }

  const score = useMemo(() => {
    let correct = 0;
    for (const item of form.questions) {
      const sel = answers[item.id];
      if (sel && isCorrect(item, sel)) correct += 1;
    }
    return { correct, total: form.questions.length };
  }, [answers, form.questions]);

  const scaled = useMemo(() => {
    if (!score.total) return 100;
    return Math.round(100 + (score.correct / score.total) * 900);
  }, [score]);

  const byDomain = useMemo(() => {
    const m: Record<string, { c: number; t: number }> = {};
    for (const item of form.questions) {
      m[item.domain] ??= { c: 0, t: 0 };
      m[item.domain].t += 1;
      if (answers[item.id] && isCorrect(item, answers[item.id]!)) m[item.domain].c += 1;
    }
    return m;
  }, [answers, form.questions]);

  if (phase === "intro") {
    return (
      <div className="space-y-8">
        <header className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Field course v2 · Skilljar-density forms
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight md:text-4xl">
            Production scenarios. Root-cause stems. Real distractors.
          </h1>
          <p className="max-w-2xl text-[var(--color-ink-soft)] leading-relaxed">
            Version 2 mirrors the texture of high-quality practice exams: each item sits under a full
            system narrative (moderation, docs, platform engineering, or official guide scenarios),
            uses concrete production metrics, and often asks for the root cause{" "}
            <em>and</em> the fix — not vocabulary trivia. Multi-response items appear when the
            blueprint expects them.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: Layers,
              t: "2 signature + 2 official",
              d: "Form draws signature use-cases plus official bank scenarios",
            },
            {
              icon: Sparkles,
              t: hydrated
                ? `${form.meta.skilljarStyleCount}/${form.questions.length} dense stems`
                : "Assembling…",
              d: "Skilljar-style production incidents with metrics",
            },
            {
              icon: ListChecks,
              t: `${form.meta.multiCount} multi-select`,
              d: "Including Select-N items like adaptive decomposition",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-4 shadow-[var(--shadow-card)]"
            >
              <c.icon className="mb-2 h-4 w-4 text-[var(--color-accent)]" />
              <p className="text-sm font-semibold">{c.t}</p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">{c.d}</p>
            </div>
          ))}
        </div>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
            This form’s scenarios
          </h2>
          <div className="grid gap-3 lg:grid-cols-2">
            {form.scenarios.map((sc) => (
              <ScenarioCard key={sc.id} scenario={sc} />
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)] transition-transform duration-150 active:scale-[0.96]"
          >
            Begin v2 exam
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={reshuffle}
            className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface-2)] px-5 py-3 text-sm font-semibold"
          >
            <RefreshCw className="h-4 w-4" />
            Draw new form
          </button>
        </div>
      </div>
    );
  }

  if (phase === "results") {
    const pass = scaled >= 720;
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
            Illustrative scaled score · v2
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-5xl font-semibold tabular-nums">
            {scaled}
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            {score.correct}/{score.total} correct · cut 720
          </p>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
            By domain
          </h2>
          <ul className="mt-3 space-y-2">
            {Object.entries(byDomain).map(([d, v]) => {
              const pct = Math.round((v.c / v.t) * 100);
              const meta = DOMAIN_META[d as keyof typeof DOMAIN_META];
              return (
                <li key={d}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>
                      {d} · {meta?.name}
                    </span>
                    <span className="font-mono text-xs">
                      {v.c}/{v.t} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--color-paper-deep)]">
                    <div
                      className="h-full rounded-full"
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
            const ok = answers[item.id] ? isCorrect(item, answers[item.id]!) : false;
            return (
              <div
                key={item.id}
                className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-4"
              >
                <div className="flex gap-2">
                  {ok ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-danger)]" />
                  )}
                  <div>
                    <p className="font-mono text-[10px] text-[var(--color-muted)]">
                      {item.id} · {item.scenario.name} · {item.domain}
                      {item.skilljarStyle ? " · dense" : ""}
                    </p>
                    <p className="mt-1 text-sm font-medium leading-snug">{item.stem}</p>
                    <p className="mt-2 text-xs text-[var(--color-muted)]">{item.explanation}</p>
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
          New v2 form
        </button>
      </div>
    );
  }

  if (!q) return null;
  const sel = answers[q.id] ?? pending;
  const need =
    q.format === "multi" ? (q.selectCount ?? 2) : 1;
  const canLock =
    q.format === "single" ? pending.length === 1 : pending.length === need;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
          Item {qi + 1}/{form.questions.length} · seed {form.seed}
        </p>
        <span className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface-2)] px-2.5 py-0.5 font-mono text-[10px] text-[var(--color-ink-soft)]">
          {q.format === "multi" ? `Select ${need}` : "Select 1"} · {q.difficulty}
          {q.skilljarStyle ? " · dense" : ""}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-paper-deep)]">
        <div
          className="h-full bg-[var(--color-accent)] transition-all"
          style={{ width: `${((qi + (revealed ? 1 : 0)) / form.questions.length) * 100}%` }}
        />
      </div>

      <ScenarioCard scenario={q.scenario} />

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-5 shadow-[var(--shadow-card)] md:p-6">
        <p className="font-mono text-[10px] text-[var(--color-muted)]">
          {q.id} · {q.domain} · TS {q.taskStatement}
        </p>
        <p className="mt-3 text-lg font-medium leading-snug">{q.stem}</p>
        {q.format === "multi" && (
          <p className="mt-2 text-xs font-semibold text-[var(--color-accent)]">
            Select {need} responses
          </p>
        )}

        <div className="mt-5 space-y-2">
          {q.options.map((opt, oi) => {
            const show = revealed;
            const isPick = sel.includes(oi);
            const isRight = q.correct.includes(oi);
            return (
              <button
                key={oi}
                type="button"
                disabled={revealed}
                onClick={() => toggleOption(oi)}
                className={cn(
                  "flex w-full gap-3 rounded-[var(--radius)] border px-3 py-3 text-left text-sm transition-colors",
                  !show && isPick && "border-[var(--color-ink)] bg-[var(--color-paper)]",
                  !show && !isPick && "border-[var(--color-line)] hover:border-[var(--color-ink)]/25",
                  show && isRight && "border-[var(--color-accent)] bg-[var(--color-accent-soft)]/50",
                  show && isPick && !isRight && "border-[var(--color-danger)] bg-[var(--color-danger-soft)]/50",
                  show && !isRight && !isPick && "border-[var(--color-line)] opacity-55",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-semibold",
                    show && isRight
                      ? "bg-[var(--color-accent)] text-white"
                      : show && isPick
                        ? "bg-[var(--color-danger)] text-white"
                        : isPick
                          ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                          : "bg-[var(--color-paper-deep)] text-[var(--color-ink-soft)]",
                  )}
                >
                  {LETTERS[oi] ?? oi + 1}
                </span>
                <span className="leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="mt-5 space-y-2 border-t border-[var(--color-line)] pt-4">
            <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
              <span className="font-semibold text-[var(--color-ink)]">Why: </span>
              {q.explanation}
            </p>
            <ul className="space-y-1 text-xs text-[var(--color-muted)]">
              {q.distractorNotes.map((n, i) => (
                <li key={i}>· {n}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={reshuffle}
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]"
        >
          Abort
        </button>
        <div className="flex gap-2">
          {!revealed ? (
            <button
              type="button"
              disabled={!canLock}
              onClick={lockAnswer}
              className="rounded-[var(--radius)] bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-paper)] disabled:opacity-40"
            >
              Lock answer
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-paper)]"
            >
              {qi + 1 >= form.questions.length ? "Results" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

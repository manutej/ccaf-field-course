import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  ClipboardCheck,
  Network,
  Library,
  Play,
  Sparkles,
} from "lucide-react";
import { WeightRing } from "@/components/patterns/WeightRing";
import { course } from "@/data/course";
import { useProgress } from "@/lib/course/progress";
import { domainColor } from "@/data/course";
import { SCENARIOS } from "@/data/scenarios";
import { EXAM_BANK } from "@/data/exam-bank";
import { evaluateBank } from "@/lib/exam/adversarial";
import { EXAM_BANK_V2 } from "@/data/v2/exam-bank";
import { useMemo } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { completedLessons, quizScores } = useProgress();
  const exam = course.meta.exam as {
    items?: number;
    duration_min?: number;
    cost_usd?: number;
    passing_scaled?: number;
  };
  const bankStats = useMemo(() => evaluateBank(EXAM_BANK), []);
  const dense = EXAM_BANK_V2.filter((q) => q.skilljarStyle).length;

  return (
    <div className="space-y-14">
      {/* V2 promo */}
      <section className="rounded-[var(--radius-lg)] border-2 border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)]/30 p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-accent-ink)]">
              <Sparkles className="h-3.5 w-3.5" />
              New · Field course v2
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)] md:text-3xl">
              Skilljar-density scenarios are live
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
              {EXAM_BANK_V2.length} production-framed items ({dense} dense stems) under signature
              systems — content moderation, platform engineering, docs at 500k LOC — plus the
              official six. Classic v1 below is unchanged.
            </p>
          </div>
          <Link
            to="/v2"
            className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)] transition-transform active:scale-[0.96]"
          >
            Open v2
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="stagger-in">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
            {course.meta.subtitle} · {course.meta.code} · classic
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--color-ink)] md:text-5xl">
            Classic field course — still here, still working.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            {course.meta.tagline} Domain lessons, v1 scenario exam, and adversarial bank remain on
            these routes. Prefer the denser stems? Use{" "}
            <Link to="/v2/exam" className="font-semibold text-[var(--color-accent)]">
              v2 exam
            </Link>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/v2/exam"
              className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)]"
            >
              <ClipboardCheck className="h-4 w-4" />
              V2 exam (recommended)
            </Link>
            <Link
              to="/exam"
              className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface-2)] px-5 py-3 text-sm font-semibold"
            >
              Classic exam
            </Link>
            <Link
              to="/modules"
              className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--color-line)] px-5 py-3 text-sm font-semibold text-[var(--color-ink-soft)]"
            >
              Domain lessons
            </Link>
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Items", String(exam.items ?? 60)],
              ["Minutes", String(exam.duration_min ?? 120)],
              ["Pass", `${exam.passing_scaled ?? 720}/1000`],
              ["Fee", `US$${exam.cost_usd ?? 125}`],
            ].map(([k, v]) => (
              <div
                key={k}
                className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface-2)] px-3 py-3"
              >
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                  {k}
                </dt>
                <dd className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-6 shadow-[var(--shadow-card)]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
            Blueprint weights
          </p>
          <WeightRing />
        </div>
      </section>

      <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-ink)] text-[var(--color-paper)]">
        <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-paper)]/50">
              Official six
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
              Four scenarios per sitting
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--color-paper)]/75">
              Classic exam draws 4 of these 6. V2 mixes signature systems with this bank.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SCENARIOS.map((s) => (
                <span
                  key={s.id}
                  className="scenario-chip inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs"
                >
                  <span className="font-mono text-[9px] text-[var(--color-paper)]/45">
                    SC{s.number}
                  </span>
                  {s.short}
                </span>
              ))}
            </div>
            <Link
              to="/v2/exam"
              className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--color-paper)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)]"
            >
              <Play className="h-3.5 w-3.5" />
              Start v2 form
            </Link>
          </div>
          <div className="relative min-h-[200px] border-t border-white/10 p-6 md:border-l md:border-t-0">
            <p className="font-mono text-[10px] text-[var(--color-paper)]/50">Classic bank gate</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold">
              {bankStats.ready}/{bankStats.total}
            </p>
            <p className="mt-1 text-sm text-[var(--color-paper)]/70">
              v1 exam-ready · avg {bankStats.avg}
            </p>
            <p className="mt-4 text-sm text-[var(--color-paper)]/70">
              v2 dense bank: {EXAM_BANK_V2.length} items
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            to: "/v2/exam" as const,
            icon: ClipboardCheck,
            t: "V2 scenario exam",
            d: "Signature + official narratives, multi-select, root-cause stems.",
          },
          {
            to: "/tree" as const,
            icon: Network,
            t: "Operadic tree",
            d: "Root → domains → tasks → leaves with anti-patterns.",
          },
          {
            to: "/v2/bank" as const,
            icon: Library,
            t: "V2 dense bank",
            d: "Browse Skilljar-style items with full scenario cards.",
          },
        ].map((c) => (
          <Link
            key={c.t}
            to={c.to}
            className="group rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5"
          >
            <c.icon className="mb-3 h-5 w-5 text-[var(--color-accent)]" />
            <h3 className="font-semibold group-hover:underline">{c.t}</h3>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{c.d}</p>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Modules</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {course.modules.map((m, idx) => {
            const doneM = completedLessons.includes(m.id);
            const quiz = quizScores[m.id];
            return (
              <Link
                key={m.id}
                to="/modules/$moduleId"
                params={{ moduleId: m.id }}
                className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-5 shadow-[var(--shadow-card)]"
              >
                <p className="font-mono text-xs text-[var(--color-muted)]">
                  Module {idx + 1} · {m.weight_pct}%
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold">
                  <span
                    className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: domainColor[m.id] }}
                  />
                  {m.name}
                  {doneM && (
                    <CheckCircle2 className="ml-2 inline h-4 w-4 text-[var(--color-accent)]" />
                  )}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{m.one_liner}</p>
                <p className="mt-3 text-xs text-[var(--color-muted)]">
                  {quiz ? `Quiz ${quiz.correct}/${quiz.total}` : "Quiz not taken"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            t: "Official-only facts",
            d: "Public guide objectives and official product docs — no proprietary Skilljar item dumps.",
          },
          {
            t: "Anti-pattern first",
            d: "Hooks over prompts for absolute rules; independent review; nullable schemas; scratchpads after compact.",
          },
          {
            t: "Two versions",
            d: "Classic v1 preserved. V2 raises stem realism to practice-exam density.",
          },
        ].map((c) => (
          <div
            key={c.t}
            className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5"
          >
            <Shield className="mb-3 h-5 w-5 text-[var(--color-accent)]" />
            <h3 className="font-semibold">{c.t}</h3>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{c.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

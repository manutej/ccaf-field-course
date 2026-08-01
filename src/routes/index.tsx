import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { WeightRing } from "@/components/patterns/WeightRing";
import { course } from "@/data/course";
import { useProgress } from "@/lib/course/progress";
import { domainColor } from "@/data/course";

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
    validity_months?: number;
  };

  return (
    <div className="space-y-14">
      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
            {course.meta.subtitle} · {course.meta.code}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--color-ink)] md:text-5xl">
            Nail the exam at one hundred percent — by answering the right questions in any scenario.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            {course.meta.tagline} You tried scattered blogs and prompt tips. That is the stall —
            and it is not your fault. This course is the durable setup: five domains, official-doc
            provenance, high-yield drills, and anti-patterns the exam loves to trap.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/modules"
              className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)] hover:opacity-90"
            >
              Start with Domain 1
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/drill"
              className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface-2)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
            >
              Jump to drills
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
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-ink-soft)]">
            Spend study time proportional to weight. Domain 1 is twenty-seven percent — it is not
            optional background reading.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
              Modules
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              One lesson per domain. Prereq order respects the blueprint.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {course.modules.map((m, idx) => {
            const done = completedLessons.includes(m.id);
            const quiz = quizScores[m.id];
            return (
              <Link
                key={m.id}
                to="/modules/$moduleId"
                params={{ moduleId: m.id }}
                className="group rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-[var(--color-ink)]/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-[var(--color-muted)]">
                      Module {idx + 1} · {m.weight_pct}% · {m.tasks.length} task statements
                    </p>
                    <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold leading-snug">
                      <span
                        className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle"
                        style={{ background: domainColor[m.id] }}
                      />
                      {m.name}
                    </h3>
                  </div>
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--color-accent)]" />
                  ) : (
                    <span className="font-mono text-xs text-[var(--color-muted)]">{m.id}</span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                  {m.one_liner}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-[var(--color-muted)]">
                  <span>{m.high_yield_count} high-yield leaves mapped</span>
                  <span>
                    {quiz
                      ? `Quiz ${quiz.correct}/${quiz.total}`
                      : "Quiz not taken"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            t: "Official-only facts",
            d: "Claims map to docs.anthropic.com, code.claude.com, platform.claude.com, and modelcontextprotocol.io — with fetch date stamped.",
          },
          {
            t: "Anti-pattern first",
            d: "The exam rewards what you refuse: parsing free text for loop stop, self-review in the writer session, batching blocking checks.",
          },
          {
            t: "Limit volunteered",
            d: "This is not a leaked item bank. It is derived from the public exam guide objectives. A citation is an invitation to verify, not a proof.",
          },
        ].map((c) => (
          <div
            key={c.t}
            className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5"
          >
            <Shield className="mb-3 h-5 w-5 text-[var(--color-accent)]" aria-hidden />
            <h3 className="font-semibold text-[var(--color-ink)]">{c.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">{c.d}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-ink)] px-6 py-8 text-[var(--color-paper)] md:px-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
          Six scenarios. Four per sitting.
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-paper)]/75">
          The exam draws four scenarios from a bank of six. Leaves in this course carry scenario
          hooks so you practice portability — not memorizing one storyline.
        </p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {(course.scenarios.length
            ? course.scenarios
            : [
                { name: "Customer Support Resolution Agent" },
                { name: "Code Generation with Claude Code" },
                { name: "Multi-Agent Research System" },
                { name: "Developer Productivity with Claude" },
                { name: "Claude Code for CI" },
                { name: "Structured Data Extraction" },
              ]
          ).map((s, i) => {
            const name =
              (s as { name?: string; title?: string; narrative?: string }).name ||
              (s as { title?: string }).title ||
              `Scenario ${i + 1}`;
            return (
              <li
                key={name}
                className="rounded-[var(--radius)] border border-white/10 bg-white/5 px-3 py-2.5 text-sm"
              >
                <span className="mr-2 font-mono text-[10px] text-[var(--color-paper)]/50">
                  SC{i + 1}
                </span>
                {name}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

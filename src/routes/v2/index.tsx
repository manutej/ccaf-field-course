import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ClipboardCheck,
  Network,
  Library,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { SCENARIOS_V2 } from "@/data/v2/scenarios";
import { EXAM_BANK_V2 } from "@/data/v2/exam-bank";
import { WeightRing } from "@/components/patterns/WeightRing";

export const Route = createFileRoute("/v2/")({
  component: V2Home,
});

function V2Home() {
  const dense = EXAM_BANK_V2.filter((q) => q.skilljarStyle).length;
  const multi = EXAM_BANK_V2.filter((q) => q.format === "multi").length;
  const sig = SCENARIOS_V2.filter((s) => s.family === "signature");

  return (
    <div className="space-y-12">
      <div className="rounded-[var(--radius)] border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]/40 px-4 py-2 font-mono text-xs text-[var(--color-accent-ink)]">
        Version 2 · Skilljar-density scenarios · Classic v1 remains at{" "}
        <Link to="/" className="font-semibold underline-offset-2 hover:underline">
          home
        </Link>
        {" / "}
        <Link to="/exam" className="font-semibold underline-offset-2 hover:underline">
          /exam
        </Link>
      </div>

      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
            CCAR-F field course · v2
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            Questions that feel like the practice exam — not a glossary quiz.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            Signature systems (content moderation, platform engineering, docs at 500k LOC) frame
            every item. Stems carry production metrics, multi-concern incidents, and root-cause +
            fix choices — the pattern high-quality Skilljar-style mocks use, grounded in the public
            July 2026 blueprint.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/v2/exam"
              className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)] transition-transform active:scale-[0.96]"
            >
              <ClipboardCheck className="h-4 w-4" />
              Sit v2 exam
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/v2/bank"
              className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface-2)] px-5 py-3 text-sm font-semibold"
            >
              <Library className="h-4 w-4" />
              Browse dense bank
            </Link>
            <Link
              to="/v2/tree"
              className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--color-line)] px-5 py-3 text-sm font-semibold text-[var(--color-ink-soft)]"
            >
              <Network className="h-4 w-4" />
              Operadic tree
            </Link>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-3">
            {[
              ["Items", String(EXAM_BANK_V2.length)],
              ["Dense", String(dense)],
              ["Multi", String(multi)],
            ].map(([k, v]) => (
              <div
                key={k}
                className="rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface-2)] px-3 py-3"
              >
                <dt className="font-mono text-[10px] uppercase text-[var(--color-muted)]">{k}</dt>
                <dd className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-6 shadow-[var(--shadow-card)]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
            Blueprint still rules weighting
          </p>
          <WeightRing />
        </div>
      </section>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
          Signature scenarios
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Practice-exam narratives that re-skin the same domain skills as the official six.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {sig.map((s) => (
            <div
              key={s.id}
              className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-5 shadow-[var(--shadow-card)]"
            >
              <p className="font-mono text-[10px] text-[var(--color-muted)]">SIG · {s.id}</p>
              <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold leading-snug">
                {s.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                {s.narrative}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-ink)] p-6 text-[var(--color-paper)] md:p-8">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-1 h-5 w-5 shrink-0 text-[var(--color-paper)]/70" />
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
              What changed vs v1
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-[var(--color-paper)]/80">
              <li>
                · Stems rewritten to Skilljar density: metrics (3%, 98%, 15 modules, 150 endpoints),
                root-cause + fix, multi-select where appropriate.
              </li>
              <li>
                · Full scenario narrative cards on every item — not a one-line label.
              </li>
              <li>
                · Signature systems (moderation / platform eng / docs) plus official six for form
                draws.
              </li>
              <li>
                · Classic v1 untouched at existing routes for comparison.
              </li>
            </ul>
            <Link
              to="/exam"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-paper)] underline-offset-2 hover:underline"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Open classic v1 exam
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { course, domainColor } from "@/data/course";

export const Route = createFileRoute("/map")({
  component: MapPage,
});

function MapPage() {
  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
          Operadic concept map
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold md:text-4xl">
          Root question → domains → task statements
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--color-ink-soft)]">
          In order to nail the exam at one hundred percent, what questions must you answer in any
          scenario? The map below is the curriculum DAG. Edges mean “requires prior concepts.”
        </p>
      </header>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-ink)] p-6 text-[var(--color-paper)] md:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-paper)]/50">
          Root
        </p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold leading-snug md:text-2xl">
          What must I be able to answer in any scenario to score one hundred percent?
        </p>
        <p className="mt-3 text-sm text-[var(--color-paper)]/70">
          Composition rule: AND of the five domain competencies, weighted by the blueprint.
        </p>
      </div>

      <div className="relative space-y-4">
        {course.modules.map((m, idx) => (
          <div key={m.id} className="relative pl-8">
            {idx < course.modules.length - 1 && (
              <span
                className="absolute left-[11px] top-10 bottom-[-16px] w-px bg-[var(--color-line)]"
                aria-hidden
              />
            )}
            <span
              className="absolute left-0 top-3 h-6 w-6 rounded-full border-2 border-[var(--color-paper)]"
              style={{ background: domainColor[m.id] }}
              aria-hidden
            />
            <Link
              to="/modules/$moduleId"
              params={{ moduleId: m.id }}
              className="block rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-5 shadow-[var(--shadow-card)] hover:border-[var(--color-ink)]/20"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
                  {m.id} · {m.name}
                </h2>
                <span className="font-mono text-xs text-[var(--color-muted)]">
                  weight {m.weight_pct}% · requires{" "}
                  {idx === 0 ? "assumed_knowledge" : course.modules[idx - 1].id}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{m.one_liner}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {m.tasks.map((t) => (
                  <span
                    key={t.id}
                    className="rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] px-2.5 py-1 font-mono text-[10px] text-[var(--color-ink-soft)]"
                    title={t.title}
                  >
                    TS {t.id}
                  </span>
                ))}
              </div>
            </Link>
          </div>
        ))}
      </div>

      <section className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
          Conservation gates (Noether course)
        </h2>
        <ul className="mt-3 grid gap-2 text-sm text-[var(--color-ink-soft)] sm:grid-cols-2">
          {[
            "facts_grounded — every teach claim has official URL",
            "prereq_respected — D1 before multi-agent nuance in later domains",
            "tokens_only — single design system across lessons",
            "a11y_floor — keyboard, focus, reduced motion",
            "no_hype — Manu voice, no game-changer language",
            "structure_complete — teach + anti + procedure + assessment + sources",
          ].map((g) => (
            <li key={g} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
              {g}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

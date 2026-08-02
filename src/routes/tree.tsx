import { createFileRoute } from "@tanstack/react-router";
import { OperadicTree } from "@/components/tree/OperadicTree";

export const Route = createFileRoute("/tree")({
  component: TreePage,
});

function TreePage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
          Operadic question tree
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight md:text-4xl">
          Root question → domains → tasks → leaves
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--color-ink-soft)] leading-relaxed">
          Competency composes: you pass when every weighted domain operator holds under any of the
          six scenarios. Expand the DAG, drill random leaves, then sit a randomized 4-of-6 exam.
        </p>
      </header>
      <OperadicTree />
    </div>
  );
}

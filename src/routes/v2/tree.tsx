import { createFileRoute, Link } from "@tanstack/react-router";
import { OperadicTree } from "@/components/tree/OperadicTree";

export const Route = createFileRoute("/v2/tree")({
  component: V2TreePage,
});

function V2TreePage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-accent)]">
          <Link to="/v2" className="hover:underline">
            v2
          </Link>{" "}
          · operadic tree
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold">
          Same competency DAG — denser exam leaves in v2 bank
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--color-ink-soft)]">
          The composition structure is unchanged: weighted AND of domains. Practice items for leaves
          now live primarily in the{" "}
          <Link to="/v2/bank" className="font-semibold text-[var(--color-accent)]">
            v2 dense bank
          </Link>
          .
        </p>
      </header>
      <OperadicTree />
    </div>
  );
}

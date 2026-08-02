import { createFileRoute, Link } from "@tanstack/react-router";
import { ExamRunnerV2 } from "@/components/v2/ExamRunnerV2";

export const Route = createFileRoute("/v2/exam")({
  component: V2ExamPage,
});

function V2ExamPage() {
  return (
    <div className="space-y-4">
      <p className="font-mono text-[10px] text-[var(--color-muted)]">
        <Link to="/v2" className="hover:text-[var(--color-ink)]">
          v2 home
        </Link>
        {" · "}
        <Link to="/exam" className="hover:text-[var(--color-ink)]">
          classic exam
        </Link>
      </p>
      <ExamRunnerV2 />
    </div>
  );
}

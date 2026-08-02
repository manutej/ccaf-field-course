import { createFileRoute } from "@tanstack/react-router";
import { ExamRunner } from "@/components/exam/ExamRunner";

export const Route = createFileRoute("/exam")({
  component: ExamPage,
});

function ExamPage() {
  return <ExamRunner />;
}

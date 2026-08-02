/**
 * Adversarial evaluators — score practice items against CCAR-F guide specs.
 * Used to gate bank quality and surface “why this is exam-hard” in the UI.
 */

import type { ExamItem, SpecTag } from "@/data/exam-bank";
import { DOMAIN_META } from "@/data/scenarios";

export type EvalCriterion = {
  id: string;
  label: string;
  pass: boolean;
  detail: string;
  weight: number;
};

export type AdversarialReport = {
  itemId: string;
  score: number; // 0–100
  grade: "exam-ready" | "needs-hardening" | "reject";
  criteria: EvalCriterion[];
  hardnessNotes: string[];
};

const DISTRACTOR_PATTERNS: Partial<Record<SpecTag, RegExp[]>> = {
  "prompt-only-insufficient": [/system prompt/i, /few-shot/i, /instruct/i],
  "over-engineering": [/classifier/i, /separate model/i, /routing layer/i, /sentiment/i],
  "self-review-trap": [/same session/i, /self-report a confidence/i],
  "batch-latency": [/both.*batch/i, /polling/i],
};

function hasFourDistinctOptions(item: ExamItem): boolean {
  const set = new Set(item.options.map((o) => o.trim().toLowerCase()));
  return set.size === 4 && item.options.every((o) => o.trim().length >= 12);
}

function correctInRange(item: ExamItem): boolean {
  return item.correctIndex >= 0 && item.correctIndex <= 3;
}

function stemIsScenarioFramed(item: ExamItem): boolean {
  return (
    item.stem.length >= 60 &&
    /(production|agent|pipeline|coordinator|tool|CLAUDE|MCP|review|extract|scenario|logs|team|engineer|PR|invoice|refund|subagent|Claude|CI|batch|schema|codebase|session|skill|command)/i.test(
      item.stem,
    )
  );
}

function explanationCitesWhy(item: ExamItem): boolean {
  return item.explanation.length >= 60 && item.distractorNotes.length >= 2;
}

function domainMatchesWeightAwareness(item: ExamItem): boolean {
  return Boolean(DOMAIN_META[item.domain]);
}

function notOutOfScope(item: ExamItem): boolean {
  const banned =
    /fine-tun|RLHF|embedding model|vector database|OAuth key rotation|cloud provider config|token counting algorithm|model weights|computer use|vision\/image/i;
  return !banned.test(item.stem) && !item.options.some((o) => banned.test(o));
}

function distractorsArePlausible(item: ExamItem): boolean {
  const wrong = item.options.filter((_, i) => i !== item.correctIndex);
  const soft = wrong.filter((o) =>
    /(prompt|few-shot|confidence|classifier|batch|auto|always|remove|increase|generic|empty|parse|natural.?language|sentiment|same session|home directory|CLAUDE\.md|router|temperature|larger|max_tokens|average|pick the|delete|hope|retry|ignore|yaml|regex|package\.json|sleep|merge|18 tools|Grep only|all web|proactively)/i.test(
      o,
    ),
  );
  return soft.length >= 1 || wrong.every((o) => o.length > 40);
}

function stressesJudgment(item: ExamItem): boolean {
  if (item.difficulty === "judgment" || item.difficulty === "trap") return true;
  if (item.difficulty === "application") return true; // application of production patterns is exam-valid
  return /most effectively|best|should you|most likely|how should|which approach|what change|what is the/i.test(
    item.stem,
  );
}

export function evaluateItem(item: ExamItem): AdversarialReport {
  const criteria: EvalCriterion[] = [
    {
      id: "four-options",
      label: "Four distinct, substantial options",
      pass: hasFourDistinctOptions(item),
      detail: "Exam items state MC format with clear alternatives.",
      weight: 12,
    },
    {
      id: "correct-index",
      label: "Valid correctIndex",
      pass: correctInRange(item),
      detail: "Single best answer index 0–3.",
      weight: 15,
    },
    {
      id: "scenario-frame",
      label: "Production / scenario-framed stem",
      pass: stemIsScenarioFramed(item),
      detail: "Guide questions use realistic customer/dev/CI contexts.",
      weight: 12,
    },
    {
      id: "explanation",
      label: "Explanation + distractor autopsy",
      pass: explanationCitesWhy(item),
      detail: "Learning requires why A wins and why B/C/D fail.",
      weight: 12,
    },
    {
      id: "in-scope",
      label: "In-scope topics only",
      pass: notOutOfScope(item),
      detail: "Reject fine-tuning, embeddings infra, auth billing, etc.",
      weight: 15,
    },
    {
      id: "plausible-distractors",
      label: "Plausible trap distractors",
      pass: distractorsArePlausible(item),
      detail: "Wrong answers should mirror common over/under-engineering mistakes.",
      weight: 12,
    },
    {
      id: "judgment",
      label: "Judgment / tradeoff pressure",
      pass: stressesJudgment(item),
      detail: "Foundations exam stresses architecture tradeoffs, not trivia.",
      weight: 12,
    },
    {
      id: "domain-map",
      label: "Mapped to blueprint domain + task statement",
      pass: domainMatchesWeightAwareness(item) && Boolean(item.taskStatement),
      detail: `Domain ${item.domain} · TS ${item.taskStatement}`,
      weight: 10,
    },
  ];

  const earned = criteria.reduce((s, c) => s + (c.pass ? c.weight : 0), 0);
  const max = criteria.reduce((s, c) => s + c.weight, 0);
  const score = Math.round((earned / max) * 100);

  const hardnessNotes: string[] = [
    ...item.stresses,
    item.officialSample
      ? "Aligned with official sample item style (§9)."
      : "Original practice item grounded in public objectives.",
  ];

  for (const tag of item.tags) {
    const pats = DISTRACTOR_PATTERNS[tag];
    if (pats) {
      const hit = item.options.some(
        (o, i) => i !== item.correctIndex && pats.some((p) => p.test(o)),
      );
      if (hit) hardnessNotes.push(`Trap family “${tag}” appears in distractors.`);
    }
  }

  const allPass = criteria.every((c) => c.pass);
  const strictGrade: AdversarialReport["grade"] = allPass
    ? "exam-ready"
    : score >= 70
      ? "needs-hardening"
      : "reject";

  return {
    itemId: item.id,
    score,
    grade: strictGrade,
    criteria,
    hardnessNotes,
  };
}

export function evaluateBank(items: ExamItem[]) {
  const reports = items.map(evaluateItem);
  const ready = reports.filter((r) => r.grade === "exam-ready").length;
  const hard = reports.filter((r) => r.grade === "needs-hardening").length;
  const reject = reports.filter((r) => r.grade === "reject").length;
  const avg = Math.round(reports.reduce((s, r) => s + r.score, 0) / reports.length);
  return { reports, ready, hard, reject, avg, total: items.length };
}

/** Runtime gate used when assembling an exam form */
export function filterExamReady(items: ExamItem[], minScore = 85): ExamItem[] {
  return items.filter((i) => evaluateItem(i).score >= minScore);
}

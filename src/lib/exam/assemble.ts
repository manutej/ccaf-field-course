/**
 * Assemble a mock exam form mirroring CCAR-F structure:
 * 4 scenarios drawn from 6; items weighted toward primary domains.
 */

import { EXAM_BANK, type ExamItem } from "@/data/exam-bank";
import {
  pickExamScenarios,
  seededShuffle,
  type Scenario,
  type ScenarioId,
} from "@/data/scenarios";
import { evaluateItem, filterExamReady } from "./adversarial";

export type AssembledQuestion = ExamItem & {
  formIndex: number;
  scenario: Scenario;
  evalScore: number;
};

export type ExamForm = {
  seed: number;
  scenarios: Scenario[];
  questions: AssembledQuestion[];
  meta: {
    targetCount: number;
    bankUsed: number;
    avgEvalScore: number;
    officialSampleCount: number;
  };
};

export function createSeed(): number {
  return (Date.now() ^ (Math.random() * 0x100000000)) >>> 0;
}

/**
 * Build form: pick 4 scenarios, pull exam-ready items per scenario,
 * shuffle within scenario blocks (exam presents scenario context then items).
 */
export function assembleExam(seed?: number, perScenario = 4): ExamForm {
  const s = seed ?? createSeed();
  const scenarios = pickExamScenarios(s);
  const ready = filterExamReady(EXAM_BANK, 80);
  const questions: AssembledQuestion[] = [];
  let formIndex = 0;

  for (const scenario of scenarios) {
    const pool = ready.filter((q) => q.scenarioId === scenario.id);
    // Prefer judgment/trap, then official samples
    const ranked = [...pool].sort((a, b) => {
      const score = (x: ExamItem) =>
        (x.difficulty === "trap" ? 3 : x.difficulty === "judgment" ? 2 : 1) +
        (x.officialSample ? 2 : 0) +
        evaluateItem(x).score / 100;
      return score(b) - score(a);
    });
    const picked = seededShuffle(ranked, s ^ scenario.number * 9973).slice(
      0,
      Math.min(perScenario, ranked.length),
    );
    // If thin pool, backfill from same primary domains
    if (picked.length < perScenario) {
      const domainSet = new Set(scenario.primaryDomains);
      const backfill = ready.filter(
        (q) =>
          domainSet.has(q.domain) &&
          !picked.some((p) => p.id === q.id) &&
          q.scenarioId !== scenario.id,
      );
      const extra = seededShuffle(backfill, s + scenario.number).slice(
        0,
        perScenario - picked.length,
      );
      picked.push(...extra);
    }

    for (const q of picked) {
      questions.push({
        ...q,
        formIndex: formIndex++,
        scenario,
        // If backfilled from another scenario id, still present under drawn scenario narrative
        evalScore: evaluateItem(q).score,
      });
    }
  }

  const avgEvalScore =
    questions.length === 0
      ? 0
      : Math.round(questions.reduce((a, q) => a + q.evalScore, 0) / questions.length);

  return {
    seed: s,
    scenarios,
    questions,
    meta: {
      targetCount: scenarios.length * perScenario,
      bankUsed: questions.length,
      avgEvalScore,
      officialSampleCount: questions.filter((q) => q.officialSample).length,
    },
  };
}

export function domainBreakdown(form: ExamForm) {
  const counts: Record<string, number> = {};
  for (const q of form.questions) {
    counts[q.domain] = (counts[q.domain] ?? 0) + 1;
  }
  return counts;
}

export function scenarioIds(form: ExamForm): ScenarioId[] {
  return form.scenarios.map((s) => s.id);
}

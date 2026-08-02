import { EXAM_BANK_V2, type ExamItemV2 } from "@/data/v2/exam-bank";
import {
  pickV2FormScenarios,
  seededShuffle,
  type Scenario,
} from "@/data/v2/scenarios";

export type AssembledV2 = ExamItemV2 & {
  formIndex: number;
  scenario: Scenario;
};

export type ExamFormV2 = {
  seed: number;
  scenarios: Scenario[];
  questions: AssembledV2[];
  meta: {
    perScenario: number;
    skilljarStyleCount: number;
    multiCount: number;
  };
};

const SSR_SEED = 20260801;

export function assembleV2(seed = SSR_SEED, perScenario = 4): ExamFormV2 {
  const scenarios = pickV2FormScenarios(seed);
  const questions: AssembledV2[] = [];
  let formIndex = 0;

  for (const scenario of scenarios) {
    let pool = EXAM_BANK_V2.filter((q) => q.scenarioId === scenario.id);
    // Prefer skilljar-style + judgment
    pool = [...pool].sort((a, b) => {
      const score = (x: ExamItemV2) =>
        (x.skilljarStyle ? 4 : 0) +
        (x.difficulty === "trap" ? 3 : x.difficulty === "judgment" ? 2 : 1) +
        (x.format === "multi" ? 1 : 0);
      return score(b) - score(a);
    });
    let picked = seededShuffle(pool, seed ^ scenario.number * 7919).slice(
      0,
      Math.min(perScenario, pool.length),
    );

    if (picked.length < perScenario) {
      const domains = new Set(scenario.primaryDomains);
      const backfill = EXAM_BANK_V2.filter(
        (q) =>
          domains.has(q.domain) &&
          !picked.some((p) => p.id === q.id) &&
          q.scenarioId !== scenario.id,
      );
      picked = [
        ...picked,
        ...seededShuffle(backfill, seed + scenario.number).slice(
          0,
          perScenario - picked.length,
        ),
      ];
    }

    for (const q of picked) {
      questions.push({ ...q, formIndex: formIndex++, scenario });
    }
  }

  return {
    seed,
    scenarios,
    questions,
    meta: {
      perScenario,
      skilljarStyleCount: questions.filter((q) => q.skilljarStyle).length,
      multiCount: questions.filter((q) => q.format === "multi").length,
    },
  };
}

export function isCorrect(item: ExamItemV2, selected: number[]): boolean {
  const a = [...selected].sort((x, y) => x - y);
  const b = [...item.correct].sort((x, y) => x - y);
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

export { SSR_SEED };

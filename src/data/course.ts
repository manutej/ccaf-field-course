import raw from "./course.json";

export type Source = { title: string; url: string };
export type TeachBlock = { h: string; b: string };
export type Anti = { bad: string; good: string };
export type QuizQ = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explain: string;
  source: string;
  difficulty: string;
};
export type Task = {
  id: string;
  title: string;
  knowledge: string[];
  skills: string[];
};
export type Module = {
  id: string;
  number?: number;
  name: string;
  weight_pct: number;
  tasks: Task[];
  one_liner: string;
  open: string;
  teach: TeachBlock[];
  anti: Anti[];
  loop_steps: string[];
  sources: Source[];
  quiz: QuizQ[];
  high_yield_count: number;
};
export type Course = {
  meta: {
    title: string;
    subtitle: string;
    code: string;
    tagline: string;
    exam: Record<string, unknown>;
    verified_at: string;
  };
  modules: Module[];
  scenarios: Array<Record<string, unknown>>;
  sources: Record<string, Source[]>;
};

export const course = raw as Course;

export function getModule(id: string) {
  return course.modules.find((m) => m.id === id);
}

export const domainColor: Record<string, string> = {
  D1: "var(--color-domain-1)",
  D2: "var(--color-domain-2)",
  D3: "var(--color-domain-3)",
  D4: "var(--color-domain-4)",
  D5: "var(--color-domain-5)",
};

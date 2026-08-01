import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProgressState = {
  completedLessons: string[];
  quizScores: Record<string, { correct: number; total: number; at: string }>;
  markLesson: (id: string) => void;
  setQuizScore: (moduleId: string, correct: number, total: number) => void;
  reset: () => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      completedLessons: [],
      quizScores: {},
      markLesson: (id) =>
        set((s) => ({
          completedLessons: s.completedLessons.includes(id)
            ? s.completedLessons
            : [...s.completedLessons, id],
        })),
      setQuizScore: (moduleId, correct, total) =>
        set((s) => ({
          quizScores: {
            ...s.quizScores,
            [moduleId]: { correct, total, at: new Date().toISOString() },
          },
        })),
      reset: () => set({ completedLessons: [], quizScores: {} }),
    }),
    { name: "ccaf-field-course-progress-v1" },
  ),
);

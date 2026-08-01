import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Compass, GraduationCap, LayoutGrid, RotateCcw } from "lucide-react";
import { course } from "@/data/course";
import { useProgress } from "@/lib/course/progress";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home", icon: GraduationCap },
  { to: "/modules", label: "Modules", icon: LayoutGrid },
  { to: "/map", label: "Concept map", icon: Compass },
  { to: "/drill", label: "Drill", icon: BookOpen },
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { completedLessons, quizScores, reset } = useProgress();
  const totalModules = course.modules.length;
  const done = course.modules.filter((m) => completedLessons.includes(m.id)).length;
  const quizDone = Object.keys(quizScores).length;

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-paper)_88%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="group flex min-w-0 items-center gap-2.5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius)] bg-[var(--color-ink)] text-sm font-semibold text-[var(--color-paper)]"
              aria-hidden
            >
              C
            </span>
            <span className="min-w-0">
              <span className="block truncate font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-ink)]">
                {course.meta.title}
              </span>
              <span className="block truncate font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                {course.meta.code} · field course
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {nav.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname === item.to || pathname.startsWith(item.to + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-[var(--radius)] px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-deep)]",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <div
              className="hidden rounded-full border border-[var(--color-line)] bg-[var(--color-surface-2)] px-3 py-1 font-mono text-[11px] text-[var(--color-ink-soft)] sm:block"
              title="Lesson progress"
            >
              {done}/{totalModules} lessons · {quizDone} quizzes
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm("Reset all local progress?")) reset();
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              aria-label="Reset progress"
              title="Reset progress"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <nav
          className="flex gap-1 overflow-x-auto border-t border-[var(--color-line)] px-2 py-1 md:hidden"
          aria-label="Mobile"
        >
          {nav.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium",
                  active
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                    : "text-[var(--color-ink-soft)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {children}
      </main>
      <footer className="border-t border-[var(--color-line)] py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-sm text-[var(--color-muted)] md:flex-row md:items-center md:justify-between">
          <p>
            Derived from the public CCAF exam guide objectives · Official docs verified{" "}
            {course.meta.verified_at}. Not affiliated with Anthropic. No exam items reproduced.
          </p>
          <p className="font-mono text-xs">
            Conservation: truth · design · access · prereq order
          </p>
        </div>
      </footer>
    </div>
  );
}

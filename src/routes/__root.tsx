import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Shell } from "@/components/course/Shell";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "CCAF Field Course — Claude Certified Architect Foundations",
      },
      {
        name: "description",
        content:
          "CCAR-F exam prep: operadic question tree, randomized 4-of-6 scenario exams, adversarial item bank grounded in the public exam guide.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,650&family=IBM+Plex+Mono:wght@400;500&family=Source+Sans+3:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => (
    <Shell>
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
          Page not found
        </h1>
        <p className="mt-2 text-[var(--color-ink-soft)]">
          That path is not part of the field course. Head back to modules or the scenario exam.
        </p>
      </div>
    </Shell>
  ),
});

function RootComponent() {
  return (
    <RootDocument>
      <Shell>
        <Outlet />
      </Shell>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

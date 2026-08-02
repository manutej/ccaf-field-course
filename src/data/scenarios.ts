/** Six official CCAR-F exam scenarios (public exam guide §5). */

export type ScenarioId = "S1" | "S2" | "S3" | "S4" | "S5" | "S6";
export type DomainId = "D1" | "D2" | "D3" | "D4" | "D5";

export type Scenario = {
  id: ScenarioId;
  number: number;
  name: string;
  short: string;
  narrative: string;
  primaryDomains: DomainId[];
  toolsHint?: string;
};

export const SCENARIOS: Scenario[] = [
  {
    id: "S1",
    number: 1,
    name: "Customer Support Resolution Agent",
    short: "Support agent",
    narrative:
      "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom Model Context Protocol (MCP) tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.",
    primaryDomains: ["D1", "D2", "D5"],
    toolsHint: "get_customer · lookup_order · process_refund · escalate_to_human",
  },
  {
    id: "S2",
    number: 2,
    name: "Code Generation with Claude Code",
    short: "Claude Code dev",
    narrative:
      "You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.",
    primaryDomains: ["D3", "D5"],
  },
  {
    id: "S3",
    number: 3,
    name: "Multi-Agent Research System",
    short: "Multi-agent research",
    narrative:
      "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.",
    primaryDomains: ["D1", "D2", "D5"],
  },
  {
    id: "S4",
    number: 4,
    name: "Developer Productivity with Claude",
    short: "Dev productivity",
    narrative:
      "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol (MCP) servers.",
    primaryDomains: ["D2", "D3", "D1"],
  },
  {
    id: "S5",
    number: 5,
    name: "Claude Code for Continuous Integration",
    short: "CI/CD Claude",
    narrative:
      "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives.",
    primaryDomains: ["D3", "D4"],
  },
  {
    id: "S6",
    number: 6,
    name: "Structured Data Extraction",
    short: "Data extraction",
    narrative:
      "You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and maintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.",
    primaryDomains: ["D4", "D5"],
  },
];

export const DOMAIN_META: Record<
  DomainId,
  { name: string; weight: number; color: string }
> = {
  D1: { name: "Agentic Architecture & Orchestration", weight: 27, color: "#0f6b5c" },
  D2: { name: "Tool Design & MCP Integration", weight: 18, color: "#1e4d7b" },
  D3: { name: "Claude Code Configuration & Workflows", weight: 20, color: "#6b4c9a" },
  D4: { name: "Prompt Engineering & Structured Output", weight: 20, color: "#9a5b1a" },
  D5: { name: "Context Management & Reliability", weight: 15, color: "#8b2e4a" },
};

export function getScenario(id: ScenarioId) {
  return SCENARIOS.find((s) => s.id === id)!;
}

/** Fisher–Yates with seedable RNG for reproducible mocks. */
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Exam structure: 4 scenarios drawn from bank of 6. */
export function pickExamScenarios(seed: number): Scenario[] {
  return seededShuffle(SCENARIOS, seed).slice(0, 4);
}

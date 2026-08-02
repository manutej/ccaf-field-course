/**
 * V2 signature scenarios — Skilljar-style production narratives.
 * Maps onto CCAR-F blueprint domains while matching practice-exam tone:
 * concrete systems, metrics, multi-concern incidents.
 */

export type DomainId = "D1" | "D2" | "D3" | "D4" | "D5";
export type ScenarioId =
  | "MOD"
  | "DEV"
  | "DOCS"
  | "S1"
  | "S2"
  | "S3"
  | "S4"
  | "S5"
  | "S6";

export type Scenario = {
  id: ScenarioId;
  number: number;
  name: string;
  short: string;
  /** Full Skilljar-style context block shown above items */
  narrative: string;
  primaryDomains: DomainId[];
  /** Official guide scenario this extends, if any */
  extendsOfficial?: string;
  family: "signature" | "official";
};

export const SCENARIOS_V2: Scenario[] = [
  {
    id: "MOD",
    number: 1,
    name: "Content Moderation and Classification System",
    short: "Moderation",
    family: "signature",
    narrative:
      "A social media platform is building a content moderation system on agentic loops: classify, escalate, action. Prompts with few-shot examples and structured output schemas keep the moderation decisions consistent and auditable across every category. Coordinator agents dispatch posts to specialist subagents (text, image, policy exception) and must preserve first-pass precision while knowing when to escalate.",
    primaryDomains: ["D1", "D2", "D4", "D5"],
    extendsOfficial: "S1 / S3 patterns",
  },
  {
    id: "DEV",
    number: 2,
    name: "Developer Productivity Tools",
    short: "Dev productivity",
    family: "signature",
    narrative:
      "A platform engineering team is building internal developer tools on Claude. Automated code review, documentation generation, and codebase exploration, all wired into their CI/CD pipeline. Agents use built-in tools (Read, Write, Edit, Bash, Grep, Glob), MCP servers, and Claude Code skills shared across the monorepo.",
    primaryDomains: ["D2", "D3", "D1", "D5"],
    extendsOfficial: "S4 / S5 patterns",
  },
  {
    id: "DOCS",
    number: 3,
    name: "Technical Documentation Maintenance System",
    short: "Docs system",
    family: "signature",
    narrative:
      "A documentation team maintains API reference docs, architecture guides, and runbooks for a 500,000-line codebase with Claude Code. Context limits bite constantly, so the team leans on targeted file selection, session persistence, and processing the larger documentation sets incrementally. Provenance of claims against source files, ADRs, and wiki pages is a hard requirement.",
    primaryDomains: ["D3", "D4", "D5"],
    extendsOfficial: "S2 / S6 patterns",
  },
  {
    id: "S1",
    number: 4,
    name: "Customer Support Resolution Agent",
    short: "Support agent",
    family: "official",
    narrative:
      "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom MCP tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.",
    primaryDomains: ["D1", "D2", "D5"],
  },
  {
    id: "S2",
    number: 5,
    name: "Code Generation with Claude Code",
    short: "Claude Code dev",
    family: "official",
    narrative:
      "You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.",
    primaryDomains: ["D3", "D5"],
  },
  {
    id: "S3",
    number: 6,
    name: "Multi-Agent Research System",
    short: "Multi-agent research",
    family: "official",
    narrative:
      "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.",
    primaryDomains: ["D1", "D2", "D5"],
  },
  {
    id: "S4",
    number: 7,
    name: "Developer Productivity with Claude",
    short: "SDK productivity",
    family: "official",
    narrative:
      "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with MCP servers.",
    primaryDomains: ["D2", "D3", "D1"],
  },
  {
    id: "S5",
    number: 8,
    name: "Claude Code for Continuous Integration",
    short: "CI/CD Claude",
    family: "official",
    narrative:
      "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives.",
    primaryDomains: ["D3", "D4"],
  },
  {
    id: "S6",
    number: 9,
    name: "Structured Data Extraction",
    short: "Data extraction",
    family: "official",
    narrative:
      "You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates the output using JSON schemas, and maintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.",
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

/** Real exam: 4 of 6 official. V2 practice: prefer 2 signature + 2 official. */
export function pickV2FormScenarios(seed: number): Scenario[] {
  const sig = SCENARIOS_V2.filter((s) => s.family === "signature");
  const off = SCENARIOS_V2.filter((s) => s.family === "official");
  const pickSig = seededShuffle(sig, seed).slice(0, 2);
  const pickOff = seededShuffle(off, seed ^ 0x9e3779b9).slice(0, 2);
  return seededShuffle([...pickSig, ...pickOff], seed ^ 0x85ebca6b);
}

export function getScenario(id: ScenarioId) {
  return SCENARIOS_V2.find((s) => s.id === id)!;
}

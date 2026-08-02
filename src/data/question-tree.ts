/**
 * Operadic question tree — root competency decomposes into weighted domains,
 * task statements, and leaf exam skills (composition = AND of leaves).
 */

import type { DomainId } from "./scenarios";

export type TreeNode = {
  id: string;
  kind: "root" | "domain" | "task" | "leaf";
  label: string;
  detail?: string;
  weight?: number;
  domain?: DomainId;
  taskId?: string;
  children?: TreeNode[];
  /** Practice item ids that stress this leaf */
  itemIds?: string[];
  antiPattern?: string;
};

export const QUESTION_TREE: TreeNode = {
  id: "root",
  kind: "root",
  label: "What must I answer correctly in any scenario to score 100%?",
  detail:
    "Composition rule: competency is the weighted AND of five domain operators. The exam draws 4 of 6 production scenarios — leaves must transfer across narratives.",
  children: [
    {
      id: "D1",
      kind: "domain",
      domain: "D1",
      label: "Agentic Architecture & Orchestration",
      weight: 27,
      detail: "Loops, multi-agent hub-and-spoke, hooks, decomposition, sessions",
      children: [
        {
          id: "TS1.1",
          kind: "task",
          taskId: "1.1",
          domain: "D1",
          label: "Agentic loops",
          detail: "stop_reason tool_use vs end_turn; append tool results; no NL stop parsing",
          children: [
            {
              id: "L1.1a",
              kind: "leaf",
              domain: "D1",
              label: "Continue only on stop_reason=tool_use",
              antiPattern: "Parse assistant text for 'done' / max_iterations as primary stop",
              itemIds: ["S1-Q06"],
            },
            {
              id: "L1.1b",
              kind: "leaf",
              domain: "D1",
              label: "Append tool results into history between iterations",
              antiPattern: "Drop tool results and re-ask from scratch",
            },
          ],
        },
        {
          id: "TS1.2",
          kind: "task",
          taskId: "1.2",
          domain: "D1",
          label: "Coordinator–subagent patterns",
          detail: "Hub-and-spoke; isolated subagent context; dynamic selection; iterative refinement",
          children: [
            {
              id: "L1.2a",
              kind: "leaf",
              domain: "D1",
              label: "Avoid overly narrow decomposition",
              antiPattern: "Always blame synthesis when coordinator assigned narrow subtopics",
              itemIds: ["S3-Q01", "S3-Q07"],
            },
            {
              id: "L1.2b",
              kind: "leaf",
              domain: "D1",
              label: "Route all inter-agent traffic through coordinator",
              antiPattern: "Peer-to-peer subagent mesh without observability",
            },
          ],
        },
        {
          id: "TS1.3",
          kind: "task",
          taskId: "1.3",
          domain: "D1",
          label: "Spawn & context pass",
          detail: "Task tool + allowedTools; explicit prompts; parallel Task calls",
          children: [
            {
              id: "L1.3a",
              kind: "leaf",
              domain: "D1",
              label: "allowedTools must include Task",
              itemIds: ["S3-Q04", "S3-Q06"],
            },
            {
              id: "L1.3b",
              kind: "leaf",
              domain: "D1",
              label: "No automatic parent history inheritance",
              antiPattern: "Assume subagents share memory",
            },
          ],
        },
        {
          id: "TS1.4-1.5",
          kind: "task",
          taskId: "1.4",
          domain: "D1",
          label: "Enforcement, handoffs, hooks",
          detail: "Programmatic prerequisites; PostToolUse; intercept policy violations",
          children: [
            {
              id: "L1.4a",
              kind: "leaf",
              domain: "D1",
              label: "Prerequisites for financial tool order",
              antiPattern: "Prompt-only identity verification before refunds",
              itemIds: ["S1-Q01", "S1-Q04"],
            },
          ],
        },
        {
          id: "TS1.6-1.7",
          kind: "task",
          taskId: "1.6",
          domain: "D1",
          label: "Decomposition & sessions",
          detail: "Chaining vs adaptive plans; --resume; fork_session; stale results",
          children: [
            {
              id: "L1.6a",
              kind: "leaf",
              domain: "D1",
              label: "Adaptive plans for open-ended work",
              itemIds: ["S4-Q05"],
            },
            {
              id: "L1.7a",
              kind: "leaf",
              domain: "D1",
              label: "Fresh + summary when tool results stale",
              itemIds: ["S2-Q07"],
            },
          ],
        },
      ],
    },
    {
      id: "D2",
      kind: "domain",
      domain: "D2",
      label: "Tool Design & MCP Integration",
      weight: 18,
      detail: "Descriptions, errors, distribution, MCP config, built-ins",
      children: [
        {
          id: "TS2.1",
          kind: "task",
          taskId: "2.1",
          domain: "D2",
          label: "Tool interfaces",
          children: [
            {
              id: "L2.1a",
              kind: "leaf",
              domain: "D2",
              label: "Rich descriptions before infrastructure",
              antiPattern: "First response = keyword router or mega-tool",
              itemIds: ["S1-Q02"],
            },
          ],
        },
        {
          id: "TS2.2",
          kind: "task",
          taskId: "2.2",
          domain: "D2",
          label: "Structured MCP errors",
          children: [
            {
              id: "L2.2a",
              kind: "leaf",
              domain: "D2",
              label: "errorCategory + isRetryable",
              antiPattern: "Generic 'Operation failed' or empty-as-success",
              itemIds: ["S1-Q07", "S3-Q02"],
            },
          ],
        },
        {
          id: "TS2.3",
          kind: "task",
          taskId: "2.3",
          domain: "D2",
          label: "Tool distribution & choice",
          children: [
            {
              id: "L2.3a",
              kind: "leaf",
              domain: "D2",
              label: "4–5 role-scoped tools; least privilege",
              itemIds: ["S3-Q03", "S4-Q06"],
            },
          ],
        },
        {
          id: "TS2.4-2.5",
          kind: "task",
          taskId: "2.4",
          domain: "D2",
          label: "MCP servers & built-ins",
          children: [
            {
              id: "L2.4a",
              kind: "leaf",
              domain: "D2",
              label: "Project .mcp.json vs user ~/.claude.json",
              itemIds: ["S4-Q03", "S4-Q07"],
            },
            {
              id: "L2.5a",
              kind: "leaf",
              domain: "D2",
              label: "Grep content · Glob paths · Edit→Read+Write",
              itemIds: ["S4-Q01", "S4-Q02"],
            },
          ],
        },
      ],
    },
    {
      id: "D3",
      kind: "domain",
      domain: "D3",
      label: "Claude Code Configuration & Workflows",
      weight: 20,
      detail: "CLAUDE.md hierarchy, skills, path rules, plan mode, CI flags",
      children: [
        {
          id: "TS3.1-3.3",
          kind: "task",
          taskId: "3.1",
          domain: "D3",
          label: "Config hierarchy & path rules",
          children: [
            {
              id: "L3.1a",
              kind: "leaf",
              domain: "D3",
              label: "Project vs user CLAUDE.md",
              itemIds: ["S2-Q04"],
            },
            {
              id: "L3.3a",
              kind: "leaf",
              domain: "D3",
              label: ".claude/rules/ globs for co-located tests",
              itemIds: ["S2-Q03"],
            },
          ],
        },
        {
          id: "TS3.2",
          kind: "task",
          taskId: "3.2",
          domain: "D3",
          label: "Commands & skills",
          children: [
            {
              id: "L3.2a",
              kind: "leaf",
              domain: "D3",
              label: ".claude/commands/ for team slash commands",
              itemIds: ["S2-Q01"],
            },
            {
              id: "L3.2b",
              kind: "leaf",
              domain: "D3",
              label: "context: fork for verbose skills",
              itemIds: ["S2-Q05"],
            },
          ],
        },
        {
          id: "TS3.4-3.6",
          kind: "task",
          taskId: "3.4",
          domain: "D3",
          label: "Plan mode & CI",
          children: [
            {
              id: "L3.4a",
              kind: "leaf",
              domain: "D3",
              label: "Plan mode for architectural multi-file work",
              itemIds: ["S2-Q02"],
            },
            {
              id: "L3.6a",
              kind: "leaf",
              domain: "D3",
              label: "claude -p + JSON schema output in CI",
              itemIds: ["S5-Q01", "S5-Q05", "S5-Q07"],
            },
          ],
        },
      ],
    },
    {
      id: "D4",
      kind: "domain",
      domain: "D4",
      label: "Prompt Engineering & Structured Output",
      weight: 20,
      detail: "Criteria, few-shots, tool_use schemas, retries, batches, multi-pass",
      children: [
        {
          id: "TS4.1-4.2",
          kind: "task",
          taskId: "4.1",
          domain: "D4",
          label: "Precision & few-shots",
          children: [
            {
              id: "L4.1a",
              kind: "leaf",
              domain: "D4",
              label: "Explicit categorical criteria > 'be conservative'",
              itemIds: ["S5-Q04", "S2-Q06", "S6-Q04"],
            },
          ],
        },
        {
          id: "TS4.3-4.4",
          kind: "task",
          taskId: "4.3",
          domain: "D4",
          label: "Schemas, tool_choice, validation loops",
          children: [
            {
              id: "L4.3a",
              kind: "leaf",
              domain: "D4",
              label: "tool_use + schema; nullable fields",
              itemIds: ["S6-Q01", "S6-Q02", "S6-Q06", "S6-Q07"],
            },
            {
              id: "L4.4a",
              kind: "leaf",
              domain: "D4",
              label: "Stop retrying when source lacks data",
              itemIds: ["S6-Q03"],
            },
          ],
        },
        {
          id: "TS4.5-4.6",
          kind: "task",
          taskId: "4.5",
          domain: "D4",
          label: "Batches & multi-pass review",
          children: [
            {
              id: "L4.5a",
              kind: "leaf",
              domain: "D4",
              label: "Batch only for non-blocking work",
              itemIds: ["S5-Q02", "S6-Q08"],
            },
            {
              id: "L4.6a",
              kind: "leaf",
              domain: "D4",
              label: "Per-file + integration pass; independent review",
              itemIds: ["S5-Q03", "S5-Q06"],
            },
          ],
        },
      ],
    },
    {
      id: "D5",
      kind: "domain",
      domain: "D5",
      label: "Context Management & Reliability",
      weight: 15,
      detail: "Case facts, escalation, error propagation, exploration, HITL, provenance",
      children: [
        {
          id: "TS5.1",
          kind: "task",
          taskId: "5.1",
          domain: "D5",
          label: "Preserve critical facts",
          children: [
            {
              id: "L5.1a",
              kind: "leaf",
              domain: "D5",
              label: "Case-facts block; trim tool payloads",
              antiPattern: "Prose progressive summary of amounts/dates",
              itemIds: ["S1-Q05", "S4-Q04"],
            },
          ],
        },
        {
          id: "TS5.2",
          kind: "task",
          taskId: "5.2",
          domain: "D5",
          label: "Escalation & ambiguity",
          children: [
            {
              id: "L5.2a",
              kind: "leaf",
              domain: "D5",
              label: "Explicit criteria; honor human requests",
              antiPattern: "Sentiment or self-confidence as complexity proxy",
              itemIds: ["S1-Q03", "S1-Q08"],
            },
          ],
        },
        {
          id: "TS5.3-5.6",
          kind: "task",
          taskId: "5.3",
          domain: "D5",
          label: "Errors, HITL, provenance",
          children: [
            {
              id: "L5.3a",
              kind: "leaf",
              domain: "D5",
              label: "Structured multi-agent error context",
              itemIds: ["S3-Q02"],
            },
            {
              id: "L5.5a",
              kind: "leaf",
              domain: "D5",
              label: "Stratified sampling; field confidence",
              itemIds: ["S6-Q05"],
            },
            {
              id: "L5.6a",
              kind: "leaf",
              domain: "D5",
              label: "Annotate conflicts; claim–source maps",
              itemIds: ["S3-Q05"],
            },
          ],
        },
      ],
    },
  ],
};

export function flattenLeaves(node: TreeNode = QUESTION_TREE): TreeNode[] {
  if (node.kind === "leaf") return [node];
  return (node.children ?? []).flatMap(flattenLeaves);
}

export function findNode(id: string, node: TreeNode = QUESTION_TREE): TreeNode | null {
  if (node.id === id) return node;
  for (const c of node.children ?? []) {
    const f = findNode(id, c);
    if (f) return f;
  }
  return null;
}

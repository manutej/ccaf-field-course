/**
 * V2 Skilljar-quality item bank.
 * Stems match practice-exam signature: concrete systems, production metrics,
 * root-cause+fix framing, multi-select where the guide implies multi-response.
 * Grounded in public CCAR-F objectives — not a leaked Skilljar dump.
 */

import type { DomainId, ScenarioId } from "./scenarios";

export type ItemFormat = "single" | "multi";

export type ExamItemV2 = {
  id: string;
  scenarioId: ScenarioId;
  domain: DomainId;
  taskStatement: string;
  difficulty: "application" | "judgment" | "trap";
  format: ItemFormat;
  /** For multi: number of correct options to select */
  selectCount?: number;
  stem: string;
  options: string[];
  /** Single: one index. Multi: sorted indices */
  correct: number[];
  explanation: string;
  distractorNotes: string[];
  stresses: string[];
  /** From user-supplied Skilljar-style examples */
  skilljarStyle?: boolean;
};

export const EXAM_BANK_V2: ExamItemV2[] = [
  // ═══════════════════════════════════════════════════════════
  // MOD — Content Moderation (user examples + expansions)
  // ═══════════════════════════════════════════════════════════
  {
    id: "MOD-Q01",
    scenarioId: "MOD",
    domain: "D4",
    taskStatement: "4.1",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "The moderation system's prompt instructs Claude to 'be conservative when moderating and err on the side of caution.' Reviewers find that innocuous posts about cooking with knives, news articles about violence, and fictional war stories are all being flagged as policy violations. What is the root cause and fix?",
    options: [
      "Root cause: vague 'be conservative' language without categorical criteria. Fix: write explicit criteria defining which content to flag (clear policy violations) versus skip (cooking tools, news reporting, fiction), with concrete examples per severity.",
      "Root cause: temperature is too high. Fix: set temperature to 0 and keep the same prompt wording.",
      "Root cause: missing Message Batches API. Fix: switch all moderation to batch for 50% cost savings.",
      "Root cause: the model lacks vision. Fix: add image analysis tools even for text-only posts.",
    ],
    correct: [0],
    explanation:
      "General instructions like 'be conservative' fail to improve precision compared to specific categorical criteria. High false-positive categories (cooking knives, news, fiction) destroy trust. Explicit report-vs-skip criteria with examples is the guide's prescribed fix.",
    distractorNotes: [
      "Temperature alone does not supply decision boundaries.",
      "Batch API is about latency/cost, not precision criteria.",
      "Vision is orthogonal to text over-flagging.",
    ],
    stresses: ["explicit criteria > vague conservatism"],
  },
  {
    id: "MOD-Q02",
    scenarioId: "MOD",
    domain: "D4",
    taskStatement: "4.3",
    difficulty: "application",
    format: "single",
    skilljarStyle: true,
    stem:
      "The moderation system uses tool_use with a JSON schema for classification output. All fields including 'sub_category' and 'target_demographic' are marked as required. Auditors discover that when a post is spam (which has no target demographic), the model fabricates plausible-sounding demographics like 'general public' or 'young adults.' What schema change prevents this fabrication?",
    options: [
      "Make target_demographic and similar fields optional/nullable so the model can return null when the source post has no demographic target, instead of inventing values to satisfy required fields.",
      "Add more required fields so the model has less freedom to invent.",
      "Remove the JSON schema and ask for free-text classifications.",
      "Set tool_choice to 'auto' so the model can skip the tool when unsure.",
    ],
    correct: [0],
    explanation:
      "Required fields pressure the model to fabricate values when information is absent. Optional/nullable fields prevent hallucination for spam and similar categories without a demographic target.",
    distractorNotes: [
      "More required fields increase fabrication pressure.",
      "Free text loses auditability.",
      "auto may skip structured output entirely.",
    ],
    stresses: ["nullable fields prevent fabrication"],
  },
  {
    id: "MOD-Q03",
    scenarioId: "MOD",
    domain: "D4",
    taskStatement: "4.2",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "The moderation system classifies hate speech accurately for explicit slurs but misses coded language and dog-whistle terms that human moderators easily recognise. The prompt includes detailed written rules about coded language patterns. What intervention would most improve detection of coded hate speech?",
    options: [
      "Add 2–4 few-shot examples that demonstrate coded/dog-whistle cases, including why they were classified as violations versus similar non-violating slang.",
      "Repeat the written rules three more times in the system prompt.",
      "Lower the confidence threshold so more borderline posts auto-escalate.",
      "Switch to Message Batches overnight so the model has more time to think.",
    ],
    correct: [0],
    explanation:
      "Few-shot examples are the most effective technique for ambiguous-case handling and generalization to novel patterns. Detailed prose rules alone often fail on coded language; examples teach judgment boundaries.",
    distractorNotes: [
      "Repetition of rules is low leverage.",
      "Lowering thresholds increases false positives without teaching coded patterns.",
      "Batch latency is irrelevant to detection quality.",
    ],
    stresses: ["few-shots for ambiguous coded cases"],
  },
  {
    id: "MOD-Q04",
    scenarioId: "MOD",
    domain: "D1",
    taskStatement: "1.5",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "A developer-tool agent writes code and runs shell commands. A system prompt instruction ('Do not run destructive commands or access files outside the project') is violated 3% of the time in testing. The team requires this rule to hold absolutely. What should the architect implement?",
    options: [
      "Implement tool-call interception hooks that block destructive or out-of-project commands programmatically, rather than relying on prompt compliance for a zero-tolerance rule.",
      "Add the instruction five more times and set temperature to 0.",
      "After each turn, parse the assistant's free text for the word 'rm' and cancel the run.",
      "Remove Bash entirely and accept that no shell automation is possible.",
    ],
    correct: [0],
    explanation:
      "When deterministic compliance is required, prompt instructions have a non-zero failure rate. Hooks intercept outgoing tool calls for guaranteed enforcement. 3% residual risk is unacceptable for absolute rules.",
    distractorNotes: [
      "Prompt repetition remains probabilistic.",
      "Free-text parsing is an anti-pattern for control.",
      "Removing Bash is overly broad versus intercepting dangerous calls.",
    ],
    stresses: ["hooks for absolute safety rules"],
  },
  {
    id: "MOD-Q05",
    scenarioId: "MOD",
    domain: "D1",
    taskStatement: "1.2",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "The moderation coordinator dispatches posts to specialist subagents. The text classifier has been extended to also handle image analysis: its prompt is now 2,500 tokens, its tool list has grown to 12 tools, and accuracy has dropped on both text and image tasks. What principle was violated and what is the fix?",
    options: [
      "Violated specialist scope / least privilege: too many tools and mixed modalities degrade selection and attention. Fix: split into focused text and image subagents with 4–5 role-relevant tools each and slim prompts.",
      "Violated stop_reason handling: the loop should never call image tools. Fix: ignore image posts.",
      "Violated batch pricing: 12 tools require Message Batches. Fix: switch the coordinator to batch-only.",
      "Violated CLAUDE.md hierarchy: put the 2,500-token prompt in user-level CLAUDE.md only.",
    ],
    correct: [0],
    explanation:
      "Giving an agent too many tools (e.g. 12 vs 4–5) and bloating scope across modalities degrades reliability. Split specialists, scope tools, keep prompts focused.",
    distractorNotes: [
      "Image posts still need handling via a specialist.",
      "Batch API is unrelated to tool-count degradation.",
      "User-level CLAUDE.md is not the multi-agent fix.",
    ],
    stresses: ["specialist agents; tool count limits"],
  },
  {
    id: "MOD-Q06",
    scenarioId: "MOD",
    domain: "D4",
    taskStatement: "4.6",
    difficulty: "trap",
    format: "single",
    skilljarStyle: true,
    stem:
      "The moderation team asks a single Claude session to classify a post, then immediately asks the same session to independently review its own classification for quality assurance. The 'review' agrees with the original classification 98% of the time, including cases that human auditors later identify as errors. Why is this self-review ineffective?",
    options: [
      "The model retains reasoning context from the original classification, making it less likely to question its own decisions; independent review instances without that prior reasoning catch subtle errors more effectively.",
      "The 98% agreement proves self-review is working; human auditors are the problem.",
      "Self-review only works when tool_choice is set to 'any'.",
      "Self-review fails because Message Batches cannot multi-turn; the real fix is batching both calls.",
    ],
    correct: [0],
    explanation:
      "Self-review in the same session keeps generation bias. Independent instances without prior reasoning context are the guide's recommended architecture for review quality.",
    distractorNotes: [
      "High agreement with a wrong label is false confidence.",
      "tool_choice does not fix self-review bias.",
      "Batch is orthogonal to independence of review context.",
    ],
    stresses: ["independent review instance > same-session self-review"],
  },
  {
    id: "MOD-Q07",
    scenarioId: "MOD",
    domain: "D1",
    taskStatement: "1.4",
    difficulty: "application",
    format: "single",
    skilljarStyle: true,
    stem:
      "A user reports a post that contains both potentially defamatory text and an embedded image that may violate graphic content policies. The coordinator receives this report as a single moderation request. What is the correct delegation strategy?",
    options: [
      "Decompose into distinct concerns and investigate in parallel with shared case context (text specialist + image specialist), then synthesise a unified decision before action/escalation.",
      "Always handle only the text path first and ignore the image until a human asks.",
      "Force a single mega-agent with all text and image tools to process the post in one tool_use.",
      "Escalate immediately to a human without classification because multi-modal posts are out of scope.",
    ],
    correct: [0],
    explanation:
      "Multi-concern requests should be decomposed and investigated in parallel with shared context, then synthesised — not collapsed into one overloaded agent or dropped on the floor.",
    distractorNotes: [
      "Ignoring image policy risk is incomplete coverage.",
      "Mega-agents reintroduce scope/tool bloat.",
      "Automatic human escalation for every multi-modal post kills automation goals.",
    ],
    stresses: ["multi-concern parallel decomposition"],
  },
  {
    id: "MOD-Q08",
    scenarioId: "MOD",
    domain: "D5",
    taskStatement: "5.2",
    difficulty: "judgment",
    format: "single",
    stem:
      "Moderation metrics show 92% automated resolution, but logs reveal the agent escalates clear spam while attempting to auto-action ambiguous political satire that needs policy interpretation. What is the most effective first fix?",
    options: [
      "Add explicit escalation criteria with few-shot examples showing when to escalate (policy gaps, ambiguous satire, user appeals) versus auto-action (clear spam, known phishing).",
      "Have the model self-report confidence 1–10 and escalate below 7.",
      "Escalate whenever sentiment is negative.",
      "Train a separate ML classifier before touching the prompt.",
    ],
    correct: [0],
    explanation:
      "Mis-calibrated escalation needs explicit criteria and few-shots. Self-confidence and sentiment are unreliable proxies; ML is over-engineered before prompt clarity.",
    distractorNotes: [
      "Self-reported confidence is poorly calibrated.",
      "Sentiment ≠ policy complexity.",
      "Try prompt criteria before new models.",
    ],
    stresses: ["escalation criteria + few-shots"],
  },

  // ═══════════════════════════════════════════════════════════
  // DEV — Developer Productivity Tools
  // ═══════════════════════════════════════════════════════════
  {
    id: "DEV-Q01",
    scenarioId: "DEV",
    domain: "D5",
    taskStatement: "5.4",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "Claude Code is auditing API documentation coverage across a large codebase. After exploring 15 modules, the agent produces vague references like 'the authentication module follows standard patterns' instead of citing specific class names and method signatures it discovered earlier. `/compact` has already been used once. What is the most effective next step?",
    options: [
      "Have the agent maintain a scratchpad file of key findings (class names, method signatures, file paths) and re-inject those structured notes into subsequent turns, optionally spawning focused subagents for remaining modules while the main session coordinates.",
      "Run /compact again immediately and continue without notes.",
      "Increase max_tokens and paste the entire monorepo into the system prompt.",
      "Disable all tools so the agent reasons only from memory.",
    ],
    correct: [0],
    explanation:
      "Context degradation produces 'typical patterns' instead of specifics. Scratchpads persist findings across boundaries; subagents isolate verbose exploration. /compact alone does not restore dropped proper names.",
    distractorNotes: [
      "Repeated compact without scratchpad loses more detail.",
      "Whole-repo system prompts are impractical.",
      "No tools worsens exploration fidelity.",
    ],
    stresses: ["scratchpads after compact; subagent isolation"],
  },
  {
    id: "DEV-Q02",
    scenarioId: "DEV",
    domain: "D3",
    taskStatement: "3.2",
    difficulty: "application",
    format: "single",
    skilljarStyle: true,
    stem:
      "A documentation team creates a /generate-api-docs skill that reads source code files and produces Markdown API reference pages. The skill generates verbose output (200+ lines per endpoint) and should be available to every team member who clones the repository. How should the skill be configured?",
    options: [
      "Place it in project-scoped .claude/skills/ with SKILL.md frontmatter including context: fork (isolate verbose output) and appropriate allowed-tools restrictions so it ships via version control to all clones.",
      "Place it only in each developer's ~/.claude/skills/ with identical names.",
      "Embed the entire skill in root CLAUDE.md as a free-text section.",
      "Define it in package.json under a claude.skills array.",
    ],
    correct: [0],
    explanation:
      "Team skills live in .claude/skills/ (project scope). context: fork prevents verbose skill output from polluting the main conversation. User-scoped skills are not shared via clone.",
    distractorNotes: [
      "User scope is personal, not team-shared.",
      "CLAUDE.md is not skill packaging.",
      "package.json is not the Claude skill surface.",
    ],
    stresses: ["project skills + context:fork for verbose output"],
  },
  {
    id: "DEV-Q03",
    scenarioId: "DEV",
    domain: "D2",
    taskStatement: "2.5",
    difficulty: "application",
    format: "single",
    skilljarStyle: true,
    stem:
      "A developer is using Claude Code to update a configuration value in a file. They use the Edit tool, but it fails because the text they are trying to match appears in three places in the file. What is the correct next step?",
    options: [
      "Use Read to load the full file contents, then Write the complete updated file (or re-Edit with a longer unique anchor that appears only once).",
      "Retry Edit with a shorter substring of the same non-unique text.",
      "Delete the file with Bash and recreate it from memory.",
      "Set tool_choice to force Edit until it succeeds.",
    ],
    correct: [0],
    explanation:
      "When Edit fails due to non-unique text matches, Read + Write is the documented reliable fallback. Longer unique anchors can also work; shorter non-unique strings make it worse.",
    distractorNotes: [
      "Shorter anchors reduce uniqueness.",
      "Delete/recreate is destructive.",
      "Forcing Edit does not create unique anchors.",
    ],
    stresses: ["Edit uniqueness → Read+Write"],
  },
  {
    id: "DEV-Q04",
    scenarioId: "DEV",
    domain: "D5",
    taskStatement: "5.5",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "Claude Code generates API reference pages for 150 endpoints across three categories: payment processing (30 endpoints, high regulatory risk), internal tooling (80 endpoints, low risk), and public data queries (40 endpoints, moderate risk). The team cannot manually review all 150. How should they structure human review?",
    options: [
      "Route by risk and model confidence: review all payment endpoints, sample public-data with field-level confidence thresholds, and use stratified random sampling of high-confidence internal docs to catch novel error patterns before reducing review.",
      "Review only the first 10 alphabetically and assume the rest match.",
      "Skip human review if aggregate accuracy on a tiny sample is 97%.",
      "Send every endpoint to three human reviewers regardless of risk.",
    ],
    correct: [0],
    explanation:
      "Aggregate accuracy masks segment failures. Prioritise high-risk document types, use field-level confidence routing, and stratified sampling of high-confidence outputs for ongoing QA.",
    distractorNotes: [
      "Alphabetical sampling ignores risk.",
      "97% aggregate can hide payment-field disasters.",
      "Full triple review is not capacity-realistic.",
    ],
    stresses: ["risk-stratified HITL + confidence routing"],
  },
  {
    id: "DEV-Q05",
    scenarioId: "DEV",
    domain: "D2",
    taskStatement: "2.1",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "An agent has two tools: analyze_content ('Analyses content') and extract_web_results ('Extracts data from web pages'). After a system prompt update added 'Always analyse content before responding', the agent started routing web-extraction tasks to analyze_content despite the unchanged descriptions. What is the most likely cause and fix?",
    options: [
      "Cause: keyword-sensitive system prompt wording created an unintended association with analyze_content. Fix: rewrite the system prompt to avoid forcing a tool by keyword, and expand both tool descriptions with inputs, examples, edge cases, and clear boundaries versus each other.",
      "Cause: Message Batches reorders tools. Fix: disable batching.",
      "Cause: stop_reason is broken. Fix: parse free text for tool names.",
      "Cause: temperature is too low. Fix: raise temperature to 1.0.",
    ],
    correct: [0],
    explanation:
      "System prompt keyword-sensitive instructions can override well-intentioned tool selection. Combined with minimal descriptions, misrouting is expected. Fix both prompt associations and description quality.",
    distractorNotes: [
      "Batch is unrelated to tool name association.",
      "NL parsing is an anti-pattern.",
      "Higher temperature does not fix keyword bias.",
    ],
    stresses: ["prompt keywords vs tool descriptions"],
  },
  {
    id: "DEV-Q06",
    scenarioId: "DEV",
    domain: "D2",
    taskStatement: "2.4",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "A team's shared .mcp.json configures a PostgreSQL MCP server. A developer adds a personal staging database MCP server to their ~/.claude.json, so both database tools are available in their session. When they query 'check user count', the agent calls the production tool instead of staging. What is the best resolution?",
    options: [
      "Rename and rewrite tool descriptions so production vs staging purpose, connection target, and when-to-use boundaries are unmistakable (e.g. query_prod_users vs query_staging_users), and avoid ambiguous shared names.",
      "Delete the project .mcp.json so only staging exists.",
      "Commit staging credentials into shared .mcp.json for everyone.",
      "Set tool_choice to force the first tool alphabetically.",
    ],
    correct: [0],
    explanation:
      "Multiple MCP servers are available simultaneously; selection depends on clear names/descriptions. Personal staging servers are valid in user scope — disambiguation is the fix, not removing shared prod config or committing secrets.",
    distractorNotes: [
      "Removing shared prod tooling hurts the team.",
      "Never commit secrets.",
      "Forced alphabetical choice is wrong.",
    ],
    stresses: ["disambiguate simultaneous MCP tools"],
  },
  {
    id: "DEV-Q07",
    scenarioId: "DEV",
    domain: "D1",
    taskStatement: "1.6",
    difficulty: "judgment",
    format: "multi",
    selectCount: 2,
    skilljarStyle: true,
    stem:
      "You are planning how Claude should tackle a large, unfamiliar refactoring effort. Which characteristics of the work indicate dynamic adaptive decomposition rather than a fixed sequential pipeline? (Select 2)",
    options: [
      "Intermediate findings will change which files and dependencies matter next.",
      "The work is open-ended investigation (map structure, find high-impact areas, adapt as discoveries land).",
      "Every file must receive the exact same three review checks in order with no branching.",
      "The change is a one-line config flip with a known file path.",
    ],
    correct: [0, 1],
    explanation:
      "Dynamic adaptive decomposition fits open-ended work where intermediate findings generate new subtasks. Fixed sequential pipelines fit predictable multi-aspect reviews. One-line known edits use direct execution, not heavy decomposition.",
    distractorNotes: [
      "Fixed identical checks → prompt chaining / sequential pipeline.",
      "One-line known path → direct execution, not adaptive multi-agent planning.",
    ],
    stresses: ["adaptive vs fixed decomposition (multi-select)"],
  },
  {
    id: "DEV-Q08",
    scenarioId: "DEV",
    domain: "D3",
    taskStatement: "3.6",
    difficulty: "application",
    format: "single",
    stem:
      "CI job hangs on: claude \"Review this PR for security issues\". Logs show Claude Code waiting for interactive input. What is the correct non-interactive invocation?",
    options: [
      "claude -p \"Review this PR for security issues\" (optionally with --output-format json and --json-schema for machine-parseable findings).",
      "export CLAUDE_HEADLESS=true && claude \"Review this PR for security issues\"",
      "claude --batch \"Review this PR for security issues\"",
      "claude \"Review this PR for security issues\" < /dev/null is the documented supported contract",
    ],
    correct: [0],
    explanation:
      "The -p / --print flag is the documented non-interactive mode for CI. Pair with JSON schema flags when posting structured PR comments.",
    distractorNotes: [
      "CLAUDE_HEADLESS is not the documented contract.",
      "--batch is not the Claude Code CI flag.",
      "stdin redirect is a fragile workaround.",
    ],
    stresses: ["-p for CI"],
  },

  // ═══════════════════════════════════════════════════════════
  // DOCS — Technical Documentation Maintenance
  // ═══════════════════════════════════════════════════════════
  {
    id: "DOCS-Q01",
    scenarioId: "DOCS",
    domain: "D5",
    taskStatement: "5.6",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "A docs team has Claude Code generate architecture guides by synthesising source code, inline comments, commit messages, and ADRs. After several edits, the guides no longer indicate which statements came from which source. A developer later questions whether a specific architectural constraint in a guide is still valid. What approach preserves source attribution?",
    options: [
      "Require structured claim–source mappings (source path, ADR id, excerpt, date) that downstream synthesis must preserve and render, distinguishing well-established vs contested statements.",
      "Ask the model to 'remember sources carefully' in prose without structure.",
      "Drop all source citations to keep guides short.",
      "Store only the final prose and re-derive sources later by embedding search.",
    ],
    correct: [0],
    explanation:
      "Source attribution is lost during unstructured summarisation. Structured claim–source mappings preserved through synthesis enable validity challenges later.",
    distractorNotes: [
      "Prose memory is unreliable under compact/edit.",
      "Dropping citations makes audits impossible.",
      "Re-deriving later is speculative and lossy.",
    ],
    stresses: ["claim–source provenance through synthesis"],
  },
  {
    id: "DOCS-Q02",
    scenarioId: "DOCS",
    domain: "D5",
    taskStatement: "5.3",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "A documentation generation pipeline uses Claude Code to produce docs from three sources: source code comments, existing wiki pages, and API schema files. During a run, the wiki page retrieval fails with a timeout, but the source code and API schema are available. The pipeline currently halts entirely on any source failure. What is the best error handling strategy?",
    options: [
      "Propagate structured error context (failure type, attempted query, partial results) and continue with code + schema, annotating the output with coverage gaps for the missing wiki source.",
      "Return empty success for the wiki and pretend it had no pages.",
      "Terminate the entire documentation workflow and page on-call for every wiki timeout.",
      "Retry forever without surfacing status to the coordinator.",
    ],
    correct: [0],
    explanation:
      "Structured multi-source error propagation enables partial success with gap annotations. Silent empty success and full abort are anti-patterns when other sources succeeded.",
    distractorNotes: [
      "Empty-as-success hides missing coverage.",
      "Full abort on one source is unnecessary.",
      "Infinite silent retry lacks coordinator visibility.",
    ],
    stresses: ["partial results + coverage annotations"],
  },
  {
    id: "DOCS-Q03",
    scenarioId: "DOCS",
    domain: "D5",
    taskStatement: "5.1",
    difficulty: "trap",
    format: "single",
    skilljarStyle: true,
    stem:
      "A docs team processes a 500,000-line codebase by having Claude Code read files and generate docs, instructing it to 'summarise each module after documenting it, then discard the detailed source from context.' After processing 20 modules, the docs for module 21 reference class names from module 3 that were renamed in module 12. What caused this failure?",
    options: [
      "Progressive summarisation dropped precise identifiers and retained stale names in vague summaries; later modules reasoned over degraded context without a durable structured fact/scratchpad layer for renames.",
      "The Message Batches API reordered modules alphabetically.",
      "tool_choice auto forced the wrong tool.",
      "CLAUDE.md user-level settings overwrote class names.",
    ],
    correct: [0],
    explanation:
      "Progressive summarisation risks losing numerical values, names, and precise facts. Discarding detailed source without structured rename tracking produces cross-module hallucinations from stale summaries.",
    distractorNotes: [
      "Batch reordering is not the mechanism here.",
      "tool_choice is unrelated to name drift.",
      "User CLAUDE.md does not rewrite code symbols mid-run.",
    ],
    stresses: ["summarisation loss; structured rename tracking"],
  },
  {
    id: "DOCS-Q04",
    scenarioId: "DOCS",
    domain: "D3",
    taskStatement: "3.4",
    difficulty: "judgment",
    format: "single",
    stem:
      "The docs team must restructure documentation for a monorepo split into five packages with cross-links, ownership maps, and migration of 200 pages. Multiple valid information architectures exist. How should they use Claude Code?",
    options: [
      "Enter plan mode to explore structure and design an approach before bulk edits; use Explore-style isolation for verbose discovery, then execute the agreed plan.",
      "Direct-execute all 200 page moves in one session without planning.",
      "Only use plan mode for single-character typo fixes.",
      "Disable CLAUDE.md so planning is unconstrained by standards.",
    ],
    correct: [0],
    explanation:
      "Plan mode is for large-scale multi-file work with multiple valid approaches and architectural decisions — exactly this docs migration.",
    distractorNotes: [
      "Blind bulk execution risks costly rework.",
      "Plan mode is not for tiny typos.",
      "Standards still apply during planning.",
    ],
    stresses: ["plan mode for architectural docs migration"],
  },
  {
    id: "DOCS-Q05",
    scenarioId: "DOCS",
    domain: "D3",
    taskStatement: "3.3",
    difficulty: "application",
    format: "single",
    stem:
      "API reference conventions differ from ADR prose conventions, and test fixtures for docs generation live next to many packages (**/*.docs-fixture.ts). What is the most maintainable way to auto-apply the right rules?",
    options: [
      "Create .claude/rules/ files with YAML frontmatter path globs so conventions load only when editing matching paths (including **/*.docs-fixture.ts regardless of directory).",
      "One monolithic CLAUDE.md and hope Claude infers the section.",
      "User-level rules only on the tech writer's laptop.",
      "A single skill that must be manually invoked for every file type.",
    ],
    correct: [0],
    explanation:
      "Path-scoped rules with globs apply automatically by file path and handle co-located fixtures across the tree.",
    distractorNotes: [
      "Inference from one file is unreliable.",
      "User-level is not team-shared.",
      "Manual skills are not automatic by path.",
    ],
    stresses: ["path rules for co-located fixtures"],
  },

  // ═══════════════════════════════════════════════════════════
  // Official scenarios — Skilljar density
  // ═══════════════════════════════════════════════════════════
  {
    id: "S1-Q01",
    scenarioId: "S1",
    domain: "D1",
    taskStatement: "1.4",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "Production data shows that in 12% of cases, your support agent skips get_customer entirely and calls lookup_order using only the customer's stated name, occasionally leading to misidentified accounts and incorrect refunds. What change would most effectively address this reliability issue?",
    options: [
      "Add a programmatic prerequisite that blocks lookup_order and process_refund until get_customer has returned a verified customer ID.",
      "Enhance the system prompt to state that customer verification via get_customer is mandatory before any order operations.",
      "Add few-shot examples showing the agent always calling get_customer first.",
      "Implement a routing classifier that enables only a subset of tools per request type.",
    ],
    correct: [0],
    explanation:
      "Identity-before-refund is compliance-critical: programmatic prerequisites provide deterministic guarantees prompts cannot.",
    distractorNotes: [
      "Prompt mandates remain probabilistic.",
      "Few-shots help selection, not hard sequence gates.",
      "Routing does not enforce ordering.",
    ],
    stresses: ["programmatic prerequisites"],
  },
  {
    id: "S1-Q02",
    scenarioId: "S1",
    domain: "D2",
    taskStatement: "2.1",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "Production logs show the agent frequently calls get_customer when users ask about orders (e.g., 'check my order #12345'), instead of lookup_order. Both tools have minimal descriptions and accept similar identifier formats. What is the most effective first step?",
    options: [
      "Expand each tool's description to include input formats, example queries, edge cases, and boundaries explaining when to use it versus similar tools.",
      "Add 5–8 few-shot examples without changing descriptions.",
      "Build a keyword router that pre-selects tools before the model runs.",
      "Consolidate into a single lookup_entity tool as the first step.",
    ],
    correct: [0],
    explanation:
      "Tool descriptions are the primary selection mechanism. Fix descriptions before infrastructure or consolidation.",
    distractorNotes: [
      "Few-shots without description fix are secondary.",
      "Keyword routers are over-engineered first steps.",
      "Consolidation is larger than a first fix.",
    ],
    stresses: ["description quality first"],
  },
  {
    id: "S1-Q03",
    scenarioId: "S1",
    domain: "D5",
    taskStatement: "5.2",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "Your agent achieves 55% first-contact resolution. Logs show it escalates straightforward damage replacements with photo evidence while autonomously handling complex policy exceptions. What is the most effective way to improve escalation calibration?",
    options: [
      "Add explicit escalation criteria with few-shot examples demonstrating when to escalate versus resolve autonomously.",
      "Have the agent self-report confidence 1–10 and auto-escalate below a threshold.",
      "Deploy a separate classifier on historical tickets before changing the prompt.",
      "Escalate automatically when negative sentiment is detected.",
    ],
    correct: [0],
    explanation:
      "Unclear boundaries cause inverted escalation. Explicit criteria + few-shots first; confidence and sentiment are poor proxies.",
    distractorNotes: [
      "Self-confidence is poorly calibrated.",
      "ML before prompt work is over-engineered.",
      "Sentiment ≠ case complexity.",
    ],
    stresses: ["escalation few-shots"],
  },
  {
    id: "S1-Q04",
    scenarioId: "S1",
    domain: "D5",
    taskStatement: "5.1",
    difficulty: "application",
    format: "single",
    stem:
      "After eight turns, lookup_order has appended 40-field payloads each time. The agent misquotes a refund amount stated in turn 2. Progressive prose summaries keep saying 'customer wants a refund soon.' What preserves transactional accuracy?",
    options: [
      "Maintain a persistent case-facts block (amounts, dates, order IDs, statuses) outside summarised history and trim tool results to return-relevant fields before append.",
      "Summarise the entire transcript more aggressively every turn.",
      "Drop all tool results after one turn and trust model memory.",
      "Raise max_tokens only and keep full 40-field objects forever.",
    ],
    correct: [0],
    explanation:
      "Transactional facts must not live only inside fuzzy progressive summaries. Case-facts blocks + trimmed tools are the guide pattern.",
    distractorNotes: [
      "More aggressive prose summaries lose numbers.",
      "Dropped tool results are not retained.",
      "Larger windows do not fix middle-loss or token waste.",
    ],
    stresses: ["case-facts + trim tools"],
  },
  {
    id: "S2-Q01",
    scenarioId: "S2",
    domain: "D3",
    taskStatement: "3.2",
    difficulty: "application",
    format: "single",
    skilljarStyle: true,
    stem:
      "You want a custom /review slash command with your team's checklist available to every developer who clones the repository. Where do you put it?",
    options: [
      "In the project's .claude/commands/ directory (version-controlled).",
      "In each developer's ~/.claude/commands/ only.",
      "Inside CLAUDE.md as a markdown heading.",
      "In .claude/config.json under a commands array.",
    ],
    correct: [0],
    explanation:
      "Project-scoped slash commands live in .claude/commands/ and ship with the repo.",
    distractorNotes: [
      "User home is personal.",
      "CLAUDE.md is not command packaging.",
      "config.json commands array is fictional.",
    ],
    stresses: ["project command scope"],
  },
  {
    id: "S2-Q02",
    scenarioId: "S2",
    domain: "D3",
    taskStatement: "3.4",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "You must restructure a monolith into microservices across dozens of files with open service-boundary decisions. Which approach?",
    options: [
      "Enter plan mode to explore dependencies and design before committing to changes.",
      "Direct-execute immediately and let boundaries emerge from partial edits.",
      "Direct-execute with a fully specified target architecture you have not validated against the code.",
      "Stay in direct mode until something breaks, then switch to plan mode.",
    ],
    correct: [0],
    explanation:
      "Plan mode is designed for architectural, multi-file, multi-approach work where complexity is already known.",
    distractorNotes: [
      "Emergent edits risk late dependency discovery.",
      "Unvalidated upfront architecture still needs exploration.",
      "Complexity is already stated — don't wait for failure.",
    ],
    stresses: ["plan mode for architecture"],
  },
  {
    id: "S2-Q03",
    scenarioId: "S2",
    domain: "D3",
    taskStatement: "3.3",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "React, API, and DB layers have different conventions. Tests sit beside sources (**/*.test.tsx). You need automatic correct conventions when generating code. Most maintainable approach?",
    options: [
      "Rule files in .claude/rules/ with YAML frontmatter globs for path-conditional loading.",
      "One root CLAUDE.md with headers and rely on inference.",
      "Skills for each type that must be manually invoked.",
      "A CLAUDE.md only in one tests/ directory.",
    ],
    correct: [0],
    explanation:
      "Glob path rules apply by file type across directories — essential for co-located tests.",
    distractorNotes: [
      "Inference is unreliable.",
      "Skills are not automatic by path.",
      "Single tests/ CLAUDE.md misses co-located tests elsewhere.",
    ],
    stresses: ["glob path rules"],
  },
  {
    id: "S3-Q01",
    scenarioId: "S3",
    domain: "D1",
    taskStatement: "1.2",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "On 'impact of AI on creative industries', all subagents succeed but the report covers only visual arts. Coordinator logs show subtasks: digital art, graphic design, photography. Root cause?",
    options: [
      "Coordinator task decomposition was too narrow, so assignments never covered music, writing, or film.",
      "Synthesis lacks gap detection and is solely at fault.",
      "Web search queries failed despite successful completion logs.",
      "Document analysis filtered non-visual sources despite never being assigned them.",
    ],
    correct: [0],
    explanation:
      "Logs show the coordinator only assigned visual-arts subtasks. Downstream agents did their jobs within scope.",
    distractorNotes: [
      "Synthesis cannot invent unassigned domains.",
      "Search completed its assigned scope.",
      "Doc agent wasn't assigned non-visual topics.",
    ],
    stresses: ["narrow decomposition"],
  },
  {
    id: "S3-Q02",
    scenarioId: "S3",
    domain: "D5",
    taskStatement: "5.3",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "Web search subagent times out. How should failure information flow to the coordinator for intelligent recovery?",
    options: [
      "Return structured error context: failure type, attempted query, partial results, and alternative approaches.",
      "After local retries, return only a generic 'search unavailable' status.",
      "Catch the timeout and return an empty result marked successful.",
      "Propagate an exception that terminates the entire research workflow.",
    ],
    correct: [0],
    explanation:
      "Structured error context enables retry, alternative paths, or partial synthesis with gap notes.",
    distractorNotes: [
      "Generic status starves decisions.",
      "Empty-as-success suppresses recovery.",
      "Full abort is unnecessary when partial research is viable.",
    ],
    stresses: ["structured multi-agent errors"],
  },
  {
    id: "S3-Q03",
    scenarioId: "S3",
    domain: "D2",
    taskStatement: "2.3",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "Synthesis needs simple fact-checks 85% of the time via coordinator→search→synthesis round trips (+40% latency). 15% need deep investigation. Best design?",
    options: [
      "Give synthesis a scoped verify_fact tool for simple lookups; keep complex verification through the coordinator and web-search specialist.",
      "Batch all verifications until the end of synthesis only.",
      "Give synthesis the full web-search tool set.",
      "Have search proactively cache everything synthesis might need.",
    ],
    correct: [0],
    explanation:
      "Least privilege for the common case; preserve coordination for deep work.",
    distractorNotes: [
      "End-batching blocks mid-synthesis dependencies.",
      "Full tool dump breaks specialisation.",
      "Speculative caches cannot predict needs.",
    ],
    stresses: ["scoped cross-role tools"],
  },
  {
    id: "S5-Q01",
    scenarioId: "S5",
    domain: "D3",
    taskStatement: "3.6",
    difficulty: "application",
    format: "single",
    skilljarStyle: true,
    stem:
      "Your pipeline runs claude \"Analyze this pull request for security issues\" and hangs waiting for interactive input. Correct approach?",
    options: [
      "Add -p / --print: claude -p \"Analyze this pull request for security issues\"",
      "Set CLAUDE_HEADLESS=true",
      "Redirect stdin from /dev/null as the primary documented approach",
      "Add --batch to the Claude Code CLI",
    ],
    correct: [0],
    explanation:
      "-p is the documented non-interactive mode for CI pipelines.",
    distractorNotes: [
      "Fictional env var.",
      "stdin redirect is a workaround.",
      "Fictional --batch flag for this purpose.",
    ],
    stresses: ["CI -p flag"],
  },
  {
    id: "S5-Q02",
    scenarioId: "S5",
    domain: "D4",
    taskStatement: "4.5",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "Two workflows: (1) blocking pre-merge check developers wait on, (2) overnight technical debt report. Manager wants both on Message Batches for 50% savings. How evaluate?",
    options: [
      "Batch the overnight debt report only; keep synchronous/real-time calls for pre-merge checks.",
      "Batch both and poll until done.",
      "Keep real-time for both because batch results cannot be correlated.",
      "Batch both with a timeout fallback to real-time.",
    ],
    correct: [0],
    explanation:
      "Batches have no latency SLA (up to 24h). Fit non-blocking work only. custom_id correlates results.",
    distractorNotes: [
      "Polling ≠ SLA for blocking merges.",
      "custom_id solves correlation myths.",
      "Timeout hybrid adds needless complexity.",
    ],
    stresses: ["batch latency fit"],
  },
  {
    id: "S5-Q03",
    scenarioId: "S5",
    domain: "D4",
    taskStatement: "4.6",
    difficulty: "judgment",
    format: "single",
    skilljarStyle: true,
    stem:
      "A PR modifies 14 files. Single-pass review of all files yields uneven depth, missed bugs, and contradictory feedback on the same pattern. How restructure?",
    options: [
      "Per-file local analysis passes plus a separate cross-file integration pass.",
      "Force developers to split every PR to 3–4 files.",
      "Use a larger context model only and keep one pass.",
      "Run three full-PR passes and keep only findings that appear twice.",
    ],
    correct: [0],
    explanation:
      "Multi-pass review fights attention dilution; larger windows don't fix attention quality; consensus voting can suppress intermittent true positives.",
    distractorNotes: [
      "Shifts burden without fixing the system.",
      "Bigger context ≠ better attention allocation.",
      "Intersection voting hides intermittent bugs.",
    ],
    stresses: ["multi-pass review"],
  },
  {
    id: "S6-Q01",
    scenarioId: "S6",
    domain: "D4",
    taskStatement: "4.3",
    difficulty: "application",
    format: "single",
    stem:
      "You need schema-compliant extraction without JSON syntax errors for invoices that sometimes omit PO numbers. Design?",
    options: [
      "tool_use with JSON schema; mark fields that may be absent as optional/nullable; use tool_choice appropriately (any/forced) for the extraction path.",
      "Ask for 'JSON only' in prose and regex the first brace block.",
      "Mark every field required so the model always invents complete objects.",
      "Use Message Batches because it auto-enforces schemas.",
    ],
    correct: [0],
    explanation:
      "tool_use + schema eliminates syntax errors; nullable fields prevent fabrication when sources omit data.",
    distractorNotes: [
      "Prose JSON still breaks.",
      "Required-all increases hallucination.",
      "Batches don't replace schema design.",
    ],
    stresses: ["tool_use schema + nullable"],
  },
  {
    id: "S6-Q02",
    scenarioId: "S6",
    domain: "D4",
    taskStatement: "4.4",
    difficulty: "judgment",
    format: "single",
    stem:
      "Validation fails: line items don't sum to total. Retry with document + failed extraction + error still fails. The PDF only lists a total—no line prices. Next step?",
    options: [
      "Stop retrying: required detail is absent from the source; route to human review or mark fields unavailable with conflict/coverage flags.",
      "Keep retrying until invented line items sum correctly.",
      "Disable validation so the pipeline is green.",
      "Switch to batch for more compute on the same missing source.",
    ],
    correct: [0],
    explanation:
      "Retries help format/structure errors, not missing source information.",
    distractorNotes: [
      "Inventing line items is harmful.",
      "Green pipelines with wrong data are worse.",
      "Batch cannot create missing source text.",
    ],
    stresses: ["retry limits when info absent"],
  },
  {
    id: "S4-Q01",
    scenarioId: "S4",
    domain: "D2",
    taskStatement: "2.5",
    difficulty: "application",
    format: "single",
    stem:
      "Find every call site of handleRefund in a monorepo. First tool choice?",
    options: [
      "Grep for content matches of handleRefund across the codebase.",
      "Glob **/handleRefund* only.",
      "Read every file under src/ sequentially.",
      "Bash find | xargs cat as the default first step.",
    ],
    correct: [0],
    explanation:
      "Grep searches contents; Glob is path patterns; reading everything wastes context.",
    distractorNotes: [
      "Glob matches names/paths, not call sites in content.",
      "Full-tree Read is inefficient.",
      "Bash is heavier when Grep exists.",
    ],
    stresses: ["Grep vs Glob"],
  },
  {
    id: "S4-Q02",
    scenarioId: "S4",
    domain: "D2",
    taskStatement: "2.3",
    difficulty: "trap",
    format: "single",
    stem:
      "You equip one productivity agent with 18 MCP tools 'just in case.' Selection quality collapses. Principle?",
    options: [
      "Too many tools degrade selection reliability — restrict to ~4–5 role-relevant tools (and scoped cross-role exceptions).",
      "More tools always improve capability.",
      "tool_choice: any fixes selection among 18 tools.",
      "Only built-ins should exist; MCP is always worse.",
    ],
    correct: [0],
    explanation:
      "Tool count increases decision complexity and misrouting. any forces a call, not the correct call.",
    distractorNotes: [
      "More tools ≠ better selection.",
      "any ≠ correct selection.",
      "MCP can beat built-ins with strong descriptions.",
    ],
    stresses: ["tool count vs reliability"],
  },
];

export function itemsForScenario(id: ScenarioId) {
  return EXAM_BANK_V2.filter((q) => q.scenarioId === id);
}

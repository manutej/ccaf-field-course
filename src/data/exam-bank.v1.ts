/**
 * CCAR-F practice item bank.
 * Grounded in public exam-guide task statements + official sample items (§9).
 * Not a leaked bank — original practice items in the guide's judgment style.
 */

import type { DomainId, ScenarioId } from "./scenarios";

export type Difficulty = "application" | "judgment" | "trap";
export type SpecTag =
  | "programmatic-enforcement"
  | "prompt-only-insufficient"
  | "tool-descriptions"
  | "over-engineering"
  | "coordinator-decomposition"
  | "structured-errors"
  | "scoped-tools"
  | "claude-md-hierarchy"
  | "path-rules"
  | "plan-vs-direct"
  | "ci-print-flag"
  | "batch-latency"
  | "multi-pass-review"
  | "few-shot"
  | "tool-choice"
  | "nullable-schema"
  | "context-facts"
  | "escalation"
  | "provenance"
  | "hooks"
  | "session-fork"
  | "built-in-tools"
  | "mcp-scope"
  | "stop-reason"
  | "self-review-trap";

export type ExamItem = {
  id: string;
  scenarioId: ScenarioId;
  domain: DomainId;
  taskStatement: string;
  difficulty: Difficulty;
  tags: SpecTag[];
  /** Official sample from exam guide §9 */
  officialSample?: boolean;
  stem: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  /** Why distractors fail — used by adversarial evaluator UI */
  distractorNotes: string[];
  /** Spec criteria this item is designed to stress */
  stresses: string[];
};

export const EXAM_BANK: ExamItem[] = [
  // ─── S1 Customer Support (official samples + hard originals) ───
  {
    id: "S1-Q01",
    scenarioId: "S1",
    domain: "D1",
    taskStatement: "1.4",
    difficulty: "judgment",
    tags: ["programmatic-enforcement", "prompt-only-insufficient"],
    officialSample: true,
    stem: "Production data shows that in 12% of cases, your agent skips get_customer entirely and calls lookup_order using only the customer's stated name, occasionally leading to misidentified accounts and incorrect refunds. What change would most effectively address this reliability issue?",
    options: [
      "Add a programmatic prerequisite that blocks lookup_order and process_refund calls until get_customer has returned a verified customer ID.",
      "Enhance the system prompt to state that customer verification via get_customer is mandatory before any order operations.",
      "Add few-shot examples showing the agent always calling get_customer first, even when customers volunteer order details.",
      "Implement a routing classifier that analyzes each request and enables only the subset of tools appropriate for that request type.",
    ],
    correctIndex: 0,
    explanation:
      "When a specific tool sequence is required for critical business logic (identity before refunds), programmatic enforcement provides deterministic guarantees that prompt-based approaches cannot. B and C are probabilistic. D addresses tool availability, not ordering.",
    distractorNotes: [
      "Prompt mandates still have non-zero failure rate on financial ops.",
      "Few-shots help selection patterns but do not guarantee sequence.",
      "Routing does not enforce prerequisite ordering.",
    ],
    stresses: ["hooks/prerequisites > prompts for compliance-critical sequences"],
  },
  {
    id: "S1-Q02",
    scenarioId: "S1",
    domain: "D2",
    taskStatement: "2.1",
    difficulty: "judgment",
    tags: ["tool-descriptions", "over-engineering"],
    officialSample: true,
    stem: 'Production logs show the agent frequently calls get_customer when users ask about orders (e.g., "check my order #12345"), instead of calling lookup_order. Both tools have minimal descriptions ("Retrieves customer information" / "Retrieves order details") and accept similar identifier formats. What\'s the most effective first step to improve tool selection reliability?',
    options: [
      "Add few-shot examples to the system prompt demonstrating correct tool selection patterns, with 5–8 examples showing order-related queries routing to lookup_order.",
      "Expand each tool's description to include input formats it handles, example queries, edge cases, and boundaries explaining when to use it versus similar tools.",
      "Implement a routing layer that parses user input before each turn and pre-selects the appropriate tool based on detected keywords and identifier patterns.",
      "Consolidate both tools into a single lookup_entity tool that accepts any identifier and internally determines which backend to query.",
    ],
    correctIndex: 1,
    explanation:
      "Tool descriptions are the primary mechanism LLMs use for tool selection. Minimal descriptions are the root cause. Few-shots add tokens without fixing descriptions; routing is over-engineered as a first step; consolidating is larger redesign than warranted for a first fix.",
    distractorNotes: [
      "Few-shots paper over bad descriptions at token cost.",
      "Keyword routers bypass LLM NLU and add ops surface.",
      "Consolidation is valid architecture later, not first step.",
    ],
    stresses: ["fix descriptions before infrastructure"],
  },
  {
    id: "S1-Q03",
    scenarioId: "S1",
    domain: "D5",
    taskStatement: "5.2",
    difficulty: "judgment",
    tags: ["escalation"],
    officialSample: true,
    stem: "Your agent achieves 55% first-contact resolution, well below the 80% target. Logs show it escalates straightforward cases (standard damage replacements with photo evidence) while attempting to autonomously handle complex situations requiring policy exceptions. What's the most effective way to improve escalation calibration?",
    options: [
      "Add explicit escalation criteria to your system prompt with few-shot examples demonstrating when to escalate versus resolve autonomously.",
      "Have the agent self-report a confidence score (1–10) before each response and automatically route requests to humans when confidence falls below a threshold.",
      "Deploy a separate classifier model trained on historical tickets to predict which requests need escalation before the main agent begins processing.",
      "Implement sentiment analysis to detect customer frustration levels and automatically escalate when negative sentiment exceeds a threshold.",
    ],
    correctIndex: 0,
    explanation:
      "Unclear decision boundaries are the root cause. Explicit criteria + few-shots is the proportionate first response. Self-reported confidence is poorly calibrated; classifiers are over-engineered before prompt work; sentiment ≠ case complexity.",
    distractorNotes: [
      "LLM confidence is poorly calibrated especially on hard cases.",
      "ML routing needs labeled data before trying prompt clarity.",
      "Sentiment tracks emotion, not policy exception need.",
    ],
    stresses: ["explicit criteria + few-shots; avoid confidence proxies"],
  },
  {
    id: "S1-Q04",
    scenarioId: "S1",
    domain: "D1",
    taskStatement: "1.5",
    difficulty: "application",
    tags: ["hooks", "programmatic-enforcement"],
    stem: "Finance requires that no refund above $500 ever processes without a human. The model is instructed in the system prompt, but production still sees occasional autonomous high-value refunds. Which approach guarantees compliance?",
    options: [
      "Raise temperature to 0 and add the $500 rule three times in the system prompt.",
      "Implement a tool-call interception hook that blocks process_refund when amount > $500 and redirects to escalate_to_human.",
      "After each turn, parse assistant text for refund amounts and cancel if over $500.",
      "Remove process_refund from tools and require humans for all refunds.",
    ],
    correctIndex: 1,
    explanation:
      "Hooks provide deterministic interception of outgoing tool calls. Prompt repetition and temperature do not guarantee compliance. Text parsing is fragile. Removing the tool destroys first-contact resolution for legitimate sub-$500 refunds.",
    distractorNotes: [
      "Prompt + temp still probabilistic.",
      "Parsing free text is an anti-pattern for control.",
      "Total removal is overly broad vs threshold gate.",
    ],
    stresses: ["hooks for guaranteed policy compliance"],
  },
  {
    id: "S1-Q05",
    scenarioId: "S1",
    domain: "D5",
    taskStatement: "5.1",
    difficulty: "application",
    tags: ["context-facts"],
    stem: "Multi-turn support sessions accumulate 40-field order objects after each lookup_order call. The agent later misquotes refund amounts and return windows that appeared early. Which context strategy best preserves transactional accuracy?",
    options: [
      "Progressively summarize the whole transcript every 4 turns into a short prose summary.",
      "Extract amounts, dates, order numbers, and statuses into a persistent case-facts block included each turn, and trim tool results to return-relevant fields before appending.",
      "Drop all tool results after one turn and rely on the model's memory of them.",
      "Increase max_tokens so the full history always fits without summarization.",
    ],
    correctIndex: 1,
    explanation:
      "Transactional facts must live outside fuzzy progressive summaries. Trim verbose tool payloads; keep structured case facts. Dropping tool results loses provenance; max_tokens doesn't solve middle-loss or token waste.",
    distractorNotes: [
      "Prose summaries lose numbers/dates.",
      "Models do not retain dropped tool results.",
      "Larger context ≠ better middle attention.",
    ],
    stresses: ["case-facts block + trim tool outputs"],
  },
  {
    id: "S1-Q06",
    scenarioId: "S1",
    domain: "D1",
    taskStatement: "1.1",
    difficulty: "trap",
    tags: ["stop-reason"],
    stem: "A junior engineer implements the agent loop to stop when the assistant message contains the substring \"I've resolved\" or when iteration count hits 8. What is wrong, and what should control loop termination?",
    options: [
      "Nothing — natural-language completion signals are more reliable than stop_reason.",
      "Iteration caps are fine as primary stop; stop_reason is optional telemetry.",
      "Parsing free text and using caps as primary stop are anti-patterns; continue while stop_reason is tool_use and terminate on end_turn.",
      "The loop should stop whenever any tool returns isError true.",
    ],
    correctIndex: 2,
    explanation:
      "The agentic loop is driven by stop_reason: tool_use continues (execute tools, append results), end_turn terminates. NL parsing and arbitrary caps as primary stop are exam anti-patterns.",
    distractorNotes: [
      "NL signals are unreliable.",
      "Caps may be safety nets but not primary logic.",
      "Tool errors may be recoverable; not automatic loop end.",
    ],
    stresses: ["stop_reason is the sole continuation signal"],
  },
  {
    id: "S1-Q07",
    scenarioId: "S1",
    domain: "D2",
    taskStatement: "2.2",
    difficulty: "application",
    tags: ["structured-errors"],
    stem: "process_refund sometimes fails because policy forbids refunds after 90 days. The tool currently returns isError with message \"Operation failed.\" The agent keeps retrying. How should the tool respond?",
    options: [
      "Keep the generic message but set isError false so the agent presents it calmly.",
      "Return structured metadata: errorCategory business/validation, isRetryable false, and a customer-friendly explanation of the 90-day policy.",
      "Throw an uncaught exception so the process crashes and pages on-call.",
      "Return an empty success object so the agent assumes the refund went through.",
    ],
    correctIndex: 1,
    explanation:
      "Structured error categories + isRetryable prevent wasted retries and enable appropriate user communication. Generic errors hide recovery decisions; silent success is dangerous; crashes are not agent UX.",
    distractorNotes: [
      "Hiding errors as non-errors misleads the agent.",
      "Process crashes are not structured agent recovery.",
      "False success is a severe anti-pattern.",
    ],
    stresses: ["errorCategory + isRetryable for business rules"],
  },
  {
    id: "S1-Q08",
    scenarioId: "S1",
    domain: "D5",
    taskStatement: "5.2",
    difficulty: "judgment",
    tags: ["escalation"],
    stem: "A customer writes: \"I want a human. Don't bother looking anything up.\" The agent can clearly see a one-click standard replacement that would resolve it. What should it do?",
    options: [
      "Investigate and offer the replacement first; only escalate if the customer rejects the fix.",
      "Honor the explicit human request immediately via escalate_to_human without first attempting investigation.",
      "Ask three clarifying questions to confirm they really want a human.",
      "Escalate only if sentiment analysis scores below −0.5.",
    ],
    correctIndex: 1,
    explanation:
      "Explicit customer requests for a human are honored immediately. Offering to resolve applies when the customer is frustrated but has not demanded a human and the issue is within capability.",
    distractorNotes: [
      "Deferring after explicit human demand violates criteria.",
      "Clarifying delays after a clear demand is poor UX.",
      "Sentiment is not the trigger when they already asked for a human.",
    ],
    stresses: ["honor explicit human requests immediately"],
  },

  // ─── S2 Claude Code Generation ───
  {
    id: "S2-Q01",
    scenarioId: "S2",
    domain: "D3",
    taskStatement: "3.2",
    difficulty: "application",
    tags: ["claude-md-hierarchy"],
    officialSample: true,
    stem: "You want to create a custom /review slash command that runs your team's standard code review checklist. This command should be available to every developer when they clone or pull the repository. Where should you create this command file?",
    options: [
      "In the .claude/commands/ directory in the project repository",
      "In ~/.claude/commands/ in each developer's home directory",
      "In the CLAUDE.md file at the project root",
      "In a .claude/config.json file with a commands array",
    ],
    correctIndex: 0,
    explanation:
      "Project-scoped commands live in .claude/commands/ and ship via VCS. User-scoped ~/.claude/commands/ is personal. CLAUDE.md is instructions, not command defs. config.json commands array is fictional.",
    distractorNotes: [
      "User home is not shared via git.",
      "CLAUDE.md is not where slash commands are defined.",
      "Non-existent config mechanism.",
    ],
    stresses: ["project vs user command scope"],
  },
  {
    id: "S2-Q02",
    scenarioId: "S2",
    domain: "D3",
    taskStatement: "3.4",
    difficulty: "judgment",
    tags: ["plan-vs-direct"],
    officialSample: true,
    stem: "You've been assigned to restructure the team's monolithic application into microservices. This will involve changes across dozens of files and requires decisions about service boundaries and module dependencies. Which approach should you take?",
    options: [
      "Enter plan mode to explore the codebase, understand dependencies, and design an implementation approach before making changes.",
      "Start with direct execution and make changes incrementally, letting the implementation reveal the natural service boundaries.",
      "Use direct execution with comprehensive upfront instructions detailing exactly how each service should be structured.",
      "Begin in direct execution mode and only switch to plan mode if you encounter unexpected complexity during implementation.",
    ],
    correctIndex: 0,
    explanation:
      "Plan mode is for large-scale changes, multiple valid approaches, and architectural decisions. Complexity is already known — waiting for surprises is backwards.",
    distractorNotes: [
      "Incremental coding risks late dependency discovery.",
      "Assumes known structure without exploration.",
      "Complexity is stated up front, not emergent-only.",
    ],
    stresses: ["plan mode for architectural multi-file work"],
  },
  {
    id: "S2-Q03",
    scenarioId: "S2",
    domain: "D3",
    taskStatement: "3.3",
    difficulty: "judgment",
    tags: ["path-rules"],
    officialSample: true,
    stem: "Your codebase has distinct areas with different coding conventions: React components use functional style with hooks, API handlers use async/await with specific error handling, and database models follow a repository pattern. Test files are spread throughout the codebase alongside the code they test (e.g., Button.test.tsx next to Button.tsx), and you want all tests to follow the same conventions regardless of location. What's the most maintainable way to ensure Claude automatically applies the correct conventions when generating code?",
    options: [
      "Create rule files in .claude/rules/ with YAML frontmatter specifying glob patterns to conditionally apply conventions based on file paths",
      "Consolidate all conventions in the root CLAUDE.md file under headers for each area, relying on Claude to infer which section applies",
      "Create skills in .claude/skills/ for each code type that include the relevant conventions in their SKILL.md files",
      "Place a separate CLAUDE.md file in each subdirectory containing that area's specific conventions",
    ],
    correctIndex: 0,
    explanation:
      "Path-scoped rules with globs (e.g. **/*.test.tsx) load only when editing matching files and work across directories. Root CLAUDE.md inference is unreliable; skills need manual invocation; directory CLAUDE.md can't span co-located tests everywhere easily.",
    distractorNotes: [
      "Inference from one big file is unreliable.",
      "Skills are on-demand, not automatic by path.",
      "Directory CLAUDE.md is location-bound.",
    ],
    stresses: ["glob path rules for cross-directory conventions"],
  },
  {
    id: "S2-Q04",
    scenarioId: "S2",
    domain: "D3",
    taskStatement: "3.1",
    difficulty: "trap",
    tags: ["claude-md-hierarchy"],
    stem: "A new hire says Claude ignores the team's testing standards. You find those standards only in ~/.claude/CLAUDE.md on the tech lead's laptop. What is the diagnosis and fix?",
    options: [
      "User-level CLAUDE.md is not shared via VCS; move standards to project-level CLAUDE.md or .claude/CLAUDE.md (and optionally .claude/rules/).",
      "The hire needs to run /memory with elevated privileges.",
      "Testing standards only work as slash commands, not CLAUDE.md.",
      "Put the standards in package.json under a claude key.",
    ],
    correctIndex: 0,
    explanation:
      "User-level settings apply only to that user and are not shared. Project-level configuration is how teams share standards.",
    distractorNotes: [
      "/memory verifies loaded files; it doesn't publish user config.",
      "Standards belong in always-loaded project memory, not only commands.",
      "package.json is not the Claude config surface.",
    ],
    stresses: ["user vs project CLAUDE.md hierarchy"],
  },
  {
    id: "S2-Q05",
    scenarioId: "S2",
    domain: "D3",
    taskStatement: "3.2",
    difficulty: "application",
    tags: ["claude-md-hierarchy"],
    stem: "You build a /analyze-codebase skill that dumps a huge discovery transcript and pollutes the main chat. How do you isolate it?",
    options: [
      "Set context: fork in the skill frontmatter so it runs in an isolated sub-agent context.",
      "Always run it with --resume so prior pollution is overwritten.",
      "Put the skill only in ~/.claude/skills/ so teammates are unaffected.",
      "Add allowed-tools: [\"Bash\"] only — that isolates context automatically.",
    ],
    correctIndex: 0,
    explanation:
      "context: fork runs skills in isolated sub-agent context, preventing verbose skill output from polluting the main conversation. allowed-tools restricts tools, not context. User scope doesn't isolate main session pollution for the invoker.",
    distractorNotes: [
      "--resume continues sessions; it doesn't isolate skill runs.",
      "User scope is about sharing, not isolation.",
      "allowed-tools ≠ context isolation.",
    ],
    stresses: ["context: fork for verbose skills"],
  },
  {
    id: "S2-Q06",
    scenarioId: "S2",
    domain: "D3",
    taskStatement: "3.5",
    difficulty: "application",
    tags: ["few-shot"],
    stem: "Prose descriptions of a data migration keep producing inconsistent transforms. What iterative refinement technique is most effective?",
    options: [
      "Add \"be careful\" and \"double-check edge cases\" to the prompt.",
      "Provide 2–3 concrete input/output examples of the expected transformation.",
      "Switch to a larger model without changing the prompt.",
      "Delete CLAUDE.md so nothing conflicts with the migration instructions.",
    ],
    correctIndex: 1,
    explanation:
      "Concrete I/O examples are the most effective way to communicate expected transformations when prose is interpreted inconsistently.",
    distractorNotes: [
      "Vague caution language is low leverage.",
      "Model size doesn't fix underspecified transforms.",
      "Deleting project standards is not refinement.",
    ],
    stresses: ["I/O examples for transform consistency"],
  },
  {
    id: "S2-Q07",
    scenarioId: "S2",
    domain: "D5",
    taskStatement: "1.7",
    difficulty: "judgment",
    tags: ["session-fork"],
    stem: "After a long analysis session, half the files Claude read were rewritten by a teammate. You want to continue design work without trusting stale tool results. Best approach?",
    options: [
      "Always --resume the same session name and ignore file changes.",
      "Start a new session with a structured summary of still-valid findings, and explicitly note which files changed and need re-analysis.",
      "fork_session is mandatory anytime any file changes.",
      "Delete all CLAUDE.md files and re-explore from zero every time.",
    ],
    correctIndex: 1,
    explanation:
      "When prior tool results are stale, starting fresh with an injected structured summary is more reliable than resuming with outdated reads. Inform the agent about specific file changes for targeted re-analysis.",
    distractorNotes: [
      "Resume with stale results is a trap.",
      "Fork explores divergent approaches from a shared baseline — not the primary fix for stale files.",
      "Full re-exploration wastes context when summaries still hold.",
    ],
    stresses: ["fresh + summary when tool results stale"],
  },

  // ─── S3 Multi-Agent Research ───
  {
    id: "S3-Q01",
    scenarioId: "S3",
    domain: "D1",
    taskStatement: "1.2",
    difficulty: "judgment",
    tags: ["coordinator-decomposition"],
    officialSample: true,
    stem: 'After running the system on the topic "impact of AI on creative industries," each subagent completes successfully, but final reports cover only visual arts, missing music, writing, and film. Coordinator logs show subtasks: "AI in digital art creation," "AI in graphic design," and "AI in photography." What is the most likely root cause?',
    options: [
      "The synthesis agent lacks instructions for identifying coverage gaps in the findings it receives from other agents.",
      "The coordinator agent's task decomposition is too narrow, resulting in subagent assignments that don't cover all relevant domains of the topic.",
      "The web search agent's queries are not comprehensive enough and need to be expanded to cover more creative industry sectors.",
      "The document analysis agent is filtering out sources related to non-visual creative industries due to overly restrictive relevance criteria.",
    ],
    correctIndex: 1,
    explanation:
      "Logs show the coordinator only assigned visual-arts subtasks. Downstream agents did their jobs within assigned scope — decomposition is the root cause.",
    distractorNotes: [
      "Synthesis can't invent unassigned domains from empty inputs.",
      "Search agents only pursue assigned queries.",
      "Doc agent wasn't assigned non-visual topics.",
    ],
    stresses: ["narrow coordinator decomposition risk"],
  },
  {
    id: "S3-Q02",
    scenarioId: "S3",
    domain: "D5",
    taskStatement: "5.3",
    difficulty: "judgment",
    tags: ["structured-errors"],
    officialSample: true,
    stem: "The web search subagent times out while researching a complex topic. You need to design how this failure information flows back to the coordinator agent. Which error propagation approach best enables intelligent recovery?",
    options: [
      "Return structured error context to the coordinator including the failure type, the attempted query, any partial results, and potential alternative approaches.",
      "Implement automatic retry logic with exponential backoff within the subagent, returning a generic \"search unavailable\" status only after all retries are exhausted.",
      "Catch the timeout within the subagent and return an empty result set marked as successful.",
      "Propagate the timeout exception directly to a top-level handler that terminates the entire research workflow.",
    ],
    correctIndex: 0,
    explanation:
      "Structured error context enables coordinator decisions: retry modified query, alternative path, or proceed with partials + coverage gaps. Generic status hides context; silent empty success and full abort are anti-patterns.",
    distractorNotes: [
      "Local retry OK but final generic status starves coordinator.",
      "Empty-as-success suppresses recovery.",
      "Full abort is unnecessary when partial research is viable.",
    ],
    stresses: ["structured multi-agent error propagation"],
  },
  {
    id: "S3-Q03",
    scenarioId: "S3",
    domain: "D2",
    taskStatement: "2.3",
    difficulty: "judgment",
    tags: ["scoped-tools"],
    officialSample: true,
    stem: "Synthesis frequently needs simple fact-checks (dates, names, stats — 85%) via coordinator→web search→synthesis round trips (+40% latency). 15% need deep investigation. Most effective approach?",
    options: [
      "Give the synthesis agent a scoped verify_fact tool for simple lookups, while complex verifications continue delegating to the web search agent through the coordinator.",
      "Have the synthesis agent accumulate all verification needs and return them as a batch to the coordinator at the end of its pass.",
      "Give the synthesis agent access to all web search tools so it can handle any verification need directly without round-trips.",
      "Have the web search agent proactively cache extra context around each source during initial research, anticipating what synthesis might need.",
    ],
    correctIndex: 0,
    explanation:
      "Least privilege: scoped tool for the common case; keep complex cases through coordinator. Batching blocks mid-synthesis dependencies; full tool dump breaks specialization; speculative cache can't predict needs.",
    distractorNotes: [
      "Batching creates blocking mid-synthesis deps.",
      "Over-provisioning synthesis breaks separation of concerns.",
      "Speculative caching is unreliable.",
    ],
    stresses: ["scoped cross-role tools for high-frequency needs"],
  },
  {
    id: "S3-Q04",
    scenarioId: "S3",
    domain: "D1",
    taskStatement: "1.3",
    difficulty: "application",
    tags: ["coordinator-decomposition"],
    stem: "Your coordinator has allowedTools without \"Task\". Subagents never spawn. Why, and what else must be true for correct subagent use?",
    options: [
      "Task is optional if subagents are defined in AgentDefinition; they auto-inherit parent history.",
      "allowedTools must include \"Task\" to spawn subagents; subagent context must be explicitly provided in the prompt — they do not inherit parent conversation history automatically.",
      "Subagents only work when tool_choice is forced to \"Task\" every turn.",
      "MCP servers automatically spawn subagents when multiple tools are present.",
    ],
    correctIndex: 1,
    explanation:
      "Task tool is the spawning mechanism; allowedTools must include Task. Subagents need explicit context in prompts — no automatic history inheritance.",
    distractorNotes: [
      "AgentDefinition alone doesn't spawn; no auto-inherit.",
      "Forced tool_choice every turn is wrong pattern.",
      "MCP ≠ subagent spawning.",
    ],
    stresses: ["Task tool + explicit context passing"],
  },
  {
    id: "S3-Q05",
    scenarioId: "S3",
    domain: "D5",
    taskStatement: "5.6",
    difficulty: "application",
    tags: ["provenance"],
    stem: "Two credible sources report different market-size figures for the same industry year. How should synthesis handle this?",
    options: [
      "Pick the higher figure to be conservative for investment framing.",
      "Average the two figures and cite \"industry sources.\"",
      "Annotate the conflict with both values and source attribution; structure the report to distinguish contested vs well-established findings.",
      "Drop both figures so the report has no numbers that could be wrong.",
    ],
    correctIndex: 2,
    explanation:
      "Conflicting statistics from credible sources should be annotated with attribution, not arbitrarily selected or averaged away. Preserve contested vs established sections.",
    distractorNotes: [
      "Arbitrary selection hides conflict.",
      "Averaging fabricates a third statistic.",
      "Dropping loses useful contested signal.",
    ],
    stresses: ["claim-source mappings; conflict annotation"],
  },
  {
    id: "S3-Q06",
    scenarioId: "S3",
    domain: "D1",
    taskStatement: "1.3",
    difficulty: "application",
    tags: ["coordinator-decomposition"],
    stem: "You want web search and document analysis to run concurrently for lower latency. How should the coordinator spawn them?",
    options: [
      "Emit multiple Task tool calls in a single coordinator response rather than across separate turns.",
      "Chain them sequentially so synthesis always has web results first.",
      "Use Bash sleep between spawns to rate-limit.",
      "Only one Task call is allowed per agent lifetime.",
    ],
    correctIndex: 0,
    explanation:
      "Parallel subagents are spawned by emitting multiple Task tool calls in one coordinator response.",
    distractorNotes: [
      "Sequential is valid when dependent, not required for independent research.",
      "Sleep is not a spawning strategy.",
      "Multiple Tasks are allowed.",
    ],
    stresses: ["parallel Task tool calls in one turn"],
  },
  {
    id: "S3-Q07",
    scenarioId: "S3",
    domain: "D1",
    taskStatement: "1.2",
    difficulty: "judgment",
    tags: ["coordinator-decomposition"],
    stem: "The coordinator always runs the full pipeline (search → docs → synthesis → report) even for narrow factual questions that only need a web lookup. What design change improves efficiency without losing quality on hard queries?",
    options: [
      "Always run all four agents; cost is acceptable for consistency.",
      "Design the coordinator to analyze query requirements and dynamically select which subagents to invoke rather than always routing through the full pipeline.",
      "Remove the coordinator and let users pick agents manually.",
      "Merge all agents into one mega-agent with 18 tools.",
    ],
    correctIndex: 1,
    explanation:
      "Coordinators should dynamically select subagents based on query complexity, not always full pipeline. Mega-agents degrade tool selection.",
    distractorNotes: [
      "Fixed full pipeline wastes latency/cost.",
      "Manual pick abandons orchestration design.",
      "Too many tools degrade selection reliability.",
    ],
    stresses: ["dynamic subagent selection"],
  },

  // ─── S4 Developer Productivity ───
  {
    id: "S4-Q01",
    scenarioId: "S4",
    domain: "D2",
    taskStatement: "2.5",
    difficulty: "application",
    tags: ["built-in-tools"],
    stem: "An engineer asks the agent to find every call site of handleRefund across a monorepo. Which built-in tool is the right first choice?",
    options: [
      "Glob with pattern **/handleRefund*",
      "Grep for content matches of handleRefund across the codebase",
      "Read every file under src/ sequentially",
      "Bash find | xargs cat | wc",
    ],
    correctIndex: 1,
    explanation:
      "Grep searches file contents for patterns (function names, errors, imports). Glob is path/name patterns. Reading everything upfront is inefficient.",
    distractorNotes: [
      "Glob matches paths/names, not call sites in content.",
      "Full tree Read wastes context.",
      "Bash is heavier when Grep exists for content search.",
    ],
    stresses: ["Grep vs Glob selection"],
  },
  {
    id: "S4-Q02",
    scenarioId: "S4",
    domain: "D2",
    taskStatement: "2.5",
    difficulty: "application",
    tags: ["built-in-tools"],
    stem: "Edit fails because the anchor text appears thrice in the file. Reliable fallback?",
    options: [
      "Retry Edit with a shorter non-unique string.",
      "Use Read to load the file, then Write the full updated contents.",
      "Delete the file with Bash and recreate from memory.",
      "Switch tool_choice to auto and hope.",
    ],
    correctIndex: 1,
    explanation:
      "When Edit can't find unique anchor text, Read + Write is the reliable fallback for file modifications.",
    distractorNotes: [
      "Shorter anchors worsen uniqueness.",
      "Delete/recreate is destructive and error-prone.",
      "tool_choice doesn't fix Edit uniqueness.",
    ],
    stresses: ["Edit uniqueness → Read+Write fallback"],
  },
  {
    id: "S4-Q03",
    scenarioId: "S4",
    domain: "D2",
    taskStatement: "2.4",
    difficulty: "application",
    tags: ["mcp-scope"],
    stem: "The team wants a shared GitHub MCP server with tokens, plus each engineer may try personal experimental servers. Correct configuration split?",
    options: [
      "Put everything in ~/.claude.json only so it never hits git.",
      "Shared server in project .mcp.json with ${GITHUB_TOKEN} expansion; personal experiments in user-scoped ~/.claude.json.",
      "Commit raw tokens in .mcp.json for reliability.",
      "Only one MCP server can be active globally; teams must share one.",
    ],
    correctIndex: 1,
    explanation:
      "Project .mcp.json for shared tooling with env var expansion; user ~/.claude.json for personal/experimental. Tools from all configured servers are available simultaneously. Never commit secrets.",
    distractorNotes: [
      "User-only config isn't team-shared.",
      "Secrets must not be committed.",
      "Multiple servers can be simultaneous.",
    ],
    stresses: ["project vs user MCP scope + env expansion"],
  },
  {
    id: "S4-Q04",
    scenarioId: "S4",
    domain: "D5",
    taskStatement: "5.4",
    difficulty: "application",
    tags: ["context-facts"],
    stem: "During a multi-hour legacy exploration, the agent starts citing \"typical patterns\" instead of specific classes found earlier. Best mitigation?",
    options: [
      "Disable all tools to force pure reasoning.",
      "Have agents maintain scratchpad files of key findings and spawn subagents for focused questions while the main agent keeps high-level coordination.",
      "Increase temperature for more creativity.",
      "Paste the entire monorepo into the system prompt once.",
    ],
    correctIndex: 1,
    explanation:
      "Context degradation is real; scratchpads persist findings across boundaries; subagents isolate verbose exploration while the main agent coordinates.",
    distractorNotes: [
      "No tools worsens exploration.",
      "Temperature doesn't fix forgotten specifics.",
      "Whole-repo system prompt is impractical and noisy.",
    ],
    stresses: ["scratchpads + subagent isolation"],
  },
  {
    id: "S4-Q05",
    scenarioId: "S4",
    domain: "D1",
    taskStatement: "1.6",
    difficulty: "judgment",
    tags: ["multi-pass-review"],
    stem: "Task: \"add comprehensive tests to a legacy codebase.\" Fixed prompt-chaining of \"write tests for every file alphabetically\" fails as dependencies emerge. Better decomposition?",
    options: [
      "Keep alphabetical file order; consistency beats adaptation.",
      "Map structure first, identify high-impact areas, then create a prioritized plan that adapts as dependencies are discovered.",
      "Only write tests for files under 50 lines.",
      "Use Message Batches API for each source file in parallel without a plan.",
    ],
    correctIndex: 1,
    explanation:
      "Open-ended investigation needs adaptive decomposition: map → prioritize → adapt. Fixed sequential pipelines suit predictable multi-aspect reviews, not open exploration.",
    distractorNotes: [
      "Alphabetical ignores risk/impact.",
      "Line-count heuristic is arbitrary.",
      "Batch API lacks multi-turn tool calling for adaptive plans.",
    ],
    stresses: ["adaptive vs fixed decomposition"],
  },
  {
    id: "S4-Q06",
    scenarioId: "S4",
    domain: "D2",
    taskStatement: "2.3",
    difficulty: "trap",
    tags: ["scoped-tools"],
    stem: "You equip a single productivity agent with 18 MCP tools \"just in case.\" Selection quality drops. Principle?",
    options: [
      "More tools always improve capability; keep all 18.",
      "Giving agents too many tools (e.g. 18 vs 4–5) degrades selection reliability — restrict to role-relevant tools.",
      "tool_choice: any fixes overabundance automatically.",
      "Only Grep should remain; MCP is always worse than built-ins.",
    ],
    correctIndex: 1,
    explanation:
      "Too many tools increase decision complexity and misrouting. Scope tools to roles. tool_choice: any forces some tool call, not correct selection among 18.",
    distractorNotes: [
      "More tools ≠ better selection.",
      "any guarantees a call, not the right one.",
      "MCP can beat built-ins when descriptions are strong.",
    ],
    stresses: ["tool count vs selection reliability"],
  },
  {
    id: "S4-Q07",
    scenarioId: "S4",
    domain: "D2",
    taskStatement: "2.4",
    difficulty: "application",
    tags: ["mcp-scope"],
    stem: "Agents keep using Grep over a superior team MCP search tool that returns ranked symbols with docs. First fix?",
    options: [
      "Remove Grep from the product entirely for all users.",
      "Enhance the MCP tool description to explain capabilities and outputs in detail so it wins selection over generic built-ins.",
      "Force tool_choice to the MCP tool on every turn including chitchat.",
      "Rename Grep to \"deprecated_grep\" only in CLAUDE.md prose without changing tools.",
    ],
    correctIndex: 1,
    explanation:
      "Strong MCP descriptions prevent preference for weaker built-ins. Removing Grep globally is overkill; always-forced tool_choice breaks normal chat; prose rename without tool changes is weak.",
    distractorNotes: [
      "Grep still valuable for many tasks.",
      "Forced every turn is wrong.",
      "CLAUDE.md alone doesn't rewrite tool registry names.",
    ],
    stresses: ["MCP description quality drives adoption"],
  },

  // ─── S5 CI/CD Claude Code ───
  {
    id: "S5-Q01",
    scenarioId: "S5",
    domain: "D3",
    taskStatement: "3.6",
    difficulty: "application",
    tags: ["ci-print-flag"],
    officialSample: true,
    stem: 'Your pipeline script runs claude "Analyze this pull request for security issues" but the job hangs indefinitely. Logs indicate Claude Code is waiting for interactive input. What\'s the correct approach to run Claude Code in an automated pipeline?',
    options: [
      'Add the -p flag: claude -p "Analyze this pull request for security issues"',
      "Set the environment variable CLAUDE_HEADLESS=true before running the command",
      'Redirect stdin from /dev/null: claude "Analyze this pull request for security issues" < /dev/null',
      'Add the --batch flag: claude --batch "Analyze this pull request for security issues"',
    ],
    correctIndex: 0,
    explanation:
      "-p / --print is the documented non-interactive mode for CI. CLAUDE_HEADLESS and --batch are not the documented mechanism; stdin redirect is a fragile workaround.",
    distractorNotes: [
      "Fictional env var.",
      "Unix workaround ≠ correct CLI contract.",
      "Fictional --batch flag for Claude Code CLI.",
    ],
    stresses: ["-p for non-interactive CI"],
  },
  {
    id: "S5-Q02",
    scenarioId: "S5",
    domain: "D4",
    taskStatement: "4.5",
    difficulty: "judgment",
    tags: ["batch-latency"],
    officialSample: true,
    stem: "Two workflows: (1) blocking pre-merge check developers wait on, (2) overnight technical debt report. Manager wants both on Message Batches API for 50% savings. How evaluate?",
    options: [
      "Use batch processing for the technical debt reports only; keep real-time calls for pre-merge checks.",
      "Switch both workflows to batch processing with status polling to check for completion.",
      "Keep real-time calls for both workflows to avoid batch result ordering issues.",
      "Switch both to batch processing with a timeout fallback to real-time if batches take too long.",
    ],
    correctIndex: 0,
    explanation:
      "Batches: 50% savings, up to 24h, no latency SLA — good for overnight reports, bad for blocking pre-merge. custom_id correlates results (ordering myth). Hybrid timeout adds complexity vs matching API to latency need.",
    distractorNotes: [
      "Polling doesn't create a latency SLA.",
      "Ordering is solvable with custom_id.",
      "Timeout hybrid is unnecessary complexity.",
    ],
    stresses: ["batch only for non-blocking latency-tolerant work"],
  },
  {
    id: "S5-Q03",
    scenarioId: "S5",
    domain: "D4",
    taskStatement: "4.6",
    difficulty: "judgment",
    tags: ["multi-pass-review", "self-review-trap"],
    officialSample: true,
    stem: "A PR modifies 14 files. Single-pass review of all files together yields uneven depth, missed bugs, and contradictory feedback on the same pattern across files. How restructure?",
    options: [
      "Split into focused passes: analyze each file individually for local issues, then run a separate integration-focused pass examining cross-file data flow.",
      "Require developers to split large PRs into smaller submissions of 3–4 files before automated review runs.",
      "Switch to a higher-tier model with a larger context window to give all 14 files adequate attention in one pass.",
      "Run three independent review passes on the full PR and only flag issues that appear in at least two of the three runs.",
    ],
    correctIndex: 0,
    explanation:
      "Per-file local + cross-file integration pass fights attention dilution. Larger context doesn't fix attention quality. Consensus-of-3 can suppress intermittent true positives. Shifting burden to devs doesn't fix the system.",
    distractorNotes: [
      "Process tax on developers.",
      "Bigger window ≠ better attention allocation.",
      "Intersection voting hides intermittent real bugs.",
    ],
    stresses: ["multi-pass review architecture"],
  },
  {
    id: "S5-Q04",
    scenarioId: "S5",
    domain: "D4",
    taskStatement: "4.1",
    difficulty: "application",
    tags: ["few-shot"],
    stem: "PR review bot floods style nits and loses trust; real security findings get ignored. Best precision fix?",
    options: [
      "Add \"be conservative\" and \"only high-confidence findings\" to the prompt.",
      "Write specific review criteria defining which issues to report (bugs, security) versus skip (minor style, local patterns), and temporarily disable high false-positive categories.",
      "Increase max_tokens so more findings fit.",
      "Use the same Claude session that wrote the code to review it for efficiency.",
    ],
    correctIndex: 1,
    explanation:
      "Explicit categorical criteria beat vague confidence language. High-FP categories should be disabled while prompts improve. Same-session self-review is less effective than independent instances.",
    distractorNotes: [
      "Vague conservatism fails vs specific criteria.",
      "More tokens ≠ better precision.",
      "Self-review retains generator reasoning bias.",
    ],
    stresses: ["explicit criteria > confidence slogans"],
  },
  {
    id: "S5-Q05",
    scenarioId: "S5",
    domain: "D3",
    taskStatement: "3.6",
    difficulty: "application",
    tags: ["ci-print-flag"],
    stem: "CI must post machine-parseable findings as inline PR comments. Which Claude Code flags?",
    options: [
      "--output-format json with --json-schema for structured CI output",
      "Use --pretty yaml only so comments stay human-readable for reviewers",
      "No flags; parse free-form markdown with regex in the pipeline",
      "Set CLAUDE_HEADLESS=json as an environment variable instead of CLI flags",
    ],
    correctIndex: 0,
    explanation:
      "--output-format json and --json-schema enforce structured, machine-parseable CI output. Fictional env vars and regex on free text are unreliable.",
    distractorNotes: [
      "Pretty YAML is not the documented structured CI contract.",
      "Regex on free text is fragile for CI automation.",
      "CLAUDE_HEADLESS=json is not a documented mechanism.",
    ],
    stresses: ["structured CI output flags"],
  },
  {
    id: "S5-Q06",
    scenarioId: "S5",
    domain: "D4",
    taskStatement: "4.6",
    difficulty: "trap",
    tags: ["self-review-trap"],
    stem: "Pipeline reuses the exact Claude session that generated a feature branch to review the same diff \"because it has context.\" Why is this weaker than an independent review instance?",
    options: [
      "It is stronger — more context always helps.",
      "The model retains generation reasoning, making it less likely to question its own decisions; independent instances without that context catch subtle issues better.",
      "Sessions cannot be reused for any reason in Claude Code.",
      "Only batch API can review code.",
    ],
    correctIndex: 1,
    explanation:
      "Self-review in the writer session is limited; independent review instances are more effective. Session isolation is a CI skill point in the guide.",
    distractorNotes: [
      "More biased context can hurt critique.",
      "Sessions can resume for other tasks; issue is self-review bias.",
      "Batch is orthogonal to review independence.",
    ],
    stresses: ["independent review instance > self-review"],
  },
  {
    id: "S5-Q07",
    scenarioId: "S5",
    domain: "D3",
    taskStatement: "3.6",
    difficulty: "application",
    tags: ["ci-print-flag"],
    stem: "Re-running PR review after new commits duplicates old comments. What context strategy helps?",
    options: [
      "Include prior review findings and instruct Claude to report only new or still-unaddressed issues.",
      "Always wipe the PR comment thread completely each run.",
      "Disable CLAUDE.md in CI so reviews stay short.",
      "Use sentiment analysis on previous comments.",
    ],
    correctIndex: 0,
    explanation:
      "Pass prior findings and ask for only new/still-open issues to avoid duplicate CI noise. CLAUDE.md should still provide review standards.",
    distractorNotes: [
      "Wiping loses history humans need.",
      "Removing standards worsens quality.",
      "Sentiment is irrelevant here.",
    ],
    stresses: ["incremental re-review context"],
  },

  // ─── S6 Structured Data Extraction ───
  {
    id: "S6-Q01",
    scenarioId: "S6",
    domain: "D4",
    taskStatement: "4.3",
    difficulty: "application",
    tags: ["tool-choice", "nullable-schema"],
    stem: "You need guaranteed schema-compliant extraction without JSON syntax errors. Most reliable approach?",
    options: [
      "Ask for \"JSON only\" in prose and regex-extract the first brace block.",
      "Use tool_use with a JSON schema on the tool input, reading structured data from the tool_use response.",
      "Lower temperature to 0 and hope.",
      "Message Batches API automatically enforces schemas.",
    ],
    correctIndex: 1,
    explanation:
      "tool_use with JSON schemas is the most reliable path to schema-compliant structured output and eliminates syntax errors. Batches don't add multi-turn schema magic by themselves.",
    distractorNotes: [
      "Prose JSON still breaks.",
      "Temp 0 reduces but doesn't eliminate syntax issues.",
      "Batches are about async cost/latency, not schema enforcement alone.",
    ],
    stresses: ["tool_use + JSON schema for structured output"],
  },
  {
    id: "S6-Q02",
    scenarioId: "S6",
    domain: "D4",
    taskStatement: "4.3",
    difficulty: "application",
    tags: ["nullable-schema"],
    stem: "Source invoices sometimes omit PO numbers. Schema marks po_number required. Model invents PO numbers. Fix?",
    options: [
      "Add few-shot examples of invented POs so at least format is consistent.",
      "Make po_number optional/nullable so the model can return null instead of fabricating required fields.",
      "Increase required fields to force more complete hallucinations.",
      "Disable tool_use and use free text.",
    ],
    correctIndex: 1,
    explanation:
      "Optional/nullable fields prevent fabrication when sources lack data. Required fields pressure the model to invent values.",
    distractorNotes: [
      "Few-shots of fabrication teach fabrication.",
      "More required fields worsen hallucination pressure.",
      "Free text loses structure.",
    ],
    stresses: ["nullable fields prevent hallucination"],
  },
  {
    id: "S6-Q03",
    scenarioId: "S6",
    domain: "D4",
    taskStatement: "4.4",
    difficulty: "judgment",
    tags: ["nullable-schema"],
    stem: "Validation fails: line items don't sum to stated total. First retry includes document + failed extraction + error. Second retry still fails. Source PDF never listed line-item prices — only a total. What now?",
    options: [
      "Keep retrying until the model invents line items that sum correctly.",
      "Stop retrying — retries don't help when required detail is absent from the source; route to human or mark fields unavailable.",
      "Switch to batch API for more compute.",
      "Remove all validation so the pipeline is green.",
    ],
    correctIndex: 1,
    explanation:
      "Retries help format/structure errors, not missing source information. Recognize absence and escalate/route rather than infinite retry.",
    distractorNotes: [
      "Inventing line items is harmful.",
      "Batch doesn't add missing source text.",
      "Dropping validation hides quality issues.",
    ],
    stresses: ["retry limits when info is absent"],
  },
  {
    id: "S6-Q04",
    scenarioId: "S6",
    domain: "D4",
    taskStatement: "4.2",
    difficulty: "application",
    tags: ["few-shot"],
    stem: "Extraction works on formal invoices but fails on informal vendor emails with measurements in prose. Highest leverage prompt technique?",
    options: [
      "Add 2–4 few-shot examples covering varied document structures and informal measurements.",
      "Only add \"handle edge cases carefully.\"",
      "Remove the schema to increase flexibility.",
      "Force tool_choice auto so the model can skip the tool.",
    ],
    correctIndex: 0,
    explanation:
      "Few-shot examples are the most effective technique for format consistency and handling varied structures / informal measurements.",
    distractorNotes: [
      "Vague caution is weak.",
      "Removing schema loses guarantees.",
      "auto may skip structured tool entirely.",
    ],
    stresses: ["few-shots for structural variety"],
  },
  {
    id: "S6-Q05",
    scenarioId: "S6",
    domain: "D5",
    taskStatement: "5.5",
    difficulty: "judgment",
    tags: ["provenance"],
    stem: "Overall extraction accuracy is 97%, so leadership wants to drop human review. What risk and practice does the guide emphasize?",
    options: [
      "97% is always enough; automate fully.",
      "Aggregate accuracy can mask poor segments — validate by document type and field; use stratified sampling of high-confidence extractions and field-level confidence routing.",
      "Only sample low-confidence items; ignore high-confidence forever.",
      "Human review is out of scope for production systems.",
    ],
    correctIndex: 1,
    explanation:
      "Aggregate metrics mask type/field failure modes. Stratified sampling of high-confidence outputs catches novel errors; calibrate field-level confidence for routing.",
    distractorNotes: [
      "Aggregates hide pockets of failure.",
      "High-confidence errors still matter.",
      "HITL is in-scope for reliability.",
    ],
    stresses: ["stratified sampling + field confidence"],
  },
  {
    id: "S6-Q06",
    scenarioId: "S6",
    domain: "D4",
    taskStatement: "4.3",
    difficulty: "application",
    tags: ["tool-choice"],
    stem: "You have multiple extraction tools (invoice, contract, receipt) and document type is unknown up front. You need a tool call every time (no conversational dodge). Configuration?",
    options: [
      'tool_choice: "auto" so the model may answer in prose when unsure of document type',
      'tool_choice: "any" to guarantee a tool call while allowing selection among extraction tools',
      "Omit tools entirely and parse free-form prose extraction from the assistant message",
      'Force tool_choice to extract_invoice on every document regardless of type',
    ],
    correctIndex: 1,
    explanation:
      '"any" guarantees a tool call while allowing the model to pick among tools when type is unknown. "auto" may return text; always forcing invoice is wrong for contracts/receipts.',
    distractorNotes: [
      "auto can skip tools and return conversational text.",
      "Prose loses schema guarantees.",
      "Forced wrong schema when document type varies.",
    ],
    stresses: ["tool_choice any vs auto vs forced"],
  },
  {
    id: "S6-Q07",
    scenarioId: "S6",
    domain: "D4",
    taskStatement: "4.4",
    difficulty: "application",
    tags: ["nullable-schema"],
    stem: "You want self-check for invoice totals inside structured output. Strong pattern?",
    options: [
      "Only output stated_total; trust the model.",
      "Extract calculated_total alongside stated_total and a conflict_detected boolean for inconsistent source data.",
      "Put validation only in the system prompt as \"make sure math works.\"",
      "Use stop_reason end_turn to mean math is valid.",
    ],
    correctIndex: 1,
    explanation:
      "Self-correction validation flows extract calculated vs stated totals and conflict flags so downstream systems can route issues.",
    distractorNotes: [
      "No dual field means no automatic conflict signal.",
      "Prompt-only math checks are weak.",
      "stop_reason is loop control, not validation.",
    ],
    stresses: ["calculated vs stated validation fields"],
  },
  {
    id: "S6-Q08",
    scenarioId: "S6",
    domain: "D4",
    taskStatement: "4.5",
    difficulty: "application",
    tags: ["batch-latency"],
    stem: "You batch 100 docs overnight. 7 fail context limits (identified by custom_id). Correct recovery?",
    options: [
      "Resubmit the entire batch of 100 unchanged.",
      "Resubmit only failed documents (by custom_id) with modifications such as chunking oversized docs.",
      "Abandon batch and switch forever to sync for all volumes.",
      "Ignore failures if overall success rate > 90%.",
    ],
    correctIndex: 1,
    explanation:
      "Handle batch failures by custom_id; resubmit only failures with appropriate modifications (chunking). Don't reprocess successes or ignore systematic context failures.",
    distractorNotes: [
      "Full resubmit wastes cost.",
      "Sync for everything forgoes batch savings for OK docs.",
      "Ignoring context failures loses data.",
    ],
    stresses: ["custom_id failure resubmit"],
  },
];

export function itemsForScenario(id: ScenarioId): ExamItem[] {
  return EXAM_BANK.filter((q) => q.scenarioId === id);
}

export function itemsForDomain(id: DomainId): ExamItem[] {
  return EXAM_BANK.filter((q) => q.domain === id);
}

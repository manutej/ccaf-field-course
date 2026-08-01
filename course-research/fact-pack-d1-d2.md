# CCAF Fact Pack — D1 Agentic Architecture & D2 Tools/MCP
**Fetched:** 2026-08-01 · **Hosts:** platform.claude.com, code.claude.com, modelcontextprotocol.io
**Integrity:** Public objectives + official docs only. Not an item bank. Fallibility: APIs evolve; re-verify URLs.

## D1 — Agentic Architecture & Orchestration (27%)

### Agentic loop (control plane)
- After each Messages/API response, inspect **stop_reason**.
- **`tool_use`**: execute requested tools, append **tool_result** blocks (match `tool_use_id`), call again.
- **`end_turn`** (and other non-tool stops): exit the tool loop.
- Anti-patterns: parsing assistant prose for "done"; iteration caps as primary stop; treating empty text as completion.
- Source: https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls

### Multi-agent / subagents
- Hub-and-spoke: coordinator owns decomposition, routing, aggregation, error handling.
- Subagents have **isolated context** — no automatic parent/sibling memory.
- Spawning is a **tool permission** (Agent / Task in allow-lists). Parallel spawn = multiple tool calls in one assistant turn.
- Pass prior findings **explicitly** in the spawn prompt (structured when attribution matters).
- Sources: https://code.claude.com/docs/en/sub-agents · Agent SDK docs on platform.claude.com

### Hooks & enforcement
- Prompt/few-shot compliance is **probabilistic**. Financial/identity ordering needs **programmatic gates**.
- PreToolUse can block; PostToolUse can normalize results before the model sees them.
- Structured human handoffs: customer ID, root cause, amounts/findings, recommended action.
- Source: https://code.claude.com/docs/en/hooks

### Session state
- Resume named sessions when context remains valid; fork when exploring divergent approaches from a shared baseline; fresh when prior context would mislead.

## D2 — Tool Design & MCP (18%)

### Tool definitions
- **Name + description** are the primary selection mechanism. One-line overlaps cause systematic misroutes.
- Disambiguate with domain-encoding names (`extract_web_results` vs `parse_pdf_tables`) and matching descriptions (formats, examples, boundaries).
- **tool_choice**: `auto` (optional tools), `any` (must call some tool), forced named tool.
- Source: https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools

### MCP integration
- MCP: host / client / server separation; tools, resources, prompts as server capabilities.
- Project **`.mcp.json`** = team-shared; user config = personal experiments.
- Use env expansion for secrets; never commit tokens.
- Errors: **isError** + category (transient/validation/permission) + retryability + human-readable text. Empty success ≠ access failure.
- Sources: https://code.claude.com/docs/en/mcp · https://modelcontextprotocol.io/docs/getting-started/intro · MCP connector on platform.claude.com

### Tool distribution
- Too many overlapping tools on one agent degrades selection. Scope tools to role; give high-frequency side tools (e.g. verify_fact) without dumping full search suites on synthesizers.

## Conservation / limits
- Claims above are paraphrases of public docs as of fetch date. Product UIs rename Task→Agent in places; treat both as the spawn surface when reading older materials.
- Exam guide domain weights 27/18/20/20/15; this pack does not reproduce exam items.

# CCAF Fact Pack — D3 Claude Code, D4 Prompt/Structured, D5 Context
**Fetched:** 2026-08-01 · **Hosts:** code.claude.com, docs.claude.com, platform.claude.com
**Integrity:** Public objectives + official docs only. Not an item bank.

## D3 — Claude Code Configuration & Workflows (20%)

### Memory hierarchy
- **Project `CLAUDE.md`**: team standards in VCS.
- **User `~/.claude/CLAUDE.md`**: personal; not shared on clone.
- **`.claude/rules/`**: focused topic files; path frontmatter globs for conditional activation (`**/*.test.tsx`, `terraform/**/*`).
- Directory CLAUDE.md is directory-bound; path globs follow scattered files.
- Source: https://code.claude.com/docs/en/memory

### Commands & skills
- Repo-shared slash commands: **`.claude/commands/`**. User commands under `~/.claude/commands/` are personal.
- Skills package workflows; **`context: fork`** isolates exploratory/verbose runs so only results return to the main session.
- Sources: https://code.claude.com/docs/en/skills · https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview

### Plan vs direct
- **Plan mode** for large, multi-approach, multi-file architectural work (explore safely first).
- **Direct execution** for single clear local changes — plan ceremony is pure cost when nothing is ambiguous.
- Source: https://code.claude.com/docs/en/overview

### Hooks (with D1)
- Same hook model applies in Claude Code workflows for policy and normalization.
- Source: https://code.claude.com/docs/en/hooks

## D4 — Prompt Engineering & Structured Output (20%)

### Prompt doctrine
- "Be conservative / high confidence only" fails: no operational skip criteria.
- Prefer **categorical rules** (report security bugs; skip local style nits) and **2–4 targeted few-shots** at true ambiguity boundaries.
- When one category destroys trust, disable it temporarily; keep precise categories live; re-enable after measured prompt fixes.
- Source: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-4-best-practices

### Structured outputs
- JSON schema / forced tool_use for machine-checkable structure.
- **Required fields that are often absent → hallucinations.** Optionality must mirror real availability.
- Retries fix format/structure errors; they do **not** create missing source facts — route to fetch/null/human.
- Instrument findings with `detected_pattern` (or similar) so dismissals aggregate into prompt fixes.
- Source: https://platform.claude.com/docs/en/build-with-claude/structured-outputs

### Batch / review architecture
- Prefer async/batch for non-blocking bulk work; do not put high-latency batch paths on blocking pre-merge gates without an explicit product decision.

## D5 — Context Management & Reliability (15%)

### Context hygiene
- Progressive summarization erases **amounts, dates, IDs, promises** — extract a persistent **case-facts** structure outside summarized history.
- **Lost-in-the-middle**: prioritize key findings at the front; section headers; keep provenance metadata on subagent outputs.
- Long exploration → context degradation ("typical patterns" instead of specific classes): re-ground from scratchpad; `/compact` verbose discovery.
- Source: https://platform.claude.com/docs/en/build-with-claude/context-windows

### Escalation & identity
- Escalation needs **explicit criteria + few-shot escalate-vs-resolve**, not self-confidence dials or pure sentiment routing.
- Multiple customer matches → **ask for identifiers**; heuristic "best match" risks wrong-account actions.

### Error propagation
- Subagent failure payloads: failure type, attempted query, partial results, alternatives — designed for coordinator decisions.
- Anti-patterns: silent empty success; killing the whole graph on recoverable leaf errors.
- Middle path: local retry for transient; propagate unresolvables with attempt + partials.
- Crash recovery: agents export structured state; coordinator loads manifest; inject into prompts on resume.

## Conservation / limits
- Docs and product names move (Task/Agent, skill frontmatter keys). Re-fetch before high-stakes claims.
- Domain weights 20/20/15 for D3–D5; no exam items reproduced.

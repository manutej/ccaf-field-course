# CCAF Field Course — build log

## 2026-08-01 Pulse: full course ship

### Phase 0 — Commission
- Curriculum contract: 5 modules (D1–D5), weights 27/18/20/20/15, prereq chain D1→D5
- Source spine: CCAF project snapshot registry + 267-node operadic tree (60 high-yield leaves)

### Phase 1 — Research swarm
- Agent A: D1 Agentic Architecture + D2 Tool/MCP — official docs only
- Agent B: D3 Claude Code + D4 Prompt/Structured + D5 Context — official docs only
- Fact packs stored under course-research/; sources wired per module in course.json

### Phase 2 — Design system
- Tokens: paper/ink/accent (teal), domain colors, Fraunces + Source Sans 3 + IBM Plex Mono
- Shell + teaching patterns (SequentialPulse, FailureModeTable, WeightRing)

### Phase 3 — Lessons
- 5 full modules with Manu-voice openers, teach blocks, anti-patterns, task statements, 8-item drills each

### Phase 4 — Assembly
- Routes: Home, Modules, Module lesson, Concept map, Mixed drill
- Progress via localStorage (zustand persist)
- Cross-lesson prereq map on /map

### Phase 5 — Delivery
- Dev server on preview
- Production build → .vercel/output (nitro vercel preset) green
- Mobile 390px: no horizontal overflow, clean console

### Gates
- facts_grounded: official URLs per domain
- prereq_respected: concept map orders D1 first
- a11y: skip link, focus rings, reduced motion, radiogroups
- no_hype: Manu register
- structure_complete: teach + anti + procedure + assessment + sources

### Integrity
- I12: public objectives only; no leaked item bank

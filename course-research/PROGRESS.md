# CCAF Field Course — build log

## 2026-08-01 Pulse: full course ship + harden

### Phase 0 — Commission
- Curriculum contract: 5 modules (D1–D5), weights 27/18/20/20/15, prereq chain D1→D5
- Source spine: CCAF project snapshot registry + 267-node operadic tree (60 high-yield leaves)

### Phase 1 — Research swarm
- Official hosts only: platform.claude.com, code.claude.com, docs.claude.com, modelcontextprotocol.io
- Fact packs: course-research/fact-pack-d1-d2.md, fact-pack-d3-d5.md (refreshed with full doctrine notes)

### Phase 2 — Design system
- Tokens: paper/ink/accent (teal), domain colors, Fraunces + Source Sans 3 + IBM Plex Mono
- Shell + teaching patterns (SequentialPulse, FailureModeTable, WeightRing)

### Phase 3 — Lessons
- 5 full modules with Manu-voice openers, teach blocks (+ official-doc addenda), anti-patterns, task statements, 8-item drills each
- **Quiz harden:** all 40 items use full plausible distractors (not short anti-pattern labels)

### Phase 4 — Assembly
- Routes: Home, Modules, Module lesson, Concept map, Mixed drill
- Progress via localStorage (zustand persist)

### Phase 5 — Delivery
- Live preview (interactive SPA)
- Production build green (Nitro / Vercel)
- GitHub Pages static course public
- Mobile 390px: no horizontal overflow, clean console

### Gates
- facts_grounded · prereq_respected · a11y · no_hype · structure_complete · I12 integrity

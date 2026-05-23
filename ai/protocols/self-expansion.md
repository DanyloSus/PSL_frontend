# Protocol: Self-Expansion

> How agents create new skills, rules, agents, or scenarios without polluting the knowledge base.

## Pre-flight

1. **Duplicate check:** scan `ai/manifest.json` for overlapping triggers. If any overlap, extend the existing artifact instead.
2. **Scope check:** does this belong in `ai/` (AI guidance) or `docs/` (human-facing)?
3. **Tier check:** new artifacts default to tier 2. Tier 0/1 requires explicit approval.

## Flow

```
User request → Identify gap → Propose to user (gate) → Template → Write → Register → Verify
```

1. Identify the gap: what knowledge is missing?
2. Propose to the user with a one-line summary + proposed location + triggers.
3. Wait for approval.
4. Copy the right template from `ai/templates/` or `ai/engine/`.
5. Fill frontmatter (id/name, tier, triggers, summary).
6. Write content with real project examples.
7. Register in `ai/manifest.json` (bump `lastUpdated`) — or `ai/engine/registry.json` for scenarios.
8. Validate JSON.
9. Run `npm run lint` on any example code.

## Rules

- `ai/BOOTSTRAP.md` stays <200 lines. Link, don't expand.
- New scenario `verified: false` until it runs successfully once.
- Triggers must be distinct — no substring collisions with existing triggers.
- Every skill has a `summary` ≤5 lines so the agent can decide to load without reading the full file.
- Every agent declares its `scope` with explicit read/write/execute/forbidden sections.

## Templates

| Artifact | Template                          |
| -------- | --------------------------------- |
| Rule     | `ai/templates/_RULE_TEMPLATE.md`  |
| Skill    | `ai/templates/_SKILL_TEMPLATE.md` |
| Agent    | `ai/templates/_AGENT_TEMPLATE.md` |
| Scenario | `ai/engine/_SCENARIO_TEMPLATE.md` |

# AI Knowledge System — React Fast Template

> Portable, agent-agnostic knowledge base that instructs AI coding assistants (Claude Code, GitHub Copilot, Cursor, …) on how to work inside this React project.

## 1. Why this exists

A monolithic `CLAUDE.md` (or `.cursorrules`, or `copilot-instructions.md`) gets dumped into the agent's context for every task — whether it's relevant or not. That wastes tokens and dilutes attention.

This system uses the **Facade pattern**: a single small router (`FACADE.md`) decides which knowledge to load based on what the user asked for. Skills, rules, and agents live in their own files and load on-demand, keyed by trigger words registered in `manifest.json`.

## 2. Layout

```
ai/
├── CLAUDE.md              # Thin adapter for Claude Code
├── FACADE.md              # Task router (read first)
├── BOOTSTRAP.md           # Always-loaded compact reference
├── README.md              # This file
├── manifest.json          # Registry: rules, skills, agents, protocols, templates
├── context-tiers.json     # Token-budget rules per task type
├── rules/                 # Enforceable rules (mapped 1:1 to ESLint config)
├── skills/                # Domain knowledge modules
├── agents/                # Sub-agent personas with explicit scopes
├── protocols/             # Cross-cutting workflows
├── templates/             # Scaffolds for adding new artifacts
└── engine/                # DAG pipeline engine
    ├── registry.json
    ├── nodes/             # 11 atomic reusable nodes
    └── scenarios/         # Composed multi-step workflows
```

The same content also serves the GitHub Copilot adapter at `.github/copilot-instructions.md`.

## 3. Loading protocol

```
1. Always loaded   →  ai/BOOTSTRAP.md  (tier 0)
2. Pick budget     →  simple | feature | audit  (see context-tiers.json)
3. Match keywords  →  manifest.json triggers field
4. Read summary    →  manifest summary (≤5 lines)
5. Load full skill →  only if summary insufficient
6. Load tier-1     →  rules touched by the task
7. Protocols       →  only when orchestrating sub-agents or expanding knowledge
```

This caps context overhead at <1k tokens for simple tasks and ~3k tokens for full feature work.

## 4. The DAG Pipeline Engine

For tasks that span >3 files or run sub-agents in parallel, the engine composes 11 atomic **nodes** into named **scenarios** stored in `engine/scenarios/`.

### Atomic nodes (`engine/nodes/`)

| Node          | Type    | Cost | Cacheable | Purpose                                         |
| ------------- | ------- | ---: | :-------: | ----------------------------------------------- |
| `discover`    | input   |   80 |     ✓     | Read files / search workspace                   |
| `extract`     | process |   60 |     ✓     | Pull structured data from raw content           |
| `skill-load`  | input   |  100 |     ✓     | Load a SKILL.md (or one section)                |
| `partition`   | process |   40 |           | Split work into N groups for parallelism        |
| `spawn`       | process |  120 |           | Launch a sub-agent with scoped context          |
| `verify`      | process |   80 |           | Run lint / type-check / tests                   |
| `fix`         | process |  100 |           | Apply guided fixes to verification failures     |
| `gate`        | gate    |   20 |           | User-approval checkpoint                        |
| `merge`       | output  |   40 |           | Combine parallel branch results                 |
| `transform`   | process |   60 |     ✓     | Apply prompt template / formatter               |
| `session-log` | process |   10 |           | Append to session tracker (always first + last) |

### Scenarios (`engine/scenarios/`)

| Scenario              | Triggers                                   | Sub-agents | Use case                                          |
| --------------------- | ------------------------------------------ | :--------: | ------------------------------------------------- |
| `feature-scaffold`    | "new feature", "scaffold feature"          |     0      | Create a feature folder with all FSD layers       |
| `batch-test-creation` | "batch test", "tests for", "coverage for"  |  up to 4   | Write Vitest+RTL tests for many files in parallel |
| `code-review`         | "review", "audit", "code review"           |     2      | Parallel review against rules + boundary audit    |
| `refactor-extract`    | "refactor", "extract", "split file", "SRP" |     0      | Split files >150 lines into smaller components    |
| `batch-fix-pattern`   | "fix pattern", "replace across", "fix all" |     0      | Bulk codemod / lint-fix style sweep               |

### Composition rules (self-expansion)

Any new scenario MUST:

1. Include `session-log` as the **first and last** node.
2. Include a `gate` node before any write or spawn operations.
3. Reuse existing nodes — no inline operations.
4. Declare its budget in metadata.
5. Start with `verified: false` until the scenario successfully runs once.

See `engine/_SCENARIO_TEMPLATE.md`.

## 5. Adapters

Adapters are thin shims so that the same knowledge base serves multiple AI tools:

| Adapter           | File                              | Purpose                                         |
| ----------------- | --------------------------------- | ----------------------------------------------- |
| Claude Code       | `ai/CLAUDE.md`                    | Symlinked or copied to project-root `CLAUDE.md` |
| GitHub Copilot    | `.github/copilot-instructions.md` | Auto-loaded by Copilot for every request        |
| Cursor / Continue | (add when needed)                 | Same pattern                                    |

Each adapter is <100 lines. All real content lives under `ai/`.

## 6. Adding new knowledge

1. **New rule** → copy `templates/_RULE_TEMPLATE.md` → write to `rules/<id>.md` → register in `manifest.json` → bump `lastUpdated`.
2. **New skill** → copy `templates/_SKILL_TEMPLATE.md` → write to `skills/<id>/SKILL.md` → register in `manifest.json` with `triggers` keywords.
3. **New agent** → copy `templates/_AGENT_TEMPLATE.md` → write to `agents/<id>.md` → register in `manifest.json` with explicit `scope`.
4. **New scenario** → copy `engine/_SCENARIO_TEMPLATE.md` → write to `engine/scenarios/<id>.md` → register in `engine/registry.json` with `verified: false`.

Always check for an existing artifact first — duplicates waste context and create conflicting guidance.

## 7. Verification

After any code change:

```bash
npm run lint && npm run build && npm test -- --run
```

For a deeper audit, use the `code-review` engine scenario.

## 8. References

- Refactoring Guru — [Facade pattern](https://refactoring.guru/design-patterns/facade)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [TanStack Router](https://tanstack.com/router) | [TanStack Query](https://tanstack.com/query)
- [shadcn/ui](https://ui.shadcn.com) | [Tailwind v4](https://tailwindcss.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

# Protocol: Token Budget

> Never load all skills. Tier-based loading, max-5-skills-per-task.

## Tiers

| Tier | Label          | Loaded                                 |
| ---- | -------------- | -------------------------------------- |
| 0    | Always         | `BOOTSTRAP.md` + tier-0 rules          |
| 1    | Trigger-loaded | Skills matching task keywords (max 5)  |
| 2    | On-demand      | Full agents, protocols, reference docs |

## Budgets

| Task type            | Max skills |  Max rules   | Strategy                                |
| -------------------- | :--------: | :----------: | --------------------------------------- |
| simple (1 file)      |     2      |      3       | Summary-only unless critical            |
| feature (multi-file) |     5      | all matching | Full for primary, summary for secondary |
| audit                |    all     |     all      | Full load permitted                     |

## Loading steps

1. Read `BOOTSTRAP.md` (always).
2. Pick a budget (simple / feature / audit).
3. Match task keywords against `manifest.json` triggers.
4. Read the `summary` field (≤5 lines) from each matched skill.
5. Read full `SKILL.md` only if the summary is insufficient.
6. Load tier-1 rules only if the task touches that area.
7. Load protocols/agents only when orchestrating.

## Anti-patterns

- Loading every skill "just in case" — context goes to 20k+ tokens.
- Loading full `README.md` for routine tasks.
- Re-reading a skill multiple times in one session — cache it.

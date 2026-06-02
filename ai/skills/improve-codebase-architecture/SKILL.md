---
name: improve-codebase-architecture
description: Find deepening opportunities in a codebase, informed by the domain language in CLAUDE.md and the decisions in .claude/rules/. Use when the user wants to improve architecture, find refactoring opportunities, consolidate tightly-coupled features, or make a codebase more testable and AI-navigable.
metadata:
  version: "1.0"
  source: https://github.com/mattpocock/skills/blob/main/skills/engineering/improve-codebase-architecture/SKILL.md
tier: 2
triggers:
  - improve architecture
  - find refactoring opportunities
  - deepen modules
  - consolidate features
  - architecture review
  - architectural friction
  - shallow modules
  - testability review
summary: |
  Surface architectural friction and propose deepening opportunities — refactors
  that turn shallow modules into deep ones. Explore organically, apply the
  deletion test, then present candidates as a self-contained HTML report
  (Tailwind + Mermaid via CDN) in the OS temp dir. After the user picks a
  candidate, drop into a one-question-at-a-time grilling loop, side-effecting
  rules / docs as decisions crystallize. Adapt to project domain language.
---

# Improve Codebase Architecture

Surface architectural friction and propose **deepening opportunities** — refactors that turn shallow modules into deep ones. The aim is testability and AI-navigability.

## Glossary

Use these terms exactly in every suggestion. Consistent language is the point — don't drift into "component," "service," "API," or "boundary."

- **Module** — anything with an interface and an implementation (function, hook, component, feature slice).
- **Interface** — everything a caller must know to use the module: types, invariants, error modes, ordering, config. Not just the type signature.
- **Implementation** — the code inside.
- **Depth** — leverage at the interface: a lot of behaviour behind a small interface. **Deep** = high leverage. **Shallow** = interface nearly as complex as the implementation.
- **Seam** — where an interface lives; a place behaviour can be altered without editing in place. (Use this, not "boundary.")
- **Adapter** — a concrete thing satisfying an interface at a seam.
- **Leverage** — what callers get from depth.
- **Locality** — what maintainers get from depth: change, bugs, knowledge concentrated in one place.

Key principles:

- **Deletion test**: imagine deleting the module. If complexity vanishes, it was a pass-through. If complexity reappears across N callers, it was earning its keep.
- **The interface is the test surface.**
- **One adapter = hypothetical seam. Two adapters = real seam.**

This skill is _informed_ by the project's domain model. The domain language gives names to good seams; the rules record decisions the skill should not re-litigate.

## Project mapping

This project uses Feature-Sliced Design. Equivalent surfaces to read first:

- **Domain language** → `CLAUDE.md` (root + `.claude/CLAUDE.md`), `ai/BOOTSTRAP.md`, feature names under `src/features/<name>/`.
- **Architectural decisions** → `.claude/rules/architecture.md`, `.claude/rules/modularity.md`, `.claude/rules/file-health.md`, and the other rule files (mirrored from `ai/rules/`).
- **Protected boundaries** → shared layers (`src/lib/`, `src/components/`, `src/ui/`, `src/hooks/`), the Axios instance (`src/lib/api.ts`), env validation (`src/config/env.ts`), and `routeTree.gen.ts` (generated — never edit). Don't propose refactors that touch these without flagging explicitly.

If a candidate contradicts a rule under `.claude/rules/`, treat it the same as an architectural-decision conflict (see step 2).

## Process

### 1. Explore

Read the project's domain language and existing rules in the area you're touching first (see Project mapping above).

Then use the `Agent` tool with `subagent_type=Explore` to walk the codebase. Don't follow rigid heuristics — explore organically and note where you experience friction:

- Where does understanding one concept require bouncing between many small modules?
- Where are modules **shallow** — interface nearly as complex as the implementation?
- Where have pure functions been extracted just for testability, but the real bugs hide in how they're called (no **locality**)?
- Where do tightly-coupled features leak across their seams (or reach for another feature's internals)?
- Which parts of the codebase are untested, or hard to test through their current interface?

Apply the **deletion test** to anything you suspect is shallow: would deleting it concentrate complexity, or just move it? A "yes, concentrates" is the signal you want.

### 2. Present candidates as an HTML report

Write a self-contained HTML file to the OS temp directory so nothing lands in the repo. Resolve the temp dir from `$TMPDIR`, falling back to `/tmp` (or `%TEMP%` on Windows), and write to `<tmpdir>/architecture-review-<timestamp>.html` so each run gets a fresh file. Open it for the user — `open <path>` on macOS, `xdg-open <path>` on Linux, `start <path>` on Windows — and tell them the absolute path.

The report uses **Tailwind via CDN** for layout and styling, and **Mermaid via CDN** for diagrams where a graph/flow/sequence reliably communicates the structure. Mix Mermaid with hand-crafted CSS/SVG visuals — Mermaid when relationships are graph-shaped (call graphs, dependencies, sequences), hand-built divs/SVG when you want something more editorial (mass diagrams, cross-sections, collapse animations). Each candidate gets a **before/after visualisation**. Be visual.

For each candidate, render as a card:

- **Files** — which files/modules are involved (use `@/` aliases or `src/features/<name>/...` paths)
- **Problem** — why the current architecture is causing friction
- **Solution** — plain English description of what would change
- **Benefits** — explained in terms of locality and leverage, and how tests would improve
- **Before / After diagram** — side-by-side, custom-drawn, illustrating the shallowness and the deepening
- **Recommendation strength** — one of `Strong`, `Worth exploring`, `Speculative`, rendered as a badge

End the report with a **Top recommendation** section: which candidate you'd tackle first and why.

**Use the project's domain vocabulary** (feature names from `src/features/`, terms from `CLAUDE.md`) **for the domain**, and the glossary above for architecture. If the codebase has a `dashboard` feature, talk about "the dashboard intake hook" — not "the FooBarHandler," and not "the dashboard service."

**Rule conflicts**: if a candidate contradicts a rule under `.claude/rules/` (e.g. A1 feature isolation, A3 shared layers stay pure, F1 components ≤150 lines, M2 no barrel files), only surface it when the friction is real enough to warrant revisiting the rule. Mark it clearly in the card (warning callout: _"contradicts `.claude/rules/architecture.md` A1 — but worth reopening because…"_). Don't list every theoretical refactor a rule forbids.

Do NOT propose interfaces yet. After the file is written, ask the user: "Which of these would you like to explore?"

### 3. Grilling loop

Once the user picks a candidate, drop into a grilling conversation (composes with [`grill-me`](../grill-me/SKILL.md)). Walk the design tree with them — constraints, dependencies, the shape of the deepened module, what sits behind the seam, what tests survive. **One question at a time.** Provide a recommended answer for each.

Side effects happen inline as decisions crystallize:

- **User rejects a candidate with a load-bearing reason?** Offer to record it as a new rule under `ai/rules/` (then mirror it to `.claude/rules/`), framed as: _"Want me to record this as a rule so future architecture reviews don't re-suggest it?"_ Only offer when the reason would actually be needed by a future explorer to avoid re-suggesting the same thing — skip ephemeral reasons ("not worth it right now") and self-evident ones.
- **Want to explore alternative interfaces for the deepened module?** Sketch each option's interface signature, invariants, error modes, and the test surface it exposes. Pick the one that maximises depth (most behaviour behind the smallest interface).

## Project constraints to respect

When proposing or implementing deepening refactors in this codebase, honour the rules already in force — they are themselves architectural decisions:

- `.claude/rules/architecture.md` — feature isolation (A1), features can't import from `app/` (A2), shared layers stay pure (A3), no cycles (A4), `routeTree.gen.ts` is generated (A5).
- `.claude/rules/modularity.md` — feature folder layout (M1), no barrel files unless they help tree-shaking (M2), no circular feature deps (M3), sub-folder at 10+ files (M4), cross-cutting concerns go to shared layers (M5).
- `.claude/rules/file-health.md` — components ≤150 lines (F1), hooks ≤80 lines guideline (F2), single responsibility (F3), one default export per file (F4).

A deepening proposal that requires breaking one of these rules MUST surface the conflict in the candidate card, not silently violate it.

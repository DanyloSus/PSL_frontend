---
name: self-expansion
description: Protocol for adding new skills, rules, or agents to this knowledge base. Template-based, manifest-registered, duplicate-checked.
metadata:
  version: "1.0"
tier: 2
triggers:
  - create skill
  - create rule
  - new skill
  - new rule
  - expand knowledge
  - self-expansion
summary: |
  To add a new artifact: (1) check for duplicates in manifest.json, (2) copy
  the relevant template from ai/templates/, (3) write the file, (4) register
  it in manifest.json, (5) verify triggers are distinct. User approval required.
---

# Self-Expansion Protocol

## When to use

- A task requires guidance that doesn't exist yet in a skill/rule.
- A recurring mistake suggests a new rule.
- A new tool or library joins the stack.

## Pre-flight checks

1. **Duplicate check:** `grep` the `triggers` field in `manifest.json`. If keywords overlap with an existing skill, EXTEND that skill instead of creating a new one.
2. **Template choice:**
   - New rule → `templates/_RULE_TEMPLATE.md`
   - New skill → `templates/_SKILL_TEMPLATE.md`
   - New agent → `templates/_AGENT_TEMPLATE.md`
   - New scenario → `engine/_SCENARIO_TEMPLATE.md`
3. **Scope check:** Does this belong in `ai/` or in project docs (`docs/`)? `ai/` is for AI guidance. `docs/` is for humans.

## Steps

1. **Ask the user.** State what you're adding and why.
2. Copy the template to the right location:
   - Rule → `ai/rules/<id>.md`
   - Skill → `ai/skills/<id>/SKILL.md`
   - Agent → `ai/agents/<id>.md`
3. Fill in frontmatter (name, description, triggers, tier).
4. Write content. Use real code examples from the project.
5. Register in `ai/manifest.json`:
   - Add entry to `rules`, `skills`, `agents`, or `protocols` array.
   - Bump `lastUpdated`.
6. Verify triggers don't collide with existing ones.
7. Run `npm run lint` on any code examples included.

## Rules for new content

- Every new artifact MUST start at tier 2 unless explicitly approved for tier 0 or 1.
- Every new scenario MUST start with `verified: false` in `engine/registry.json`.
- Never duplicate content across skills. Link between them.
- Keep `BOOTSTRAP.md` under 200 lines — do NOT expand it with new content; link from it instead.

## Verification

After adding a new artifact:

```bash
# Lint any example code
npm run lint

# Sanity check the manifest
node -e "JSON.parse(require('fs').readFileSync('ai/manifest.json', 'utf8'))"
```

## Checklist

- [ ] User approved the addition
- [ ] No duplicate skill / rule exists
- [ ] Template used
- [ ] Registered in `manifest.json`
- [ ] Triggers are distinct
- [ ] `lastUpdated` bumped

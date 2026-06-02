---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
metadata:
  version: "1.0"
  source: https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md
tier: 2
triggers:
  - grill me
  - stress-test plan
  - grill design
  - interview my plan
  - challenge my design
summary: |
  Interview the user one question at a time about every aspect of a plan or
  design until shared understanding is reached. Walks the decision tree branch
  by branch, resolves dependencies between decisions, and provides a recommended
  answer for each question. When a question can be answered by exploring the
  codebase, explore instead of asking.
---

# Grill Me

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.

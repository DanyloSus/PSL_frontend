# Protocol: Agent Orchestration

> When to delegate to sub-agents, and how to choose parallel vs sequential.

## When to spawn a sub-agent

- Task is large enough that keeping it in the main context would crowd out core work.
- Research / exploration across many files.
- Independent work that can run in parallel with other sub-agents.
- A specialized agent (`code-reviewer`, `test-writer`) has a better scope match.

## Parallel vs sequential

| Shape          | Use when                                                               |
| -------------- | ---------------------------------------------------------------------- |
| **Parallel**   | Tasks are independent — e.g., writing tests for 4 unrelated features   |
| **Sequential** | Later tasks depend on earlier results — e.g., scaffold → test → verify |

Always prefer parallel when independent — it scales better.

## Scope enforcement

Every agent has a declared scope (read/write/execute/forbidden). Before spawning, pass the scope in the prompt so the sub-agent enforces it.

## Handoff format

Give the sub-agent:

- Goal (one sentence)
- Context (what's already loaded)
- Constraints (what NOT to do)
- Deliverable format (short report vs detailed output)

## When NOT to spawn

- Task is one-shot and small — inline is cheaper.
- Task requires information only the main agent has.
- User has not authorized background/parallel work.

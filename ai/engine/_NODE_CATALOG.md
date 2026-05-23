# Node Catalog

> Atomic, reusable nodes that compose into DAG scenarios. Each node has a declared cost, cacheability, and I/O contract.

## Nodes (11)

| Node                                | Type    | Cost | Cacheable | Purpose                               |
| ----------------------------------- | ------- | ---: | :-------: | ------------------------------------- |
| [discover](nodes/discover.md)       | input   |   80 |     ✓     | Read files / search workspace         |
| [extract](nodes/extract.md)         | process |   60 |     ✓     | Pull structured data from raw content |
| [skill-load](nodes/skill-load.md)   | input   |  100 |     ✓     | Load a SKILL.md or section            |
| [partition](nodes/partition.md)     | process |   40 |           | Split work into N groups              |
| [spawn](nodes/spawn.md)             | process |  120 |           | Launch a sub-agent                    |
| [verify](nodes/verify.md)           | process |   80 |           | Run lint / type-check / tests         |
| [fix](nodes/fix.md)                 | process |  100 |           | Apply guided fixes to verify failures |
| [gate](nodes/gate.md)               | gate    |   20 |           | User-approval checkpoint              |
| [merge](nodes/merge.md)             | output  |   40 |           | Combine parallel branch results       |
| [transform](nodes/transform.md)     | process |   60 |     ✓     | Apply prompt template / formatter     |
| [session-log](nodes/session-log.md) | process |   10 |           | Append to session tracker             |

## Composition rules

1. Every scenario MUST start and end with `session-log`.
2. Every scenario MUST include a `gate` before any write/spawn.
3. Reuse nodes — do NOT create inline operations.
4. Parallel spawns go through `partition` first.
5. After a `spawn`, use `merge` to combine results before `verify`.

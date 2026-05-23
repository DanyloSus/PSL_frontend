# Scenario: feature-scaffold

> Scaffold a complete new feature with all Feature-Sliced Design layers.

## Metadata

```yaml
id: feature-scaffold
triggers: ["new feature", "create feature", "scaffold feature"]
budget:
  max_skills: 3
  max_subagents: 0
  estimated_tokens: 5000
verified: false
```

## DAG

```
session-log ──→ skill-load(FSD) ──→ skill-load(presentation) ──→ skill-load(query) ──→ gate ──→ transform ──→ verify ──→ session-log
```

## Steps

```yaml
nodes:
  - id: log_start
    node: session-log
    inputs:
      request_num: 1
      summary: "Scenario feature-scaffold: {feature_name}"
      mode: edit
      scenario_id: feature-scaffold
    outputs: [session_name]

  - id: load_fsd
    node: skill-load
    inputs:
      skill_id: react-feature-sliced-design
    outputs: [fsd_guide]

  - id: load_presentation
    node: skill-load
    inputs:
      skill_id: react-presentation-layer
    outputs: [presentation_guide]

  - id: load_query
    node: skill-load
    inputs:
      skill_id: react-tanstack-query
    outputs: [query_guide]

  - id: approve_plan
    node: gate
    inputs:
      message: "Create feature '{feature_name}' with subfolders: api/, components/, hooks/, types/? Feature barrel? Zustand store?"
      options: ["Approve", "Modify scope", "Cancel"]
    outputs: [user_decision]

  - id: generate_files
    node: transform
    condition: "$user_decision.approved"
    inputs:
      input: [$fsd_guide, $presentation_guide, $query_guide]
      operation: to-code
      params:
        template: "Generate feature '{feature_name}' per FSD + presentation + query skills"
    outputs: [feature_files]

  - id: validate
    node: verify
    inputs:
      check_type: full
    outputs: [verification]

  - id: log_end
    node: session-log
    inputs:
      session_name: $session_name
      request_num: 2
      summary: "Scenario feature-scaffold completed: {feature_name} — {verification.status}"
      mode: edit
      files_modified: $feature_files
      scenario_id: feature-scaffold
    outputs: []
```

## Files created

```
src/features/{feature_name}/
├── api/
│   ├── get-{feature_name}.ts
│   └── {feature_name}-keys.ts
├── components/
│   └── {feature_name}-list.tsx
├── hooks/
│   └── use-{feature_name}.ts
└── types/
    ├── {feature_name}.types.ts
    └── {feature_name}.schema.ts
```

## Token Estimate

| Node        | Cost | Instances | Total    |
| ----------- | ---- | --------- | -------- |
| session-log | 10   | 2         | 20       |
| skill-load  | 100  | 3         | 300      |
| gate        | 20   | 1         | 20       |
| transform   | 60   | 1         | 60       |
| verify      | 80   | 1         | 80       |
| **Total**   |      |           | **~480** |

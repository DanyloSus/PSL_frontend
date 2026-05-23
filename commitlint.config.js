export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "chore",
        "deps",
        "perf",
        "revert",
        "ci",
        "build",
      ],
    ],
    "header-max-length": [0],
  },
};

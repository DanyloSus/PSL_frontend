# React Fast Template

A production-ready React 19 + TypeScript + Vite template with feature-sliced architecture, comprehensive tooling, and CI/CD pipelines ready to use out of the box.

---

## Tech Stack

### Core

| Library                                      | Version | Purpose                 |
| -------------------------------------------- | ------- | ----------------------- |
| [React](https://react.dev)                   | 19      | UI framework            |
| [TypeScript](https://www.typescriptlang.org) | ~5.9    | Type safety             |
| [Vite](https://vite.dev)                     | 8       | Build tool & dev server |

### Routing & Data

| Library                                        | Version | Purpose                      |
| ---------------------------------------------- | ------- | ---------------------------- |
| [TanStack Router](https://tanstack.com/router) | 1       | File-based type-safe routing |
| [TanStack Query](https://tanstack.com/query)   | 5       | Server state & data fetching |
| [Axios](https://axios-http.com)                | 1       | HTTP client                  |
| [Zustand](https://zustand-demo.pmnd.rs)        | 5       | Client state management      |

### Forms & Validation

| Library                                        | Version | Purpose               |
| ---------------------------------------------- | ------- | --------------------- |
| [React Hook Form](https://react-hook-form.com) | 7       | Form state management |
| [Zod](https://zod.dev)                         | 4       | Schema validation     |

### UI & Styling

| Library                                                     | Version | Purpose                         |
| ----------------------------------------------------------- | ------- | ------------------------------- |
| [Tailwind CSS](https://tailwindcss.com)                     | 4       | Utility-first CSS               |
| [shadcn/ui](https://ui.shadcn.com)                          | —       | Accessible component primitives |
| [Radix UI](https://www.radix-ui.com)                        | 1       | Headless UI components          |
| [Lucide React](https://lucide.dev)                          | 1       | Icon library                    |
| [CVA](https://cva.style)                                    | 0.7     | Component variant management    |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 3       | Safe Tailwind class merging     |
| [Geist](https://vercel.com/font)                            | —       | Variable font                   |

### Testing

| Library                                              | Version | Purpose                                |
| ---------------------------------------------------- | ------- | -------------------------------------- |
| [Vitest](https://vitest.dev)                         | 4       | Unit & component testing               |
| [Testing Library](https://testing-library.com/react) | 16      | React component testing utilities      |
| [Playwright](https://playwright.dev)                 | 1       | End-to-end & browser testing           |
| [Storybook](https://storybook.js.org)                | 10      | Component development & visual testing |

### Code Quality

| Tool                                                      | Purpose                         |
| --------------------------------------------------------- | ------------------------------- |
| [ESLint](https://eslint.org) (flat config)                | Linting with 15+ plugins        |
| [Prettier](https://prettier.io)                           | Code formatting                 |
| [Husky](https://typicode.github.io/husky)                 | Git hooks                       |
| [lint-staged](https://github.com/lint-staged/lint-staged) | Run linters on staged files     |
| [commitlint](https://commitlint.js.org)                   | Conventional commit enforcement |

---

## Project Structure

The project follows **Feature-Sliced Design** — a layered architecture where features are self-contained modules and shared code lives in dedicated layers. Each layer has strictly enforced import rules.

```
src/
├── config/          # Environment variables (Zod-validated)
├── lib/             # Shared libraries (Axios instance, React Query config)
├── utils/           # Shared utilities (cn helper)
├── hooks/           # Shared custom hooks
├── types/           # Shared TypeScript types
├── ui/              # Low-level UI components (Button, Spinner)
├── components/      # Reusable presentational components
│   ├── errors/      # Error fallback components
│   └── layouts/     # Layout wrappers (QueryClient, ErrorBoundary, etc.)
├── routes/          # TanStack Router routes (file-based)
├── features/         # Feature modules (feature-sliced)
│   └── <feature>/
│       ├── api/     # API calls & React Query hooks
│       ├── assets/  # Feature-specific assets
│       ├── components/  # Feature UI components
│       ├── hooks/   # Feature hooks
│       ├── types/   # Feature types
│       └── utils/   # Feature utilities
└── testing/         # Test setup & utilities
```

```
e2e/                 # Playwright end-to-end tests
.storybook/          # Storybook configuration
.github/workflows/   # CI/CD pipelines
```

### Architecture Rules

Import boundaries are enforced by `eslint-plugin-boundaries`:

- **Features** are self-contained — they import from shared layers only
- **Shared layers** (`components`, `hooks`, `lib`, `types`, `utils`, `ui`) cannot import from features
- **No deep relative imports** — use the `@/` alias for all internal imports
- **Naming conventions**: all files and folders use `kebab-case`

Violations are reported as ESLint errors.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v24 (see `.nvmrc`). Use [nvm](https://github.com/nvm-sh/nvm) to switch automatically:
  ```bash
  nvm use
  ```

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

Edit `.env` and set your API URL:

```env
VITE_APP_APP_URL=http://localhost:3000
VITE_APP_API_URL=https://your-api.example.com
```

Environment variables are validated at startup via Zod in `src/config/env.ts`. The app will throw if required variables are missing.

---

## Development

```bash
npm run dev
```

Starts the dev server at [http://localhost:3000](http://localhost:3000) with Hot Module Replacement.

TanStack Router routes are auto-generated from files in `src/routes/`. The router plugin handles code-splitting automatically.

---

## Building

```bash
npm run build
```

Runs TypeScript type checking (`tsc -b`) and then Vite production build. Output goes to `dist/`.

### Preview the production build

```bash
npm run preview
```

Serves the `dist/` folder locally.

---

## Testing

### Unit & Component Tests (Vitest)

```bash
# Watch mode (development)
npm test

# Single run
npm test -- --run

# With coverage report
npm run test:coverage
```

Tests use jsdom environment, `@testing-library/react`, and `@testing-library/jest-dom` matchers. Coverage is collected via V8 provider over `src/**`.

### End-to-End Tests (Playwright)

```bash
# Install browsers (first time only)
npx playwright install --with-deps

# Run all E2E tests
npx playwright test

# Run with UI mode
npx playwright test --ui
```

Tests run against Chromium, Firefox, and WebKit. On CI, tests retry up to 2 times and run in a single worker. Reports are saved as HTML.

E2E test files live in `e2e/`.

### Component Testing (Storybook)

```bash
npm run storybook
```

Opens Storybook at [http://localhost:6006](http://localhost:6006).

Storybook integrates with Vitest (`@storybook/addon-vitest`) so stories can be run as tests. The `addon-a11y` addon runs accessibility checks on every story. Visual regression testing is available via Chromatic.

```bash
# Build a static Storybook
npm run build:storybook
```

---

## Code Quality

### Linting

```bash
# Check
npm run lint

# Auto-fix
npm run lint:fix
```

ESLint is configured with a flat config (`eslint.config.js`) and includes rules for:

- TypeScript, React, React Hooks, JSX a11y
- Import ordering & cycle detection (`eslint-plugin-import-x`)
- Architecture boundary enforcement (`eslint-plugin-boundaries`)
- File & folder naming conventions (`eslint-plugin-check-file`)
- Testing patterns (`eslint-plugin-testing-library`, `@vitest/eslint-plugin`)
- Storybook (`eslint-plugin-storybook`)

### Formatting

```bash
npm run format
```

Prettier is configured in `.prettierrc.cjs` (double quotes, 2 spaces, trailing commas off, 80-char print width). The Tailwind plugin automatically sorts class names.

### Git Hooks

Husky runs automatically on `git commit`:

| Hook         | Action                                                                            |
| ------------ | --------------------------------------------------------------------------------- |
| `pre-commit` | `lint-staged` — ESLint on `*.{ts,tsx,js,jsx}`, Prettier on `*.{json,md,yml,yaml}` |
| `commit-msg` | `commitlint` — validates conventional commit format                               |

---

## Commit Convention

Commits must follow [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<scope>): <subject>
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `deps`, `perf`, `revert`, `ci`, `build`

Examples:

```
feat(auth): add login form with Zod validation
fix(api): handle 401 response in Axios interceptor
chore(deps): upgrade TanStack Router to v1.170
```

---

## CI/CD

All pipelines trigger on push and pull requests to `main` and `dev` branches.

### Code Quality (`code-quality.yml`)

Runs ESLint on every push and PR.

```
Checkout → Setup Node (from .nvmrc) → npm ci → npm run lint
```

### Testing (`testing.yml`)

Two parallel jobs:

**Vitest** — unit & component tests:

```
Checkout → Setup Node → npm ci → npm test -- --run
```

**Playwright** — end-to-end tests:

```
Checkout → Setup Node → npm ci → Install browsers → npx playwright test → Upload HTML report
```

Playwright reports are uploaded as artifacts and retained for 7 days.

### Build (`build.yml`)

Verifies the production build succeeds and uploads the artifact.

```
Checkout → Setup Node → npm ci → npm run build → Upload dist/
```

Build artifacts are retained for 7 days.

---

## Pull Requests

Use the PR template in `.github/pull_request_template.md`. Fill in all sections before requesting review:

### What was done

Describe the changes made — what was added, changed, or removed.

### Related issue

Reference the issue being resolved: `Closes #<issue-number>`

### How to test

Provide step-by-step instructions for verifying the change works correctly.

### Additional notes

Any context that reviewers should know — gotchas, follow-ups, decisions made.

---

## Available Scripts

| Script                    | Description                           |
| ------------------------- | ------------------------------------- |
| `npm run dev`             | Start development server on port 3000 |
| `npm run build`           | TypeScript check + production build   |
| `npm run preview`         | Preview production build locally      |
| `npm run lint`            | Run ESLint                            |
| `npm run lint:fix`        | Run ESLint with auto-fix              |
| `npm run format`          | Run Prettier on all files             |
| `npm test`                | Run Vitest in watch mode              |
| `npm run test:coverage`   | Run Vitest with V8 coverage report    |
| `npm run storybook`       | Start Storybook on port 6006          |
| `npm run build:storybook` | Build static Storybook                |

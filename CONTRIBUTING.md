# Contributing Guide

This guide explains how to set up, code, test, review, and release updates so that all contributions meet our team’s Definition of Done (DoD) and quality standards.

---

## Code of Conduct

Our team follows Oregon State University’s Capstone professionalism and collaboration guidelines.
All members are expected to communicate respectfully through Discord, GitHub, and meetings.
Conflicts are addressed through private check-ins and team discussions before escalation to the TA or project partner.

---

## Getting Started

### Requirements

* Node.js **22.x**
* Git
* GitHub access (collaborator permissions)

### Setup

First-time setup:

```
git clone <repo-url>
cd CS041-meal-planning-app

cd client && npm ci && cd ..
cd server && npm ci && cd ..
```

> **Important:** Plain `npm install` is intentionally **blocked** in this repository.
> Always use `npm ci` for deterministic installs based on the committed lockfiles.

### Running the App

From the repository root:

**Recommended (run client + server together):**

```
npm run dev:all
```

**Run services individually:**

```
npm run dev:client   # React (Vite) client
npm run dev:server   # Express API server
```

**Aliases (still supported):**

```
npm run client
npm run server
```

---

## Commit Messages (Conventional Commits)

We follow the **Conventional Commits** standard.

### Format

```
<type>(optional scope): <short imperative summary>
```

### Allowed types

| Type         | Description              |
| ------------ | ------------------------ |
| **feat**     | Add a new feature        |
| **fix**      | Bug fix                  |
| **docs**     | Documentation changes    |
| **style**    | Formatting only          |
| **refactor** | Code restructure         |
| **test**     | Add/update tests         |
| **chore**    | Maintenance & configs    |
| **perf**     | Performance improvements |
| **ci**       | Workflow changes         |
| **build**    | Dependency/build updates |

### Examples

```
feat(client): add meal calendar UI
fix(server): correct /recipes response
docs: update README for current scripts
ci: update Node version to 22
```

---

## Branching & Workflow

We use a **feature-branch workflow** with `main` as the stable branch.

### Branch naming

```
<type>/<short-description>-<initials>
```

### Examples

```
feat/login-page-CHH
fix/grocery-endpoint-KL
docs/readme-update-LPL
refactor/state-cleanup-XS
test/vitest-setup-FLDB
```

### Guidelines

* Always branch off `main`
* One feature or fix per branch
* Pull Request required before merge
* Squash merge only
* Keep PRs small and reviewable

---

## Pull Request Rules

To prevent oversized or unreviewable PRs, the following rules are **mandatory**:

### Required for every PR

* **Must link at least one GitHub Issue**
* **Must be focused** (one feature or fix)
* **Must pass CI** (lint + tests)
* **Cannot merge your own PR**
* **At least 1 reviewer approval**

### PR Size Guidelines

* **≤ 200 lines changed** (recommended)
* If > 200 lines:

  * Notify the team in Discord before opening the PR
  * Requires **2 reviewers**
  * Clearly explain why the scope is large (e.g., boilerplate, migration)

### Weekly Expectations

* **2–3 PRs per member per week**
* Each PR should be meaningful and tied to an Issue or planned task

---

## Dependency Installation Rules

To prevent lockfile corruption and inconsistent installs across machines, **plain `npm install` is disabled** in the repository root, `client/`, and `server/`.

### Installing dependencies normally

Use `npm ci` (installs exactly from the lockfile):

```
npm ci
cd client && npm ci
cd server && npm ci
```

### Adding or updating a dependency intentionally

All dependency changes must be done from the **repository root** using the helper scripts.

**Client dependencies:**

```
npm run add:dep:client -- <package> [--save-dev]
```

Examples:

```
npm run add:dep:client -- react-icons
npm run add:dep:client -- @testing-library/user-event --save-dev
```

**Server dependencies:**

```
npm run add:dep:server -- <package> [--save-dev]
```

Examples:

```
npm run add:dep:server -- supertest --save-dev
```

**Root-level tools (rare):**

```
npm run add:dep -- <package>
```

### Uninstalling dependencies

Uninstalling does **not** trigger the install blocker:

```
cd client
npm uninstall <package>
```

or:

```
cd server
npm uninstall <package>
```

### Why this rule exists

* Prevents accidental lockfile rewrites
* Ensures deterministic installs (`npm ci`)
* Avoids multi-platform lockfile drift
* Guarantees dependency changes are intentional and reviewed

---

## Issues & Planning

GitHub Issues are used for:

* Tracking major features
* Backend or infrastructure tasks
* Bug reports
* Organizing milestones

Not every small UI change needs an Issue, but **all PRs must reference one**.

---

## Code Style, Linting & Formatting

Linting is enforced for **client and server** code.

### Local commands

```
npm run lint
```

### Editor recommendations (`.vscode/settings.json`)

```
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Conventions

* Components use PascalCase
* Helpers/utilities use camelCase
* Remove unused imports and variables
* No stray `console.log` in PRs
* Group imports: standard → third-party → local

---

## Testing (Vitest)

The project uses **Vitest** for automated testing.

### Running tests (from repo root)

Frontend tests:

```
npm run test:client
```

Backend tests:

```
npm run test:server
```

Run all tests:

```
npm run test:all
```

### Notes

* Tests are expanded incrementally as features stabilize.
* Contributors should run relevant tests locally before requesting PR review.

---

## Definition of Done (Current)

A change is considered **done** when:

* Lint passes
* Relevant tests pass
* Manual verification is completed
* Client and server run without runtime errors

---

## CI/CD

GitHub Actions workflows live in `.github/workflows/`.

CI currently performs:

1. Dependency install (`client` and `server`)
2. Lint (`client` and `server`)
3. Tests (`client` and `server`)

All required CI checks must pass before merging.

---

## Security & Secrets

* Never commit API keys or credentials
* Use `.env` files for local secrets
* Rotate credentials immediately if leaked
* Report security issues to the team and TA

---

## Documentation Expectations

* Update **README.md** and **CONTRIBUTING.md** when behavior or scripts change
* Comment non-obvious logic
* Architecture and deployment docs will be added once hosting is finalized

---

## Release Process (Future)

Semantic versioning will be adopted once deployment begins:

```
v1.0.0 — first working prototype
v1.1.0 — new features
v1.1.1 — patches / hotfixes
```

---

*Last updated: January 30, 2026*

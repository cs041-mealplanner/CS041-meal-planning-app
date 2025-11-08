# Contributing Guide

This guide explains how to set up, code, test, review, and release updates so that all contributions meet our team’s Definition of Done (DoD) and quality standards.

---

## Code of Conduct
Our team follows Oregon State University’s Capstone professionalism and collaboration guidelines.  
All members are expected to communicate respectfully through Discord, GitHub, and meetings.  
Conflicts are addressed through private check-ins and team discussions before escalation to the TA or partner.

---

## Getting Started
**Requirements**
- Node.js 20+
- Expo CLI (for front-end development)
- Git & GitHub access (collaborator permissions)

**Setup**
```bash
git clone <repo-url>
cd meal-planning-webapp
npm install
npm run web
```
Environment variables are stored locally in `.env` (not pushed to GitHub).

## Commit Messages

We follow the **[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)** standard to maintain clear, consistent history across all PRs.

**Format:**
```
<type>: <short imperative summary>
```

**Allowed types:**

| Type | Description |
|------|--------------|
| **feat** | Introduce a new feature |
| **fix** | Correct a bug |
| **docs** | Documentation-only changes |
| **style** | Code style or formatting changes (no behavior impact) |
| **refactor** | Code restructure that doesn’t fix or add features |
| **test** | Add or update tests |
| **chore** | Maintenance (tooling, configs, or dependency updates) |
| **perf** | Performance improvement |
| **ci** | CI/CD configuration or workflow changes |
| **build** | Build system or dependency changes |

**Examples:**
```
feat: add top navigation component  
fix: correct null response handling  
test: add smoke test for App component  
ci: add Jest coverage report to pipeline
```

---

## Branching & Workflow

We use a **feature-branch workflow** with `main` as the stable branch.

**Branch naming convention:**
```
<type>/<short-description>-<author-initials>
```

**Examples:**
```
feat/navbar-FLDB
fix/login-bug-KL
docs/readme-update-CHH
chore/add-license-LPL
refactor/cleanup-FLDB
test/jest-setup-XS
ci/workflow-update-XS
```

**Guidelines:**
- Branch type should match your commit type (`feat/`, `fix/`, `test/`, etc.).
- Always branch off `main` (or from an active feature branch if dependent work).
- Open a PR into `main` with at least one peer review before merge.
- Use **squash merges** to keep commit history clean and readable.

---

## Issues & Planning

We use **GitHub Issues** mainly to document major features and track overall progress — not for strict sprint management.  
Most day-to-day coordination happens on **Discord** and during weekly team check-ins.

**How we actually use it:**
- Issues are created for major pages or milestones (e.g., “Login Page,” “Dashboard,” etc.).
- Not every small UI or cleanup task needs an Issue — simple fixes usually go straight to a branch and PR.
- The **Team Planning** board exists but isn’t actively maintained.
- Each PR should still link at least one relevant Issue when possible (e.g., `Closes #9 - Ingredients page`).

> Since we’re still focused on **front-end setup and design work**, the Issue system doesn’t need to be heavily used yet.  
> Once core functionality and backend integration begin, we’ll expand Issue tracking to match feature complexity.  
> For now, this lightweight process keeps us organized without slowing development.

---

## Code Style, Linting & Formatting

We use **ESLint** (Node 20, React/Expo) to enforce code quality.  
The CI gate runs on every push/PR and **must pass with 0 errors**.

**Config & enforcement**
- ESLint flat config: `eslint.config.js` (repo root)
- CI workflow: `.github/workflows/ci.yml` (runs `npm ci` then `npm run lint`)

**Local commands**
```bash
# install exact deps
npm ci

# check lint
npm run lint

# (optional) auto-fix locally; use if not provided as a script:
npm run lint -- --fix
```

**Editor setup (VS Code)**
- Install the “ESLint” extension.
- Recommended settings (add to `.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

**Style conventions**
- **Files:** component files in `app/` use `PascalCase.jsx` (e.g., `Login.jsx`); non-component helpers use `camelCase.js`.
- **Components:** PascalCase names; one component per file when practical.
- **Hooks:** `useSomething` naming; no hooks inside loops/conditions.
- **Imports:** group std libs → third-party → local; remove unused imports/vars.
- **Strings:** single quotes; **no** semicolon churn or unused `console.log`s in PRs.

> **Prettier:** if we add it later, we’ll commit `prettier.config.js` and update this section.  
> Until then, formatting is guided by ESLint rules and editor on-save fixes.

---

## Testing
Testing framework setup is planned for **Sprint 3**.  
We will use **Jest** and **@testing-library/react-native** to cover component rendering and core logic.  

**Current status:**  
- Jest smoke/mock tests run in CI; full unit coverage will expand in future sprints.
- Once tests are added, CI (`.github/workflows/ci.yml`) will include a `npm test` step.  
- Each PR will require all tests to pass before merging.
- Code coverage reports (`coverage/`) will be generated by Jest and uploaded as CI artifacts for review.

**Temporary Definition of Done:**  
Until the test suite is implemented, successful linting and manual feature verification serve as the quality gate.

---

## Pull Requests & Reviews
- Open a PR from your feature branch into `main`.
- Link the related GitHub Issue and include a short description of the change.
- Each PR must receive **at least one teammate approval** before merging.
- Merges are blocked until all CI checks pass successfully.
- Use the Pull Request template (`.github/PULL_REQUEST_TEMPLATE.md`) to maintain consistency across submissions.

---

### CI/CD Workflow (Updated Nov 8, 2025)

As of Nov 8, 2025, the repository’s GitHub Actions pipeline includes a headless web build step (`npm run build:web:ci`) to catch missing assets or invalid imports that would cause “red screen” errors during `npm run web`.

NOTE: There are no actual automated tests yet, only smoke/mock tests with Jest.

All steps are executed headlessly on GitHub’s servers — developers may run them locally to verify before opening PRs.
**The CI runs automatically on every push and pull request** and enforces:
- Clean dependency install (`npm ci`)
- Lint check (`npm run ci:lint`)
- Unit tests (`npm run ci:test`)
- Web bundle build (`npm run build:web:ci`) — fails if Expo cannot resolve modules/images
- Branch protection: all checks must pass before merging to `main` or `develop`

---

## Security & Secrets
- **No API keys, credentials, or secrets** are committed to the repository.  
- Use local environment variables stored in `.env` (excluded via `.gitignore`).  
- Immediately report any potential security or privacy concerns to the team for escalation to the TA or partner if necessary.

---

## Documentation Expectations
- Update **README.md** when adding new features or dependencies.  
- Add short inline comments explaining key functions and logic.  
- If documentation expands in later sprints, we’ll store it either in the repo root or a `/docs` folder.

---

## Release Process
*(Planned for future sprints)*

The team will adopt **semantic versioning** once the app reaches a functional milestone (e.g., first deployed prototype).  

- Follow **semantic versioning** for releases (`v1.0.0`, `v1.1.0`, etc.).  
- Minor UI updates and patches can be merged directly to `main` after CI passes and peer review.  
- Major feature releases require team review and partner approval before tagging a version.

---

_Last updated: November 8, 2025_

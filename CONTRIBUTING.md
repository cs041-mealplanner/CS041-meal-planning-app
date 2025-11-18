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
- Node.js 22+
- Git & GitHub access (collaborator permissions)

**Setup**

First time setup:
```
git clone <repo-url>
cd CS041-meal-planning-app
cd client && npm ci && cd ..
cd server && npm ci && cd ..
```

To run both services after installing (in separate concurrent terminals):
```
npm run client   # starts Vite React web client
npm run server   # starts Express API server
```

---

## Commit Messages (Conventional Commits)

We follow the **Conventional Commits** standard.

**Format**
```
<type>(optional scope): <short imperative summary>
```

**Allowed types**

| Type | Description |
|------|-------------|
| **feat** | Add a new feature |
| **fix** | Bug fix |
| **docs** | Documentation changes |
| **style** | Formatting only |
| **refactor** | Code restructure |
| **test** | Add/update tests |
| **chore** | Maintenance & configs |
| **perf** | Performance improvements |
| **ci** | Workflow changes |
| **build** | Dependency/build updates |

**Examples**
```
feat(client): add meal calendar UI
fix(server): correct /recipes response
docs: update README for new architecture
ci: update Node version to 22
```

---

## Branching & Workflow

We use a **feature-branch workflow** with `main` as the stable branch.

**Branch naming**
```
<type>/<short-description>-<initials>
```

**Examples**
```
feat/login-page-CHH
fix/grocery-endpoint-KL
docs/readme-update-LPL
refactor/state-cleanup-XS
test/vitest-setup-FLDB
```

**Guidelines**
- Always branch off `main`
- One feature per branch
- PR required before merge
- Squash merge only
- Keep PRs small and reviewable

---

## Pull Request Rules

To prevent unreviewable, oversized PRs, the following rules are now **mandatory**:

### Required for every PR
- **Must link at least one Issue #**  
- **Must be focused** (one feature or fix only)  
- **Must pass CI** (lint now, tests later)  
- **Cannot merge your own PR**  
- **At least 1 reviewer approval**  

### PR Size Rules
- **≤ 200 lines changed** (recommended)
- If > 200 lines:
  - Must notify the team in Discord **before opening PR**
  - Requires **2 reviewers**
  - Must clearly explain why scope is large (e.g., boilerplate, migration)

### Weekly Expectations
- **2–3 PRs per member per week**
- Each PR should be meaningful and tied to an Issue or planned feature

---

## Issues & Planning

We use GitHub Issues primarily for:
- Tracking major features
- Logging backend tasks
- Documenting bugs
- Organizing future milestones

Not every tiny UI change needs an Issue, but all PRs should reference one.

---

## Code Style, Linting & Formatting

We use **ESLint** in the `client/` workspace.

**Local commands**
```
npm run lint
npm run lint -- --fix   # optional auto-fix
```

**Editor recommended settings (`.vscode/settings.json`)**
```
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

**Conventions**
- Components use PascalCase
- Helpers/utilities use camelCase
- Remove unused imports/variables
- No stray console.logs in PRs
- Group imports: std → third-party → local

---

## Testing (Sprint 4 — Vitest)

Automated testing will be introduced in Sprint 4 using Vitest for the React (Vite) frontend.
Vitest is the recommended test runner for Vite and provides fast, zero-config integration with modern React tooling.

### Planned File Structure

client/tests/        # Vitest unit/component tests for the frontend
server/tests/        # (Planned) backend tests added in a later sprint

### Frontend Testing (client/)

Vitest will be configured together with React Testing Library to support:
- Component rendering tests
- Hook and utility tests
- DOM interaction tests
- Snapshot or state-based behavioral tests (if needed)

Once Vitest is installed:
- Running `npm test` inside the `client/` directory will execute the test suite
- CI will include a `npm test` step to block merges on failing tests
- Coverage reporting may be added in later sprints if needed

### Backend Testing (server/)

Backend tests will be added in a follow-up PR.
The team may use Vitest in a Node environment or Supertest for Express API route testing.
This will be finalized once backend endpoints stabilize.

### Temporary Definition of Done (until Vitest is fully enabled)

- Lint passes (client)
- Manual feature verification completed
- No breaking runtime errors when running both client and server

---

## CI/CD

GitHub Actions workflow: `.github/workflows/ci.yml`

CI currently performs:
1. Install `client` dependencies  
2. Install `server` dependencies  
3. Run lint (`client`)  

Future additions:
- Run Vitest test suite
- Coverage reporting
- Build validation

All PRs must pass CI before merging.

---

## Security & Secrets
- Never commit API keys or credentials
- Use `.env` for local secrets
- Rotate sensitive tokens immediately if leaked
- Report issues to the team + TA

---

## Documentation Expectations
- Update **README.md** and **CONTRIBUTING.md** when behavior changes
- Add comments for non-obvious logic
- Architecture/deployment docs will be added in later sprints

---

## Release Process (Future)

We will adopt semantic versioning once deployment begins:

```
v1.0.0 — first working prototype
v1.1.0 — new features
v1.1.1 — patches/hotfixes
```

Major releases require team + partner approval.

---

_Last updated: November 18, 2025_

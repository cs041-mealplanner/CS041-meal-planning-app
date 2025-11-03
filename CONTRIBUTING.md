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

---

## Branching & Workflow
We use a **feature-branch workflow** with the `main` branch as the stable release branch.

**Branch naming convention**
```
feature/<feature-name>
fix/<bug-description>
docs/<section-name>
```
- Create a feature branch before coding.
- Open a Pull Request (PR) to merge into `main`.
- Use squash merges after at least one peer review approval.

---

## Issues & Planning
- Issues are created and assigned using GitHub Issues.
- Each issue must include a short description, expected behavior, and checklist.
- Tasks are estimated in weekly sprints and linked to PRs.

---

## Commit Messages
We use **Conventional Commits** for clarity:
```
feat: add login page layout
fix: correct API response handling
docs: update README with setup steps
```
---
test
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
- No automated tests yet; CI currently enforces lint only.  
- Once tests are added, CI (`.github/workflows/ci.yml`) will include a `npm test` step.  
- Each PR will require all tests to pass before merging.

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

## CI/CD
We use **GitHub Actions** for continuous integration (CI) validation.  
Workflow file: `.github/workflows/ci.yml`

Each push or pull request to `main` triggers:
1. Dependency installation (`npm ci`)  
2. ESLint linting (`npm run lint`)  

**Future Enhancements**
- Add Jest test suite and `npm test` step once the testing framework is established.  
- Add Expo build validation in later sprints if required by project scope.

Merges into `main` require all CI jobs to pass before approval.

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
- Follow **semantic versioning** for releases (`v1.0.0`, `v1.1.0`, etc.).  
- Minor UI updates and patches can be merged directly to `main` after CI passes and peer review.  
- Major feature releases require team review and partner approval before tagging a version.

---

## Support & Contact
For issues or clarifications:
- **Team Discord:** `#dev-discussion` channel  
- **Primary Contact:** Francis Louie Baobao (baobaof@oregonstate.edu)  
- **TA:** Nischal Aryal (aryaln@oregonstate.edu)  
- **Partner:** Alexander Ulbrich (alexander.ulbrich@oregonstate.edu)

---

_Last updated: November 2, 2025_

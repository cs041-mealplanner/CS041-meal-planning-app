# 🍽️ CS.041 — Meal Planning Web App (Nourishly)

A meal‑planning web application built as part of the **OSU CS Capstone (CS 461–463)** sequence.

Nourishly uses a **React (Vite) web client** with **AWS Amplify services** providing backend infrastructure for authentication, data, and hosting.

---

## Team Members

* Che‑Han Hsu — [hsuche@oregonstate.edu](mailto:hsuche@oregonstate.edu)
* Lapatrada Liawpairoj — [liawpail@oregonstate.edu](mailto:liawpail@oregonstate.edu)
* Kyle Lund — [lundkyl@oregonstate.edu](mailto:lundkyl@oregonstate.edu)
* Xander Sniffen — [sniffenx@oregonstate.edu](mailto:sniffenx@oregonstate.edu)
* Louie Baobao — [baobaof@oregonstate.edu](mailto:baobaof@oregonstate.edu)

**Project Partner:** Alexander Ulbrich — [alexander.ulbrich@oregonstate.edu](mailto:alexander.ulbrich@oregonstate.edu)
**TA / Mentor:** Nischal Aryal — [aryaln@oregonstate.edu](mailto:aryaln@oregonstate.edu)

---

## Project Overview

Nourishly focuses on providing a structured workflow for:

* Meal planning and weekly organization
* Recipe and ingredient tracking
* Grocery list generation

The current codebase emphasizes **clean architecture, CI reliability, and developer workflow** while core features continue to be implemented incrementally.

---

## Live Deployment

The application is deployed via AWS Amplify:

https://main.d2hvbdc7xxhqmv.amplifyapp.com/

---

## Architecture & Tech Stack

### Frontend — React + Vite

* Located in `client/`
* Vite dev server with fast HMR
* UI components, routing, and user‑facing logic

### Backend Infrastructure — AWS Amplify

Backend services are provided through **AWS Amplify**, which manages authentication, data access, and deployment infrastructure for the application.

### Tooling

* **Node.js 20.x**
* **ESLint** (client)
* **GitHub Actions CI** (client dependency install, lint, and test checks)

---

## Getting Started

### Requirements

* Node.js 20.x
* Git
* (Recommended) VS Code with ESLint extension

### Clone the repository

```bash
git clone https://github.com/cs041-mealplanner/CS041-meal-planning-app.git
cd CS041-meal-planning-app
```

### Install dependencies

> **Note:** Plain `npm install` is intentionally **blocked** in this repository.
> Use `npm ci` for deterministic installs based on the committed lockfiles.

Frontend:

```bash
cd client
npm ci
cd ..
```

---

## Running the App

Start the development server from the repository root:

```bash
npm run dev:client
```

The Vite development server typically runs at:

```
http://localhost:5173
```

Backend functionality such as authentication and data access is handled through AWS Amplify services.

---

## Recipe Data Notes

Recipe browsing currently supports two sources:

* **Spoonacular API recipes** when a valid `VITE_SPOONACULAR_API_KEY` is available in the client environment
* **Manual recipes** created in the UI with the `Create Recipe` button

Important behavior to know:

* If the Spoonacular key is missing or the API request fails, the Recipes page falls back to showing manually created recipes only
* Manual recipes are stored locally in the browser through `localStorage`
* Manual recipes can include filter tags such as `Vegetarian`, `Vegan`, `High Protein`, and `Low Carb` so they participate in the same recipe filters as closely as possible

This keeps the app usable in environments where the Spoonacular client key is unavailable while the backend/API integration is still evolving.

---

## Linting & CI

Linting is enforced via GitHub Actions CI.  
Run locally from the repository root:

```bash
npm run lint
```

---

## UI / UX Designs

Design prototypes and wireframes are maintained in Figma:

[https://www.figma.com/design/AaskoDRw7IUEmEOyLcIDQa/Meal-Planner-Web-App](https://www.figma.com/design/AaskoDRw7IUEmEOyLcIDQa/Meal-Planner-Web-App)

Designer: **Lapatrada Liawpairoj (Mint)**

---

## License

MIT License © 2025 Team CS.041 — Oregon State University

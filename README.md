# 🍽️ CS.041 — Meal Planning Web App (Nourishly)

A meal‑planning web application built as part of the **OSU CS Capstone (CS 461–463)** sequence.

Nourishly uses a **React (Vite) web client** and an **Express API server** to support meal planning, recipes, and grocery‑list workflows.

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

### Backend — Node.js + Express

* Located in `server/`
* REST API endpoints and health checks

### Tooling

* **Node.js 22.x**
* **ESLint** (client)
* **GitHub Actions CI** (dependency install + lint; tests added as applicable)

---

## Getting Started

### Requirements

* Node.js 22.x
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

Backend:

```bash
cd server
npm ci
cd ..
```

---

## Running the App

You can run the client and server **from the repository root** using the provided npm scripts.

### Run both client and server (recommended)

```bash
npm run dev:all
```

### Run services individually

Client (React + Vite):

```bash
npm run dev:client
```

Server (Express API):

```bash
npm run dev:server
```

* Vite dev server typically runs at: `http://localhost:5173`
* Express exposes a health check at: `http://localhost:<PORT>/health`

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

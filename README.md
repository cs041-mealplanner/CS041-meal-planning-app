# 🍽️ CS.041 — Meal Planning Web App (Nourishly)


A meal planner web app with recipe management, grocery list generation, and weekly meal planning.
Built as part of the **OSU CS Capstone (CS 461–463)** sequence.

The project uses a **React (Vite) web client** and an **Express server**.

---

## Team Members
- Che-Han Hsu — hsuche@oregonstate.edu
- Lapatrada Liawpairoj — liawpail@oregonstate.edu
- Kyle Lund — lundkyl@oregonstate.edu
- Xander Sniffen — sniffenx@oregonstate.edu
- Louie Baobao — baobaof@oregonstate.edu

**Partner:** Alexander Ulbrich — alexander.ulbrich@oregonstate.edu  
**TA/Mentor:** Nischal Aryal — aryaln@oregonstate.edu

---

## Project Overview

Nourishly aims to provide an integrated workflow for meal planning, recipe management, and grocery list creation.

### Core Features (Planned)

- Create, edit, and delete meal plans
- Auto-generate grocery lists
- Recipe + ingredient tracking
- Weekly meal calendar
- Custom user preferences

---

## Architecture & Tech Stack

### Frontend — React + Vite

- Located in `client/`
- Fast dev server, HMR, ESBuild
- UI components, routing, and main user experience

### Backend — Node.js + Express

- Located in `server/`
- API endpoints, data processing, health checks

### Tooling

- Node.js 22.x
- ESLint (client)
- GitHub Actions CI (install + lint)

### Legacy Mobile App (Archived)

The original Expo/React Native implementation now lives in:

`legacy-RN-Expo/`

This folder is **preserved for reference only** and is not used by the current web version.

---

## UI / UX Designs

Wireframes and UI prototypes can be viewed on Figma:

**Figma:**  
https://www.figma.com/design/AaskoDRw7IUEmEOyLcIDQa/Meal-Planner-Web-App

Designer: **Lapatrada Liawpairoj (Mint)**  
_Last updated: Nov 2025_

---

## Getting Started

### Requirements

- Node.js 22.x
- Git
- (Optional) VS Code with ESLint extension

### Clone the repository

```
git clone https://github.com/cs041-mealplanner/CS041-meal-planning-app.git
cd CS041-meal-planning-app
```

---

## Installing Dependencies

### Install frontend dependencies

```
cd client
npm ci
cd ..
```

### Install backend dependencies

```
cd server
npm ci
cd ..
```

---

## Running the App

### Start the Express server

`npm run server`

### Start the React (Vite) client

`npm run client`

- Vite dev server typically runs at:
  http://localhost:5173
- Express server exposes health check at:
  http://localhost:PORT/health

---


## Linting

Currently, linting is configured for the **client**.

From the project root:

`npm run lint`

This runs ESLint inside `client/`.

---

## Legacy Expo App

The previous mobile-first implementation has been archived under:

`legacy-RN-Expo/`

It contains:

- Expo Router screens
- React Native components
- Assets + icons
- Jest / Expo test configs

These files are not used by the current stack but preserved for reference.

---

## License

MIT License © 2025 Team CS.041 — Oregon State University

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

📈 Tulip Tracker SPA

> A modern, lightweight Vue 3 single-page application to track team and project progress in Tulip (Jira-like system). Focused on visualizing epics, features, stories, and team delivery through burn-up charts.

---

## 🧭 Purpose

Give project leads and developers a clean, real-time interface to:

- Select Epics.
- Display all relatives Artifacts such as feature, story or task.
- Visualize delivery pace with a burn-up chart.
- Pilot projects without relying on cluttered dashboards or complex queries in Tulip.

---

## Development Commands

### Standard Development
- `npm run dev` - Start development server with real Tuleap API (requires VPN)
- `npm run build` - Type-check and build for production
- `npm run type-check` - Run TypeScript type checking with vue-tsc
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run preview` - Preview production build locally

### Local Development with Mock API (No VPN Required)
- `npm run mock:server` - Start Mockoon mock server only
- `npm run dev:mock` - Start development with mock Tuleap API
- `npm run mock:dev` - Start both mock server and dev server in parallel (recommended)

## 🛠 Tech Stack

| Layer            | Tool / Framework         |
| ---------------- | ------------------------ |
| Framework        | Vue 3 (Composition API)  |
| State Management | Pinia                    |
| UI Components    | Naive UI or Vuetify      |
| Charts           | Chart.js (`vue-chartjs`) |
| HTTP Client      | Axios                    |
| Routing          | Vue Router 4             |
| Build Tool       | Vite                     |
| Auth             | Token (localStorage)     |
| Deployment       | OpenShift (Docker)       |

## 🧪 Local Development Setup

### Using Mock API (No VPN Required)

For local development without needing VPN access to the real Tuleap instance:

1. **Quick Start**: `npm run mock:dev` - Starts both mock server and dev server
2. **Manual Setup**:
   - Copy `.env.example` to `.env` (optional)
   - Set `NUXT_PUBLIC_TULEAP_API_URL=http://localhost:3001/api` in `.env`
   - Run `npm run mock:server` in one terminal
   - Run `npm run dev` in another terminal

### Mock API Configuration

- **Mock server**: Runs on `http://localhost:3001`
- **Config file**: `mockoon/tuleap-api.json`
- **Sample data**: Uses real examples from `exemple/` directory
- **Endpoints**: All essential Tuleap API endpoints are mocked

### Environment Variables

- `NUXT_PUBLIC_TULEAP_API_URL` - API base URL (default: real Tuleap, set to `http://localhost:3001/api` for mock)

---

## 🔐 Authentication

- The user provides a Tulip API token manually (form input).
- Token is stored in `localStorage` and injected into all API requests.
- Future improvement: OAuth or SSO integration if Tulip supports it.

---

## 🧩 Core Features

### 1. 🔎 Filter & Select

- Select a **team** from the dropdown.
- Dynamically load **projects** associated with the team.
- Select one or more **epics** from those projects.

### 2. 📋 Feature/Story Explorer

- Hierarchical list view:
  - Epic > Feature > Story
- Status indicators (e.g., To Do, In Progress, Done).
- Collapsible nodes.

### 3. 📊 Burn-up Chart

- Cumulative view of story points or task counts over time.
- Ideal vs actual progress.
- Sprint/week-based aggregation.

---

## Key Directories

- `src/components/` - Reusable Vue components
- `src/views/` - Page-level components for routing
- `src/stores/` - Pinia store definitions
- `src/router/` - Vue Router configuration
- `src/assets/` - Static assets (CSS, images)

## Import Aliases

- `@/` maps to `src/` directory (configured in vite.config.ts)

## Code Style

- ESLint configured with Vue and TypeScript rules
- Prettier for code formatting
- Vue components use `<script setup lang="ts">` syntax

## Development Notes

- The project uses vue-tsc for TypeScript type checking instead of standard tsc
- Vite dev tools are enabled for debugging
- The build process runs type-check and build-only in parallel using npm-run-all2

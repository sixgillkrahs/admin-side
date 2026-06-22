# Stack Research

**Domain:** Dashboard & RBAC Admin Control Panel
**Researched:** 2026-06-22
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 19.2 | Frontend UI | High-performance, declarative, component-driven UI library. |
| Vite | 8.0 | Bundler & Dev Server | Fast, modern build tool with native ES module support and instant HMR. |
| TypeScript | 6.0 | Language | Type safety, enhanced editor auto-complete, and self-documenting code. |
| Tailwind CSS | v4.3 | Styling | CSS-first config, high performance, and rapid UI development using utility classes. |
| Shadcn UI | 4.11 | UI Component Preset | Highly accessible, customizable, and clean Radix-based design system components. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| TanStack Router | v1.x | Routing | Use for type-safe, declarative page routing with automatic type-checking of search parameters (perfect for dashboard filters). |
| TanStack Query | v5.x | Server State | Use for fetching, caching, synchronizing, and updating server state (RBAC lists, dashboard overview stats). |
| Recharts | v2.x | Charting | Use for declarative React-based charts (Area, Bar, Line charts) for dashboard KPIs. |
| Zustand | v5.x | Client State | Use for lightweight, hook-based client-side state management (current user, active theme, sidebar state). |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint | Code Linting | Enforces coding style and prevents runtime bugs. Configured in `eslint.config.js`. |
| `@tailwindcss/vite` | Tailwind compiler | Integrates Tailwind CSS v4 compilation directly in Vite bundler. |

## Installation

```bash
# Routing and State
npm install @tanstack/react-router @tanstack/react-query zustand

# Charting
npm install recharts

# Dev dependencies
npm install -D @tanstack/router-vite-plugin
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| TanStack Router | React Router v7 | Use React Router if migrating a legacy project or if file-system routing isn't preferred. |
| Recharts | Chart.js / Chart.js React | Use Chart.js if you need simple, classic canvas-based rendering with minimal setup. |
| Zustand | React Context | Use raw React Context if state is very simple and doesn't update frequently. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Redux / Redux Toolkit | Overkill for simple dashboard and client state, too much boilerplate. | Zustand |
| Raw fetch state | Requires manual caching, loading states, retry logic, and causes code duplication. | TanStack Query |
| Legacy D3 (direct DOM manipulation) | Conflicts with React's virtual DOM rendering process. | Recharts |

## Stack Patterns by Variant

**If building real-time dashboard updates:**
- Use WebSockets or Server-Sent Events (SSE).
- Because Dashboard statistics need to react to platform changes immediately.

**If dealing with large RBAC datasets:**
- Use server-side pagination, sorting, and filtering via TanStack Query.
- Because client-side filtering on thousands of users degrades performance.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| React@19.2 | Recharts@2.12+ | Ensure Recharts is React 19 compatible to avoid legacy deprecation errors. |
| React@19.2 | TanStack Router@1.x | Fully supported. |

## Sources

- [TanStack Docs](https://tanstack.com/) — Routing and query patterns.
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs/v4-beta) — CSS-first theme configuration.
- [Shadcn UI Docs](https://ui.shadcn.com/) — Radix primitives layout.

---
*Stack research for: Dashboard & RBAC Admin Control Panel*
*Researched: 2026-06-22*

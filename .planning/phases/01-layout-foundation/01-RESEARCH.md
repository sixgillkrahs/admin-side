# Phase 1: layout-foundation - Research

**Researched:** 2026-06-22
**Domain:** React 19 + Vite 8 + Tailwind CSS v4 + Shadcn UI Admin Shell and Folder Structure
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Implement a feature-based folder structure inside `src/features/` for modular separation of dashboard and rbac features.
- **D-02:** Establish `src/components/common/` for shared, non-feature-specific UI components (e.g. layouts, Sidebar, Header).
- **D-03:** Build a Sidebar navigation component `src/components/common/Sidebar.tsx` to handle navigation between Dashboard and RBAC modules.
- **D-04:** Wire the Sidebar layout into the root application component to serve as the unified admin application shell.

### the agent's Discretion
- Layout styling detail conforming to the dark-mode/premium Shadcn UI aesthetics.
- Visual micro-animations, icons selection, responsive sidebar toggle behavior.

### Deferred Ideas (OUT OF SCOPE)
- DASH-01 KPIs and dashboard widgets (deferred to Phase 3)
- RBAC management screens, user lists, and modal forms (deferred to Phase 2)

</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

Single-tier application — all capabilities reside in Browser/Client.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Folder modularization | Browser/Client | — | Feature-based folders to organize source code. |
| Sidebar Navigation | Browser/Client | — | Client-side navigation trigger between routes/screens. |
| App Shell Layout | Browser/Client | — | Client-side shell wrapper managing responsiveness and UI theme. |

</architectural_responsibility_map>

<research_summary>
## Summary

This research outlines the best practices for setting up a modern, scalable, and premium admin panel using React 19, Tailwind CSS v4, and a modular feature-based architecture. 

The primary recommendation is to enforce strict boundaries around `src/features/[feature-name]` directories, utilizing public-facing `index.ts` files to prevent deep-import spaghetti. For styling, we utilize Tailwind v4's CSS-first theme configuration to prevent compile-time border and color resolution errors.

**Primary recommendation:** Define features modularly in `src/features/` and build a responsive, glassy-morph layout shell in `src/components/common/` using CSS variables to handle dark mode seamlessly.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | ^19.2.6 | Component logic | Standard frontend library |
| tailwindcss | ^4.3.1 | Utility-first styling | CSS-first configuration, fast compile |
| @tailwindcss/vite| ^4.3.1 | Vite support for Tailwind v4 | Official Vite plugin integrating compiler |
| lucide-react | ^1.21.0 | Visual icons | Clean, modern vector icons for nav |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | ^2.1.1 | Class merging | Dynamic className creation |
| tailwind-merge | ^3.6.0 | CSS class override resolution | Resolving conflicting Tailwind classes |

**Installation:**
All core and supporting packages are already installed in `package.json`. No additional npm packages are required for this phase.
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### System Architecture Diagram
```
+-------------------------------------------------------------+
| App Shell (src/App.tsx)                                     |
|                                                             |
|  +-----------------------+  +----------------------------+  |
|  | Sidebar Navigation    |  | Main Content Area          |  |
|  |                       |  |                            |  |
|  | - Dashboard Link      |  | - Renders Active Feature   |  |
|  | - RBAC Link           |  | - Responsive Grid Container|  |
|  |                       |  |                            |  |
|  +-----------|-----------+  +-------------|--------------+  |
|              |                            |                 |
|              v (State update)             v                 |
|      [Active Tab State]  ======>  [Conditional Component]   |
|                                           |                 |
|                                           v                 |
|                            +------------------------------+ |
|                            | src/features/                | |
|                            |  ├── dashboard/components/   | |
|                            |  └── rbac/components/        | |
|                            +------------------------------+ |
+-------------------------------------------------------------+
```

### Recommended Project Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx         # Top application bar
│   │   ├── Sidebar.tsx        # Navigation menu
│   │   └── Layout.tsx         # General page shell wrapper
│   └── ui/                    # Shadcn UI primitives (button.tsx)
├── features/
│   ├── dashboard/
│   │   ├── components/        # Feature-specific UI
│   │   └── index.ts           # Public API entry point
│   └── rbac/
│       ├── components/        # Feature-specific UI
│       └── index.ts           # Public API entry point
```

### Pattern 1: Feature public API exports
**What:** Each feature directory should expose a single `index.ts` file acting as the gateway. Other parts of the app should never import directly from feature internals.
**When to use:** Organizing all code under `src/features/`.
**Example:**
```typescript
// src/features/dashboard/index.ts
export { DashboardOverview } from './components/DashboardOverview';
```

### Anti-Patterns to Avoid
- **Deep Feature Imports:** Importing directly via `import x from '@/features/rbac/components/subfolder/component'` bypassing `index.ts`. This breaks encapsulation and makes refactoring difficult.
- **Direct Style Hardcoding:** Writing raw hex color values or non-tokenized CSS. Use CSS variables defined in `index.css` via Tailwind v4 to ensure theme consistency.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Class merging | Manual template strings with regex replacement | `cn` utility in `src/lib/utils.ts` | Prevents duplicate padding, colors, and layout classes. |
| Icons | Custom SVGs or image assets | `lucide-react` | Unified styling, scaling, and easy maintainability. |

</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Tailwind v4 Theme Sync
**What goes wrong:** Build failures or layout issues due to missing tailwind variables (like `border-border` resolving to transparent or failing compilation).
**Why it happens:** Tailwind v4 moves theme definition out of JS configuration and into `src/index.css` `@theme`.
**How to avoid:** Define custom mapping (e.g. `--color-border: var(--border)`) directly inside the `@theme` block in `src/index.css`. This is already configured in this workspace.

### Pitfall 2: Feature-to-Feature Tight Coupling
**What goes wrong:** Import loops where Feature A imports from Feature B, and Feature B imports from Feature A.
**Why it happens:** Missing separation of concerns or shared utilities placed inside features.
**How to avoid:** Shared assets must reside in `src/components/common`, `src/hooks/`, or `src/lib/`. Feature modules should only contain feature-specific code.
</common_pitfalls>

<code_examples>
## Code Examples

### Standard Responsive Layout Wrapper
```typescript
// src/components/common/Layout.tsx
import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Container */}
      <div className="flex flex-1 flex-col md:pl-64">
        <Header />
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` | `@theme` CSS declarations | Tailwind v4 | Styles are parsed directly by the CSS engine, reducing JS overhead and build time. |
| Nested component sheets | feature-based folder layout | Modern React | Better modularity, easier code ownership. |

</sota_updates>

<open_questions>
## Open Questions

None. The path forward for folder initialization and responsive design is fully resolved.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- Official Tailwind CSS v4 docs — theme configuration and Vite plugin
- Shadcn UI documentation — layout guidelines and Tailwind v4 theme settings

</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: React 19, Tailwind CSS v4
- Ecosystem: Lucide React, Shadcn UI
- Patterns: Feature-based architecture, Admin layouts

**Confidence breakdown:**
- Standard stack: HIGH — using standard official templates
- Architecture: HIGH — modular feature-based style
- Pitfalls: HIGH — Tailwind v4 configuration verified

**Research date:** 2026-06-22
**Valid until:** 2026-07-22
</metadata>

---

*Phase: 01-layout-foundation*
*Research completed: 2026-06-22*
*Ready for planning: yes*

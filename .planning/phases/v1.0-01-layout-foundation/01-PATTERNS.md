# Phase 1: layout-foundation - Pattern Map

**Generated:** 2026-06-22
**Domain:** Shared layout and features skeleton structure

## File-to-Pattern Mapping

| File Path | Role | Data Flow | Closest Analog | Pattern / Convention |
|---|---|---|---|---|
| `src/components/common/Sidebar.tsx` | Layout Navigation | Active Tab state -> Parent | `src/components/ui/button.tsx` | Functional React component using `cn()` class merger and `lucide-react` icons. |
| `src/components/common/Header.tsx` | Layout Shell | Static presentation | `src/components/ui/button.tsx` | Functional component presenting current page title and controls. |
| `src/components/common/Layout.tsx` | Layout Shell Wrapper | Children rendering | `src/App.tsx` | Layout structure wrapping children with Sidebar and Header. |
| `src/features/dashboard/index.ts` | Feature Entry | Public API exports | — | Clean exports mapping feature UI components. |
| `src/features/rbac/index.ts` | Feature Entry | Public API exports | — | Clean exports mapping feature UI components. |

## Code Excerpts & Analogs

### Pattern 1: Component Definition & Class Merging
Uses `cn()` from `@/lib/utils` to merge styles dynamically, mimicking `button.tsx` styling approach:
```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

export function SidebarItem({ className, active, children, ...props }: ComponentProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer text-sm font-medium",
        active 
          ? "bg-secondary text-secondary-foreground" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

### Pattern 2: Encapsulated Feature Exports (index.ts)
Every modular feature exposes only its public entrypoint to prevent direct deep imports:
```typescript
// src/features/[feature]/index.ts
export { FeatureContainer as FeatureName } from './components/FeatureContainer';
```

## Anti-Patterns Avoided

- **Deep imports:** importing internally from `src/features/rbac/components/UserTable.tsx` instead of `src/features/rbac/index.ts`. All external usage of features goes through the entry index file.
- **Styling Hardcoding:** Hardcoding background colors like `bg-[#0f172a]`. We strictly use Tailwind v4 theme variables such as `bg-background` and `text-foreground`.

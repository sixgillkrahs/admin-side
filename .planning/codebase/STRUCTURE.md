# Codebase Structure

**Analysis Date:** 2026-06-22

## Directory Layout

```text
admin-side/
├── .agents/            # GSD Core agent instructions and settings
├── .planning/          # Project planning and codebase documentation
├── public/             # Public static assets
├── src/                # Application source code
│   ├── assets/         # Static assets (images, fonts, svgs)
│   ├── components/     # React components
│   │   └── ui/         # Shadcn UI reusable components (button.tsx, etc.)
│   ├── lib/            # Shared utilities and helpers
│   │   └── utils.ts    # Class-merging and styling helpers
│   ├── App.css         # Global default stylesheet (boilerplate)
│   ├── App.tsx         # Root component
│   ├── index.css       # Tailwind CSS v4 entrypoint & base style rules
│   ├── main.tsx        # Application entrypoint (react dom render)
│   └── vite-env.d.ts   # Vite TS environment types
├── eslint.config.js    # ESLint configuration
├── index.html          # HTML template
├── package.json        # Project metadata and dependencies
├── tsconfig.json       # Root TypeScript configuration
├── tsconfig.app.json   # TypeScript application configuration
├── tsconfig.node.json  # TypeScript Node environment configuration (Vite config)
└── vite.config.ts      # Vite build and plugin configurations
```

## Directory Purposes

**src/:**
- Purpose: Application source code.
- Contains: React components, styling files, entry points, TS files.
- Key files: `main.tsx`, `App.tsx`, `index.css`.

**src/components/ui/:**
- Purpose: UI components wrapper layer. Contains visual design system components.
- Contains: Reusable Shadcn UI React components.
- Key files: `button.tsx`.

**src/lib/:**
- Purpose: Common client-side utility functions.
- Contains: TypeScript helper modules.
- Key files: `utils.ts`.

**.planning/:**
- Purpose: Spec-driven project planning files.
- Subdirectories: `codebase/` containing codebase mapping documents.

## Key File Locations

**Entry Points:**
- `src/main.tsx`: Renders the React DOM element.
- `index.html`: Webpage template.

**Configuration:**
- `vite.config.ts`: Vite build environment and Tailwind plugins setup.
- `package.json`: Target packages and versions.
- `tsconfig.json` & `tsconfig.app.json`: TypeScript configurations.
- `eslint.config.js`: Coding lint rules.

**Core Logic & UI:**
- `src/App.tsx`: Root component organizing layouts.
- `src/components/ui/button.tsx`: UI primitives.

## Naming Conventions

**Files:**
- PascalCase for React components (e.g. `Button.tsx`, `App.tsx`).
- camelCase or kebab-case for utility files (e.g. `utils.ts`).

**Directories:**
- kebab-case for folders (e.g. `admin-side`, `ui`).

## Where to Add New Code

**New UI Component:**
- Implementation: `src/components/` or `src/components/ui/`.

**New Business Module/Helper:**
- Implementation: `src/lib/`.
- Types: Defined locally or inside a dedicated `src/types/` folder (to be created when needed).

**New Style rules:**
- Configuration: Add in `@theme` block or custom classes in `src/index.css`.

---

*Structure analysis: 2026-06-22*
*Update when adding routing or global store layers*

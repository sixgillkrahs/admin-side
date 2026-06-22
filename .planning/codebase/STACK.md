# Technology Stack

**Analysis Date:** 2026-06-22

## Languages

**Primary:**
- TypeScript 6.0 - All application code and type definitions.

**Secondary:**
- JavaScript - Configuration files (e.g., `eslint.config.js`).

## Runtime

**Environment:**
- Node.js 20.x or higher (Development environment).
- Modern web browsers supporting ES modules (Production environment).

**Package Manager:**
- npm 10.x
- Lockfile: `package-lock.json` present.

## Frameworks

**Core:**
- React 19.2 - UI library for component-driven views.
- Vite 8.0 - Dev server and bundler.

**UI & Styling:**
- Tailwind CSS v4.3 - Styling engine integrated via `@tailwindcss/vite` plugin.
- Radix UI - Headless primitive components used by Shadcn UI.
- Shadcn UI - Accessible UI components preset (using `radix-nova` style).

**Testing:**
- None configured yet.

**Build/Dev:**
- TypeScript Compiler (~6.0.2)
- ESLint (10.3) for linting.

## Key Dependencies

**Critical:**
- `react` / `react-dom` (^19.2) - Core application UI.
- `shadcn` (^4.11) - Component CLI and style presets.
- `lucide-react` (^1.21) - Icons.
- `class-variance-authority` (^0.7) - Utility to manage component variants.
- `tailwind-merge` (^3.6) & `clsx` (^2.1) - Classes merging utility.
- `tw-animate-css` (^1.4) - Animations preset.

## Configuration

**Environment:**
- Configured via standard Vite environment variables (e.g. `.env` files).

**Build:**
- `tsconfig.json` & `tsconfig.app.json` - TypeScript compilation options.
- `vite.config.ts` - Vite bundler settings and alias resolution.

## Platform Requirements

**Development:**
- macOS, Linux, or Windows (tested on Windows).
- Node.js installed.

**Production:**
- Can be built into static assets (HTML/CSS/JS) and hosted on any static hosting provider (e.g., Vercel, Netlify, AWS S3, Nginx).

---

*Stack analysis: 2026-06-22*
*Update after major dependency changes*

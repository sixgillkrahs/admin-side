---
phase: "07"
name: "login-layout-branding-visuals"
created: 2026-06-23
---

# Phase 7: login-layout-branding-visuals — Context

## Decisions

### Layout & Design
- Split-screen layout (50% left side branding, 50% right side login form card).
- Left-side branding uses an abstract CSS gradient panel with glassmorphism styling and the portal title: "Business Chat Admin Portal".
- Right-side features the login card, centered vertically and horizontally.

### i18n Switcher
- Placed in the top-right corner of the login form panel.
- Fully supports toggling between English (en) and Vietnamese (vi) for all texts, labels, and placeholders.

### Component Primitives
- UI components use Shadcn UI (Card, Input, Button, Label).
- Styled using Tailwind CSS v4 styling classes.

### Discretion Areas
- Exact color gradient choices and micro-animations for the branding panel.
- Precise layout responsive collapse on mobile (e.g., hiding the left-side branding panel on mobile screens, displaying only the login form card).

## Deferred Ideas

- Remember Me session persistence across refreshes (deferred to v2).
- MFA Verification modal/screen (deferred to v2).
- Forgot Password request UI flow (deferred to v2).

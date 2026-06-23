# Phase 1 — UI Design Contract

> Visual and interaction contract for the interactive Recharts widgets.

---

## Spacing & Layout

| Property | Value | Usage |
|----------|-------|-------|
| Layout Grid | `grid grid-cols-1 lg:grid-cols-2 gap-6` | Side-by-side display of line and bar graphs |
| Chart Height | `300px` | Explicit height for canvas containers |
| Margin | `mt-8` | Separation from the KPI overview cards |

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Section Heading | 18px | semibold | 1.4 |
| Chart Legend | 12px | regular | 1.4 |
| Tooltip Label | 12px | semibold | 1.2 |

---

## Color Mapping

Charts utilize oklch token approximations:

| Element | Color | Utility Value |
|---------|-------|---------------|
| Line stroke | Primary | `var(--primary)` |
| Bar fill | Accent Blue | `oklch(0.623 0.214 259.815)` |
| Grid lines | Border | `var(--border)` |
| Tooltip bg | Card | `var(--card)` |

---

## Copywriting & Translations

| Element | English | Vietnamese |
|---------|---------|------------|
| Chart 1 Title | API Request Volume | Lưu lượng Yêu cầu API |
| Chart 1 Subtext | Requests over the last 7 days | Số yêu cầu trong 7 ngày qua |
| Chart 2 Title | Hourly Sessions | Phiên làm việc theo giờ |
| Chart 2 Subtext | Sessions recorded per hour | Số phiên được ghi nhận theo giờ |
| X-Axis (Days) | Mon, Tue, Wed, Thu, Fri, Sat, Sun | T2, T3, T4, T5, T6, T7, CN |
| Metric Label | Requests | Yêu cầu |
| Session Label | Sessions | Phiên |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-06-23

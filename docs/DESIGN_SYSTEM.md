# Design System: Jothidam Tamil

## 01 Brand identity

- Personality: traditional, trustworthy, spiritual
- Tone in UI copy: respectful, plain Tamil and English labels, no exclamation marks
- Feel: dark cosmic theme — deep indigo/purple background, gold accents for auspicious elements
- Tamil script used for section headings and labels where appropriate

---

## 02 Color palette

| Token | Value | Use |
| --- | --- | --- |
| --color-bg | #0f0a1e | Page background |
| --color-surface | #1a1035 | Cards, panels |
| --color-surface-alt | #231545 | Table headers, alt rows |
| --color-border | #3d2d6e | Dividers, input borders |
| --color-text | #f0e6ff | Headings, primary text |
| --color-text-muted | #9d8ec4 | Labels, secondary text |
| --color-text-body | #d4c5f0 | Table cell text |
| --color-primary | #c084fc | Buttons, active nav, badges |
| --color-primary-hover | #a855f7 | Hover on primary |
| --color-gold | #f59e0b | Auspicious timings, Nalla Neram, match score |
| --color-gold-bg | #1c1505 | Gold badge background |
| --color-success | #34d399 | Match / porutham pass |
| --color-success-bg | #052015 | Match badge background |
| --color-danger | #f87171 | No-match / Dosham / Rahu Kalam |
| --color-danger-bg | #1f0505 | Danger badge background |
| --color-sidebar | #0a0618 | Sidebar background |
| --color-sidebar-hover | #1a1035 | Sidebar item hover/active |
| --color-sidebar-accent | #c084fc | Active nav left border |
| --color-sidebar-text | #e9d5ff | Active nav text |

---

## 03 Typography

Fonts: `Segoe UI` for English, `Noto Sans Tamil` (Google Fonts) for Tamil script.

| Role | Size | Weight |
| --- | --- | --- |
| Page heading (h2) | 1.5rem | 700 |
| Section heading (h3) | 1.05rem | 600 |
| Body / table cell | 0.9rem | 400 |
| Label | 0.82rem | 600 |
| Small / muted | 0.78rem | 400 |
| Stat / score value | 1.8rem | 700 |
| Numerology number | 2.2rem | 700 |

---

## 04 Spacing

Base unit 4px. Use multiples: 4, 8, 12, 16, 20, 24, 28, 32.

- Card padding: 24px
- Page padding: 32px
- Form row gap: 14px bottom margin
- Table cell padding: 10px 14px
- Button padding: 10px 20px

---

## 05 Border radius and shadows

| Element | Radius | Shadow |
| --- | --- | --- |
| Cards | 12px | 0 2px 12px rgba(0,0,0,.4) |
| Buttons | 8px | none |
| Inputs | 8px | none |
| Modals | 14px | 0 8px 32px rgba(0,0,0,.6) |
| Badges | 12px | none |
| Rasi chart cells | 0px | none |
| Porutham cards | 10px | none |

---

## 06 Components

Buttons

| Class | Background | Text | Use |
| --- | --- | --- | --- |
| btn-primary | #c084fc | #0f0a1e | Main action per section |
| btn-secondary | #231545 | #d4c5f0 | Supporting actions |
| btn-outline | transparent + #c084fc border | #c084fc | Low-emphasis |
| btn-gold | #f59e0b | #0f0a1e | Generate / auspicious actions |
| btn-danger | #2d0a0a | #f87171 | Delete / remove |
| btn-pdf | #7c3aed | white | Export PDF |

Badges
- Match (Porutham pass): background #052015, text #34d399, border #0a4a30
- No-match (Porutham fail): background #1f0505, text #f87171, border #4a0a0a
- Partial: background #1c1505, text #f59e0b, border #4a3000
- Rahu Kalam: danger colors
- Nalla Neram: success/gold colors

Rasi chart:
- 4×4 grid, center 2×2 cells blank (label area)
- Cell background: --color-surface
- Planet text: --color-primary, bold
- House number: --color-text-muted, small, top-left corner

Porutham cards:
- Grid of 10 cards, each showing porutham name, result emoji, and match/no-match/partial class
- Match score shown as large number above the grid

Panchangam cards:
- One card per timing slot
- Rahu Kalam card uses danger border
- Nalla Neram card uses success border

Inputs: height ~38px, border --color-border, focus border --color-primary, radius 8px, padding 9px 12px.

Modals: --color-surface background, radius 14px, max-width 480px (wide: 640px), overlay rgba(0,0,0,.7). Close on overlay click.

Tables: header background --color-surface-alt, uppercase labels 0.78rem --color-text-muted. Row hover --color-surface-alt.

Toast: fixed bottom-right, --color-surface background. Success: --color-success. Error: --color-danger. Auto-dismiss 3s.

---

## 07 Responsive

Desktop-first (Electron window min 960px wide). Sidebar collapses to 60px icon-only below 768px.

---

## 08 Motion

Transitions: 0.2s on buttons, nav items, badges. No page transition animations.

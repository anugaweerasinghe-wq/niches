

# Elite Obsidian Terminal — Logo Integration & Branding Overhaul

## Overview
Integrate the uploaded "N-Pulse" logo as the primary brand asset (header + favicon), replace the loading spinner with the branded logo, and apply the full Obsidian Terminal theme system (#050505 background, #00FF9D Cyber-Emerald accents).

---

## 1. Logo Asset Integration

**Copy the uploaded image into the project twice:**
- `public/images/logo.png` — for favicon and HTML meta references
- `src/assets/logo.png` — for React component imports (better bundling)

**Favicon update** in `index.html`:
- Replace the current `favicon.ico` reference with the new logo
- Update the Organization schema `logo` field to point to `/images/logo.png`

---

## 2. Header Refactor (`src/components/Logo.tsx`)

Replace the current SVG + "NichePulse" text with:
- The N-Pulse logo image (h-8, w-auto) wrapped in a container with `mix-blend-mode: screen` and `filter: brightness(1.1)` to dissolve the black background into the #050505 site background
- Text "NichePulse" in Inter Tight, font-bold, tracking-tight
- Flex container with `items-center gap-2.5`
- Keep the existing framer-motion entrance animation

---

## 3. Branded Loading State (`src/components/LoadingState.tsx`)

Replace the generic glowing circle spinner (lines 54-63) with:
- The N-Pulse logo image (w-16, h-16) with `mix-blend-mode: screen`
- Custom breathing animation: `animate={{ scale: [1, 1.05, 1] }}` with `transition={{ duration: 2, repeat: Infinity }}`
- Cyber-Emerald outer glow via `box-shadow: 0 0 40px hsl(157 100% 49% / 0.3)`
- Keep the pulse rings around it (they auto-inherit `--primary` color)

---

## 4. Obsidian Terminal Theme (`src/index.css`)

### Dark theme (`.dark` block) — full variable replacement:
| Variable | Current | New (Obsidian) |
|----------|---------|----------------|
| `--background` | `0 0% 2%` | `0 0% 2%` (keep ~#050505) |
| `--foreground` | `0 0% 98%` | `0 0% 95%` |
| `--card` | `0 0% 6%` | `0 0% 10%` (~#1A1A1A) |
| `--primary` | `215 100% 60%` | `157 100% 49%` (#00FF9D) |
| `--accent` | `215 100% 55%` | `157 100% 49%` |
| `--ring` | `215 100% 60%` | `157 100% 49%` |
| `--border` | `0 0% 14%` | `157 20% 12%` (emerald-tinted) |
| `--input` | `0 0% 14%` | `157 15% 12%` |
| `--glow-primary` | `215 100% 60%` | `157 100% 49%` |
| `--glow-secondary` | `270 100% 60%` | `170 100% 40%` |
| `--glass-border` | `0 0% 100% / 0.08` | `157 100% 49% / 0.10` |
| `--text-gradient-start` | `0 0% 70%` | `157 60% 60%` |
| `--text-gradient-end` | `0 0% 100%` | `0 0% 98%` |

### Light theme (`:root` block):
| Variable | New |
|----------|-----|
| `--primary` | `157 100% 35%` (darker emerald for contrast on white) |
| `--accent` | `157 100% 35%` |
| `--ring` | `157 100% 35%` |
| `--glow-primary` | `157 100% 35%` |

### New utility classes:
- `.micro-glow` — `border: 0.5px solid hsl(157 100% 49% / 0.15); box-shadow: 0 0 12px hsl(157 100% 49% / 0.06);`
- `::selection` — update to emerald tint

### Font import:
- Add `Inter+Tight:wght@400;500;600;700;800` to the Google Fonts import URL

---

## 5. Animated Background (`src/components/AnimatedBackground.tsx`)

Replace the 3 large framer-motion gradient orbs with:
- 12 small CSS-only emerald dots (2-4px) using `absolute` positioning with staggered `float` animations (15-40s durations)
- GPU-accelerated CSS transforms only (no JS computation, <5% CPU)
- Keep the subtle grid overlay, tint it emerald
- Each dot: `bg-[#00FF9D]` with varying opacity (0.1-0.3) and blur (1-3px)

---

## 6. Micro-Glow Borders on Key Components

Apply `border border-[hsl(157_100%_49%/0.08)]` (emerald micro-glow) to:
- **Header** (`Index.tsx` line 81): Add micro-glow to bottom border
- **SearchInput.tsx** glow effect: Change gradient from blue/purple to emerald
- **PlatformCard.tsx**, **StyleCard.tsx**: These use `--primary` via CSS vars, so they auto-update
- **Footer.tsx** FAQ cards: Auto-update via `--border` variable

---

## 7. `tailwind.config.ts` Updates

- Add `'Inter Tight'` before `'Inter'` in the `fontFamily.sans` array
- Add `particle-float` keyframe for background dots
- Existing color mappings reference CSS variables, so they auto-propagate

---

## 8. Google Verification Tag (`index.html`)

- Add: `<meta name="google-site-verification" content="srN6VtadGTwoTU5FUVYRLP8X1n8zCjTX872UROAm3wM" />`
- Keep existing verification tag on line 10

---

## Files Modified

| File | Type of Change |
|------|---------------|
| `public/images/logo.png` | New — copied from upload |
| `src/assets/logo.png` | New — copied from upload |
| `index.html` | Favicon update + Google verification tag |
| `src/components/Logo.tsx` | Replace SVG with logo image + text |
| `src/components/LoadingState.tsx` | Replace spinner with branded logo |
| `src/index.css` | Full Obsidian theme variables + Inter Tight font + micro-glow utility |
| `tailwind.config.ts` | Inter Tight font stack |
| `src/components/AnimatedBackground.tsx` | Replace orbs with emerald particle dots |
| `src/components/SearchInput.tsx` | Glow gradient color update (blue to emerald) |

**Not modified**: Edge functions, hooks, search logic, API calls, routing, DOM structure.


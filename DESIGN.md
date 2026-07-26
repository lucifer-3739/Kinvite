---
name: Kinvite
description: Sleek tech-forward SaaS invitation builder and RSVP workspace.
colors:
  primary: "#f59e0b"
  primary-hover: "#d97706"
  neutral-bg: "#0a0a0a"
  border: "rgba(255, 255, 255, 0.1)"
typography:
  display:
    fontFamily: "Outfit, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.05
  body:
    fontFamily: "var(--font-sans), sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.6
rounded:
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  3xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#000000"
    rounded: "{rounded.xl}"
    padding: "12px 24px"
  card:
    backgroundColor: "rgba(23, 23, 23, 0.6)"
    borderColor: "{colors.border}"
    rounded: "{rounded.2xl}"
    padding: "24px"
---

# Design System: Kinvite

## Overview

**Creative North Star: "Sleek Modern SaaS Workspace"**

Kinvite's design language combines modern SaaS visual aesthetic constraints with premium high-contrast layouts. It features a dark mode default scheme, geometric display typography, transparent glassmorphic containers, and glowing ambient background highlights. The goal is to make digital invitation management feel sophisticated, lightweight, and interactive.

**Key Characteristics:**
* **Dark Mode Primacy**: Neutral dark backdrops with high-contrast text elements.
* **Geometric Displays**: Outfit typography for display headings, utilizing bold sizes and solid colors.
* **Micro-interactive Previews**: Key features contain fully functional mock sandboxes on the page rather than static screenshots.

## Colors

The color palette is restrained to deep, neutral background layers highlighted by single, vibrant primary accents that can shift dynamically.

### Primary
* **Golden Amber** (`#f59e0b`): The default high-contrast brand color used for primary buttons, highlights, and active elements.

### Neutral
* **Charcoal Pitch** (`#0a0a0a` / `#09090b`): The dark background ground theme.
* **Slate Zinc** (`#71717a` / `#a1a1aa`): Used for secondary captions and placeholder inputs.
* **Pure Light** (`#ffffff`): Reserved for high-contrast heading text and primary elements.

### Named Rules
**The Rarity Rule.** Accent colors are applied strictly to interactive controls (buttons, active status tags, selectors) to preserve visual hierarchy. Whole-section backdrops remain monochromatic or neutral.

## Typography

**Display Font:** Outfit
**Body Font:** Geist / Noto Sans

### Hierarchy
* **Display** (Extra Bold, `clamp(2rem, 5vw, 3.75rem)`, 1.05): Used for main hero statements.
* **Headline** (Bold, `1.5rem` / `2rem`, 1.2): Used for sections headings.
* **Title** (Bold, `1.125rem`, 1.4): Used for card titles.
* **Body** (Medium, `14px`, 1.6): Default reading content.
* **Label** (Extra Bold, `10px`, case: uppercase, letter-spacing: 0.05em): Used for badges and status tags.

## Layout

* **Grid**: 12-column layout on desktops with a maximum width of `1140px`. Single-column stacking on mobile viewports.
* **Spacing**: Rhythm is based on multiples of `8px` (`8px` small, `16px` medium, `24px` large, `48px` page sections).

## Elevation & Depth

No physical elevations or heavy drop shadows. Depth is created purely using transparent glass layers, thin semi-transparent border lines (`rgba(255, 255, 255, 0.1)`), and dynamic backdrop blurs (`backdrop-filter: blur(12px)`).

## Shapes

* **Corner Radii**: Cards and main interactive panels use `16px` (`rounded-2xl`). Buttons and input fields use `12px` (`rounded-xl`). Heavy banners use `24px` (`rounded-3xl`).
* **Forms**: Flat input boundaries that glow with an outline border when focused.

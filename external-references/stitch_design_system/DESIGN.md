---
name: Architectural High-Tech
colors:
  surface: '#0c1324'
  surface-dim: '#0c1324'
  surface-bright: '#33394c'
  surface-container-lowest: '#070d1f'
  surface-container-low: '#151b2d'
  surface-container: '#191f31'
  surface-container-high: '#23293c'
  surface-container-highest: '#2e3447'
  on-surface: '#dce1fb'
  on-surface-variant: '#bbc9cd'
  inverse-surface: '#dce1fb'
  inverse-on-surface: '#2a3043'
  outline: '#859397'
  outline-variant: '#3c494c'
  surface-tint: '#2fd9f4'
  primary: '#8aebff'
  on-primary: '#00363e'
  primary-container: '#22d3ee'
  on-primary-container: '#005763'
  inverse-primary: '#006877'
  secondary: '#ffb59e'
  on-secondary: '#5d1800'
  secondary-container: '#d34000'
  on-secondary-container: '#fffbff'
  tertiary: '#7af3c2'
  on-tertiary: '#003827'
  tertiary-container: '#5cd6a7'
  on-tertiary-container: '#005a40'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a2eeff'
  primary-fixed-dim: '#2fd9f4'
  on-primary-fixed: '#001f25'
  on-primary-fixed-variant: '#004e5a'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59e'
  on-secondary-fixed: '#3a0b00'
  on-secondary-fixed-variant: '#842500'
  tertiary-fixed: '#80f9c8'
  tertiary-fixed-dim: '#62dcad'
  on-tertiary-fixed: '#002115'
  on-tertiary-fixed-variant: '#00513a'
  background: '#0c1324'
  on-background: '#dce1fb'
  surface-variant: '#2e3447'
  surface-navy: '#020617'
  surface-panel: '#0F172A'
  vibrant-cyan: '#22D3EE'
  blueprint-gray: '#94A3B8'
  luminous-glow: rgba(34, 211, 238, 0.4)
  text-high-contrast: '#F8FAFC'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  grid-unit: 40px
---

## Brand & Style

The design system is a high-performance visual framework inspired by CAD environments, schematic blueprints, and futuristic command interfaces. It is engineered for a target audience of architects, developers, and technical specialists who require extreme clarity and a sense of precision.

The design style is **Architectural High-Tech**. It combines the raw, structural honesty of **Brutalism** with a **Luminous Minimalism**. The aesthetic is defined by deep obsidian depths, vibrant cyan "light-trails," and technical grid overlays. The interface should feel like a backlit glass console—crisp, authoritative, and sophisticated. Every element exists on a strict coordinate-based logic, emphasizing structural integrity and functional speed.

## Colors

The palette is optimized for high-contrast legibility in a dark-mode environment. The core background is a deep, architectural navy (`#020617`), providing a more sophisticated depth than pure black.

- **Primary (Vibrant Cyan):** Used for critical paths, active states, and luminous highlights. It has been enhanced to `#22D3EE` for maximum vibrance against the navy background.
- **Secondary (Construction Orange):** Reserved for destructive actions, warnings, and high-priority alerts.
- **Tertiary (Matrix Green):** Used for success states and stable data points.
- **Neutrals:** Text and borders utilize `blueprint-gray` for secondary information, while `text-high-contrast` ensures primary content remains piercingly legible. 

Luminous effects (glows) should use the Primary color at varying opacities to simulate light emission.

## Typography

The typography strategy leverages the contrast between geometric structure and technical utility. 

- **Space Grotesk** is used for headlines to act as structural landmarks. For primary headings, apply a subtle `text-shadow` using the `luminous-glow` color to create a "backlit screen" effect.
- **JetBrains Mono** is the functional workhorse for all body text, data, and labels. This reinforces the technical narrative. 

To ensure legibility, body text must never drop below `#94A3B8`. Use all-caps with increased letter-spacing for `label-sm` to mimic technical annotation styles found on engineering drawings.

## Layout & Spacing

The layout is governed by a **Strict Fixed Grid** that mimics a drafting table. 

- **Desktop:** 12-column grid with a 1280px max-width. All containers must snap to the grid lines.
- **Mobile:** Fluid single-column with 16px margins. 
- **Technical Grid:** Backgrounds should feature a subtle 40px square grid overlay in `#94A3B8` at 5% opacity to reinforce the architectural theme.

Use the 8px base unit for all internal component spacing to maintain a consistent mathematical rhythm.

## Elevation & Depth

This system avoids traditional soft shadows in favor of **Luminous Layers** and **Technical Borders**.

- **Surface Levels:** The base is `#020617`. Elevated panels or modal surfaces use `#0F172A`.
- **Borders:** Containers are defined by 1px solid borders. Use `#22D3EE` at 10-15% opacity for standard containers.
- **Luminous Highlights:** Instead of elevation shadows, "active" or "hovered" elements emit a cyan glow. This is achieved using a `box-shadow` with a 10px-20px blur and no spread, colored with `luminous-glow`. 
- **Glass Effect:** For overlays, use a background blur (12px) with a semi-transparent navy fill to maintain context while focusing the user.

## Shapes

The shape language is strictly **Sharp (0px)**. 

Every UI element—buttons, inputs, cards, and dropdowns—must have 90-degree corners. To add a "High-Tech" decorative flair, use 45-degree chamfered (clipped) corners specifically for primary action buttons or status indicators. This mimics the machined edges of high-end hardware.

## Components

- **Buttons:** 1px solid borders. Primary buttons feature a solid `#22D3EE` fill with `#020617` text and a permanent external cyan glow. Secondary buttons use a cyan stroke and a subtle glow on hover.
- **Input Fields:** Utilize a "Terminal" style. Sharp 1px border on all sides. When focused, the border becomes vibrant cyan and the input area gains a 5% cyan tint. The cursor should be a solid cyan block.
- **Cards:** Defined by a sharp border and a slightly lighter navy background (`#0F172A`). Header areas of cards should be separated by a 1px horizontal line.
- **Status Indicators:** Use small, square icons. "Active" states should pulse slightly with a cyan glow.
- **Data Visuals:** Use 1px weight lines for all charts. Grids within charts should match the 8px base spacing unit.
- **Progress Bars:** Solid fills with no rounded caps. Use a "scanning" animation for indeterminate states.
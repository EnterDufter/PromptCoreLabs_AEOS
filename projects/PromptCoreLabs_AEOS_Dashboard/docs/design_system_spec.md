# PCL AEOS Sovereign UI - Design System Specification (v3.0.4)

## 🎨 Color Palette & Tokens

### Light Mode (Hyper-Clean White)
- Primary Background (`--bg-main`): `#FFFFFF`
- Secondary Background (`--bg-secondary`): `#F8FAFC` (Slate-50)
- Surface/Card (`--bg-card`): `#FFFFFF`
- Surface Hover (`--bg-card-hover`): `#F1F5F9` (Slate-100)
- Border Light (`--border`): `#E2E8F0` (Slate-200)
- Border Strong (`--border-dark`): `#CBD5E1` (Slate-300)
- Text Main (`--text-main`): `#0F172A` (Slate-900)
- Text Muted (`--text-muted`): `#64748B` (Slate-500)
- Accent Brand (`--accent-brand`): `#2563EB` (Blue-600)
- Accent Brand Hover (`--accent-brand-hover`): `#1D4ED8` (Blue-700)
- Status Success (`--status-success`): `#10B981` (Emerald-500)
- Status Warning (`--status-warning`): `#F59E0B` (Amber-500)
- Status Danger (`--status-danger`): `#EF4444` (Red-500)

### Dark Mode (Sovereign Slate)
- Primary Background (`--bg-main`): `#090A0F` (Deep Slate/Black)
- Secondary Background (`--bg-secondary`): `#11131F` (Slate-950)
- Surface/Card (`--bg-card`): `#161926` (Slate-900)
- Surface Hover (`--bg-card-hover`): `#1E2235`
- Border Light (`--border`): `#26293B`
- Border Strong (`--border-dark`): `#373A4E`
- Text Main (`--text-main`): `#F8FAFC` (Slate-50)
- Text Muted (`--text-muted`): `#94A3B8` (Slate-400)

---

## 🔤 Typography & Font Stacks

- **Sans Family**: `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Display Family**: `'Outfit', 'Inter', sans-serif`
- **Mono Family**: `'JetBrains Mono', 'Fira Code', monospace`

---

## ✨ Elevation & Effects

- **Glassmorphism**: `backdrop-filter: blur(12px); background: rgba(255, 255, 255, 0.85);` (Light) / `background: rgba(9, 10, 15, 0.85);` (Dark)
- **Glow Pulse**: `0 0 15px rgba(37, 99, 235, 0.35)`
- **Trace Motion**: SVG animated dashes `stroke-dasharray: 6; animation: dash 1.5s linear infinite;`

---

## 📐 Border Radius Tokens

- `radius-sm`: `0.375rem` (6px)
- `radius-md`: `0.5rem` (8px)
- `radius-lg`: `0.75rem` (12px)
- `radius-xl`: `1.0rem` (16px)
- `radius-2xl`: `1.5rem` (24px)

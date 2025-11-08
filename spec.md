# Nebula Marks – Bookmark UI

Goal: A minimalist bookmark web app with two visual themes:
- Night mode = **galaxy** vibe (deep indigo, violet, subtle stars)
- Day mode = **ocean** vibe (soft blues, turquoise, light and airy)

Tech stack:
- React + TypeScript (Vite)
- TailwindCSS for styling
- Framer Motion for micro-animations

MVP:
- Mocked bookmark data (no Chrome API yet)
- Full-page layout with:
  - Top navbar: app name, search input (non-functional for now), theme toggle
  - Main area: responsive grid of bookmark cards
- Theme toggle: Galaxy 🌌 / Ocean 🌊
  - Changes background gradient and base colors
- Bookmark cards:
  - Show favicon (or first letter fallback), title, hostname, tags
  - Hover: subtle glow, small lift (motion)
  - Minimal, elegant, slightly glassmorphic

Non-goals for now:
- No backend, no login
- No real Chrome bookmarks integration (will come later)

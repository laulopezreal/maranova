# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Nebula Marks** is a minimalist bookmark web app built with React, TypeScript, and Vite. The project features two visual themes:
- **Night mode** (Galaxy): deep indigo, violet, subtle stars
- **Day mode** (Ocean): soft blues, turquoise, light and airy

This is currently an MVP with mocked bookmark data. Chrome bookmarks integration and backend functionality are planned for future iterations.

## Commands

### Development
```bash
npm run dev          # Start Vite dev server with HMR
npm run build        # Type-check with tsc and build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint on all files
```

## Tech Stack & Key Dependencies

- **React 19** with TypeScript
- **Vite** for build tooling and HMR
- **Tailwind CSS 4** for styling
- **Framer Motion** for micro-animations (card hover effects, theme transitions)
- **ESLint 9** with flat config for linting

## Architecture

### TypeScript Configuration
This project uses TypeScript project references:
- `tsconfig.app.json`: App source code configuration with strict mode enabled
- `tsconfig.node.json`: Vite config and build tooling
- Root `tsconfig.json` references both

### Styling Approach
- Tailwind CSS for utility-first styling
- Glassmorphic design pattern for bookmark cards
- Theme-based color schemes (galaxy vs ocean) controlled via CSS custom properties or Tailwind theme extension
- PostCSS for Tailwind processing

### Component Structure (Planned)
- **Navbar**: App name, search input (non-functional), theme toggle (🌌/🌊)
- **Bookmark Cards**: Favicon/fallback, title, hostname, tags with hover effects (glow, lift animation via Framer Motion)
- **Grid Layout**: Responsive bookmark card grid

### State Management
- Use React hooks (`useState`, `useContext` if needed) for theme state and bookmark data
- No external state management library required for MVP

## Development Guidelines

### Component Development
- Use functional components with TypeScript
- Leverage Framer Motion for card hover effects (subtle glow, lift transform)
- Implement glassmorphic styling with backdrop-blur and semi-transparent backgrounds
- Ensure responsive grid layout works across screen sizes

### Theme Implementation
- Theme toggle should switch between galaxy (night) and ocean (day) color schemes
- Apply theme changes to background gradients, text colors, and card styles
- Consider using CSS variables or Tailwind's dark mode variant for theme switching

### Data Structure
Bookmark objects should include:
- `title`: string
- `hostname`: string (extracted from URL)
- `favicon`: string (URL or fallback to first letter)
- `tags`: string[]

### Linting & Type Safety
- Run `npm run lint` before committing
- TypeScript strict mode is enabled - ensure all types are properly defined
- ESLint is configured with React Hooks rules and React Refresh plugin

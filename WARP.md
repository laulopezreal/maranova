# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Vision

**Maranova** (mare + nova: "sea of new stars") will be the **world's most beautiful and intelligent bookmark manager**.

We're building something that combines:
- 🎨 **Stunning Visualizations**: Interactive force-directed graphs, glassmorphic design, animated backgrounds
- 🤖 **AI-Powered Intelligence**: Smart recommendations, automatic categorization, insight generation
- 🌊 **Calm Simplicity**: Despite powerful features, the UX remains clean, intuitive, and peaceful
- 🚀 **Universal Appeal**: Fancy enough to impress, simple enough for anyone to use

This isn't just another bookmark manager. It's a **visual thinking tool** that helps you understand and explore your digital knowledge.

## Current State (MVP)

**Nebula Marks** is the MVP with three core views:
- **Grid View**: Card-based layout with glassmorphic bookmark cards
- **List View**: Compact list for quick scanning
- **Graph View**: Interactive force-directed network visualization (D3.js)

Features implemented:
- Dual themes: Galaxy (night) and Ocean (day) with animated starry backgrounds
- Hierarchical folder navigation with sidebar
- Bidirectional selection (sidebar ↔ graph)
- Glassmorphic design with backdrop blur throughout
- Responsive layouts
- Mock bookmark data structure

Tech stack: React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion, D3.js

## Commands

### Development
```bash
npm run dev          # Start Vite dev server with HMR
npm run server       # Start the auth API server
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

---

## Strategic Roadmap: Path to World-Class

### Phase 1: Data Integration (Foundation)
**Goal**: Connect to real bookmark sources

**Browser Extension Integration**
- Chrome/Firefox/Safari extension to sync bookmarks
- Real-time sync with local storage
- Import from Chrome Bookmarks JSON export
- Export functionality (JSON, HTML, CSV)

**Authentication & Backend**
- Firebase/Supabase for user accounts
- Cloud sync across devices
- Secure bookmark storage
- Privacy-first approach (local-first, optional cloud sync)

**Success Metrics**: Users can import their real bookmarks in < 30 seconds

---

### Phase 2: AI-Powered Intelligence (Differentiation)
**Goal**: Make bookmarks smarter, not just organized

**AI Features**
1. **Smart Categorization**
   - LLM-powered automatic folder suggestions
   - Tag generation from bookmark content
   - Duplicate detection with merge suggestions
   - Dead link detection and archival recommendations

2. **Intelligent Recommendations**
   - "You might also like..." based on bookmark patterns
   - Related bookmarks clustering
   - Trending topics in your collection
   - Time-based insights ("You bookmarked a lot about X this month")

3. **Semantic Search**
   - Natural language queries: "find that article about React hooks from last month"
   - Vector embeddings for similarity search
   - Search by concepts, not just keywords
   - "Forgotten gems" - resurface old valuable bookmarks

4. **AI Summaries**
   - Generate TL;DR for bookmarked articles
   - Extract key quotes and highlights
   - Generate reading time estimates
   - Create knowledge graphs from your bookmarks

**Technical Implementation**
- OpenAI API or Anthropic Claude for LLM features
- Vector database (Pinecone/Weaviate) for semantic search
- Background processing for non-blocking UX
- Cost optimization: batch processing, caching, smart model selection

**Success Metrics**: "AI found something I forgot about" moments weekly

---

### Phase 3: Advanced Visualizations (Delight)
**Goal**: Make bookmark exploration beautiful and insightful

**Enhanced Graph View**
- **Temporal View**: Timeline visualization showing bookmark evolution
- **Topic Clusters**: AI-powered grouping with visual separation
- **Heatmaps**: Show bookmark activity over time
- **3D Mode**: Optional WebGL-powered 3D graph for presentations
- **Path Finding**: Shortest path between related bookmarks
- **Export**: Save graphs as SVG/PNG for sharing

**New Visualization Types**
- **Knowledge Map**: Hierarchical tree with expandable branches
- **Tag Cloud**: Interactive word cloud sized by usage
- **Domain Map**: Group by source domains with statistics
- **Reading Analytics**: Charts showing reading patterns, topics, sources
- **Relationship View**: Show how bookmarks connect (same author, topic, domain)

**Visual Polish**
- Smooth transitions between all views
- Animated node entrances/exits
- Particle effects on interactions
- Custom themes (user-uploadable color schemes)
- Dark mode perfection

**Success Metrics**: Users spend >5 minutes exploring, not just organizing

---

### Phase 4: Social & Collaboration (Growth)
**Goal**: Enable knowledge sharing while maintaining privacy

**Sharing Features**
- **Public Collections**: Share curated bookmark collections
- **Embeddable Widgets**: Graph views for blogs/websites
- **Collaboration**: Shared team workspaces for research
- **Discovery Feed**: Explore public collections from others
- **Following**: Follow users with similar interests

**Privacy Controls**
- Granular sharing (public/private/unlisted)
- Anonymous sharing option
- Watermarked exports
- Optional end-to-end encryption

**Success Metrics**: Viral growth through shared collections

---

### Phase 5: Mobile & Cross-Platform (Scale)
**Goal**: Bookmarking everywhere

**Mobile Apps**
- React Native app (iOS + Android)
- Share sheet integration
- Offline-first architecture
- Widget for home screen
- Voice input for quick bookmarking

**Browser Integration**
- Quick-add from any page (extension popup)
- Smart tag suggestions while bookmarking
- Preview graph before saving
- Keyboard shortcuts

**Desktop Apps**
- Electron wrapper for native feel
- System tray integration
- Global hotkeys
- Native notifications

**Success Metrics**: Daily active usage on multiple devices

---

## Implementation Principles

### Design Philosophy
1. **Beauty is not optional** - Every interaction should feel delightful
2. **AI serves humans** - Technology amplifies, doesn't replace human curation
3. **Privacy first** - User data is sacred, monetization through premium features
4. **Fast by default** - <100ms interactions, instant feedback
5. **Progressive disclosure** - Simple surface, powerful depths

### Technical Excellence
1. **Performance Budget**: 
   - Initial load < 2s
   - Interaction response < 100ms
   - Graph with 1000+ nodes smooth at 60fps

2. **Code Quality**:
   - 100% TypeScript, no `any` types
   - Test coverage >80% for critical paths
   - Component library documentation
   - Accessibility (WCAG AA minimum)

3. **Scalability**:
   - Virtual rendering for large datasets
   - Lazy loading and code splitting
   - CDN for static assets
   - Database indexing strategy

### Go-to-Market Strategy

**Target Audiences**
1. **Primary**: Power users (developers, researchers, knowledge workers)
2. **Secondary**: Students and educators
3. **Tertiary**: Creative professionals (designers, writers)

**Pricing Model**
- **Free Tier**: Up to 1000 bookmarks, basic AI features
- **Pro ($8/mo)**: Unlimited bookmarks, full AI, advanced visualizations
- **Team ($15/user/mo)**: Collaboration features, admin controls

**Launch Strategy**
1. Product Hunt launch with stunning demo video
2. Reddit/HN posts showing graph visualizations
3. YouTube tutorials and use cases
4. Integration with productivity tools (Notion, Obsidian)
5. API for developers to build on top

---

## Next Session Priorities

### Immediate (Next 1-2 sessions)
1. **Chrome Extension MVP**
   - Import bookmarks from Chrome
   - Replace mock data with real user data
   - Test with large datasets (1000+ bookmarks)

2. **Graph View Enhancements**
   - Node clustering algorithm
   - Better performance with large graphs (virtualization)
   - Export graph as image
   - Graph search/filter

3. **AI Experimentation**
   - Proof of concept: LLM-powered tag generation
   - Test semantic search with vector embeddings
   - Measure API costs and latency

### Short-term (Next 3-5 sessions)
1. **Backend Setup**
   - Choose stack (Supabase recommended for speed)
   - User authentication
   - Cloud bookmark storage
   - API design

2. **AI Integration**
   - Implement smart categorization
   - Add "similar bookmarks" feature
   - Basic semantic search

3. **Mobile Responsive**
   - Adapt graph view for touch
   - Mobile-optimized navigation
   - PWA capabilities

### Medium-term (Next 10+ sessions)
1. **Advanced AI Features**
2. **Additional visualizations**
3. **Collaboration features**
4. **Mobile apps**

---

## Success Vision

In 12 months, Maranova is:
- ✅ The most visually stunning bookmark manager on the internet
- ✅ Featured on Product Hunt, Designer News, HN front page
- ✅ 10,000+ active users loving the AI recommendations
- ✅ Users say: "I actually enjoy organizing my bookmarks now"
- ✅ Graph visualizations being shared on Twitter/LinkedIn
- ✅ Revenue from Pro subscriptions covering costs + growth
- ✅ Mobile apps in app stores with 4.5+ star ratings
- ✅ Integration requests from major productivity tools

**The ultimate goal**: Make bookmark management so beautiful and intelligent that people want to organize, not just collect.

---

*Last updated: November 2024*
*Current branch: feature/graph-view (ready for merge)*

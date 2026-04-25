# Task Plan: Praneesh Portfolio — "The Void Speaks in Packets"

## Goal
Build a dark, 3D-immersive, explorable cybersecurity portfolio website with a space/quasar theme, terminal easter eggs, minigame, blog, and anime references — designed to be one of the best portfolio websites on the internet.

## Current Phase
Phase 3 — Design System (M1) [OUTSOURCING]

## Workflow Protocol
1. **User (Outsourcer):** Uses `OUTSOURCING_PLAN.md` prompts to generate code via external AIs (ChatGPT, v0, Copilot).
2. **User (Outsourcer):** Provides the generated raw code/assets back to me.
3. **Antigravity (Integrator):** Cleans, refactors to Next.js 16/Biome standards, and integrates into the repository.
4. **Antigravity (Integrator):** Verifies the build and pushes commits.

## Phases

### Phase 1: Planning & Perfection
- [x] Read & digest original masterplan (1407 lines)
- [x] Identify issues, gaps, deprecated tools
- [x] Research bleeding-edge 2025-2026 tech additions
- [x] Create perfected plan documents (PERFECTED_PLAN, MODULE_BREAKDOWN, TOOL_ASSIGNMENT, FREE_TOOLS_GUIDE)
- [x] User reviews & approves perfected plan
- [x] UI/UX Pro Max design system research
- **Status:** ✅ DONE

### Phase 2: Scaffold (M0)
- [x] Init Next.js 16.2.4 + TypeScript + Tailwind v4 + Biome 2.2.0
- [x] Design tokens (CSS @theme with full palette)
- [x] Font setup (Orbitron, DM Sans, JetBrains Mono, Cinzel via next/font)
- [x] Base layout + metadata + OG setup (praneeshrv.me)
- [x] 404 page (terminal-styled with One Piece easter egg)
- [x] Zustand global store
- [x] Core hooks (useReducedMotion, useMediaQuery)
- [x] TypeScript types for all data shapes
- [x] Biome lint clean (0 errors)
- [x] Build passes (exit code 0)
- [x] Folder structure (components/3d, ui, sections, game, fallbacks; hooks, stores, types, lib, content, shaders)
- [x] Content data placeholders (projects.json, ctf-achievements.json)
- [x] Husky + lint-staged pre-commit hook
- [ ] Deploy skeleton to Vercel (user to connect repo)
- **Status:** ✅ DONE (except Vercel deploy)

### Phase 3: Design System (M1)
- [x] Glassmorphism CSS utilities (glass-panel, glass-terminal) — done in M0
- [x] Glow effect utilities (glow-green, glow-purple, box-glow-*) — done in M0
- [x] CRT scanlines overlay — done in M0
- [x] 404 page — done in M0
- [x] OUTSOURCE/INTEGRATE: Custom cursor (crosshair + hover states)
- [x] OUTSOURCE/INTEGRATE: GlitchText component
- [ ] OUTSOURCE: Button, Card, Navigation React components
- [x] OUTSOURCE/INTEGRATE: Loading screen (terminal boot)
- [ ] OUTSOURCE: TypewriterText component
- [ ] INTEGRATE: Refactor and wire up M1 components into the repo
- **Status:** partially_integrated

### Phase 4: 3D Space Scene (M2)
- [ ] R3F Canvas + camera + controls
- [ ] StarField (adaptive particle count)
- [ ] NeutronStar (custom GLSL shader)
- [ ] AccretionDisk + RelativisticJets
- [ ] Planets (6x, orbital paths)
- [ ] DysonSphere wireframe
- [ ] PostProcessing (Bloom, Vignette)
- [ ] GPU tier detection + mobile CSS fallback
- [ ] Error boundary around 3D
- **Status:** pending

### Phase 5: Sections (M3)
- [ ] Hero overlay (typewriter, CTA)
- [ ] About (HUD cockpit panels)
- [ ] Projects (cards, filter, 3D tilt hover)
- [ ] Skills (constellation graph desktop / grid mobile)
- [ ] Experience (warp-speed timeline)
- [ ] CTF Hall of Fame
- [ ] Certifications (clearance badges)
- [ ] Contact (Resend API form)
- [ ] Resume download
- **Status:** pending

### Phase 6: Animation Layer (M4)
- [ ] GSAP ScrollTrigger per section
- [ ] CSS scroll-driven animations (where possible)
- [ ] Entrance animations + stagger
- [ ] Hover micro-interactions
- [ ] Glitch effects (CSS clip-path)
- [ ] Number count-up animations
- [ ] Text reveal (splitting.js)
- **Status:** pending

### Phase 7: Terminal (M5)
- [ ] xterm.js overlay component
- [ ] Command interpreter (15+ commands)
- [ ] Keyboard shortcut triggers
- [ ] Neofetch command (custom)
- [ ] ASCII art for anime commands
- **Status:** pending

### Phase 8: Minigame — Packet Runner (M6)
- [ ] Canvas game loop
- [ ] Player (packet), enemies (firewall, IDS)
- [ ] Collision, scoring, power-ups
- [ ] Trigger from terminal + UI button + Konami code
- [ ] Local storage leaderboard
- **Status:** pending

### Phase 9: Blog Engine (M7)
- [ ] MDX setup (Velite or @next/mdx + gray-matter)
- [ ] Blog index + post template
- [ ] Shiki syntax highlighting
- [ ] RSS feed
- [ ] Sample posts
- **Status:** pending

### Phase 10: Polish & Launch (M8)
- [ ] Lighthouse audit (90+ all categories)
- [ ] Accessibility pass (ARIA, keyboard, reduced motion)
- [ ] SEO (JSON-LD, OG images, sitemap, robots.txt)
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Analytics (Vercel Analytics)
- [ ] Easter eggs (console.log, Konami, flag CTF)
- **Status:** pending

## Key Questions
1. ~~Tailwind v4 or vanilla CSS?~~ → Tailwind v4 CSS-first with @theme ✅
2. ~~Zustand vs Jotai vs React Context?~~ → Zustand ✅ (user approved)
3. ~~Skills section: D3 force graph or R3F constellation?~~ → Interactive constellation graph ✅ (user chose)
4. Blog: Velite vs fumadocs-mdx vs @next/mdx? (decide in M7)
5. ~~Custom domain purchased yet?~~ → praneeshrv.me already owned ✅

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Replace Contentlayer → Velite | Contentlayer deprecated since 2024 |
| Replace GSAP Club plugins → free alternatives | User is student, no budget for SplitText/MorphSVG |
| Replace Kaboom.js → Pure Canvas | Kaboom deprecated, Canvas = zero deps |
| Replace react-syntax-highlighter → Shiki | Faster, better themes, Next.js native |
| Add Biome → replaces ESLint + Prettier | 10-40x faster, single tool |
| Add View Transitions API | Native browser, zero JS page transitions |
| Add CSS scroll-driven animations | Reduce GSAP dependency where possible |
| motion.dev over Framer Motion | Lighter, standalone, modern |
| JetBrains Mono (not Berkeley Mono) | Free, user already uses it on Arch |
| Error boundary around 3D | WebGL crash = blank page without it |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| (none yet) | — | — |

## Notes
- Original masterplan preserved untouched at praneesh_portfolio_masterplan.md
- All new docs are ADDITIONS, not edits to original
- MVP = M0-M3 complete (~3 weeks) → deployable WOW
- Full build = M0-M8 (~2.5-3.5 months student pace)

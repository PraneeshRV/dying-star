# MODULE BREAKDOWN — Detailed Build Specs

> Each module is independently buildable, testable, and integrable.
> Build order: M0 → M1 → M2 → M3 → [MVP DEPLOY] → M4 → M5 → M6 → M7 → M8

---

## M0: SCAFFOLD — "The Launchpad"
**Time:** 2-3 days | **AI Tool:** Antigravity (architecture-critical)

### Tasks
```
1. pnpm create next-app@latest ./ --typescript --tailwind --app --src=false --import-alias "@/*"
2. Install core deps:
   pnpm add three @react-three/fiber @react-three/drei @react-three/postprocessing
   pnpm add gsap @gsap/react motion zustand
   pnpm add -D @biomejs/biome @types/three
3. Configure Biome (biome.json — replace ESLint + Prettier)
4. Configure Tailwind v4 (@theme in globals.css with all design tokens)
5. Set up fonts via next/font:
   - Orbitron (display/logo)
   - DM Sans (body)
   - JetBrains Mono (code/terminal)
   - Cinzel (accent headings)
6. Create base layout.tsx with metadata
7. Set up Husky + lint-staged pre-commit hooks
8. Deploy empty skeleton to Vercel
9. Configure .env.local template
```

### Output
- Deployable Next.js skeleton on Vercel
- Design tokens in CSS
- Fonts loading without layout shift
- Biome lint/format working
- Git repo initialized with Husky

### Dependencies
- None (first module)

### Verification
```bash
pnpm dev          # runs without errors
pnpm build        # builds successfully
biome check .     # no lint errors
# Verify on Vercel preview URL
```

---

## M1: DESIGN SYSTEM — "The Aesthetic Core"
**Time:** 3-4 days | **AI Tool:** Antigravity + v0.dev (component prototyping)

### Tasks
```
1. GlassPanel component
   - Props: variant ('panel' | 'terminal'), glow (boolean), children
   - glassmorphism backdrop-filter + border glow
   
2. GlitchText component
   - Props: text, interval (ms), intensity ('subtle' | 'medium' | 'heavy')
   - CSS clip-path animation (no JS for the glitch itself)
   - Periodic trigger via setInterval

3. Custom Cursor
   - Default: crosshair/block cursor (CSS)
   - Hover links: expand + green ring
   - Hover 3D: targeting reticle
   - Disable on touch devices (useMediaQuery)

4. Button component
   - Variants: primary (green glow), secondary (purple), ghost
   - Hover: glow border + scale
   - Terminal-styled text (monospace, uppercase)

5. Card component
   - Glass background
   - 3D tilt on hover (CSS perspective-transform)
   - Scan line sweep on hover (CSS animation)

6. LoadingScreen component
   - Terminal boot sequence
   - Fake progress bar with messages
   - 2-3s duration, skip after 1s (click/key)
   - GSAP for reveal transition to main content

7. Navigation (Floating Orbital)
   - Ring of icons around mini quasar logo (top-left)
   - Active section glow ring (IntersectionObserver)
   - Mobile: hamburger → fullscreen terminal-menu
   - Scroll progress as orbital arc

8. 404 Page
   - "404.exe not found" terminal aesthetic
   - One Piece easter egg: "The page is in another sea" + tiny Straw Hat
   - Link back to home

9. ScanLine component (reusable overlay)
10. TypewriterText component (requestAnimationFrame-based)
```

### Output
- Full component library, each in components/ui/
- All components self-documented with JSDoc
- Visually consistent with design system

### Dependencies
- M0 (scaffold + design tokens)

### Verification
```bash
# Visual inspection in browser
# Each component renders correctly at /dev-preview or Storybook (optional)
# Responsive check: desktop, tablet, mobile
# Reduced motion: @media (prefers-reduced-motion) honored
```

---

## M2: 3D SPACE SCENE — "The Universe"
**Time:** 7-10 days | **AI Tool:** Antigravity (arch) + Copilot (boilerplate) + ChatGPT (GLSL)

### Sub-modules

#### M2a: Canvas Foundation (2 days)
```
1. SpaceScene.tsx — Main R3F Canvas wrapper
   - Suspense + ErrorBoundary
   - Camera: PerspectiveCamera, fixed position, slight auto-sway
   - OrbitControls DISABLED (cinematic only)
   - Adaptive DPR (device pixel ratio)
   
2. StarField.tsx — Procedural starfield
   - BufferGeometry + Points
   - Random positions in sphere (radius 100)
   - Custom PointsMaterial with size attenuation
   - Twinkle: random phase offset per star in shader
   - Adaptive count: 10k (GPU≥3), 5k (GPU=2), CSS fallback (GPU≤1)

3. hooks/useGPUTier.ts
   - @pmndrs/detect-gpu integration
   - Returns tier 1-4
   - Memoized (runs once)

4. CSSParticleBackground.tsx — fallback for low-end
   - tsParticles or CSS-only animated dots
   - Matches color palette
```

#### M2b: Neutron Star Core (3 days)
```
1. NeutronStar.tsx
   - SphereGeometry (radius 1, 64 segments)
   - Custom ShaderMaterial (GLSL)
     - Vertex: simplex noise surface distortion + pulsation (uTime)
     - Fragment: white core → blue → purple gradient (equator→poles)
   - PointLight attached (illuminates scene)
   
2. AccretionDisk.tsx
   - RingGeometry (inner 1.5, outer 4)
   - Custom shader: hot white center → orange → transparent
   - Tilt: rotateX(-0.3)
   - Slow constant rotation in useFrame

3. RelativisticJets.tsx
   - Two ConeGeometry (up + down from star)
   - Additive blending, transparent blue-purple
   - Animated length pulse in vertex shader
   
4. shaders/*.vert, *.frag — all GLSL in separate files
```

#### M2c: Celestial Bodies (2 days)
```
1. Planet.tsx — reusable component
   - Props: radius, orbitRadius, orbitSpeed, color, texture, label
   - SphereGeometry + texture (NASA/procedural)
   - Orbit: useFrame with sin/cos + time
   - Thin RingGeometry for orbital path (low opacity)
   - Hover: label appears (drei Html or Billboard)

2. 6 planet instances (from masterplan mapping):
   - Terra-Hack (CTF, red-orange, large)
   - Nebula-Build (Projects, blue-green, medium)
   - Cipher-World (Skills, purple, medium)
   - Echo-9 (Experience, gold, small)
   - Arch-Prime (About, grey-teal, small)
   - Blog-Star (Blog, white-blue, small, pulsar-like)

3. DysonSphere.tsx
   - IcosahedronGeometry (detail 2)
   - Wireframe mode, emissive purple-blue
   - Partial: custom clipping planes for "under construction"
   - Slow rotation

4. AsteroidBelt.tsx
   - InstancedMesh (200 small dodecahedra)
   - Distributed in torus shape
   - Per-instance rotation speed variation
```

#### M2d: Post-Processing & Optimization (2 days)
```
1. PostProcessing.tsx
   - Bloom: threshold 0.5, strength 1.5, radius 0.8
   - Vignette: darkness 0.7
   - ChromaticAberration: 0.003 (desktop only, skip tier 2+)
   - Film grain: subtle noise (desktop only)

2. GPU-tiered rendering:
   - Tier 1: all effects
   - Tier 2: bloom + vignette only
   - Tier 3: no WebGL → CSS fallback
   - Tier 4: static dark bg

3. Performance:
   - LOD for distant planets (lower geometry)
   - useFrame: skip when tab not visible (document.hidden)
   - Preload textures via drei Preload
   - Dynamic import: Canvas loaded client-only
```

### Output
- Standalone `<SpaceScene />` component
- Works at all 4 GPU tiers
- WebGL crash → graceful CSS fallback
- Mouse parallax on starfield

### Dependencies
- M0 (scaffold)

### Verification
```bash
# Visual: scene renders, star pulses, planets orbit
# Performance: 60fps desktop, 30fps mobile (or fallback)
# Error: disable WebGL in browser → CSS fallback renders
# Reduced motion: animations paused/slowed
```

---

## M3: SECTIONS — "The Content Quadrants"
**Time:** 7-8 days | **AI Tool:** v0.dev (prototypes) → Antigravity (refinement)

### Sub-modules

#### M3a: Hero Overlay (1 day)
```
- Positioned over SpaceScene Canvas
- Name: "PRANEESH R V" — TypewriterText with blinking cursor
- Role cycling: ["Cybersecurity Student", "CTF Player", "Arch User", "Builder"]
- Tagline: "root@cosmos:~$ whoami"
- CTAs: [EXPLORE.SH] [VIEW RESUME]
- Scroll indicator: animated arrow + tiny mono text
- CRT scanlines overlay (low opacity)
- Vignette (CSS radial-gradient)
```

#### M3b: About Section (1 day)
```
- Spaceship cockpit / HUD aesthetic
- Two-panel: terminal "cat about.txt" (left) + avatar/ASCII portrait (right)
- 3 HUD panels: IDENTITY, OPERATOR PROFILE, PERSONAL LOG
- Each panel "boots up" on viewport enter (GlassPanel + TypewriterText)
- Small rotating planet model next to heading
```

#### M3c: Projects Section (2 days)
```
- Space station docking bay concept
- Card grid with filter pills: [All] [Security] [Tools] [Infrastructure] [CTF] [WIP]
- Card: GlassPanel + project icon + title + desc + tech pills + links
- Hover: 3D tilt (CSS perspective) + scan line sweep + border glow
- Data: content/data/projects.json
- [BREACH →] button = live link, [SOURCE] = GitHub
- Placeholder for future projects
```

#### M3d: Skills Section (2 days)
```
- Desktop: D3.js-like force graph OR Three.js constellation
  - Nodes = skills, edges = constellation lines
  - Hover: glow + tooltip with proficiency
  - Clustered by category (color-coded)
- Mobile: categorized grid with CSS animated progress rings
- Categories: Security (red), Dev (blue), Infrastructure (green), Tools (purple)
- Data: content/data/skills.json
- Tool logos with glow effect for recognizable tools
```

#### M3e: Experience Timeline (1 day)
```
- Warp-speed corridor aesthetic
- Vertical timeline with glowing central spine
- Each entry = checkpoint with year badge
- Expand-on-hover/click for details
- "Warp lines" animate on scroll (CSS/GSAP)
- Data: content/data/experience.json
```

#### M3f: CTF Hall of Fame (1 day)
```
- Neon-lit trophy room
- Team stats panel (GlassPanel): Rank, CTFs Competed, Scope, Specialties
- Achievement table: Competition, Result, Year
- Animated flag submission counter (number count-up)
- Radar-sweep visualization (CSS/SVG animation)
- Easter egg: click 3x → triggers mini "find the flag" DOM challenge
- Data: content/data/ctf-achievements.json
```

#### M3g: Contact Form (1 day)
```
- "Deep space comms array" — satellite dish animation (CSS/Lottie)
- Form: react-hook-form + zod validation
- Fields: Callsign (name), Frequency (email), Message (textarea)
- Submit: Resend API via Next.js API route
- Success: "TRANSMISSION RECEIVED — SIGNAL LOCKED" + particle burst
- Social links: GitHub, LinkedIn, Email, CTFTime
```

### Output
- All sections rendering with JSON placeholder data
- Responsive (desktop, tablet, mobile)
- Content-code separation (all text in /content/data/)
- Each section is a standalone component

### Dependencies
- M0 (scaffold), M1 (design system components)
- M2 optional (hero needs SpaceScene behind it, but can use CSS fallback during M3 dev)

### Verification
```bash
# All sections render without errors
# Data loads from JSON files
# Responsive at 3 breakpoints
# Filter works on Projects
# Contact form submits (test with Resend test key)
```

---

## M4: ANIMATION LAYER — "The Soul"
**Time:** 4-5 days | **AI Tool:** Antigravity (GSAP orchestration is complex)

### Tasks
```
1. GSAP ScrollTrigger setup
   - Register plugin globally
   - Per-section entrance timelines
   - Pin hero section during initial scroll
   - Scrub-based animations (tied to scroll position)

2. Section entrance animations:
   - Hero → About: parallax starfield shift
   - Section headers: char-by-char reveal (splitting.js)
   - Cards: stagger-fade from bottom
   - Timeline nodes: activate on scroll-past
   - Skills graph: constellation lines draw themselves
   - CTF stats: number count-up from 0

3. CSS scroll-driven animations (where GSAP overkill):
   - Simple opacity/translate reveals
   - Progress bar fills
   - Background color transitions

4. Hover micro-interactions:
   - Nav links: underline draws from center (CSS)
   - Buttons: glow border + slight scale
   - Project cards: 3D tilt + scan line
   - Skill nodes: glow pulse + tooltip
   - Social icons: rotation + color shift

5. Glitch effects:
   - Hero name: brief glitch every 20s (CSS clip-path)
   - Section transitions: frame-split 100ms
   - Certain hovers: red channel shift

6. View Transitions API:
   - Route changes (/blog, /uses)
   - Cross-fade + scale effect
   - Fallback: motion.dev AnimatePresence
```

### Output
- All sections animated on scroll
- Smooth 60fps animations
- Reduced motion: all GSAP disabled, CSS transitions minimal

### Dependencies
- M0, M1, M2, M3 (all sections built)

### Verification
```bash
# Scroll through site — animations trigger correctly
# Performance: no jank, 60fps
# Reduced motion: toggle in OS → verify animations disabled
# Mobile: touch scroll animations work
```

---

## M5: TERMINAL — "The Hacker's Heart"
**Time:** 3-4 days | **AI Tool:** Antigravity (arch) + Copilot (command handlers)

### Tasks
```
1. Terminal.tsx
   - xterm.js instance with FitAddon
   - Custom theme: green on void, glow effect
   - Slides up from bottom (motion.dev animation)
   - Overlay (site doesn't pause)
   - Accessible via: Ctrl+`, terminal icon (bottom-right), typing when no input focused

2. lib/terminal-commands.ts — Command interpreter
   Commands:
   - whoami → identity text
   - ls skills/ → skill list
   - cat manifesto.txt → philosophy multi-line
   - ctf --stats → stats + ASCII bar chart
   - ls projects/ → project list
   - play → launches PacketRunner (M6)
   - neofetch → custom ASCII art + site stats
   - sudo rm -rf / → "Permission denied. Nice try."
   - hack → "Already in progress."
   - anime → ASCII Soul Society gates + "Bankai."
   - matrix → brief Matrix rain
   - flag → encoded CTF challenge string
   - help → command list
   - clear → clear terminal
   - exit → close terminal
   - cd, pwd, echo → basic Unix simulation

3. hooks/useTerminal.ts
   - Open/close state (Zustand)
   - Command history (up/down arrow)
   - Auto-complete (tab key, basic)
```

### Output
- Working terminal overlay with 15+ commands
- Authentic terminal feel
- Keyboard navigable

### Dependencies
- M0, M1

### Verification
```bash
# Open terminal via Ctrl+`
# Run each command — correct output
# Up/down arrow → history works
# exit → closes
# Mobile: terminal accessible via icon
```

---

## M6: MINIGAME — "Packet Runner"
**Time:** 4-5 days | **AI Tool:** ChatGPT Codex (game logic) + Antigravity (integration)

### Tasks
```
1. PacketRunner.tsx — Canvas game component
   - Full-screen overlay when active
   - requestAnimationFrame game loop
   - Pause/resume capability

2. Game mechanics:
   - Player: glowing blue hexagon (keyboard: WASD/arrows, mobile: D-pad)
   - Enemies: red firewall blocks (static), IDS scanners (moving beams), honeypots
   - Collectibles: data fragments (score), power-ups (encryption shield, speed burst)
   - Collision detection: AABB
   - Difficulty: scales with score

3. Visual style:
   - Grid background (dark + green/blue grid lines)
   - Neon aesthetic matching site palette
   - Monospace score display
   - Screen shake on hit

4. Anime power-ups:
   - Hollow fragment (Bleach) — invincibility 3s
   - Devil Fruit (One Piece) — double score 5s
   - Tiny pixel art, only recognizable to fans

5. Triggers:
   - "play" in terminal → launches game
   - MINI_GAME.EXE button in UI
   - Konami code (↑↑↓↓←→←→BA) → launches + flashes "STAR PLATINUM"

6. Scoring:
   - localStorage high scores
   - Optional: Supabase free-tier global leaderboard (stretch goal)
```

### Output
- Playable arcade minigame
- Fully lazy-loaded (separate chunk)
- Multiple trigger methods

### Dependencies
- M0 (for integration), M5 (terminal trigger)

### Verification
```bash
# Game launches from all 3 triggers
# Player moves, enemies spawn, collision works
# Score increments, power-ups function
# High score persists (localStorage)
# Pause/resume works
# Mobile D-pad works
```

---

## M7: BLOG ENGINE — "The Signal"
**Time:** 3-4 days | **AI Tool:** Antigravity (MDX config) + Copilot (template code)

### Tasks
```
1. Velite setup (or @next/mdx + gray-matter)
   - Content schema: title, date, excerpt, category, tags, readTime
   - MDX compilation at build time
   - Generated types for posts

2. Blog index (/blog)
   - Grid of blog cards (dark editorial aesthetic)
   - Category filter: [WRITEUP] [RESEARCH] [ARCH] [BUILD] [THOUGHTS]
   - Card: category tag, title, date, read time, excerpt
   - Space/tech background texture per card

3. Blog post template (/blog/[slug])
   - MDX rendering with custom components
   - Table of contents (auto-generated from headings)
   - Shiki syntax highlighting (vitesse-dark theme)
   - Custom MDX components: Callout, CodeBlock, Image
   - Reading progress bar
   - Previous/Next post navigation

4. Sample posts:
   - One CTF writeup (placeholder content)
   - One Arch setup guide (placeholder content)

5. RSS feed (app/feed.xml/route.ts)
```

### Output
- Working blog with index + post pages
- MDX rendering with syntax highlighting
- Category filtering
- RSS feed

### Dependencies
- M0, M1

### Verification
```bash
# Blog index renders with sample posts
# Post page renders MDX correctly
# Code blocks highlighted with Shiki
# RSS feed valid XML
# SEO: og:title, og:description per post
```

---

## M8: POLISH & LAUNCH — "Launch Prep"
**Time:** 3-4 days | **AI Tool:** Antigravity (systematic audit)

### Tasks
```
1. Lighthouse audit
   - Run on every page
   - Fix all issues until 90+ (95+ desktop)
   - Bundle analyze: remove unused deps

2. Accessibility
   - Semantic HTML audit (main, nav, article, section, aside)
   - ARIA labels on all interactive elements
   - Keyboard navigation: tab through everything
   - Reduced motion: @media prefers-reduced-motion
   - Color contrast: AA minimum
   - Focus indicators: custom styled
   - Screen reader: sr-only text for 3D elements

3. SEO
   - JSON-LD: Person, Website, BlogPosting schemas
   - OG images: @vercel/og dynamic generation
   - Sitemap: next-sitemap
   - robots.txt
   - Canonical URLs
   - Meta descriptions per page

4. Cross-browser testing
   - Chrome, Firefox, Safari, Edge
   - Mobile: iOS Safari, Chrome Android
   - 3D: verify fallback triggers correctly on low-end

5. Analytics
   - Vercel Analytics (built-in, free)
   - Track: page views, resume downloads, contact submits, terminal usage, game plays

6. Easter eggs
   - console.log: ASCII Jolly Roger + "It's not like I wanted you to find this, baka"
   - Konami code: game + "STAR PLATINUM" flash
   - Hover name 7x: glitches to "Ichigo Praneesh" for 1 frame
   - Loading screen 1% chance: "ZA WARUDO" flash
   - FMAB: Edward Elric watch chain border on interests

7. Hidden CTF flag
   - Encoded string accessible via terminal "flag" command
   - Solving reveals secret section or message
   - Base64 + ROT13 + hex encoding layers
```

### Output
- Production-ready website
- 90+ Lighthouse all categories
- All easter eggs functional
- Analytics tracking
- SEO optimized

### Dependencies
- ALL previous modules (M0-M7)

### Verification
```bash
# Lighthouse: npx lighthouse https://praneeshrv.dev --output=json
# All scores 90+
# Manual: keyboard-only navigation test
# Manual: screen reader test
# Cross-browser: visuals consistent
# Easter eggs: all triggers work
```

---

## INTEGRATION ORDER

```
M0 ─────► M1 ─────► M2 ─────► M3 ─── ► [MVP DEPLOY]
                                 │
                                 ├────► M4 (animations)
                                 ├────► M5 (terminal)
                                 ├────► M6 (minigame, needs M5)
                                 ├────► M7 (blog)
                                 └────► M8 (polish, needs ALL)
```

M4-M7 can be built in parallel after MVP deploy. M8 is always last.

---
*Module Breakdown v1.0 | 2026-04-25*

# PRANEESH R V — PERFECTED PORTFOLIO PLAN v2.0
### *"The Void Speaks in Packets"*
> Enhanced, corrected, and future-proofed version of the original masterplan.
> Original preserved untouched at `praneesh_portfolio_masterplan.md`.

---

## WHAT CHANGED FROM v1.0

| # | Issue in Original | Fix in v2.0 |
|---|-------------------|-------------|
| 1 | Contentlayer (deprecated 2024) | → Velite (type-safe, maintained) |
| 2 | GSAP Club plugins (SplitText, MorphSVG, DrawSVG) = PAID | → splitting.js, CSS stroke animations, flubber.js |
| 3 | Kaboom.js (deprecated) | → Pure Canvas API game loop |
| 4 | Tailwind v4 assumed v3-style config | → CSS-first `@theme` config, no tailwind.config.ts |
| 5 | Berkeley Mono (paid font) | → JetBrains Mono / Geist Mono (free) |
| 6 | Midjourney/DALL-E for images (paid) | → Ideogram / Leonardo AI / FLUX (free) |
| 7 | No error boundary around 3D | → Added WebGL crash protection |
| 8 | No GPU-adaptive particle counts | → 10k→2k→CSS progressive tiers |
| 9 | Missing 2025-2026 web APIs | → View Transitions, scroll-timeline, @starting-style, Popover API |
| 10 | ESLint + Prettier (slow, two tools) | → Biome (single binary, 10-40x faster) |
| 11 | Framer Motion (heavier) | → motion.dev (lighter successor) |
| 12 | react-syntax-highlighter | → Shiki (faster, better themes) |
| 13 | No MVP definition | → MVP at M0-M3 (~3 weeks), full at M0-M8 (~3 months) |
| 14 | 12-week timeline (aggressive for student) | → Realistic 10-14 week timeline with student pace |
| 15 | Missing hooks (useReducedMotion, useMediaQuery) | → Added to architecture |

---

## 1. CORE VISION & CONCEPT
*(Unchanged — vision is S-tier. Keeping it exactly as written.)*

**"A Dying Star that Knows Too Much."**

The website IS the universe. Visitor = astronaut dropped out of warp speed into Praneesh's cosmos. Center: pulsing Quasar/Neutron Star. Around it: Dyson Sphere under construction, orbital data rings, code debris, planetary bodies per domain.

Aesthetic: **deep space + cyberpunk terminal + Arch Linux ricing culture**.

### Conceptual Pillars
| Pillar | Meaning |
|--------|---------|
| **The Void** | Deep black, stars, silence before exploit fires |
| **Signal** | Neon green terminal glow, packet blips, scan lines |
| **Power** | Purple energy, quasar jets, Dyson sphere rings |
| **Precision** | Monospace fonts, clean grid-break layouts, surgical typography |
| **Chaos (controlled)** | CTF energy, glitch effects, souls-game resilience |

### Tagline
`root@cosmos:~$ whoami` ← recommended. Merges hacker + space + Arch identity perfectly.

---

## 2. TECH STACK v2.0 — THE ARSENAL (CORRECTED)

### Core Framework
```
Next.js 15 (App Router + Turbopack)
├── React 19 Server Components → SEO pages
├── Client Components → 3D/animation
├── File routing → Blog
├── next/image → texture optimization
├── next/font → zero layout shift fonts
├── Turbopack → faster dev builds (default in v15)
└── Server Actions → contact form
```

### 3D & Graphics
```
@react-three/fiber (R3F) — React ↔ Three.js bridge
@react-three/drei — prebuilt helpers (Stars, OrbitControls, Sparkles, Cloud)
@react-three/postprocessing — Bloom, Vignette, (Chromatic desktop-only)
@pmndrs/detect-gpu — GPU tier detection for progressive enhancement
three (r170+) — core Three.js

Optional:
  Spline (@splinetool/react-spline) — for hero centerpiece if custom GLSL too complex initially
```

### Animation
```
GSAP (core — FREE)
├── ScrollTrigger (FREE plugin)
├── TextPlugin (FREE — typewriter effects)
└── NO Club plugins (SplitText, MorphSVG, DrawSVG are PAID)

motion.dev — React animation (lighter successor to Framer Motion)
├── AnimatePresence → mount/unmount
├── Layout animations
├── Hover/tap states
└── Page transitions via View Transitions API

splitting.js — FREE alternative to GSAP SplitText
├── Character-level text splitting
├── Word/line splitting
└── CSS variable injection for stagger

CSS Native Animations (bleeding edge):
├── scroll-timeline → scroll-driven section reveals
├── @starting-style → animate elements appearing
├── View Transitions API → page route transitions
└── Keyframe animations → glitch, glow, pulse effects

Lottie (lottie-react) — complex pre-animated icons (loading, skill icons)
```

### Styling
```
Tailwind CSS v4 (CSS-first config)
├── @theme block in CSS (no tailwind.config.ts!)
├── @apply for component classes
├── v4 native container queries
└── v4 native color-mix()

CSS Modules — complex component-specific styles
shadcn/ui — accessible headless components (heavily customized)
```

### Terminal & Code
```
xterm.js — real terminal emulator
├── Custom theme (green-on-void)
├── Custom command interpreter
└── Fits addon for responsive sizing

Shiki — syntax highlighting (replaces react-syntax-highlighter)
├── 10x faster
├── Theme: vitesse-dark or custom void theme
├── Used in blog posts + project code blocks
└── Next.js built-in support via @shikijs/rehype

Custom typewriter — requestAnimationFrame-based (no npm dependency)
```

### Blog / Content
```
Velite — type-safe content layer (replaces dead Contentlayer)
├── MDX files in /content/blog
├── Compile-time validation
├── Generated TypeScript types
├── Zero runtime cost
└── Git-based, zero hosting cost

Alternative: @next/mdx + gray-matter (simpler, fewer features)
```

### Minigame
```
Pure Canvas API + requestAnimationFrame
├── Zero dependencies
├── Full control over rendering
├── Custom game loop
├── Easy to lazy-load (single component)
```

### State Management
```
Zustand — lightweight global state
├── Terminal state (open/closed, command history)
├── Game state (score, active, paused)
├── UI state (loading complete, reduced motion)
└── Theme state (future light mode)
```

### Other Libraries
```
react-intersection-observer — scroll triggers (backup to GSAP)
tsParticles — CSS particle fallback for low-end GPUs
react-hot-toast — notifications
zustand — state
react-hook-form + zod — contact form
Resend — email API (free 3k/mo)
gray-matter — frontmatter parsing (if not using Velite)
date-fns — date formatting
lucide-react — icons
flubber — SVG morph animations (free MorphSVG alternative)
```

### Dev Tools
```
TypeScript 5.x — strict mode
Biome — lint + format (replaces ESLint + Prettier, 10-40x faster)
Husky + lint-staged — pre-commit hooks
Vitest — unit tests
Playwright — E2E tests
@next/bundle-analyzer — bundle size monitoring
Lighthouse CI — performance CI gate
```

### Package Manager
```
pnpm (recommended) or Bun
├── pnpm: fastest installs, strict node_modules
├── Bun: fastest runtime, built-in test runner
└── NOT npm (slower, flat node_modules)
```

---

## 3. DESIGN SYSTEM
*(Palette unchanged — it's excellent. Adding implementation notes for v4.)*

### Color Palette (Tailwind v4 CSS-first)
```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* Backgrounds */
  --color-void: #000005;
  --color-void-2: #03000D;
  --color-surface: #0A0A1A;
  --color-surface-2: #0F0F2A;

  /* Primary — Quasar Green */
  --color-green: #00FF88;
  --color-green-dim: #00CC6A;
  --color-green-glow: rgba(0, 255, 136, 0.15);

  /* Secondary — Nebula Purple */
  --color-purple: #8B5CF6;
  --color-purple-hot: #A78BFA;
  --color-purple-deep: #4C1D95;
  --color-purple-glow: rgba(139, 92, 246, 0.20);

  /* Tertiary — Plasma Blue */
  --color-blue: #38BDF8;
  --color-blue-hot: #7DD3FC;
  --color-blue-deep: #0C4A6E;

  /* Danger */
  --color-red: #FF3366;
  --color-orange: #FF6B35;

  /* Text */
  --color-text-primary: #E8E8F0;
  --color-text-secondary: #8888AA;
  --color-text-dim: #444466;
  --color-text-mono: #00FF88;

  /* Special */
  --color-gold: #F5A623;
  --color-neutron: #FFFFFF;
}
```

### Typography
```
Display:   "Orbitron" (space tech, logo/name) — Google Fonts, free
Body:      "DM Sans" (clean, variable weight) — Google Fonts, free
Mono:      "JetBrains Mono" (what you USE on Arch) — free
Accent:    "Cinzel" (cosmic, ancient-civ feel) — Google Fonts, free

Load via: next/font (Google Fonts + local subsets, zero layout shift)
```

### Glassmorphism, Glow, Cursor
*(Unchanged from original — well designed.)*

---

## 4. SITE ARCHITECTURE & ROUTING
*(Unchanged — structure is solid.)*

```
/ (Home)
  ├── #hero          — Landing / Space Scene
  ├── #about         — About Me
  ├── #projects      — Projects / Works
  ├── #skills        — Skills / Stack
  ├── #experience    — Timeline
  ├── #ctf           — CTF Hall of Fame
  ├── #contact       — Contact
  └── [floating]     — Terminal, Minigame trigger

/blog                — Blog index
/blog/[slug]         — Individual posts

/resume              — PDF render/download
/uses                — Arch setup, tools, config

404                  — "404.exe not found" terminal page
```

### Navigation — Floating Orbital Nav
*(Unchanged — unique, on-brand.)*

---

## 5. SECTIONS
*(Unchanged from original — designs are excellent. See MODULE_BREAKDOWN.md for implementation details per section.)*

Sections: Hero, About, Projects, Skills, Experience, CTF Hall of Fame, Certifications, Blog, Contact, Resume.

---

## 6. MINIGAME — PACKET RUNNER
*(Concept unchanged. Implementation updated.)*

**Engine:** Pure Canvas API + `requestAnimationFrame` (not Kaboom.js — it's deprecated)

**Trigger:** 
1. `play` in terminal
2. `MINI_GAME.EXE` button (terminal-styled icon)
3. Konami code (↑↑↓↓←→←→BA)

**Anime refs in power-ups:** Hollow fragment (Bleach), Devil Fruit (One Piece) — tiny pixel art.

---

## 7. ANIMATIONS & MOTION SYSTEM

### Loading Screen
*(Unchanged — boot sequence design is perfect.)*

### Page Transitions — UPGRADED
```
Between routes: View Transitions API (native browser)
├── Fallback: motion.dev AnimatePresence
├── Cross-fade with subtle scale
└── Zero JS for browsers that support it

Between sections: GSAP ScrollTrigger + CSS scroll-timeline
├── GSAP for complex multi-step sequences
├── CSS scroll-timeline for simple opacity/translate
└── Progressive enhancement: CSS-only if JS disabled
```

### Text Animations — CORRECTED
```
Character reveals: splitting.js (FREE, replaces paid GSAP SplitText)
├── Splits text into <span> per char/word/line
├── Injects CSS custom properties for stagger (--char-index)
├── Animate via CSS or GSAP targeting the spans

Line drawing: CSS stroke-dasharray + stroke-dashoffset (replaces paid DrawSVG)

Shape morphing: flubber.js or CSS clip-path transitions (replaces paid MorphSVG)
```

---

## 8. 3D SCENE — TECHNICAL DEEP DIVE
*(Core unchanged — adding error boundary + progressive tiers.)*

### NEW: Error Boundary
```tsx
<ErrorBoundary fallback={<CSSParticleFallback />}>
  <Suspense fallback={<LoadingScreen />}>
    <Canvas>
      <SpaceScene />
    </Canvas>
  </Suspense>
</ErrorBoundary>
```

### NEW: Progressive Enhancement Tiers
```
Tier 1 (High desktop, GPU score ≥ 3):
  Full scene: 10k stars, 6 planets, Dyson Sphere, all PostProcessing
  
Tier 2 (Mid-range, GPU score 2):
  8k stars, 4 planets, no Dyson Sphere, Bloom only

Tier 3 (Low-end / Mobile, GPU score 1):
  CSS particle background (tsParticles), no WebGL
  2D animated neutron star (CSS radial-gradient + pulse)
  
Tier 4 (No JS / SSR):
  Static dark background, all text content readable
```

### NEW: Texture Strategy
```
Planet textures: NASA public domain (solarsystemscope.com/textures)
Format: KTX2 (GPU-compressed) via drei useKTX2
Fallback: WebP for non-KTX2 browsers
Resolution: 2048x1024 desktop, 512x256 mobile
```

---

## 9. TERMINAL
*(Unchanged — design is thorough.)*

---

## 10. ANIME EASTER EGGS
*(Unchanged — subtle, perfect balance.)*

---

## 11. PERFORMANCE & OPTIMIZATION

### Target Metrics
```
Lighthouse (desktop):  95+ Performance, 95+ A11y, 100 BP, 100 SEO
Lighthouse (mobile):   85+ Performance (3D is heavy), 95+ rest
LCP: < 2.5s (defer 3D, SSR text first)
INP: < 100ms
CLS: < 0.1
```

### NEW: LCP Strategy
```
1. SSR all text content (hero name, tagline, section text)
2. Dynamic import 3D Canvas: const Canvas = dynamic(() => import('./SpaceScene'), { ssr: false })
3. Show styled text immediately, 3D loads behind/below
4. Skeleton shimmer while 3D initializes
5. Font: preload display font, swap body fonts
```

### Progressive Enhancement
*(Same 4 tiers as Section 8.)*

---

## 12. SEO, ACCESSIBILITY & ANALYTICS
*(Unchanged — thorough.)*

Analytics: **Vercel Analytics** (free, built-in) as primary. Umami as optional self-hosted backup.

---

## 13. DEPLOYMENT
*(Unchanged — Vercel free tier.)*

### NEW: Static Asset Strategy
```
Heavy textures (planet .ktx2 files): Consider Cloudflare R2 (free egress)
  → Only if Vercel bandwidth becomes a concern
  → Start with Vercel, migrate if needed
```

---

## 14. FUTURE-PROOFING
*(Unchanged — architecture principles solid.)*

---

## 15. BUILD PHASES — REALISTIC TIMELINE v2.0

### MVP Track (Deployable WOW — ~3-4 weeks active work)
```
Week 1:     M0 Scaffold + M1 Design System
Week 2-3:   M2 3D Space Scene
Week 3-4:   M3 All Sections (with placeholder data)
→ DEPLOY MVP. Site looks incredible. Sections work. 3D runs. 🚀
```

### Enhancement Track (~6-8 more weeks)
```
Week 5:     M4 Animation Layer
Week 6:     M5 Terminal Easter Egg
Week 7-8:   M6 Minigame (Packet Runner)
Week 9-10:  M7 Blog Engine + first posts
Week 10-11: M8 Polish & Launch
```

### Total: ~11 weeks active work
With student schedule (not full-time): **14-16 weeks realistic**

---

## 16. FILE/FOLDER STRUCTURE v2.0

```
praneesh-portfolio/
├── app/
│   ├── (home)/
│   │   └── page.tsx                # Main single-page
│   ├── blog/
│   │   ├── page.tsx                # Blog index
│   │   └── [slug]/
│   │       └── page.tsx            # Post page
│   ├── uses/
│   │   └── page.tsx                # /uses page
│   ├── api/
│   │   └── contact/
│   │       └── route.ts            # Contact form API
│   ├── layout.tsx                  # Root layout
│   ├── not-found.tsx               # 404 terminal page
│   └── globals.css                 # Design tokens + Tailwind v4 @theme
│
├── components/
│   ├── 3d/
│   │   ├── SpaceScene.tsx          # Main R3F canvas
│   │   ├── NeutronStar.tsx         # Custom GLSL shader
│   │   ├── AccretionDisk.tsx       # Ring + shader
│   │   ├── RelativisticJets.tsx    # Cone + additive blend
│   │   ├── Planet.tsx              # Sphere + texture + orbit
│   │   ├── StarField.tsx           # Points geometry
│   │   ├── DysonSphere.tsx         # Wireframe icosahedron
│   │   ├── AsteroidBelt.tsx        # Instanced mesh
│   │   └── PostProcessing.tsx      # Bloom, vignette
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   ├── Experience.tsx
│   │   ├── CTFHallOfFame.tsx
│   │   ├── Certifications.tsx
│   │   ├── BlogPreview.tsx
│   │   └── Contact.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── GlassPanel.tsx
│   │   ├── Terminal.tsx
│   │   ├── Cursor.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── Navigation.tsx
│   │   ├── GlitchText.tsx
│   │   ├── TypewriterText.tsx
│   │   ├── ScanLine.tsx
│   │   └── ErrorBoundary.tsx       # NEW: WebGL crash protection
│   ├── game/
│   │   └── PacketRunner.tsx
│   └── fallbacks/
│       └── CSSParticleBackground.tsx  # NEW: Low-end GPU fallback
│
├── content/
│   ├── blog/
│   │   └── *.mdx                   # Blog posts
│   └── data/
│       ├── projects.json
│       ├── skills.json
│       ├── experience.json
│       └── ctf-achievements.json
│
├── lib/
│   ├── fonts.ts                    # next/font config
│   ├── utils.ts                    # General utilities
│   ├── animations.ts               # GSAP timeline configs
│   ├── blog.ts                     # Blog helpers (Velite)
│   ├── gpu-detection.ts            # NEW: GPU tier logic
│   └── terminal-commands.ts        # NEW: Command handler map
│
├── hooks/
│   ├── useGPUTier.ts               # GPU detection hook
│   ├── useTerminal.ts              # Terminal state/commands
│   ├── useScrollProgress.ts        # Scroll percentage
│   ├── useReducedMotion.ts         # NEW: prefers-reduced-motion
│   └── useMediaQuery.ts            # NEW: responsive hooks
│
├── shaders/                        # NEW
│   ├── neutronStar.vert
│   ├── neutronStar.frag
│   ├── accretionDisk.frag
│   └── jets.frag
│
├── stores/
│   └── globalStore.ts              # Zustand
│
├── types/
│   └── index.ts
│
├── public/
│   ├── resume.pdf
│   ├── textures/                   # KTX2 + WebP fallbacks
│   ├── fonts/                      # Self-hosted fonts
│   └── og-image.png
│
├── next.config.ts
├── biome.json                      # NEW: replaces .eslintrc + .prettierrc
├── tsconfig.json
├── package.json
└── .env.local
```

---

## 17. AI TOOLS INTEGRATION v2.0

*(See TOOL_ASSIGNMENT.md for detailed per-module assignment.)*
*(See FREE_TOOLS_GUIDE.md for complete free tools inventory.)*

---

## 18. CONTENT CHECKLIST
*(Unchanged — content comes after base website.)*

---

## SUMMARY

```
ORIGINAL MASTERPLAN: Visionary but had deprecated tools + paid dependencies + scope issues
PERFECTED PLAN v2.0: All free, all maintained, bleeding-edge, realistic timeline, modularized

MVP in ~3-4 weeks → Full in ~14-16 weeks (student pace)
$0 cost (all free tools + student offers)
9 independent modules, each buildable + testable separately
3 AI tools assigned per module for maximum efficiency
```

---
*Perfected Plan v2.0 | 2026-04-25 | Classification: PERSONAL*

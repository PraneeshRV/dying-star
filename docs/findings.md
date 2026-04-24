# Findings & Decisions

## Requirements
- Dark, 3D-immersive, explorable portfolio website
- Space theme: neutron star/quasar center, planets, asteroids, Dyson Sphere
- Cybersecurity student identity + Arch Linux + terminal aesthetic
- Subtle anime refs (Bleach, One Piece, JJBA, FMAB)
- Sections: Hero, About, Projects, Skills, Experience, CTF, Blog, Contact, Resume
- Interactive minigame (Packet Runner)
- Terminal easter egg (xterm.js)
- Future-proof architecture (content-code separation)
- Budget: $0 (student — GitHub Copilot, Antigravity, ChatGPT all via student offers)
- Target: recruiters + public + security community

## Research Findings

### Masterplan Issues Found
1. **Contentlayer = DEAD** — deprecated since 2024. Use Velite or fumadocs-mdx
2. **GSAP Club plugins = PAID** — SplitText, MorphSVG, DrawSVG require GreenSock Club. Alternatives:
   - SplitText → `splitting.js` (free) or custom CSS split
   - DrawSVG → CSS `stroke-dasharray` + `stroke-dashoffset` animation
   - MorphSVG → `flubber.js` (free) or CSS `clip-path` morph
3. **Kaboom.js = deprecated** — use pure Canvas API or Phaser 3
4. **Tailwind v4 = CSS-first** — no `tailwind.config.ts` anymore, config in CSS `@theme`
5. **Berkeley Mono = PAID** — stick with JetBrains Mono (free, user already uses it)
6. **Midjourney = NOT free** — use Ideogram (free), Leonardo AI (free tier), or FLUX on HuggingFace
7. **Framer Motion → motion.dev** — rebrand + lighter standalone version available

### Bleeding-Edge 2025-2026 Tech Additions
| Tech | What | Why Add |
|------|------|---------|
| View Transitions API | Native browser page transitions | Zero JS, smooth, future-standard |
| CSS `@starting-style` | Animate from `display:none` | No JS modal/popover animations |
| Popover API | Native popover/modal | Replace JS-heavy modals |
| CSS Anchor Positioning | Position tooltips declaratively | Cleaner skill tooltips |
| CSS `scroll-timeline` | Scroll-driven animations in CSS | Replace some GSAP ScrollTrigger |
| Container Queries | Component-responsive design | Smarter than media queries |
| Biome | Replaces ESLint + Prettier | 10-40x faster, single binary |
| motion.dev | Framer Motion successor | Lighter, framework-agnostic |
| React 19 `use()` hook | Simpler async data | Cleaner data loading |
| Next.js 15 Turbopack | Faster dev builds | Enabled by default |
| Shiki | Syntax highlighting | Faster + prettier than react-syntax-highlighter |

### Free Shader Resources
- Shadertoy.com — GLSL inspiration
- The Book of Shaders — learning
- drei built-ins: Stars, Sparkles, Cloud, MeshDistortMaterial
- solarsystemscope.com/textures — free planet textures
- NASA SVS (svs.gsfc.nasa.gov) — public domain space imagery

### Performance Strategy
- LCP < 2.5s with 3D → SSR text first, defer Canvas via dynamic import
- GPU detection: `@pmndrs/detect-gpu` → 4 progressive tiers
- Adaptive star count: 10k desktop → 2k mobile → CSS particles low-end
- PostProcessing: Bloom only on desktop, skip Chromatic+Noise on mobile
- Texture format: KTX2 (GPU-compressed) via drei's useKTX2
- Error boundary around R3F Canvas → graceful fallback

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Next.js 15 App Router | RSC for SEO, client for 3D, file routing for blog |
| R3F + drei + postprocessing | Gold standard for React 3D, huge ecosystem |
| GSAP core (free) + CSS scroll animations | Best animation lib, supplement with native CSS |
| motion.dev | Lighter Framer Motion successor for React transitions |
| Tailwind v4 (CSS-first) | Latest, config-in-CSS, faster |
| xterm.js | Real terminal emulator, authentic feel |
| Pure Canvas for minigame | Zero deps, full control, Kaboom deprecated |
| Velite for blog MDX | Contentlayer replacement, type-safe |
| Shiki for code blocks | Faster, better themes than react-syntax-highlighter |
| Biome for lint/format | Replaces ESLint+Prettier, 10-40x faster |
| Zustand for state | Minimal, proven, good for terminal/game state |
| Resend for contact | Free 3k emails/mo, simple API |
| Vercel for hosting | Free tier, Next.js native, edge network |
| splitting.js for text effects | Free SplitText alternative |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| (none yet) | — |

## Resources
- Original masterplan: `praneesh_portfolio_masterplan.md`
- Resume: `Praneesh_R_V_Resume.pdf`
- Three.js docs: https://threejs.org/docs/
- R3F docs: https://r3f.docs.pmnd.rs/
- drei: https://drei.docs.pmnd.rs/
- GSAP: https://gsap.com/docs/
- Velite: https://velite.js.org/
- Shiki: https://shiki.style/
- xterm.js: https://xtermjs.org/
- Biome: https://biomejs.dev/
- NASA textures: https://solarsystemscope.com/textures/

---
*Update this file after every 2 view/browser/search operations*

## UI/UX Pro Max Research (2026-04-25)

### Style Match
Best styles for this project (from ui-ux-pro-max):
1. **HUD / Sci-Fi FUI** — neon cyan, holographic blue, glow effects, scanning anims, ticker text ← PERFECT match
2. **Dark Mode (OLED)** — deep black #000000, dark grey #121212, minimal glow ← base layer
3. **3D & Hyperrealism** — WebGL/Three.js, realistic shadows, parallax, R3F 10/10 ← 3D layer
4. **Motion-Driven** — scroll anim, hover, entrance, GSAP 10/10 ← animation layer

### Color Validation
Cybersecurity Platform palette from database:
- Primary: #00FF41 (Matrix Green) ← close to our #00FF88
- Background: #000000 ← matches our --void
- Text: #E0E0E0 ← close to our --text-primary
- **Our palette is validated and better** (more purple/blue dimension)

### Typography Validation
Best match from database: **Crypto/Web3 pairing**
- Heading: **Orbitron** ← exactly what we chose ✓
- Body: **Exo 2** (alternative to DM Sans, more sci-fi)
- Decision: keep Orbitron + DM Sans (more readable body than Exo 2)
- Mono: JetBrains Mono (not in database, but user's actual terminal font)

### Product Type
Portfolio/Personal → Primary: **Motion-Driven + Minimalism**
- Our approach = Motion-Driven + HUD/Sci-Fi + 3D = correct for cybersecurity niche

### Skills to Use During Build
| Skill | When | Why |
|-------|------|-----|
| **frontend-design** | Every component | Avoid generic AI slop, bold aesthetic |
| **ui-ux-pro-max** | Design decisions | 99 UX guidelines, a11y checklist |
| **react-best-practices** | All React code | 70 perf rules, waterfall elimination |
| **composition-patterns** | Component architecture | Compound components, no boolean prop bloat |
| **webapp-testing** | After each module | Playwright verification |
| **verification-before-completion** | Before any "done" claim | Evidence before assertions |
| **brainstorming** | Already active | Design-before-code gate |
| **planning-with-files** | Already active | Persistent working memory |

### Key UX Rules to Enforce (from ui-ux-pro-max)
- Touch targets ≥ 44×44px
- Animation 150-300ms, ease-out enter, ease-in exit
- Exit animations 60-70% of enter duration
- Stagger list items 30-50ms per item
- prefers-reduced-motion MUST be respected
- Color contrast ≥ 4.5:1 (our green #00FF88 on #000005 = 12.5:1 ✓)
- No emoji as icons → lucide-react
- z-index scale: 0/10/20/40/100/1000
- Focus rings 2-4px on all interactive elements


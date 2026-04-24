# PRANEESH R V — PORTFOLIO WEBSITE MASTER PLAN
### *"The Void Speaks in Packets"*
> A complete, no-compromises blueprint for building one of the most memorable cybersecurity portfolio websites on the internet.

---

## TABLE OF CONTENTS

1. [Core Vision & Concept](#1-core-vision--concept)
2. [Tech Stack — The Arsenal](#2-tech-stack--the-arsenal)
3. [Design System](#3-design-system)
4. [Site Architecture & Routing](#4-site-architecture--routing)
5. [Section-by-Section Breakdown](#5-section-by-section-breakdown)
6. [The Interactive Minigame](#6-the-interactive-minigame)
7. [Animations & Motion System](#7-animations--motion-system)
8. [The Space Scene — Technical Deep Dive](#8-the-space-scene--technical-deep-dive)
9. [Terminal Layer (Cybersecurity Soul)](#9-terminal-layer-cybersecurity-soul)
10. [Anime Easter Eggs](#10-anime-easter-eggs)
11. [Performance & Optimization](#11-performance--optimization)
12. [SEO, Accessibility & Analytics](#12-seo-accessibility--analytics)
13. [Deployment & Infrastructure](#13-deployment--infrastructure)
14. [Future-Proofing & Extensibility](#14-future-proofing--extensibility)
15. [Build Phases & Milestones](#15-build-phases--milestones)
16. [File/Folder Structure](#16-filefolder-structure)
17. [AI Tools Integration](#17-ai-tools-integration)
18. [Content Checklist](#18-content-checklist)

---

## 1. CORE VISION & CONCEPT

### The Big Idea
**"A Dying Star that Knows Too Much."**

The website IS the universe. The visitor is an astronaut who has just dropped out of warp speed into Praneesh's corner of the cosmos. At the center: a slowly pulsing **Quasar** (or Neutron Star). Around it: a **Dyson Sphere under construction**, orbital rings of data, debris fields of code fragments, and planetary bodies representing each domain (CTF, Projects, Skills, etc.).

The aesthetic fuses **deep space + cyberpunk terminal + Arch Linux ricing culture**. Like someone who runs a tiling window manager in space and uses neovim on a spaceship.

### Conceptual Pillars

| Pillar | What it Means |
|--------|---------------|
| **The Void** | Deep black backgrounds, stars, the silence before an exploit fires |
| **Signal** | Neon green terminal glow, packet blips, scan lines |
| **Power** | Purple energy, quasar jets, Dyson sphere energy rings |
| **Precision** | Monospace fonts, clean grid-break layouts, surgical typography |
| **Chaos (controlled)** | CTF-player energy, glitch effects, hacker aesthetic, souls-game resilience |

### The Tagline Options (pick one)
- *"I break things to understand them."*
- *"root@cosmos:~$ whoami"*
- *"The void speaks in packets."*
- *"Exploiting the universe, one CTF at a time."*

---

## 2. TECH STACK — THE ARSENAL

### Core Framework
```
Next.js 15 (App Router)
- React Server Components for SEO-critical pages
- Client Components for all interactive 3D/animation elements
- File-based routing perfect for Blog section
- Built-in image optimization (massive perf win for space textures)
```

### 3D & Graphics
```
Three.js (r3f) + React Three Fiber + Drei
- The gold standard for WebGL in React
- @react-three/fiber — React wrapper for Three.js
- @react-three/drei — Prebuilt helpers (Stars, OrbitControls, etc.)
- @react-three/postprocessing — Bloom, chromatic aberration, glitch effects
- Leva — Dev GUI for tweaking 3D parameters

Spline (optional accent)
- For specific pre-built 3D objects (neutron star, asteroid, etc.)
- Embeddable as <spline-viewer> or via @splinetool/react-spline
- Use for the hero centerpiece if custom r3f is too heavy initially
```

### Animation
```
GSAP (GreenSock) — Primary animation engine
- ScrollTrigger plugin for scroll-driven reveals
- SplitText for character-level text animations
- MorphSVG for shape transitions
- DrawSVG for line-draw effects

Framer Motion — React-native animations
- Page transitions
- Hover states
- Layout animations
- AnimatePresence for mount/unmount

Lottie (via lottie-react)
- For complex pre-animated icons (loading screens, skill icons)

CSS Houdini + Custom Properties
- For advanced gradient animations and paint worklets
```

### Styling
```
Tailwind CSS v4 — Utility-first base
CSS Modules — For complex component-specific styles
shadcn/ui — Headless accessible components (used sparingly, heavily customized)
```

### Terminal & Code
```
xterm.js — Real terminal emulator in the browser
  - Powers the interactive terminal easter egg
  - Custom theme matching the site palette

react-syntax-highlighter (with a custom theme)
  - For code blocks in blog and project pages

Typewriter Effect (custom or 'typewriter-effect' npm)
```

### Blog / CMS
```
Option A (Recommended): Contentlayer + MDX files
  - MDX files in /content/blog — write in markdown, render as React
  - Zero cost, full control, Git-based
  - Syntax highlighting, custom components in blog posts

Option B: Sanity.io (free tier)
  - Visual CMS if you want to write blogs without touching code
  - Great for future collaboration

Option C: Hashnode (embed)
  - If you already have a Hashnode blog, embed it
```

### Minigame
```
Kaboom.js — Lightweight game library
  OR
Pure Canvas API with custom game loop (more control, zero dependencies)
  OR
Phaser 3 — If the game becomes complex
```

### Other Libraries
```
react-intersection-observer — Scroll-based triggers without GSAP
particles-bg OR tsParticles — Star field / particle effects fallback
react-hot-toast — Notifications (contact form success, easter eggs)
react-confetti — For CTF win celebration moments
zustand — Lightweight global state (terminal state, game state, theme)
react-hook-form + zod — Contact form validation
Resend (email API) — Free 3000 emails/month for contact form
gray-matter + next-mdx-remote — Blog post parsing
date-fns — Date formatting for blog/timeline
lucide-react — Icon library (clean, minimal)
```

### Dev Tools
```
TypeScript — Strict mode, always
ESLint + Prettier + Husky (pre-commit hooks)
Vitest — Unit tests
Playwright — E2E tests for critical flows
Storybook — Component documentation (great for portfolio too)
Lighthouse CI — Performance monitoring
```

---

## 3. DESIGN SYSTEM

### Color Palette

```css
:root {
  /* Backgrounds */
  --void:        #000005;   /* Deep space black — primary bg */
  --void-2:      #03000D;   /* Slightly warm black */
  --surface:     #0A0A1A;   /* Card/panel backgrounds */
  --surface-2:   #0F0F2A;   /* Elevated surfaces */

  /* Primary Accent — Quasar Green (terminal) */
  --green:       #00FF88;   /* Electric terminal green */
  --green-dim:   #00CC6A;   /* Subdued green */
  --green-glow:  rgba(0, 255, 136, 0.15); /* Glow overlay */

  /* Secondary Accent — Nebula Purple */
  --purple:      #8B5CF6;   /* Main purple */
  --purple-hot:  #A78BFA;   /* Bright purple */
  --purple-deep: #4C1D95;   /* Deep purple for bg elements */
  --purple-glow: rgba(139, 92, 246, 0.20);

  /* Tertiary Accent — Plasma Blue */
  --blue:        #38BDF8;   /* Cyan-blue */
  --blue-hot:    #7DD3FC;   /* Light plasma blue */
  --blue-deep:   #0C4A6E;   /* Deep blue for bg */

  /* Danger / Alert (for CTF, security elements) */
  --red:         #FF3366;   /* Alert red */
  --orange:      #FF6B35;   /* Warm warning */

  /* Text */
  --text-primary:   #E8E8F0;
  --text-secondary: #8888AA;
  --text-dim:       #444466;
  --text-mono:      #00FF88; /* Green mono for terminal text */

  /* Special */
  --gold:        #F5A623;   /* CTF achievement gold */
  --neutron:     #FFFFFF;   /* Core of the neutron star */
}
```

### Typography

```
Display Font:    "Space Grotesk" — NO. Use "Syne" or "Bebas Neue" for headers
                 Actually: "Orbitron" for main logo/name (space tech feel)
                 OR "Oxanium" (sci-fi, readable, unique)

Body Font:       "DM Sans" or "Cabinet Grotesk" (variable)

Monospace:       "JetBrains Mono" (what you actually use in Arch!)
                 OR "Geist Mono" (Vercel's, very clean)
                 For terminal: "Berkeley Mono" if budget allows

Accent/Quote:    "Cinzel" — for dramatic section dividers
                 (has a cosmic, ancient-civilization feel)

Load via: next/font (Google Fonts + local, zero layout shift)
```

### Typography Scale
```css
--text-xs:   0.75rem;
--text-sm:   0.875rem;
--text-base: 1rem;
--text-lg:   1.125rem;
--text-xl:   1.25rem;
--text-2xl:  1.5rem;
--text-3xl:  1.875rem;
--text-4xl:  2.25rem;
--text-5xl:  3rem;
--text-6xl:  3.75rem;
--text-7xl:  4.5rem;   /* Hero name */
--text-8xl:  6rem;     /* MAX IMPACT moments */
```

### Glassmorphism System
```css
.glass-panel {
  background: rgba(10, 10, 26, 0.6);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(139, 92, 246, 0.15);
  box-shadow: 
    0 0 40px rgba(139, 92, 246, 0.05),
    inset 0 1px 0 rgba(255,255,255,0.05);
}

.glass-terminal {
  background: rgba(0, 0, 5, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 255, 136, 0.2);
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.1);
}
```

### Glow Effects System
```css
/* Text glows */
.glow-green  { text-shadow: 0 0 20px var(--green), 0 0 60px var(--green-dim); }
.glow-purple { text-shadow: 0 0 20px var(--purple), 0 0 60px var(--purple-deep); }
.glow-blue   { text-shadow: 0 0 20px var(--blue); }

/* Box glows */
.box-glow-green  { box-shadow: 0 0 30px rgba(0,255,136,0.3), 0 0 60px rgba(0,255,136,0.1); }
.box-glow-purple { box-shadow: 0 0 30px rgba(139,92,246,0.3), 0 0 60px rgba(139,92,246,0.1); }
```

### Custom Cursor
```
Default:        A crosshair cursor styled like a terminal cursor (blinking block)
On hover links: Expands + changes color to green with a ring
On hover 3D:    Changes to a targeting reticle
On CTF section: Red "scanning" cursor
Implementation: CSS custom cursor + JS for trail effect
```

---

## 4. SITE ARCHITECTURE & ROUTING

```
/ (Home)
  ├── #hero          — Landing / Space Scene
  ├── #about         — About Me
  ├── #projects      — Projects / Works
  ├── #skills        — Skills / Stack
  ├── #experience    — Timeline
  ├── #ctf           — CTF Hall of Fame (dedicated section)
  ├── #contact       — Contact
  └── [floating]     — Terminal, Minigame trigger

/blog                — Blog index
/blog/[slug]         — Individual blog posts

/resume              — Redirect to /public/resume.pdf (or render inline)

/uses                — The /uses page (what tools you use — very popular with devs)
                       Arch setup, tools, terminal config, etc.

404 Page             — Custom "404.exe not found" terminal-style page
```

### Navigation Design
- **Type**: Floating orbital nav (not a traditional navbar)
- A ring of icons orbiting around a small version of the quasar logo in the top-left
- On mobile: collapses to a hamburger that opens a full-screen terminal-menu
- Active section highlighted with a glow ring
- Scroll progress shown as an orbital arc completion

---

## 5. SECTION-BY-SECTION BREAKDOWN

---

### SECTION 1: HERO / INTRO

**Concept**: The user arrives in deep space. The camera slowly drifts forward toward a massive quasar at the center. Text materializes character by character from the void.

**Elements**:

```
Layer 1 (Three.js Canvas — fills 100vh/vw):
  - Procedurally generated starfield (10,000+ stars with parallax)
  - The Quasar / Neutron Star (center)
    - Pulsating core (white + electric blue)
    - Two relativistic jets shooting up/down (purple-blue gradient beams)
    - Accretion disk (glowing ring, slightly tilted, rotating)
    - Atmospheric bloom post-processing
  - 4-6 Planets (each representing a domain — see below)
  - Asteroid belt between planet rings
  - Dyson Sphere wireframe in construction (partial, outer orbit)
  - Occasional "data packet" streaks across the scene
  - Nebula background (large, soft, layered)

Layer 2 (HTML overlay — centered):
  - Name: "PRANEESH R V" — typed out with a blinking cursor
  - Role: [ "Cybersecurity Student" | "CTF Player" | "Arch User" | "Builder" ]
    → Rotating/cycling with typewriter effect
  - Tagline below (chosen from list above)
  - Two CTA buttons:
    [ EXPLORE.SH ]   [ VIEW RESUME ]
  - Scroll indicator: animated arrow + "scroll to explore" in tiny mono text

Layer 3 (Ambient):
  - Subtle CRT scanlines overlay (very low opacity)
  - Vignette darkening the edges
  - Occasional "glitch" flicker (every ~15 seconds, brief)
```

**Planet-to-Domain Mapping**:
| Planet | Domain | Color | Size |
|--------|---------|-------|------|
| Terra-Hack | CTF / Competitions | Red-orange | Large |
| Nebula-Build | Projects | Blue-green | Medium |
| Cipher-World | Skills & Stack | Purple | Medium |
| Echo-9 | Experience | Gold | Small |
| Arch-Prime | Personal / About | Grey-teal | Small |
| Blog-Star | Blog | White-blue | Small, pulsar-like |

**Interaction**:
- Mouse movement causes subtle parallax on starfield
- Hovering near a planet shows a glowing label
- Clicking a planet smoothly scrolls/transitions to that section
- OrbitControls disabled (auto-rotation only) to keep it cinematic

---

### SECTION 2: ABOUT ME

**Concept**: A spaceship cockpit / command center. First-person HUD aesthetic.

**Layout**: Two-panel split
- Left: Terminal window running `cat about.txt` with typed-out bio
- Right: A stylized avatar / illustration placeholder (or animated ASCII portrait)

**Content blocks** (designed as HUD panels):
```
┌─[ IDENTITY ]──────────────────────────────┐
│ NAME: Praneesh R V                         │
│ LOCATION: Coimbatore, India                │
│ AFFILIATION: Amrita Vishwa Vidyapeetham    │
│ CLEARANCE: Cybersecurity B.Tech (2027)     │
└────────────────────────────────────────────┘

┌─[ OPERATOR PROFILE ]──────────────────────┐
│ Primary: CTF Competitor (Top 10 India)     │
│ Secondary: Web Exploitation, OSINT         │
│ Tertiary: Infrastructure, Linux, Rust      │
└────────────────────────────────────────────┘

┌─[ PERSONAL LOG ]──────────────────────────┐
│ > Arch Linux evangelizer                  │
│ > Hollow Knight / Elden Ring completionist │
│ > Bleach > everything (fight me)          │
│ > Neovim user (obviously)                 │
│ > Currently building: RedCalibur          │
└────────────────────────────────────────────┘
```

**Animation**: Each panel "boots up" as it enters viewport. Text types itself in.

**Fun Element**: A small rotating planet model next to the "About" heading.

---

### SECTION 3: PROJECTS / WORKS

**Concept**: A space station docking bay. Each project is a "docked spacecraft."

**Layout**: Horizontal scroll OR masonry grid of project cards

**Project Card Design**:
```
┌─────────────────────────────────────────────┐
│  [CRAFT DESIGNATION]  [STATUS: ACTIVE/WIP]  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                             │
│  [ 3D Model or Animated Icon of project ]  │
│                                             │
│  PROJECT NAME (large, glowing)              │
│  Short description line                     │
│                                             │
│  TECH STACK: [pill badges]                  │
│                                             │
│  [ BREACH → ]   [ SOURCE ]                 │
└─────────────────────────────────────────────┘
```

**Hover State**: Card tilts in 3D (CSS perspective transform), glows at the border, and a "system scan" line sweeps across it top to bottom.

**Current Projects to Feature**:
1. **RedCalibur** — AI-driven VAPT automation framework
2. **Axec-CLI** — Rust-based AppImage manager for Linux
3. **L3m0nCTF Infrastructure** — GCP + Docker + CTFd platform
4. *(+ space for future projects)*

**Filter Tags**: [All] [Security] [Tools] [Infrastructure] [CTF] [In Progress]

---

### SECTION 4: SKILLS / STACK

**Concept**: A technology tree / star map. Each skill is a star node connected by constellation lines.

**Implementation Options** (pick one):
- **Option A**: D3.js force-directed graph — nodes float and connect dynamically
- **Option B**: Three.js constellation — literally drawn as stars in 3D space
- **Option C**: Static but beautifully designed grid with animated progress rings

**Recommended: Option A + C hybrid**
- Desktop: D3 force graph — interactive, hoverable, zoomable
- Mobile: Categorized grid with CSS animated rings

**Skill Categories & Stars**:
```
SECURITY CLUSTER (Red-orange stars):
  Web Exploitation ●●●●○
  Digital Forensics ●●●●○
  OSINT             ●●●●●
  Cryptography      ●●●○○
  VAPT              ●●●○○
  Network Analysis  ●●●○○

DEVELOPMENT CLUSTER (Blue stars):
  Python            ●●●●○
  Rust              ●●●○○
  C/C++             ●●●○○
  JavaScript        ●●●○○
  Node.js           ●●●○○

INFRASTRUCTURE CLUSTER (Green stars):
  Linux (Arch/Debian) ●●●●●
  Docker              ●●●●○
  GCP                 ●●●○○
  Git                 ●●●●○

TOOLS CLUSTER (Purple stars):
  Burp Suite        ●●●●○
  Wireshark         ●●●○○
  Metasploit        ●●●○○
  Nmap              ●●●●○
```

**Tool Logos**: Show actual logos (with a glowing effect) for recognizable tools.

---

### SECTION 5: EXPERIENCE / TIMELINE

**Concept**: A warp-speed timeline. The user scrolls through time like flying through hyperspace.

**Design**: Vertical timeline with a glowing central spine (like a jump drive corridor). Each entry is a "checkpoint" in the journey.

**Timeline Entries** (with visual differentiation):
```
[2023]  ──► Enrolled at Amrita (B.Tech CSE Cybersecurity)
[2024]  ──► Started CTF journey, joined Team Hunter
[2024]  ──► 45+ CTFs competed, Top 20 India (CTFTime)
[2025]  ──► H7CTF 2025 — Finalist, 14th place / 30 teams
[2025]  ──► Pragyan CTF 2025 — 8th Place, NIT Trichy
[2025]  ──► SIH 2025 — Internal Finals (wipeITclean)
[2025]  ──► L3m0nCTF 2025 — Core Organizer + Lead Infra
[WIP]   ──► PJPT Certification (TCM Security)
[WIP]   ──► RedCalibur — VAPT Automation Framework
[→ ]    ──► The mission continues...
```

**Interaction**: Each checkpoint has an expand-on-hover/click to reveal more detail. The "warp lines" animate as you scroll through.

---

### SECTION 6: CTF HALL OF FAME

*This deserves its own section — it's a major differentiator.*

**Concept**: A hacker's trophy room. Neon-lit display cases.

**Content**:
```
┌─[ TEAM HUNTER STATS ]────────────────────────┐
│  🏆 RANK: Top 10 India (CTFTime)              │
│  🔥 CTFs COMPETED: 50+                        │
│  🌐 SCOPE: National + International           │
│  ⚔️  SPECIALTIES: OSINT / Forensics / Web     │
└──────────────────────────────────────────────┘

NOTABLE ACHIEVEMENTS:
┌──────────────────┬────────────────┬──────────┐
│  COMPETITION     │  RESULT        │  YEAR    │
├──────────────────┼────────────────┼──────────┤
│  H7CTF (SRMIST)  │  14th / Finals │  2025    │
│  Pragyan (NIT T) │  8th Place     │  2025    │
│  [+ more]        │  ...           │  ...     │
└──────────────────┴────────────────┴──────────┘
```

**Animated Element**: A live-ish "flag submission" counter animation, or a radar-sweep visualization of CTF activity.

**Easter Egg**: Clicking the CTF section 3 times in a row triggers a mini "find the flag" challenge on the page — hidden somewhere in the DOM/source.

---

### SECTION 7: CERTIFICATIONS & EDUCATION

Compact section, visually styled as **clearance badges** / ID cards.

```
┌─────────────────────────────────┐
│  [CLEARANCE BADGE]              │
│  Google Cybersecurity Prof.     │
│  VERIFIED ✓                     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  [IN PROGRESS]                  │
│  PJPT — TCM Security            │
│  LOADING ████░░░░ 60%           │
└─────────────────────────────────┘
```

---

### SECTION 8: BLOG

**Layout**: Clean grid of blog cards with a dark editorial feel.

**Card Design**:
- Category tag (top, colored by category)
- Title (large, striking)
- Date + estimated read time
- Excerpt (2 lines)
- A subtle space/tech background texture per card

**Categories** (suggestions for blog topics):
- `[WRITEUP]` — CTF writeups (massive SEO + community value)
- `[RESEARCH]` — Security research
- `[ARCH]` — Linux ricing / Arch setup guides
- `[BUILD]` — Dev logs for RedCalibur, Axec, etc.
- `[THOUGHTS]` — Opinion pieces

**Note**: CTF writeups are *gold* for a security portfolio. Every major CTF you compete in → write a writeup → post it. This builds massive organic traffic from the security community.

---

### SECTION 9: CONTACT

**Concept**: Sending a transmission across space. A "deep space comms array."

**Layout**:
```
"OPEN CHANNEL"

[A stylized satellite dish or pulsar antenna animation]

TRANSMISSION FORM:
  YOUR CALLSIGN:  [input — name]
  FREQUENCY:      [input — email]
  MESSAGE:        [textarea — message]

  [ TRANSMIT >> ]

OR REACH ME AT:
  [GitHub]  [LinkedIn]  [Email]  [CTFtime]
```

**Form**: react-hook-form + Zod validation + Resend API for actual email delivery.

**Success State**: "TRANSMISSION RECEIVED — SIGNAL LOCKED" with a small particle burst animation.

---

### SECTION 10: DOWNLOADABLE RESUME

**Floating element** (not a full section, more a persistent UI element):
- A pulsing "RESUME.PDF" button in the nav/footer
- On click: Brief "DECRYPTING FILE..." animation → then triggers download
- Also accessible at /resume route

---

## 6. THE INTERACTIVE MINIGAME

### Game Concept: "PACKET RUNNER"

A retro-arcade-style game triggered by a hidden command in the terminal, or by a visible "PLAY" button in a corner of the screen.

**Gameplay**:
```
You ARE a network packet navigating through a hostile network.
- Side-scrolling or top-down (recommend: top-down, like the classic Snake but more)
- Avoid: Firewall walls, IDS sensors (red scanners), honeypots
- Collect: Data fragments (score), power-ups (encryption shield, speed burst)
- Boss: An IDS/Firewall boss encounter at score milestones

CONTROLS: WASD or arrow keys
MOBILE: On-screen D-pad

VISUAL STYLE: 
- Grid-based neon world (dark bg, green/blue grid lines)
- Your packet: A glowing blue hexagon
- Enemies: Red scanning beams, orange firewall blocks
- Fonts: Monospace, obviously
```

**Implementation**: Pure Canvas API with requestAnimationFrame game loop.

**Trigger Options**:
1. Type `play` in the terminal easter egg
2. A visible "MINI_GAME.EXE" button (styled like a terminal icon)
3. Konami code (↑↑↓↓←→←→BA) → launches the game

**Leaderboard**: Local storage top scores, optionally a Supabase-backed global leaderboard (free tier).

**Anime Reference Hidden Here**: One of the power-ups can be styled as a "Hollow" fragment (Bleach), another as a "Devil Fruit" (One Piece) — tiny pixel art references only recognizable to those who know.

---

## 7. ANIMATIONS & MOTION SYSTEM

### Loading Screen
```
Duration: 2-3 seconds (skip-able after 1s)

Sequence:
1. Black screen
2. "BOOTING SYSTEM..." terminal text appears
3. A fake progress bar fills:
   [■■■■■■■■░░] LOADING UNIVERSE... 87%
   [■■■■■■■■■░] CALIBRATING QUASAR... 95%
   [■■■■■■■■■■] ESTABLISHING CONNECTION... 100%
4. Brief glitch flash
5. The space scene fades in

Implementation: 
- CSS keyframes for the text/bar
- GSAP for the reveal transition
```

### Page Transitions
```
Between sections (scroll): GSAP ScrollTrigger — each section has an entrance animation
Between routes (Blog, etc.): Framer Motion AnimatePresence
  - Outgoing: Fade out + slight upward drift
  - Incoming: Fade in + slide from below
```

### Scroll Animations (GSAP ScrollTrigger)
```
Hero → About:      Camera "flies through" the starfield (parallax shift)
Section reveals:   Each section header — character by character reveal
Cards:             Stagger-fade from bottom as they enter viewport
Timeline:          Each node "activates" as you scroll past it
Skills graph:      Constellation lines draw themselves in
CTF stats:         Numbers count up from 0 when in view
```

### Hover Micro-interactions
```
Nav links:         Underline draws from center outward (DrawSVG)
Buttons:           Glowing border + slight scale-up + cursor change
Project cards:     3D tilt (CSS perspective) + scan line sweep
Skill nodes:       Glow pulse + tooltip fade in
Social icons:      Slight rotation + color shift
```

### Glitch Effects
```
Used sparingly — makes it feel like a live system:
- Hero name: Brief glitch every 20 seconds
- Section transitions: Frame-split glitch for 100ms
- On certain hover states: Red channel shift
Implementation: CSS clip-path animation OR canvas-based glitch shader
```

---

## 8. THE SPACE SCENE — TECHNICAL DEEP DIVE

### Quasar / Neutron Star Setup (React Three Fiber)

```jsx
// Core Components Needed:

<NeutronStar>
  - Mesh: SphereGeometry (radius 1, high segments)
  - Material: ShaderMaterial (custom GLSL)
    - Animated surface noise (simplex noise in GLSL)
    - White-to-blue-to-purple color gradient from equator to poles
    - Pulsation: uniform float uTime in vertex shader
  - Point light attached to core (casts light on planets)

<AccretionDisk>
  - Mesh: RingGeometry (inner 1.5, outer 4)
  - Material: Custom shader — hot white center, fading to orange to transparent
  - Tilt: rotate(-0.3, 0, 0)
  - Rotation: slow, constant in useFrame

<RelativisticJets>
  - Two ConeGeometry pointing up and down from star
  - Material: Additive blending (transparent, bright blue-purple)
  - Animated length pulse in vertex shader

<StarField>
  - Points geometry (10,000 vertices)
  - BufferGeometry with random positions in sphere
  - Custom PointsMaterial with size attenuation
  - Slight twinkle: random phase offset per star in shader

<Planets>
  - 5-6 SphereGeometry meshes
  - Each with unique texture (use free NASA/procedural textures)
  - Each orbiting: useFrame calculates new position via Math.sin/cos + time
  - Each has a thin RingGeometry for orbital path (low opacity)

<DysonSphere>
  - IcosahedronGeometry (detail level 2)
  - Material: Wireframe mode, emissive purple-blue
  - Partial: Use custom clipping planes to show "under construction"
  - Rotate slowly

<AsteroidBelt>
  - Instanced Mesh (200+ small dodecahedra)
  - Distributed in a torus shape between planets
  - Each instance has slightly different rotation speed

<PostProcessing>
  - Bloom: threshold 0.5, strength 1.5, radius 0.8
  - ChromaticAberration: very subtle (0.003)
  - Vignette: darkness 0.7
  - Noise: subtle film grain
```

### Performance Optimization for 3D
```
- LOD (Level of Detail): Distant planets use lower-poly meshes
- Frustum culling: Automatic via Three.js
- Texture compression: KTX2 format via @ktx2loader
- Mobile fallback: Detect low-end GPU → show CSS particle background instead of WebGL
- useFrame optimization: Only update physics when tab is visible
- Suspend + Preload: React Suspense with <Preload all /> from Drei
```

---

## 9. TERMINAL LAYER (CYBERSECURITY SOUL)

### The Secret Terminal
Accessible via:
1. Keyboard shortcut: `Ctrl + ~` or `Ctrl + ``
2. Clicking a tiny terminal icon (bottom-right corner)
3. Typing anything on the page when no input is focused

**Implementation**: xterm.js + custom command interpreter

### Terminal Commands
```bash
$ whoami
> praneesh — cybersecurity student, ctf player, arch evangelist

$ ls skills/
> web-exploitation/  osint/  forensics/  cryptography/  vapt/

$ cat manifesto.txt
> [multi-line philosophy about security, hacking, learning]

$ ctf --stats
> Teams: Hunter | NOVA
> Rank: Top 10 India
> CTFs Competed: 50+
> [animated bar chart in terminal]

$ ls projects/
> RedCalibur/  Axec-CLI/  L3m0nCTF-Infra/

$ play
> [launches the Packet Runner minigame]

$ neofetch
> [custom ASCII neofetch output with site stats instead of system stats]
> Showing: OS: Arch Linux btw, DE: This Portfolio, 
>          Shell: zsh, Theme: void-dark, Uptime: [since site launch]

$ sudo rm -rf /
> Permission denied. Nice try.

$ hack
> Already in progress.

$ anime
> [shows a brief ASCII art — a subtle Soul Society / Bleach reference]

$ matrix
> [brief Matrix rain animation in the terminal]

$ flag
> [hidden CTF challenge — returns an encoded string]
>  Solve it to unlock a secret section of the site

$ help
> [lists all commands]

$ clear
> [clears terminal]

$ exit
> [closes terminal]
```

**Visual**: The terminal slides up from the bottom. xterm.js with full custom theme (green text, black bg, glow effect). The site doesn't pause — terminal is an overlay.

---

## 10. ANIME EASTER EGGS

*Subtle. Only for those who know. Never breaks the space/hacker aesthetic.*

| Location | Easter Egg | Reference |
|----------|-----------|-----------|
| Terminal `anime` command | ASCII Soul Society gates + "Bankai." text | Bleach |
| 404 Page | "The page you're looking for is... in another sea." with a tiny Straw Hat | One Piece |
| Loading screen (rare variant, 1% chance) | "ZA WARUDO" flashes for 100ms during progress bar | JJBA |
| About section | In the "interests" line, a tiny pixel star icon that pulses — Edward Elric's watch chain style border | FMAB |
| Console.log | Open browser console → `console.log` shows "It's not like I wanted you to find this, baka" with One Piece Jolly Roger in ASCII | General weeb |
| Hover on name 7 times | Name briefly glitches to "Ichigo Praneesh" for 1 frame | Bleach |
| Konami code | Triggers the game but also flashes "STAR PLATINUM" briefly | JJBA |

---

## 11. PERFORMANCE & OPTIMIZATION

### Target Metrics
```
Lighthouse Score:
  Performance:    90+  (95+ on desktop)
  Accessibility:  95+
  Best Practices: 100
  SEO:           100

Core Web Vitals:
  LCP (Largest Contentful Paint): < 2.5s
  FID / INP:                      < 100ms
  CLS (Cumulative Layout Shift):  < 0.1
```

### Strategies
```
1. IMAGES
   - All textures: WebP + KTX2 (for Three.js)
   - next/image for all <img> tags
   - Lazy load everything below the fold
   - Avatar/profile: SVG if possible

2. FONTS
   - next/font with font-display: swap
   - Subset to used characters (latin only)
   - Preconnect to Google Fonts

3. THREE.JS / WEBGL
   - Dynamic import: const { Canvas } = await import('@react-three/fiber')
   - Load 3D only on client, after hydration
   - GPU tier detection: use @pmndrs/detect-gpu
   - Low-end fallback: CSS particle background (tsParticles)

4. CODE SPLITTING
   - Next.js automatic code splitting per route
   - Minigame: Fully lazy-loaded in a separate chunk
   - Blog: MDX compiled at build time

5. BUNDLE SIZE
   - Bundle analyzer: @next/bundle-analyzer
   - Tree-shake everything
   - Replace heavy libraries with lighter alternatives if needed

6. CACHING
   - Static assets: Cache-Control: max-age=31536000, immutable
   - API routes: SWR or React Query for any dynamic data
```

### Progressive Enhancement
```
Tier 1 (High-end desktop):  Full 3D scene, all animations, minigame
Tier 2 (Mid-range):         3D scene with reduced post-processing
Tier 3 (Mobile/low-end):    CSS particle background, reduced animations
Tier 4 (No JS):             SSR-rendered static content, readable without JS
```

---

## 12. SEO, ACCESSIBILITY & ANALYTICS

### SEO
```
- next/metadata API for all pages
- Open Graph images: Dynamic OG image via @vercel/og
  - Generates beautiful preview cards automatically
- Structured Data (JSON-LD):
  - Person schema (your info)
  - Website schema
  - BlogPosting schema for each blog post
- Sitemap: next-sitemap package
- robots.txt: Allow all, disallow /private (future)
- Canonical URLs on all pages

KEYWORDS TO TARGET:
  "praneesh r v portfolio"
  "cybersecurity CTF portfolio"
  "web exploitation portfolio"
  "OSINT CTF player India"
  "[CTF name] writeup [year]" (massive search traffic)
```

### Accessibility
```
- Semantic HTML throughout (main, nav, article, section, aside)
- ARIA labels on all interactive elements
- Keyboard navigation for all interactive elements
- Reduced motion: @media (prefers-reduced-motion: reduce)
  → Disables all GSAP animations, minimal CSS transitions only
- Color contrast: AA minimum, AAA where possible
- Focus indicators: Custom styled, always visible
- Screen reader: Hidden descriptive text for 3D elements
  <span className="sr-only">3D quasar animation</span>
```

### Analytics
```
Free Options:
- Vercel Analytics (built-in with Vercel hosting) — RECOMMENDED
- Umami (self-hosted, privacy-first, free) — if you want full control
- Plausible (if budget allows) — GDPR compliant, minimal script

What to Track:
- Page views by section (scroll depth)
- Resume download clicks
- Contact form submissions
- Terminal command usage (anonymized)
- Minigame plays
- Blog post reads + time on page
```

---

## 13. DEPLOYMENT & INFRASTRUCTURE

### Hosting: **Vercel** (Free tier — perfect)
```
Why Vercel:
✓ Next.js creators — best possible support
✓ Free SSL, custom domains
✓ Edge network (fast globally)
✓ GitHub integration (auto-deploy on push)
✓ Preview deployments for every PR
✓ Built-in analytics
✓ Serverless functions for contact form API
```

### Domain
```
Recommended purchases:
- praneeshrv.dev     (dev extension = perfect for developers)
- praneeshrv.me      (clean, personal)
- praneesh.dev       (if available)

Registrar: Namecheap or Cloudflare (Cloudflare = free WHOIS privacy)
Price: ~$10-12/year
```

### CI/CD Pipeline
```
GitHub Actions workflow:
  On PR:
    - Run ESLint + TypeScript check
    - Run Vitest unit tests
    - Run Lighthouse CI (fail if score drops below threshold)
    - Vercel preview deploy

  On merge to main:
    - All above
    - Vercel production deploy
    - Sitemap generation
    - Notify via Discord webhook (optional flex)
```

### Environment Variables
```
.env.local:
  RESEND_API_KEY=         # Contact form emails
  NEXT_PUBLIC_SITE_URL=   # For OG images and canonical URLs
  SUPABASE_URL=           # If using Supabase for leaderboard
  SUPABASE_ANON_KEY=      # Supabase public key
```

---

## 14. FUTURE-PROOFING & EXTENSIBILITY

### Architecture Principles
```
1. CONTENT-CODE SEPARATION
   - All text content in /content directory (MDX/JSON)
   - Adding a new project = adding a JSON entry + MDX file
   - No code changes needed for content updates

2. COMPONENT LIBRARY
   - Every reusable element is a self-contained component
   - Documented via Storybook (optional but excellent)
   - Consistent prop interfaces

3. THEME SYSTEM
   - All colors/fonts/spacing in CSS variables
   - Easy to add new themes (light mode, "red alert" mode, etc.)

4. API-READY
   - Contact form already uses an API route
   - Ready to add: GitHub activity feed, CTFtime stats, etc.
```

### Planned Future Sections
```
[ ] /uses      — Your Arch setup, dotfiles, tools (popular with dev community)
[ ] /gear      — Hardware setup, desk setup
[ ] /now       — What you're working on right now (Derek Sivers /now page)
[ ] /reads     — Books, papers, writeups you recommend
[ ] /gallery   — Screenshots of rices, CTF moments, etc.
[ ] Live CTFtime integration — Fetch your team's recent CTF activity via API
[ ] GitHub activity graph — Custom-styled contribution graph
[ ] Spotify now playing — What you listen to while hacking (using Spotify API)
```

### The /uses Page (High Priority for Later)
```
This page is GOLD for the dev community. Template:
- Operating System: Arch Linux (btw)
- Window Manager: [yours]
- Terminal: [yours]
- Shell: zsh / fish
- Editor: Neovim
- Browser: [yours]
- CTF Tools: Burp Suite, Wireshark, etc.
- Fonts: JetBrains Mono
- Color Scheme: void-dark (your custom theme)
```

---

## 15. BUILD PHASES & MILESTONES

### Phase 0: Setup (Week 1)
```
[ ] Initialize Next.js 15 project with TypeScript
[ ] Configure Tailwind CSS v4
[ ] Set up ESLint + Prettier + Husky
[ ] Install core dependencies (Three.js, GSAP, Framer Motion)
[ ] Configure next/font with chosen typefaces
[ ] Set up CSS variables (design system)
[ ] Create base layout (no content yet)
[ ] Deploy to Vercel (even empty)
[ ] Buy and connect domain
```

### Phase 1: Foundation (Week 2)
```
[ ] Loading screen component
[ ] Custom cursor
[ ] Navigation (floating orbital nav)
[ ] Basic routing structure
[ ] Footer
[ ] 404 page
[ ] Resume PDF added
```

### Phase 2: Hero / Space Scene (Week 3-4)
```
[ ] Three.js canvas setup (React Three Fiber)
[ ] Starfield
[ ] Neutron Star / Quasar (core mesh + shader)
[ ] Accretion disk
[ ] Relativistic jets
[ ] 4-6 Planets with orbits
[ ] Post-processing (bloom, vignette)
[ ] Hero text overlay (typewriter, CTA buttons)
[ ] Parallax on mouse move
[ ] Mobile GPU detection + CSS fallback
```

### Phase 3: All Sections (Week 5-7)
```
[ ] About section (HUD design)
[ ] Projects section (cards + filter)
[ ] Skills section (constellation graph or animated grid)
[ ] Experience timeline
[ ] CTF Hall of Fame
[ ] Certifications / Education
[ ] Contact form (with Resend API)
```

### Phase 4: Animations (Week 8)
```
[ ] GSAP ScrollTrigger on all sections
[ ] Framer Motion page transitions
[ ] Hover micro-interactions
[ ] Glitch effects
[ ] Number counters
[ ] Text reveal animations
```

### Phase 5: Special Features (Week 9-10)
```
[ ] Terminal easter egg (xterm.js)
[ ] All terminal commands implemented
[ ] Minigame (Packet Runner)
[ ] Anime easter eggs
[ ] Hidden CTF flag challenge in source
[ ] Console.log easter egg
[ ] Konami code trigger
```

### Phase 6: Blog (Week 11)
```
[ ] Contentlayer setup
[ ] Blog index page
[ ] Blog post template
[ ] MDX rendering with custom components
[ ] First 2-3 posts (one CTF writeup, one Arch post)
[ ] Syntax highlighting
[ ] RSS feed
```

### Phase 7: Polish & Launch (Week 12)
```
[ ] Lighthouse audit + fix issues
[ ] Accessibility pass
[ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
[ ] Mobile testing (multiple device sizes)
[ ] SEO meta tags + OG images
[ ] Sitemap + robots.txt
[ ] Analytics integration
[ ] Final content review
[ ] LAUNCH 🚀
```

---

## 16. FILE/FOLDER STRUCTURE

```
praneesh-portfolio/
├── app/
│   ├── (home)/
│   │   └── page.tsx              # Main single-page app
│   ├── blog/
│   │   ├── page.tsx              # Blog index
│   │   └── [slug]/
│   │       └── page.tsx          # Individual post
│   ├── uses/
│   │   └── page.tsx              # /uses page
│   ├── api/
│   │   └── contact/
│   │       └── route.ts          # Contact form API
│   ├── layout.tsx                # Root layout
│   ├── not-found.tsx             # 404 page
│   └── globals.css               # Global CSS + variables
│
├── components/
│   ├── 3d/
│   │   ├── SpaceScene.tsx        # Main Three.js canvas
│   │   ├── NeutronStar.tsx
│   │   ├── AccretionDisk.tsx
│   │   ├── Planet.tsx
│   │   ├── StarField.tsx
│   │   ├── DysonSphere.tsx
│   │   └── PostProcessing.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   ├── Experience.tsx
│   │   ├── CTFHallOfFame.tsx
│   │   ├── Blog.tsx (preview)
│   │   └── Contact.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── GlassPanel.tsx
│   │   ├── Terminal.tsx
│   │   ├── Cursor.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── Navigation.tsx
│   │   └── GlitchText.tsx
│   └── game/
│       └── PacketRunner.tsx
│
├── content/
│   ├── blog/
│   │   ├── first-ctf-writeup.mdx
│   │   └── arch-setup-guide.mdx
│   └── data/
│       ├── projects.json
│       ├── skills.json
│       ├── experience.json
│       └── ctf-achievements.json
│
├── lib/
│   ├── fonts.ts
│   ├── utils.ts
│   ├── animations.ts             # GSAP timeline configs
│   └── blog.ts                   # Blog helpers
│
├── hooks/
│   ├── useGPUTier.ts
│   ├── useTerminal.ts
│   └── useScrollProgress.ts
│
├── public/
│   ├── resume.pdf
│   ├── textures/                 # Three.js textures
│   ├── fonts/                    # Self-hosted fonts
│   └── og-image.png
│
├── stores/
│   └── globalStore.ts            # Zustand store
│
├── types/
│   └── index.ts
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local
```

---

## 17. AI TOOLS INTEGRATION

### Free AI Tools to Maximize

```
DESIGN & VISUALS:
  Spline (spline.design)    — Free 3D objects, embeddable
  Rive (rive.app)           — Free interactive animations (better than Lottie)
  Framer AI                 — Prototype quick layouts
  Galileo AI                — AI UI generation for inspiration
  Midjourney / DALL-E       — For blog post hero images
  Remove.bg                 — Clean profile photo cutouts

CODE & DEVELOPMENT:
  Claude (you're using it!)  — Architecture, code generation, debugging
  GitHub Copilot             — Free for students (GitHub Student Pack!)
  Cursor IDE                 — AI-powered IDE (free tier)
  v0.dev (Vercel)            — Generate React components from prompts
  Codeium                   — Free Copilot alternative

CONTENT:
  Perplexity AI             — Research for blog posts
  Grammarly                 — Writing polish
  Notion AI                 — Blog drafting (if you use Notion)

SEO & ANALYTICS:
  Ahrefs Webmaster Tools    — Free SEO monitoring
  Google Search Console     — Free, essential
  PageSpeed Insights        — Performance testing

IMAGES & ASSETS:
  Unsplash / Pexels         — Free stock (for blog)
  NASA Image Library        — Free space images (public domain!)
  Heroicons / Lucide        — Free icon sets
  SVGRepo                   — Free SVG icons
```

### GitHub Student Pack (CLAIM THIS IF YOU HAVEN'T)
```
URL: education.github.com/pack

Includes FREE access to:
  - GitHub Copilot (normally $10/month)
  - Namecheap domain (free .me domain for 1 year)
  - MongoDB Atlas credits
  - DigitalOcean credits ($200)
  - JetBrains IDEs (all of them, free)
  - Canva Pro
  - And 100+ more tools
```

---

## 18. CONTENT CHECKLIST

*To be filled in before/after base site is built:*

### Priority Content
```
[ ] Final bio / about text (1-2 paragraphs)
[ ] Project descriptions (RedCalibur, Axec-CLI, L3m0nCTF)
[ ] Project links (GitHub repos, live demos)
[ ] Profile photo or avatar (or decide to use ASCII art)
[ ] Updated resume PDF
[ ] Full list of CTF competitions with results
[ ] Social links (GitHub, LinkedIn, CTFtime, email)
[ ] Skills list with self-rated proficiency

[ ] First blog post (CTF writeup is ideal for launch)
```

### Nice-to-Have Content
```
[ ] Project screenshots / demo videos / GIFs
[ ] Team Hunter CTFtime profile link
[ ] Arch Linux dotfiles repository link
[ ] Any public talks/presentations
[ ] Recommendation/endorsement quotes (from teammates/profs)
[ ] "Currently listening to" Spotify widget (optional)
[ ] Current challenges / learning goals
```

---

## SUMMARY: THE NORTH STAR

When someone lands on `praneeshrv.dev`, this is what they experience:

1. **They arrive** — Deep space. A quasar pulses. Stars drift. They feel small and intrigued.
2. **They explore** — The scroll is a journey, not a scroll. Every section reveals a new quadrant.
3. **They discover** — An easter egg in the console. A terminal they can type in. A flag they can hunt.
4. **They understand** — This person is serious about security, passionate about tech, and obsessive about craft.
5. **They remember** — Not just the projects or the skills, but the *feeling* of the site.

That's the mission. Build the universe first. Fill it with signal.

---

```
  ██████╗ ██████╗  █████╗ ███╗   ██╗███████╗███████╗███████╗██╗  ██╗
  ██╔══██╗██╔══██╗██╔══██╗████╗  ██║██╔════╝██╔════╝██╔════╝██║  ██║
  ██████╔╝██████╔╝███████║██╔██╗ ██║█████╗  █████╗  ███████╗███████║
  ██╔═══╝ ██╔══██╗██╔══██║██║╚██╗██║██╔══╝  ██╔══╝  ╚════██║██╔══██║
  ██║     ██║  ██║██║  ██║██║ ╚████║███████╗███████╗███████║██║  ██║
  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝
  
  root@cosmos:~$ sudo make portfolio --flag="the-void-speaks-in-packets"
  [SUDO] password for praneesh: ••••••••
  Building universe... Done.
  Deploying to production... Done.
  Status: ONLINE
```

---
*Plan authored for: Praneesh R V | Version: 1.0.0 | Classification: PERSONAL*

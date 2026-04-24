# AI Outsourcing & Integration Plan

**Workflow Protocol:**
1. **Outsource:** You copy the "Prompt to Copy" and paste it into the assigned AI tool.
2. **Collect:** You review the generated code/assets and bring them back to me.
3. **Integrate:** I will integrate the code into our Next.js 16/Tailwind v4 architecture, ensuring it follows our Biome linting, design tokens, and performance standards.
4. **Verify:** I will run tests and build checks to ensure the integration is flawless.

**Context Block (paste at the top of EVERY prompt for consistency):**
> My project uses Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript strict mode.
> Components must use `"use client"` directive if they use hooks or browser APIs.
> Animation library: `motion` (motion.dev, NOT framer-motion).
> Fonts: `var(--font-orbitron)` (display), `var(--font-dm-sans)` (body), `var(--font-jetbrains-mono)` (code), `var(--font-cinzel)` (accents).
> Colors: `--color-green: #00FF88`, `--color-purple: #8B5CF6`, `--color-blue: #38BDF8`, `--color-void: #000005`, `--color-text-primary: #E8E8F0`.

---

## 🟢 Module 1: Design System (M1)

### Task M1.1: GlitchText & Custom Cursor
* **Assigned AI:** GitHub Copilot (or ChatGPT)
* **Deliverable:** `GlitchText.tsx`, `CustomCursor.tsx`, and any CSS.
* **Prompt to Copy:**
  > [Paste context block above first]
  > Create two React components:
  > 1. A `GlitchText` component that takes `text` and `as` (HTML tag) props. It should use CSS `clip-path` animations to create a cyberpunk glitch effect on hover. Use `font-family: var(--font-orbitron)`. Colors: neon green `#00FF88` with purple `#8B5CF6` glitch layers.
  > 2. A `CustomCursor` component that replaces the default cursor with a crosshair/sniper reticle. It should expand on hover over interactive elements (`a`, `button`, `[data-cursor-hover]`). Use `requestAnimationFrame` for smooth tracking.
  > Both must use `"use client"` and TypeScript.

### Task M1.2: Terminal Boot Loading Screen
* **Assigned AI:** ChatGPT
* **Deliverable:** `BootLoader.tsx` component.
* **Prompt to Copy:**
  > [Paste context block above first]
  > Create a full-screen loading component that simulates an Arch Linux terminal boot sequence. Requirements:
  > - Print lines sequentially: "Initializing core systems...", "Mounting /dev/void...", "Bypassing firewall...", "Establishing quantum link...", "Loading neutron star renderer...", "Connection established."
  > - Each line appears with a typewriter effect (character by character).
  > - Include an ASCII progress bar `[████████░░] 80%` that fills to 100%.
  > - When complete, the screen fades out over 500ms and calls an `onComplete()` callback prop.
  > - Background: `#000005`. Text: `#00FF88`. Font: `var(--font-jetbrains-mono)`.
  > - Must use `"use client"` and TypeScript.

### Task M1.3: Button, Card & TypewriterText Components
* **Assigned AI:** v0.dev (by Vercel) or Copilot
* **Deliverable:** `Button.tsx`, `ProjectCard.tsx`, `TypewriterText.tsx`.
* **Prompt to Copy:**
  > [Paste context block above first]
  > Create three React components for a cybersecurity portfolio:
  > 1. `Button` — two variants: "primary" (green `#00FF88` border, glow on hover) and "secondary" (purple `#8B5CF6` border, glow on hover). Glassmorphism background. Uppercase monospace text. Props: `variant`, `href`, `children`, `className`.
  > 2. `ProjectCard` — a card with glassmorphism background (`rgba(10, 10, 26, 0.6)`, `backdrop-filter: blur(16px)`). 3D tilt effect on hover using CSS `perspective` and `transform: rotateX/Y`. Glowing border on hover. Props: `title`, `description`, `techStack: string[]`, `status`, `sourceUrl`.
  > 3. `TypewriterText` — renders text character by character using `requestAnimationFrame`. Props: `text`, `speed` (ms per char), `onComplete` callback. Blinking cursor at the end.
  > All must use `"use client"` and TypeScript.

### Task M1.4: Floating Navigation
* **Assigned AI:** v0.dev or Copilot
* **Deliverable:** `FloatingNav.tsx`.
* **Prompt to Copy:**
  > [Paste context block above first]
  > Create a floating navigation component for a single-page portfolio. Requirements:
  > - Fixed position, centered at the bottom of the viewport (like a macOS dock but sci-fi themed).
  > - Glassmorphism background with `backdrop-filter: blur(16px)`. Border: `rgba(139, 92, 246, 0.15)`.
  > - Navigation items: Home, About, Projects, Skills, Experience, Contact. Use Lucide-react icons.
  > - Active section highlighting based on scroll position (IntersectionObserver).
  > - Hover effect: icon scales up slightly with a glow.
  > - Auto-hides on scroll down, reappears on scroll up.
  > - Must use `"use client"` and TypeScript.

---

## 🟡 Module 2: 3D Space Scene (M2)

### Task M2.1: Neutron Star & Accretion Disk (GLSL)
* **Assigned AI:** ChatGPT (Deep Research / o3)
* **Deliverable:** GLSL shaders + R3F component (`NeutronStar.tsx`).
* **Prompt to Copy:**
  > [Paste context block above first]
  > I am building a React Three Fiber scene. Write a custom ShaderMaterial for a spinning Neutron Star with:
  > - A glowing core sphere (pulsating brightness).
  > - An accretion disk (torus shape, rotating, with volumetric glow).
  > - Relativistic jets shooting from both poles (particle-based or shader cone).
  > Provide complete `vertexShader` and `fragmentShader` GLSL code. Colors configurable via uniforms, defaulting to green (`#00FF88`) and purple (`#8B5CF6`). Pass `uTime` uniform for animation.
  > Wrap in a React Three Fiber component. Must use `"use client"`.

### Task M2.2: Interactive Starfield & Constellation
* **Assigned AI:** ChatGPT or Claude
* **Deliverable:** `Starfield.tsx`, `Constellation.tsx`.
* **Prompt to Copy:**
  > [Paste context block above first]
  > Create two React Three Fiber components:
  > 1. `Starfield` — renders 2000 stars using `<Points>` from `@react-three/drei`. Stars should twinkle (vary opacity over time using a simple sin wave per star). Accept a `count` prop for GPU tier adaptation.
  > 2. `Constellation` — renders 500 interactive stars. Draw lines between stars closer than a threshold distance, forming constellations. Mouse movement should slightly attract nearby stars. Use `InstancedMesh` or `Points` for performance.
  > Both must use `"use client"`.

### Task M2.3: Planets & Dyson Sphere
* **Assigned AI:** ChatGPT or Claude
* **Deliverable:** `OrbitalPlanets.tsx`, `DysonSphere.tsx`.
* **Prompt to Copy:**
  > [Paste context block above first]
  > Create two React Three Fiber components:
  > 1. `OrbitalPlanets` — render 6 small spheres orbiting a center point at different radii and speeds. Each planet should have a faint orbital ring (thin torus). Colors: varied dark metallics with subtle glow.
  > 2. `DysonSphere` — a large wireframe icosahedron slowly rotating around the scene center. Use `<Icosahedron>` from drei with `wireframe` material. Color: `#8B5CF6` with low opacity (0.15). Subtle pulse animation.
  > Both must use `"use client"`.

### Task M2.4: R3F Canvas Wrapper & Error Boundary
* **Assigned AI:** Antigravity (me — I'll build this during integration)
* **Deliverable:** `SpaceCanvas.tsx`, `WebGLErrorBoundary.tsx`.
* **Note:** This is integration work. I'll wire up the Canvas, camera, controls, postprocessing (Bloom, Vignette), and GPU tier detection using `@pmndrs/detect-gpu`. I'll also create the error boundary and CSS-only fallback for WebGL failures.

---

## 🟡 Module 3: UI Sections (M3)

### Task M3.1: About Section (Cockpit HUD)
* **Assigned AI:** v0.dev
* **Deliverable:** `About.tsx` layout.
* **Prompt to Copy:**
  > [Paste context block above first]
  > Generate a dark-mode "About Me" section for a cybersecurity portfolio. Design like a sci-fi spaceship cockpit HUD. Include:
  > - Glassmorphism panels with `backdrop-filter: blur(16px)` and `border: 1px solid rgba(139, 92, 246, 0.15)`.
  > - Sections: "Bio" (paragraph), "Current Mission" (list), "Clearance Level" (skill bars).
  > - Decorative elements: radar sweep animation, corner brackets on panels, hex grid background pattern.
  > - Colors: neon green `#00FF88` accents, purple `#8B5CF6` borders, black `#000005` background.
  > - Use Lucide-react icons. Use `"use client"`.

### Task M3.2: Projects Gallery (3D Tilt Cards)
* **Assigned AI:** v0.dev or Copilot
* **Deliverable:** `Projects.tsx`.
* **Prompt to Copy:**
  > [Paste context block above first]
  > Create a responsive project gallery section. Requirements:
  > - Filter tabs at top: "All", "Security", "Tools", "Infrastructure", "CTF".
  > - Cards with glassmorphism, 3D tilt on hover (CSS `perspective` + `rotateX/Y`), glowing border.
  > - Each card: project title, description, tech stack badges, status badge ("Active"/"WIP"), and GitHub link icon.
  > - Accept a `projects` prop typed as `Array<{id, title, description, techStack: string[], category, status, sourceUrl}>`.
  > - Use CSS grid (responsive: 1 col mobile, 2 tablet, 3 desktop). Use `"use client"`.

### Task M3.3: Skills Constellation Graph
* **Assigned AI:** ChatGPT or Claude
* **Deliverable:** `SkillsConstellation.tsx` (R3F) + `SkillsGrid.tsx` (mobile fallback).
* **Prompt to Copy:**
  > [Paste context block above first]
  > Create two components for a Skills section:
  > 1. `SkillsConstellation` (desktop) — A React Three Fiber component. Render skill nodes as glowing spheres. Group by category ("security", "development", "infrastructure", "tools") with different colors. Draw lines between related skills to form constellation patterns. Hovering a node shows the skill name as a tooltip (use drei's `<Html>`). Accept a `skills` prop typed as `Array<{name, category, proficiency: 1-5}>`.
  > 2. `SkillsGrid` (mobile fallback) — A CSS grid of skill badges. Each badge shows the skill name and a proficiency bar (1-5 dots). Group by category with headers.
  > Both must use `"use client"`.

### Task M3.4: Experience Timeline
* **Assigned AI:** v0.dev or Copilot
* **Deliverable:** `Timeline.tsx`.
* **Prompt to Copy:**
  > [Paste context block above first]
  > Create a vertical timeline component for a portfolio. Sci-fi warp-speed aesthetic:
  > - A glowing vertical line down the center. Timeline entries alternate left/right.
  > - Each entry: year badge, title, description, type icon (education/ctf/project/certification).
  > - Entries animate in on scroll (use CSS `@starting-style` or IntersectionObserver).
  > - Accept a `entries` prop typed as `Array<{id, year, title, description, type}>`.
  > - Use glassmorphism cards. Colors: green `#00FF88`, purple `#8B5CF6`. Use `"use client"`.

### Task M3.5: CTF Hall of Fame & Contact Form
* **Assigned AI:** v0.dev or Copilot
* **Deliverable:** `CTFHallOfFame.tsx`, `ContactForm.tsx`.
* **Prompt to Copy:**
  > [Paste context block above first]
  > Create two sections:
  > 1. `CTFHallOfFame` — A trophy-case style display for CTF achievements. Table or card layout showing competition name, result, year. Use a trophy/shield icon. Glassmorphism styling. Accept `achievements` prop typed as `Array<{competition, result, year}>`.
  > 2. `ContactForm` — A contact form with fields: Name, Email, Message. Glassmorphism container. Submit button with green glow. Terminal-style labels (e.g., `> name:`). Use `react-hook-form` and `zod` for validation.
  > Both must use `"use client"`.

---

## 🟡 Module 4: Animation Layer (M4)

### Task M4.1: Scroll Animations & Entrance Effects
* **Assigned AI:** Antigravity (me — I'll handle this during integration)
* **Deliverable:** GSAP ScrollTrigger wiring + CSS scroll-driven animations.
* **Note:** This module is pure integration work. I will wire GSAP ScrollTrigger to each section, add staggered entrance animations, hover micro-interactions, and number count-up effects. The prompts below are optional if you want pre-built pieces.

### Task M4.2: Text Reveal (splitting.js) — Optional
* **Assigned AI:** Copilot
* **Deliverable:** `TextReveal.tsx`.
* **Prompt to Copy:**
  > [Paste context block above first]
  > Create a React component that splits text into individual characters using the `splitting` npm package and animates them in on scroll using CSS transitions with staggered delays. Each character should translate up from below and fade in. Props: `text`, `staggerMs` (default 30ms). Use `"use client"`.

---

## 🔴 Module 5: Terminal (M5)

### Task M5.1: Terminal Component (xterm.js)
* **Assigned AI:** ChatGPT
* **Deliverable:** `Terminal.tsx` + `commandParser.ts`.
* **Prompt to Copy:**
  > [Paste context block above first]
  > Write a React component wrapping `xterm.js` and `xterm-addon-fit`. Requirements:
  > - Green-on-black terminal aesthetic. Font: `var(--font-jetbrains-mono)`.
  > - Custom command parser supporting: `help`, `whoami`, `clear`, `neofetch`, `ls projects`, `cat about.txt`, `skills`, `ctf`, `contact`, `resume`, `sudo rm -rf /`, `exit`.
  > - `neofetch` should print an ASCII art block with system info (OS: Arch btw, Shell: zsh, WM: Hyprland, etc.).
  > - `sudo rm -rf /` should print a fake "permission denied — nice try" joke.
  > - The component should overlay the page when activated. Close with `exit` command or Escape key.
  > - Must use `"use client"` and TypeScript. Export the command parser separately.

---

## 🔴 Module 6: Minigame — Packet Runner (M6)

### Task M6.1: Packet Runner Canvas Game
* **Assigned AI:** Claude or ChatGPT
* **Deliverable:** `PacketRunner.tsx`, `gameEngine.ts`.
* **Prompt to Copy:**
  > [Paste context block above first]
  > Create a 2D endless runner minigame called "Packet Runner" using the HTML5 Canvas API in a React component. Requirements:
  > - Player: a small data packet (neon green `#00FF88` rectangle/diamond).
  > - Obstacles: firewalls (red `#FF3366` rectangles), IDS (purple `#8B5CF6` triangles). Spawn from the right, scroll left.
  > - Controls: Space/Up to jump, Down to duck.
  > - Physics: gravity, jump velocity, ground collision.
  > - Score counter (increments each frame). High score saved to localStorage.
  > - Game over on collision → show "PACKET DROPPED" and final score, with "Retry" button.
  > - Neon wireframe visual style. Background: `#000005`.
  > - Must use `"use client"` and TypeScript.

---

## 🔴 Module 7: Blog Engine (M7)

### Task M7.1: MDX Blog Setup
* **Assigned AI:** Antigravity (me — integration work)
* **Deliverable:** Velite config, blog page routes, MDX components.
* **Note:** I will set up Velite for MDX processing, create blog index and post template pages, configure Shiki for syntax highlighting, and generate RSS feed. This is framework-level plumbing that's best done by me directly.

### Task M7.2: Blog Post Template & Components
* **Assigned AI:** v0.dev or Copilot
* **Deliverable:** `BlogPost.tsx`, `BlogIndex.tsx`.
* **Prompt to Copy:**
  > [Paste context block above first]
  > Create two page components for a portfolio blog:
  > 1. `BlogIndex` — a list of blog posts. Each entry shows: title, date, excerpt, category badge, estimated read time. Glassmorphism card style. Filter by category tabs: "All", "Writeup", "Research", "Arch", "Build".
  > 2. `BlogPost` — a single post layout with: title, date, category, read time, and a rendered markdown body area. Include a table of contents sidebar that highlights the current section. Terminal-style code blocks with copy button.
  > Both must use `"use client"` and TypeScript.

---

## 🔴 Module 8: Polish & Launch (M8)

### Task M8.1: SEO & Analytics
* **Assigned AI:** Antigravity (me — integration work)
* **Deliverable:** JSON-LD schemas, OG image generation, sitemap, robots.txt, Vercel Analytics.
* **Note:** Pure configuration and integration. I'll handle this.

### Task M8.2: Easter Eggs
* **Assigned AI:** Copilot or ChatGPT
* **Deliverable:** `EasterEggs.tsx`, `KonamiCode.tsx`.
* **Prompt to Copy:**
  > [Paste context block above first]
  > Create two small React utility components:
  > 1. `KonamiCode` — listens for the Konami Code keyboard sequence (↑↑↓↓←→←→BA). When detected, calls an `onActivate()` callback. Use `"use client"`.
  > 2. `ConsoleEasterEgg` — on mount, prints styled ASCII art and a hidden message to `console.log` using `%c` CSS styling. Include a fake CTF flag like `flag{y0u_f0und_th3_v0id}`. Use `"use client"`.

---

## Integration Ownership Summary

| Task | Who Builds | Who Integrates |
|------|-----------|----------------|
| M1.1 GlitchText + Cursor | External AI → User | Antigravity |
| M1.2 BootLoader | External AI → User | Antigravity |
| M1.3 Button/Card/Typewriter | External AI → User | Antigravity |
| M1.4 FloatingNav | External AI → User | Antigravity |
| M2.1 Neutron Star GLSL | External AI → User | Antigravity |
| M2.2 Starfield + Constellation | External AI → User | Antigravity |
| M2.3 Planets + Dyson Sphere | External AI → User | Antigravity |
| M2.4 Canvas + Error Boundary | **Antigravity directly** | — |
| M3.1–M3.5 All sections | External AI → User | Antigravity |
| M4.1 ScrollTrigger wiring | **Antigravity directly** | — |
| M4.2 TextReveal (optional) | External AI → User | Antigravity |
| M5.1 Terminal + Commands | External AI → User | Antigravity |
| M6.1 Packet Runner | External AI → User | Antigravity |
| M7.1 Blog plumbing | **Antigravity directly** | — |
| M7.2 Blog templates | External AI → User | Antigravity |
| M8.1 SEO/Analytics | **Antigravity directly** | — |
| M8.2 Easter Eggs | External AI → User | Antigravity |

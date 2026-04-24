# AI Outsourcing & Integration Plan

**Workflow Protocol:**
1. **Outsource:** You copy the "Prompt to Copy" and paste it into the assigned AI tool.
2. **Collect:** You review the generated code/assets and bring them back to me.
3. **Integrate:** I will integrate the code into our Next.js 16/Tailwind v4 architecture, ensuring it follows our Biome linting, design tokens, and performance standards.
4. **Verify:** I will run tests and build checks to ensure the integration is flawless.

---

## 🟡 Module 1: Design System (M1)

### Task M1.1: GlitchText & Custom Cursor
* **Assigned AI:** GitHub Copilot (or ChatGPT o3-mini)
* **Deliverable:** React components (`GlitchText.tsx`, `CustomCursor.tsx`) and CSS.
* **Prompt to Copy:**
  > "Create two React Next.js components using Tailwind CSS: 
  > 1. A `GlitchText` component that uses CSS clip-path animations to create a cyberpunk glitch effect on hover. It should use our custom font variables like `var(--font-orbitron)`.
  > 2. A `CustomCursor` component that replaces the default cursor with a sniper crosshair style. It should have a hover state that expands when hovering over interactive elements.
  > Please provide the full TypeScript code and any required CSS."

### Task M1.2: Terminal Boot Loading Screen
* **Assigned AI:** ChatGPT (o3-mini or GPT-4o)
* **Deliverable:** React component (`BootLoader.tsx`) with a simulated startup sequence.
* **Prompt to Copy:**
  > "Create a React component for a portfolio loading screen. It should simulate an Arch Linux or sci-fi terminal boot sequence. Requirements:
  > - Print lines of text sequentially like 'Initializing core systems...', 'Bypassing firewall...', 'Establishing connection...'.
  > - Use a typewriter effect for the lines.
  > - Include a progress bar that fills up to 100%.
  > - The screen should fade out and unmount when complete. Use Tailwind CSS and standard React hooks."

---

## 🔴 Module 2: 3D Space Scene (M2)

### Task M2.1: Neutron Star & Accretion Disk (GLSL)
* **Assigned AI:** ChatGPT (Deep Research / o3-mini)
* **Deliverable:** React Three Fiber code and custom GLSL Vertex/Fragment shaders.
* **Prompt to Copy:**
  > "I am building a React Three Fiber scene. Write a custom ShaderMaterial for a spinning Neutron Star with a glowing accretion disk and relativistic jets shooting out the poles. 
  > Provide the complete `vertexShader` and `fragmentShader` GLSL code. Make the colors easily configurable via uniforms, defaulting to bright neon green (#00FF88) and purple (#8B5CF6). Provide the accompanying R3F component to render this."

### Task M2.2: Interactive Constellation Background
* **Assigned AI:** Claude 3.7 Sonnet (or ChatGPT)
* **Deliverable:** R3F particle system component (`Constellation.tsx`).
* **Prompt to Copy:**
  > "Create a React Three Fiber component that renders a field of 500 stars. 
  > Add an interaction where lines are drawn between stars that are close to each other, forming a constellation. As the mouse moves across the screen, it should slightly attract or repel the stars. Please use `@react-three/fiber` and `@react-three/drei`. Optimize for performance by using `InstancedMesh` or `Points` if possible."

---

## 🔴 Module 3: UI Sections (M3)

### Task M3.1: About Section (Cockpit HUD)
* **Assigned AI:** v0.dev (by Vercel)
* **Deliverable:** UI layout code (JSX + Tailwind).
* **Prompt to Copy:**
  > "Generate a dark-mode Next.js UI section for an 'About Me' portfolio. The design should look like a sci-fi spaceship cockpit HUD or a hacking terminal. Use neon green (#00FF88) and deep purple (#8B5CF6) accents on a deep black background. Include glassmorphism panels, radar-like decorative elements, and sections for 'Bio', 'Current Mission', and 'Clearance Level'. Use Lucide-react icons."

### Task M3.2: Projects Carousel (3D Tilt Cards)
* **Assigned AI:** v0.dev (by Vercel) or Copilot
* **Deliverable:** React Component (`Projects.tsx`).
* **Prompt to Copy:**
  > "Create a responsive project gallery for a cybersecurity portfolio using Next.js and Tailwind CSS. The projects should be displayed as cards. Implement a 3D tilt effect on hover (you can use CSS or framer-motion/motion.dev). Each card should have a glowing border on hover, a project title, a description, and a row of tech stack badges."

---

## 🔴 Module 5 & 6: Terminal & Minigame

### Task M5.1: Terminal Component (xterm.js)
* **Assigned AI:** ChatGPT
* **Deliverable:** Next.js component integrating `xterm.js`.
* **Prompt to Copy:**
  > "Write a React component that wraps `xterm.js` and `xterm-addon-fit`. It should create a fully functional fake terminal in the browser. Include a basic command parser that can handle commands like 'help', 'whoami', 'clear', and 'neofetch'. The terminal should use a green-on-black retro hacker aesthetic. Provide the complete TypeScript implementation."

### Task M6.1: Packet Runner Canvas Game
* **Assigned AI:** Claude 3.7 Sonnet (via web) or ChatGPT
* **Deliverable:** HTML5 Canvas game logic encapsulated in a React component (`PacketRunner.tsx`).
* **Prompt to Copy:**
  > "Create a 2D endless runner minigame called 'Packet Runner' using the native HTML5 Canvas API in a React component. 
  > The player controls a data packet that must jump over obstacles (firewalls, malware). 
  > Include a basic physics loop, score counter, collision detection, and a game over state. Keep the visual style minimal, using neon wireframe graphics."

---

## My Role as Integrator (Antigravity)
When you hand me back the code from these tools, I will:
1. **Clean it up:** Remove messy inline styles, replace them with our `@theme` design tokens.
2. **Refactor:** Convert generic React to our Next.js 16 / Turbopack architecture.
3. **Fix types:** Ensure strict TypeScript compliance and Biome linting rules are met.
4. **Wire state:** Connect the UI pieces to our `globalStore.ts` (Zustand).
5. **Merge:** Put it into the exact correct folder (`components/ui`, `components/3d`, etc.) and wire it into the `page.tsx` layout.

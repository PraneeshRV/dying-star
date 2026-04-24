# AI TOOL ASSIGNMENT — Who Builds What

> 3 premium AI tools (student offers): Antigravity, GitHub Copilot, ChatGPT/Codex
> Strategy: assign each tool to what it does BEST.

---

## Tool Strengths

| Tool | Best At | Weaknesses |
|------|---------|------------|
| **Antigravity** | Architecture, complex multi-file changes, planning, debugging, system design, build orchestration | Token-intensive for boilerplate |
| **GitHub Copilot** | In-editor autocomplete, boilerplate, repetitive patterns, quick inline suggestions | Bad at multi-file architecture, no project context |
| **ChatGPT/Codex** | Math/GLSL shaders, game logic, algorithm design, content drafting, exploration | No file system access, context resets |

---

## Per-Module Assignment

### M0: Scaffold
| Task | Tool | Why |
|------|------|-----|
| Project init + config | **Antigravity** | Architecture decisions, correct flags |
| biome.json config | **Antigravity** | Config file generation |
| Tailwind v4 @theme setup | **Antigravity** | Design system = architecture |
| Font setup | **Copilot** | next/font boilerplate |
| Vercel deploy | **Manual** | CLI + dashboard |

### M1: Design System
| Task | Tool | Why |
|------|------|-----|
| Component architecture | **Antigravity** | Props, interfaces, patterns |
| GlassPanel, Card, Button | **v0.dev** → **Antigravity** | v0 for rapid prototype → refine |
| GlitchText CSS | **Copilot** | CSS keyframes = autocomplete-friendly |
| Custom Cursor | **Antigravity** | Mouse tracking + conditional states |
| LoadingScreen | **Antigravity** | GSAP orchestration |
| Navigation (orbital) | **Antigravity** | Complex layout + IntersectionObserver |
| 404 page | **Copilot** | Simple page, themed styling |

### M2: 3D Space Scene
| Task | Tool | Why |
|------|------|-----|
| SpaceScene architecture | **Antigravity** | R3F Canvas + Suspense + ErrorBoundary |
| StarField | **Copilot** | BufferGeometry boilerplate |
| NeutronStar GLSL shader | **ChatGPT** | Simplex noise math, GLSL expertise |
| AccretionDisk shader | **ChatGPT** | Ring shader math |
| RelativisticJets | **ChatGPT** | Cone + additive blending math |
| Planet component | **Copilot** | Repetitive (6 instances with props) |
| DysonSphere | **Copilot** + **ChatGPT** | Geometry + clipping plane math |
| AsteroidBelt | **Copilot** | InstancedMesh boilerplate |
| PostProcessing | **Antigravity** | Effect composer orchestration |
| GPU detection | **Antigravity** | Hook architecture |
| CSS fallback | **Antigravity** | Progressive enhancement logic |

### M3: Sections
| Task | Tool | Why |
|------|------|-----|
| Section layout prototypes | **v0.dev** | Rapid UI generation from prompts |
| Hero overlay | **Antigravity** | Z-index + TypewriterText integration |
| About HUD | **Copilot** | Repetitive panel styling |
| Projects cards + filter | **Antigravity** | State management + filter logic |
| Skills graph (D3/R3F) | **ChatGPT** | Force simulation math |
| Experience timeline | **Copilot** | Vertical layout + styled entries |
| CTF Hall of Fame | **Antigravity** | Number animation + easter egg logic |
| Contact form | **Copilot** | react-hook-form + zod = well-known pattern |
| Resend API route | **Antigravity** | Server-side API route |

### M4: Animation Layer
| Task | Tool | Why |
|------|------|-----|
| GSAP ScrollTrigger setup | **Antigravity** | Complex orchestration |
| Per-section timelines | **Antigravity** | Multi-step GSAP sequences |
| splitting.js integration | **Copilot** | Import + CSS vars |
| CSS scroll-driven anims | **Copilot** | CSS-only, autocomplete-friendly |
| Hover micro-interactions | **Copilot** | CSS transitions |
| Glitch effect CSS | **Copilot** | Keyframe animation |
| View Transitions API | **Antigravity** | Next.js integration |

### M5: Terminal
| Task | Tool | Why |
|------|------|-----|
| xterm.js setup + theme | **Antigravity** | Integration architecture |
| Command interpreter | **Antigravity** | Core command routing logic |
| Individual commands | **Copilot** | Repetitive handler functions |
| ASCII art for commands | **ChatGPT** | Creative ASCII generation |
| Keyboard shortcuts | **Copilot** | Event listener boilerplate |
| Zustand terminal state | **Antigravity** | Store architecture |

### M6: Minigame
| Task | Tool | Why |
|------|------|-----|
| Game loop architecture | **ChatGPT** | Game dev patterns, requestAnimationFrame |
| Player + enemy classes | **ChatGPT** | OOP game entities |
| Collision detection | **ChatGPT** | AABB math |
| Rendering (Canvas draw) | **ChatGPT** + **Copilot** | Draw calls + math |
| Power-up system | **Copilot** | Simple state toggling |
| Trigger integration | **Antigravity** | Terminal + Konami + UI button |
| Leaderboard (localStorage) | **Copilot** | Simple get/set |

### M7: Blog Engine
| Task | Tool | Why |
|------|------|-----|
| Velite/MDX config | **Antigravity** | Config is tricky, easy to break |
| Blog index page | **Copilot** | Grid + card layout |
| Post template | **Antigravity** | MDX rendering + custom components |
| Shiki setup | **Antigravity** | Rehype plugin configuration |
| Custom MDX components | **Copilot** | Simple React components |
| RSS feed | **Copilot** | XML generation pattern |
| Sample post content | **ChatGPT** | Content drafting |

### M8: Polish
| Task | Tool | Why |
|------|------|-----|
| Lighthouse audit | **Antigravity** | Systematic analysis + fixes |
| A11y pass | **Antigravity** | ARIA + keyboard + screen reader |
| SEO (JSON-LD, OG) | **Copilot** | Structured data = boilerplate |
| Cross-browser testing | **Manual** + **Antigravity** | Browser tool for visual testing |
| Easter eggs | **Copilot** + **ChatGPT** | Fun creative code |
| Hidden CTF flag | **ChatGPT** | Encoding puzzle design |

---

## Workflow Per Module

```
1. START with Antigravity → architecture, file structure, interfaces
2. USE v0.dev → rapid UI prototypes (export → customize)
3. SWITCH to Copilot → in-editor implementation, boilerplate, styling
4. ASK ChatGPT → math-heavy tasks (GLSL, D3, game logic), ASCII art, content
5. RETURN to Antigravity → integration, debugging, polish, testing
```

### Rule of Thumb
```
Architecture decisions    → Antigravity
Repetitive code          → Copilot
Math / algorithms        → ChatGPT
UI prototypes            → v0.dev
Creative content         → ChatGPT
Bug fixing               → Antigravity
```

---

## Free Tool Augmentation

| Tool | Use | Cost |
|------|-----|------|
| **v0.dev** | UI component prototypes | Free tier (10 generations/day) |
| **Spline** | 3D object design (if custom GLSL too hard) | Free tier |
| **Ideogram** | Blog hero images | Free |
| **Leonardo AI** | Texture generation | Free tier |
| **NASA Images** | Planet textures | Public domain |

---
*Tool Assignment v1.0 | 2026-04-25*

# Mission Control Revamp — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "Shattered Star" slop-era site with the Mission Control design per `docs/specs/2026-07-04-portfolio-revamp-design.md` (incl. amendments).

**Architecture:** Single page (boot → 3D hero → 4 sections) + `/blog` + `/resume`. Data-driven sections from `content/data/*.json`. 3D only on desktop, dynamic-imported behind BootLoader; static `StarFallback` everywhere else.

**Tech Stack:** Next 16 App Router, React 19, R3F/three (hero only), Tailwind 4, Biome. No new deps.

**Delegation note:** Section-component tasks are executed by Sonnet subagents using the `frontend-design` skill; this plan pins files, data contracts, tokens, and copy rules — subagent owns JSX/CSS craft within them. Orchestrator (Fable) runs every verify line personally.

## Global Constraints

- Verify command (every task): `npm run lint && npx tsc --noEmit && npm run build` — all green (`npx biome` doesn't resolve; binary lives at `@biomejs/biome`, `npm run lint` wraps it).
- Palette ONLY: `--color-void #0A0A0C`, `--color-panel #111114`, `--color-line #26262B`, `--color-ember #FF7A45`, `--color-ember-dim #B2532F`, text ramp `#ECECEA / #9A9A94 / #5C5C58`. No green, purple, cyan, gradients, glows, glassmorphism.
- Fonts: Space Grotesk (headings), DM Sans (body), JetBrains Mono (telemetry/labels/metadata). Orbitron + Cinzel removed.
- Mono telemetry labels: uppercase, tracking-wide, `text-[11px]`–`text-xs`, `--color-text-low`, format `NN · LABEL` (e.g. `02 · RESEARCH`).
- Motion: opacity/transform fades only, ≤400ms, honor `prefers-reduced-motion`. No glitch, typewriter, scale-on-hover >1.02.
- `prefers-reduced-motion`, `pointer: coarse`/`max-width: 768px`, or WebGL-fail ⇒ `StarFallback`, and the Three.js chunk must never be fetched.
- Never modify BootLoader visuals/timing beyond Task 5's state-throttle.
- Content: no hardcoded prose in section JSX — everything from `content/data/*.json`.

---

## Phase 0 — Prune

### Task 1: Delete sandbox world + dead 3D + verify scripts

**Files:**
- Delete: `app/sandbox/` (dir), `components/sandbox/` (dir), `components/game/` (dir)
- Delete: `components/3d/DysonSphere.tsx`, `Megastructures.tsx`, `PlanetSurface.tsx`, `OrbitalBodies.tsx`, `OrbitalPlanets.tsx`, `Constellation.tsx`, `PathwayRemnants.tsx`, `SystemCamera.tsx`, `TacticalLabel.tsx`, `shatteredSystem.ts`, `galaxyConfig.ts` — KEEP `NeutronStar.tsx`, `Starfield.tsx`, `SpaceCanvas.tsx`, `WebGLErrorBoundary.tsx`, `orbitMath.ts` only if still imported (grep first; delete if orphaned)
- Delete: `scripts/verify-shattered-system.mjs`, `verify-space-realism.mjs`, `verify-galaxy-contract.mjs`, `verify-space-assets.mjs`, `verify-sandbox-world.mjs`, `verify-sandbox-render.mjs`, `shaders/` + `stores/`, `hooks/`, `types/`, `lib/` files used ONLY by deleted code (grep each import before deleting)
- Delete: `content/data/space-asset-ledger.json`
- Modify: `package.json` (drop `verify:system`, set `"verify": "biome check && tsc --noEmit && next build"`), `components/3d/index.ts` (only surviving exports), `app/page.tsx` (remove `enter sandbox` CTA lines 136–143 + any dead imports), `app/sitemap.ts`/`manifest.ts` if they reference /sandbox (grep)

**Interfaces:** Produces: `components/3d/index.ts` exporting exactly `SpaceCanvas`, `NeutronStar`, `Starfield`, `WebGLErrorBoundary`.

- [ ] Step 1: `grep -rn "sandbox\|DysonSphere\|Megastructures\|PlanetSurface\|OrbitalBodies\|OrbitalPlanets\|Constellation\|SystemCamera\|shatteredSystem\|galaxyConfig" app components lib hooks stores types --include='*.ts*' -l` — build full consumer list before deleting.
- [ ] Step 2: Delete files/dirs above; prune every consumer found in Step 1.
- [ ] Step 3: Verify: `npx biome check && npx tsc --noEmit && npm run build` → green.
- [ ] Step 4: Commit `chore: remove sandbox world, dead 3d, sandbox verify scripts`.

## Phase 1 — Tokens, layout, hero

### Task 2: Design tokens + font swap

**Files:**
- Modify: `app/globals.css` (replace `@theme` palette + delete glass/glow/glitch utilities), `app/layout.tsx` (fonts, remove `CustomCursor` import + mount at lines 4/109)
- Delete: `components/ui/CustomCursor.tsx` + `.module.css`

**Interfaces:** Produces CSS vars per Global Constraints plus `--font-grotesk`, `--font-body`, `--font-mono`.

- [ ] Step 1: In `layout.tsx`: import `Space_Grotesk` (`--font-grotesk`, weights 400–700), keep `DM_Sans` → `--font-body`, `JetBrains_Mono` → `--font-mono`; delete Orbitron + Cinzel; remove CustomCursor.
- [ ] Step 2: Rewrite `globals.css` `@theme` block:

```css
@theme inline {
  --color-void: #0a0a0c;
  --color-panel: #111114;
  --color-line: #26262b;
  --color-ember: #ff7a45;
  --color-ember-dim: #b2532f;
  --color-text-hi: #ececea;
  --color-text-mid: #9a9a94;
  --color-text-low: #5c5c58;
  --font-grotesk: var(--font-space-grotesk);
  --font-body: var(--font-dm-sans);
  --font-mono: var(--font-jetbrains-mono);
}
```
Delete: all green/purple/cyan/oxidized tokens, `glow-*`, `box-glow-*`, `glass-*`, glitch keyframes. Keep base reset, selection color → ember, focus-visible ring → ember. `grep -rn "glass-\|glow-\|text-green\|text-purple\|cherenkov\|oxidized" app components` — every hit must be resolved (old sections will still hit; leave them compiling by keeping *aliases* `--color-green: var(--color-ember)` etc. TEMPORARILY, removed in Task 6).
- [ ] Step 3: Verify green + commit `feat: mission-control design tokens + font swap`.

### Task 3: Hero rewrite + gated 3D

**Files:**
- Create: `components/sections/HeroSection.tsx` (client), `components/3d/HeroScene.tsx` (client wrapper)
- Modify: `app/page.tsx`, `components/fallbacks/StarFallback.tsx` (restyle to new palette if needed)

**Interfaces:**
- `HeroScene`: no props. Internally: `useReducedMotion()` + `matchMedia("(max-width: 768px), (pointer: coarse)")` checked BEFORE rendering `next/dynamic(() => import("@/components/3d").then(m => m.SpaceCanvas), { ssr: false, loading: () => <StarFallback /> })`; fallback branch renders `<StarFallback />` directly. Wrapped in `WebGLErrorBoundary`.
- `HeroSection`: no props; reads `content/data/profile.json`.

- [ ] Step 1: Build `HeroScene.tsx` exactly per interface above (dynamic import declared at module top level but only *rendered* when checks pass — chunk fetch only happens on render).
- [ ] Step 2: `HeroSection`: name in Space Grotesk (no glow), role line `AI Red Team · Offensive Security`, one-line mission statement from profile.json, two CTAs max (`View research` → `#research`, `Resume` → `/resume`), mono telemetry label `01 · OPERATOR`. Scroll cue allowed, subtle.
- [ ] Step 3: `page.tsx`: hero section renders `HeroScene` + `HeroSection`; JSON-LD block kept verbatim; old inline hero markup gone.
- [ ] Step 4: Verify green. Run dev server, screenshot: boot → hero visible, no green/purple anywhere in hero. Network tab (or `preview_network`): on 375px viewport, NO three/R3F chunk requested.
- [ ] Step 5: Commit `feat: mission-control hero with gated 3d scene`.

## Phase 2 — Content + sections

### Task 4: Data contracts (schemas + seed)  *(blocks Task 5; Antigravity Flash fills real content in parallel)*

**Files:**
- Create: `content/data/research.json`, `content/data/projects.json`, `content/data/experience.json`
- Keep: `content/data/profile.json` (extend, don't break existing consumers — grep `profile.json` imports first)

**Interfaces (exact shapes — Task 5 components consume these):**

```jsonc
// research.json
{ "statement": "string, 1-2 sentences",
  "aiWork": [{ "title": "", "kind": "research|tool|writeup", "summary": "", "link": "", "tags": [""] }],
  "foundations": [{ "platform": "HTB", "metric": "47 boxes", "detail": "", "link": "" }] }
// projects.json
{ "projects": [{ "id": "", "name": "", "status": "ACTIVE|ARCHIVED|SHIPPED", "summary": "",
  "stack": [""], "links": { "repo": "", "live": "" }, "telemetry": "one mono metadata line" }] } // max 4
// experience.json
{ "roles": [{ "org": "", "title": "", "start": "YYYY-MM", "end": "YYYY-MM|present", "line": "one-line impact" }],
  "certs": [{ "name": "", "issuer": "", "year": "YYYY", "status": "done|in-progress" }] }
```

- [ ] Step 1: Write the three JSON files with seed data pulled from existing section components/profile.json (real, not lorem — Flash pass will enrich/correct from vault later).
- [ ] Step 2: Verify green (JSON imports resolve under `tsc`). Commit `feat: content data contracts for mission-control sections`.

### Task 5: Section components (Sonnet + frontend-design skill)

**Files:**
- Create: `components/sections/ResearchSection.tsx`, `ProjectsSection.tsx` (overwrite), `ExperienceSection.tsx` (overwrite), `ContactSection.tsx` (overwrite), `components/ui/SiteHeader.tsx`, `components/ui/SectionShell.tsx`
- Modify: `app/page.tsx` (section order: Hero → Research → Projects → Experience → Contact), `components/ui/BootLoader.tsx` (throttle: progress state updates per completed line, not per character — visuals identical)

**Interfaces:**
- `SectionShell({ index: string, label: string, id: string, children })` — renders mono telemetry header `{index} · {LABEL}`, thin top rule, consistent max-width + spacing. All sections use it.
- Sections take no props; each imports its own `content/data/*.json` per Task 4 shapes.
- `SiteHeader`: fixed top, mono nav links (RESEARCH / PROJECTS / EXPERIENCE / CONTACT / BLOG / RESUME), name left, transparent over hero → `--color-panel` after scroll. No hamburger animations beyond fade.

**Design brief for subagent:** Mission Control per Global Constraints. Research = 2 tiers: AI red team work as primary cards, foundations as compact telemetry strip. Projects = data cards: mono header row (`id / status`), name, summary, stack chips (text, thin border, no fill), links. Experience = table-like rows with thin rules; certs as sub-list. Contact = mailto + GitHub/LinkedIn, mono labels, zero form.

- [ ] Step 1: Dispatch Sonnet with this task + Global Constraints + Task 4 schemas verbatim.
- [ ] Step 2: Wire `page.tsx`; delete now-orphaned: `AboutSection`, `SkillsSection`, `CertificationsSection`, `CTFSection`, `BlogPreviewSection`, `ContactSection`(old), `ExperienceSection`(old), `ProjectsSection`(old — overwritten), `GlitchText.*`, `TypewriterText.*`, `FloatingNav.*`, `ProjectCard.*`, `Button.*` if orphaned (grep each).
- [ ] Step 3: Remove Task 2's temporary color aliases from `globals.css`; `grep -rn "glass-\|glow-\|cherenkov\|oxidized\|GlitchText\|TypewriterText\|FloatingNav" app components` → 0 hits.
- [ ] Step 4: Verify green + dev screenshot of every section with real data. Commit `feat: mission-control sections`.

### Task 6: /blog route

**Files:**
- Create: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
- Inspect first: `content/blog/` format + any existing `lib/` blog helpers (grep `content/blog` consumers)

**Interfaces:** list page = mono index rows (date · title · tags); slug page = prose on void bg, ember links. Use existing markdown tooling if present in repo; if none, render with a minimal MD-to-HTML approach already available in deps (check before adding anything — NO new deps without flagging).

- [ ] Step 1: Inspect content format, then build both pages (Sonnet dispatch OK).
- [ ] Step 2: Update `app/sitemap.ts` for /blog. Verify green + screenshot list + one post. Commit `feat: blog route`.

## Phase 3 — Polish

### Task 7: Resume page + cleanup + a11y/perf pass

**Files:**
- Modify: `app/resume/page.tsx` (hide iframe `<768px`, show download CTA), `stores/globalStore.ts` (drop dead `reducedMotion` state/action; delete whole store if then unused — grep), `app/not-found.tsx` + `app/opengraph-image.tsx` (restyle to new palette), `lib/site.ts` (title/description: drop "Archive of the Shattered Star" naming for Mission Control positioning copy)

- [ ] Step 1: Apply modifications. Verify green.
- [ ] Step 2: Lighthouse (mobile) on production build (`npm run build && npm start`, then `npx lighthouse http://localhost:3000 --preset=perf --form-factor=mobile --quiet`) → Perf ≥90; fix what falls short.
- [ ] Step 3: Checks: reduced-motion ⇒ static hero (devtools emulation); 375px screenshot all sections; keyboard-tab through nav/CTAs — visible ember focus rings.
- [ ] Step 4: Commit `feat: polish pass — resume, meta, a11y, perf`.

## Phase 4 — Review gates

### Task 8: Reviews + merge

- [ ] Step 1: Antigravity **Flash 3.5**: vault → enrich `content/data/*.json` + SEO meta + alt text (user-driven; prompt supplied by orchestrator). Re-verify after its edits personally.
- [ ] Step 2: cavecrew-reviewer on full branch diff; fix/reject each finding.
- [ ] Step 3: Antigravity **Opus 4.6**: full diff review + browser visual QA (user-driven). Fix or explicitly reject every finding; re-run verify.
- [ ] Step 4: Final: `npm run verify` output pasted in session + Lighthouse score. Merge to main after user approval. Update memory.

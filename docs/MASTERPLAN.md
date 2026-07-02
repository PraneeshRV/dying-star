# MASTERPLAN — Archive of the Shattered Star (v2)

**Status:** Authoritative — the ONLY living plan. Supersedes every earlier plan doc: the v1/v2
masterplans, module/outsourcing/tool docs, `v1-space-plan.md`, and the cinematic sandbox plan
(`.planning/sandbox/`). All of those now live in `docs/archive/` (gitignored, local only).
When this doc and any other doc disagree, this doc wins. `.planning/` remains only as codebase
reference + requirement history; its ROADMAP/STATE point here.

**Owner:** Praneesh R V · **Created:** 2026-06-21 · **Adopted:** 2026-07-02 · **Target domain:** praneeshrv.me

## Start here (status as of 2026-07-02)

- Live site serves the 2026-05-01 build; branch `sandbox-render-foundation` holds newer work.
- Done already: content shell, 3D fallbacks/GPU tiers, SEO/OG/metadata, analytics, verified hero scene.
- Not done: contact API (still mailto, no `app/api/`), blog (W7), proof content (W6), clarity layer (W1/W3).
- Sandbox route + S0 WebGPU work exist in the repo — **W0 deletes them** (plan already archived).
- Next action: run **W0**, then follow §12 sequencing. No new plan docs — edit this file only.

---

## 0. North Star

> In **10 seconds** a stranger knows: *Praneesh is serious offensive-security + AI red-teaming
> talent, with proof.* In **2 minutes** they are impressed enough to remember him and reach out.

This is a **craft-maxed flagship** — the bar is "best portfolio a hiring manager or security peer
has seen this year." That standard is only met when the site is BOTH instantly legible to a busy
recruiter AND technically impressive to a security engineer. "More theme" is never the goal;
"right signal, faster, more memorable" is.

### Three non-negotiable principles
1. **Clarity dominates theme.** The space/terminal aesthetic is the *frame*, never the *message*.
   Every themed label has a plain-language meaning a non-gamer recruiter reads without decoding lore.
2. **Proof over claims.** Numbers, links, artifacts, writeups. Every section answers "prove it."
3. **One thing, perfect.** One hero scene, one narrative page, done flawlessly — not three half-polished
   experiences. Cut ruthlessly.

### What changed from current state (decisions locked 2026-06-21)
- **KEEP** the Shattered-Star 3D space theme + dark aesthetic — but add a **clarity layer**.
- **CUT** the `/sandbox` route and the planned **Packet Runner** game entirely. Remove from scope.
- **AUDIENCE:** dual — recruiters/hiring managers (fast credibility) AND security peers/CTF community
  (technical depth). Top-of-page serves recruiters; depth lives below and in writing.

---

## 1. Strategy & Positioning

### Message hierarchy (top → bottom of `/`)
1. **Who + what + proof** (hero, plain language).
2. **Credibility at a glance** (stat bar with real numbers).
3. **Selected work** (flagship projects with results).
4. **Competitive proof** (CTF / Team Hunter).
5. **Trajectory** (experience timeline + research).
6. **Capabilities** (skills, certifications folded in).
7. **Thinking** (blog/writeups — the credibility multiplier).
8. **Reach me** (contact + socials, frictionless).

### Positioning statement (use verbatim as source for copy)
> Cybersecurity researcher focused on **agentic-AI red teaming and VAPT**. Competes with **Team Hunter
> (CTFtime #8 India / #102 global, 2026)**, researches LLM exploitation at **TIFAC-CORE**, builds
> AI-assisted security tooling (**RedCalibur**), and has run CTF infrastructure for **200+ players**.

### The single biggest fix — the "clarity layer"
The current hero makes a reader decode `archive@shattered-star:~$ scan operator-record` before they
learn anything real. Invert it:
- **H1:** `PRANEESH R V` (keep).
- **Primary subhead (plain, instantly readable):** "Cybersecurity researcher — AI red teaming · VAPT · CTF."
- **One proof line:** "Team Hunter · CTFtime #8 in India · LLM red-team research @ TIFAC-CORE."
- **Themed flavor line:** keep `scan operator-record` but DEMOTE it to a small mono accent, not the
  first thing the eye lands on.
- **CTAs (clear verbs):** `View résumé` (primary) · `See work` (secondary) · `Contact` (tertiary).
  Rename the lore CTAs: "Recover archive" → "Explore", "view dossier" → "Résumé".

---

## 2. Information Architecture

### Routes (final)
| Route | Purpose | Action |
|-------|---------|--------|
| `/` | One-page narrative (all sections below) | Redesign |
| `/blog` | Writing index | Build (W7) |
| `/blog/[slug]` | Post / writeup | Build (W7) |
| `/resume` | PDF viewer | Keep |
| `/sandbox` | — | **DELETE** (W0) |

### `/` section order (reordered to lead with proof)
`Hero` → `Credibility bar` → `Selected Work` → `CTF & Competitions` → `Experience` → `About + Skills`
→ `Certifications` (compact, folded near skills) → `Writing` → `Contact`.

Rationale: current order buries Projects/CTF below About+Skills. Lead with achievements; "About"
becomes supporting context, not the opener.

---

## 3. Design System Refinement

Theme stays; execution gets disciplined. Current palette over-uses neon glow (reads cheaper than it
should) and ships legacy color aliases.

### Tasks
- **Pick one signature accent** (Cherenkov cyan `#58f3ff`) + 1–2 restrained supports (gravity blue,
  ember for warnings only). Demote glow: glow is an *accent*, not a default on every element.
- **Contrast audit (WCAG 2.2 AA):** verify `--color-text-secondary` (#9aa8b4) and `--color-text-dim`
  (#55616c) on `--color-void` (#030406). `text-dim` will likely FAIL AA for body text — restrict it to
  decorative/non-essential text only, or lighten.
- **Type scale:** lock a modular scale (e.g. 1.25 ratio), define `--text-xs..--text-6xl` tokens, stop
  ad-hoc `text-[0.68rem]` literals.
- **Spacing rhythm:** 8px base; standardize section padding, card padding, gaps via tokens.
- **Radii / borders / shadows:** 2–3 radius tokens, one elevation system. Kill one-off
  `shadow-[0_0_30px_rgba(...)]` literals scattered in JSX — move to utilities.
- **Clean up legacy aliases** in `globals.css` (`--color-green` = cyan etc. is confusing; either commit
  to semantic names or to the shattered-star names, not both).

**Deliverable:** updated `app/globals.css` token block + a short `docs/DESIGN_TOKENS.md` reference.

---

## 4. Hero 3D Scene — one, perfected

Keep the **neutron star + 33%-shattered Dyson sphere** as THE signature icon. Audit every other body
(megastructures, pathway remnants, extra planets/moons) and **cut anything that adds visual noise
without adding meaning.** Fewer objects, higher fidelity.

### Targets
- LCP < 2.5s; scene reaches interactive without blocking text paint (text/hero copy render first,
  canvas hydrates after).
- 60fps on a mid-tier laptop (Intel Iris / M1); throttle/simplify on low-tier GPU via existing
  `detect-gpu`.
- Mobile: lighter scene or elegant static fallback — never a janky 3D on phones.
- Reduced-motion: static, composed frame (already partially handled — verify).
- Instant deterministic fallback on WebGL failure (already exists — keep, polish visual).

### Interaction
- Subtle: slow auto-orbit + pointer parallax. Optional "focus" camera move when a section is reached.
- Do NOT gate content comprehension on 3D interaction.

---

## 5. Section-by-Section Specs

Each section: **plain eyebrow allowed, themed flavor allowed, but the substance must be plain.**

- **Hero** — see §1 clarity layer. Add scroll cue. Mount 3D behind, copy in front, copy wins.
- **Credibility bar** — NEW. 4 stat chips with real numbers: `CTFtime #8 IN / #102 global`,
  `200+ CTF players hosted`, `LLM red-team research @ TIFAC-CORE`, `Azure AI intern @ Joy IT`.
  Server-rendered, no animation dependency.
- **Selected Work** — keep filter UI (it's good). Per card: title, 1-line outcome, role, year, stack,
  status, links. Rename `BREACH` → `LIVE`/`DEMO`. Add a real artifact per flagship (screenshot/GIF).
  Promote 3 flagships above the filterable grid.
- **CTF & Competitions** — current `ctf-achievements.json` is thin (498B). Expand: notable solves,
  categories, ranks, a link to 1–2 writeups. This is core differentiation — make it rich.
- **Experience** — timeline (data already rich, 18KB). Keep, but tighten copy to outcomes.
- **About + Skills** — compress. Replace TypewriterText on the *core summary paragraph* with
  instant-readable text (typewriter only on a short ≤1-line flavor string). Replace the ASCII portrait
  as the *primary* visual with a real headshot in a themed frame (recruiters trust faces); ASCII can
  stay as a small garnish. Skills: grouped, scannable, no skill-bar percentages (they're noise) — group
  by domain with proficiency tiers in words.
- **Certifications** — compact strip near Skills, not a full standalone section (reduces section count).
- **Writing** — preview of latest posts → `/blog`.
- **Contact** — real form (W8) + visible GitHub/LinkedIn/email. One-click copy email.

---

## 6. Content & Proof Strategy

Engineering is ahead of content; content is the gap to "best there can be."

- **Projects:** every flagship rewritten as Problem → Approach → Result with at least one concrete
  metric or artifact. Add demo GIFs/screenshots to `public/`. RedCalibur, Agentic-AI CTF challenges,
  this site itself.
- **CTF:** specific solves + ranks + at least one linked writeup.
- **Blog (W7):** the single highest-leverage content investment. Ship **2 real seed posts**:
  1. a CTF/exploit **writeup** (shows hands-on skill),
  2. a **build/research** post (e.g. RedCalibur architecture or an LLM red-team finding).
  Future cadence: 1 post/month minimum.
- **Résumé:** keep PDF current; ensure `/resume` and OG reflect latest.

---

## 7. Motion & Interaction Language

Restraint is the aesthetic. Define once, reuse:
- Scroll-reveal on section entry (IntersectionObserver / `motion`), staggered, subtle.
- Magnetic / glow-on-hover CTAs (already partially present) — standardize.
- Page + route transitions for `/blog`.
- **Every motion has a reduced-motion equivalent** (the global `prefers-reduced-motion` block exists —
  verify each new animation respects it).
- No autoplay sound. No motion that blocks reading.

---

## 8. Engineering Hardening

- **Performance budget:** LCP < 2.5s, CLS < 0.1, INP < 200ms, Lighthouse ≥ 95 (Perf/A11y/Best/SEO) on
  desktop AND mobile. JS shipped to hero route minimized; R3F + three lazy-loaded and code-split.
- **Contact API (W8):** `app/api/contact/route.ts` — `zod` validation, rate limiting, Resend send,
  no secrets in client bundle, honeypot + basic abuse resistance. (Already partially planned/built —
  verify it meets this.)
- **Resolve `next dev` issue:** STATE.md notes dev server doesn't hydrate in smoke window while
  `next start` is healthy. Investigate (Turbopack root / font fetch) so local DX isn't broken.
- **Error boundaries:** keep WebGL boundary; add a route-level error + loading UI.
- **Dependency check:** confirm everything in `package.json` is used post-sandbox-cut; drop orphans.

---

## 9. Accessibility & SEO

- **WCAG 2.2 AA:** contrast fixes (§3), visible focus (exists), skip-to-content link, semantic heading
  order (one `h1`, logical `h2`/`h3`), `aria` on all canvas/interactive widgets, full keyboard path that
  never depends on the canvas.
- **Screen reader pass** documented.
- **SEO** (already strong): keep sitemap/robots/JSON-LD/OG; ADD per-post and per-project metadata,
  real OG images per blog post, RSS feed validity.

---

## 10. Repo Hygiene

- Delete `/sandbox` route + `components/3d/sandbox/**` + `components/sandbox/**` + sandbox verify
  scripts + `sandbox-world.json` (W0). Update `npm run verify:system` to drop sandbox checks.
- Move superseded docs to `docs/archive/`. This file is the only living plan.
- Update `.planning/PROJECT.md`, `ROADMAP.md`, `STATE.md` to reflect the cut scope + new order, OR mark
  `.planning/` as legacy and let this doc lead. (Recommend: update STATE/ROADMAP to point here.)

---

## 11. Execution — Workstreams (subagent-ready)

Each workstream (W#) is a self-contained unit a subagent can own. Order = dependency order. Every W
ends at the **global verification gate** (below) before it's "done."

### Global Definition of Done (applies to every W touching code)
```
npm run lint        # biome clean
npx tsc --noEmit    # types clean
npm run build       # production build green
npm run start       # browser smoke: target viewports, zero console errors
```
Plus: the W's own acceptance criteria met, and no regression to other sections.

### Dependency graph
```
W0 (hygiene/cut) ─┬─> W1 (copy) ──> W3 (hero clarity) ─┐
                  ├─> W2 (design tokens) ──────────────┼─> W5 (sections) ─> W9 (motion) ─┐
                  └─> W4 (hero 3D) ────────────────────┘                                  ├─> W10 (perf/a11y/SEO) ─> W11 (QA/launch)
W6 (proof content) ──────────────────────────────────────> W5                            │
W7 (blog) ───────────────────────────────────────────────────────────────────────────────┤
W8 (contact API) ─────────────────────────────────────────────────────────────────────────┘
```
W6, W7, W8 can run in parallel with the design/section track.

---

### W0 — Scope cut & repo hygiene
- **Agent:** investigator (map refs) → builder (delete).
- **Do:** remove `/sandbox` route, `components/3d/sandbox/**`, `components/sandbox/**`,
  `scripts/verify-sandbox-*.mjs`, `content/data/sandbox-world.json`, sandbox links in hero CTAs; prune
  `verify:system`; archive superseded docs to `docs/archive/`.
- **Accept:** no dangling imports/refs to sandbox; `npm run build` green; hero has no "enter sandbox" CTA.

### W1 — Strategy & copywriting
- **Agent:** content/general.
- **Do:** rewrite all user-facing copy per §1/§5 — plain primary, themed secondary. Produce a
  `content/copy.md` source of truth, then update JSON/section strings. Rename lore CTAs.
- **Accept:** above-the-fold readable in <10s by a non-gamer; every themed label has plain meaning.

### W2 — Design tokens & contrast
- **Agent:** builder.
- **Do:** §3 — single accent, demote glow, type scale, spacing, radii tokens, fix AA contrast, clean
  legacy aliases. Write `docs/DESIGN_TOKENS.md`.
- **Accept:** axe/Lighthouse contrast = 0 serious violations; no ad-hoc color/size literals in new code.

### W3 — Hero clarity layer
- **Agent:** frontend.
- **Do:** restructure hero per §1 — plain H1/subhead/proof line, demoted flavor line, clear CTAs,
  credibility stat bar. Copy renders before canvas hydrates.
- **Accept:** LCP element is hero text (not canvas); message hierarchy matches §1.

### W4 — Hero 3D optimization
- **Agent:** frontend (3D).
- **Do:** §4 — cut noisy bodies, lazy-load/code-split R3F, hit fps + LCP targets, verify mobile +
  reduced-motion + WebGL-fail fallbacks.
- **Accept:** 60fps mid-tier; text paints before canvas; all fallbacks visually polished.

### W5 — Section redesigns
- **Agent:** frontend (one section per sub-task is ideal for parallel subagents).
- **Do:** §5 reorder + per-section specs. Credibility bar, Selected Work cards, rich CTF section,
  compact certs, About/Skills cleanup (kill typewriter-on-paragraph, real headshot).
- **Accept:** new order live; each section meets its spec; responsive at 360/390/768/1280/1440; no overflow.

### W6 — Proof content & assets
- **Agent:** content.
- **Do:** §6 — rewrite projects (Problem/Approach/Result + metric), expand CTF JSON, add screenshots/GIFs
  to `public/`, refresh résumé.
- **Accept:** every flagship has ≥1 metric + ≥1 artifact + working links.

### W7 — Blog engine
- **Agent:** frontend + content.
- **Do:** MDX pipeline, `/blog` + `/blog/[slug]`, Shiki highlighting, tags/dates/excerpts, RSS, per-post
  metadata + OG. Ship 2 real seed posts (1 writeup, 1 build/research).
- **Accept:** posts render; RSS valid XML; Lighthouse SEO ≥95 on a post; 2 posts published.

### W8 — Contact API
- **Agent:** backend.
- **Do:** §8 — `zod` + rate limit + Resend + honeypot, no client secrets; `react-hook-form` UI states.
- **Accept:** validated submit sends mail; invalid/abuse rejected; no secret in client bundle; mailto fallback intact.

### W9 — Motion layer
- **Agent:** frontend.
- **Do:** §7 — scroll-reveal, hover/CTA motion, route transitions, all reduced-motion-safe.
- **Accept:** every animation has reduced-motion equivalent; no CLS from entrance animations.

### W10 — Perf / a11y / SEO hardening
- **Agent:** reviewer + frontend.
- **Do:** §8/§9 — hit budgets, fix Lighthouse/axe findings, skip link, heading order, screen-reader pass,
  per-route metadata, dependency prune, resolve `next dev` issue.
- **Accept:** Lighthouse ≥95 all four categories desktop+mobile; axe 0 serious; keyboard-only full path works.

### W11 — Final QA & launch
- **Agent:** reviewer.
- **Do:** full regression smoke at all viewports, cross-browser (Chromium/Firefox/WebKit), 404/error
  routes, OG preview check, domain wiring on Vercel, analytics live.
- **Accept:** all green; deployed to praneeshrv.me; post-deploy smoke passes.

---

## 12. Sequencing recommendation
1. **W0** first (clears the deck).
2. Then **W1 + W2** in parallel (copy + tokens — they unblock everything visual).
3. Then **W3 + W4** (hero), with **W6/W7/W8** running in parallel as independent tracks.
4. Then **W5** (sections) consuming W1/W2/W6 outputs.
5. Then **W9** (motion) over the finished layout.
6. Then **W10** hardening, **W11** launch.

## 13. Anti-goals (do NOT do)
- Do not add more lore/metaphor depth. Theme is at its ceiling; clarity is the lever now.
- Do not reintroduce sandbox or a minigame.
- Do not add skill-percentage bars, autoplay audio, or motion that blocks reading.
- Do not create another competing plan doc. Edit THIS file.
- Do not put real secrets in any client code, easter egg, or flag.

---
*This masterplan is the single source of truth. Update it here when scope changes.*

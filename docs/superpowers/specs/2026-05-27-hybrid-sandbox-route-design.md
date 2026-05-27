# Hybrid Sandbox Route Design

## Status

Direction approved in conversation. Written spec is awaiting user review before implementation planning.

## Goal

Add an opt-in `/sandbox` route that turns the existing `Archive of the Shattered Star` concept into a freeform orbital ruins experience without weakening the current recruiter-facing homepage.

The homepage should remain the professional, readable portfolio. The sandbox should be the deeper world mode: a full-screen 3D route where visitors explore ruined orbital structures, scan portfolio artifacts, inspect object details, and complete a light first-run mission loop.

The experience should feel like a cyber-space lab built around a shattered-star wreckage field, not a generic 3D menu. It must still answer the portfolio question: why should someone trust Praneesh?

## Approved Direction

Use **Hybrid Sandbox Route**.

Core choices:

- The homepage previews the world and links into `/sandbox`; it does not become the full sandbox.
- `/sandbox` is a separate route with its own full-screen shell and client-side interaction state.
- The sandbox world style is **Orbital Ruins**: wrecks, gates, stations, planets, artifact scans, and hidden proof objects around the shattered-star system.
- v1 uses **guided orbit by default** with an optional free-flight mode toggle.
- v1 uses a **Tactical Console + light Mission Ops** HUD.
- v1 includes a light intro mission, checklist, and session discovery tracker, but no scoring, enemies, account system, or backend persistence.
- Discoveries are lore-flavored but portfolio-first.
- v1 mirrors core homepage proof, while later phases can add deeper sandbox-only logs and case-study fragments.

## Experience Architecture

### Homepage

The existing `/` route remains the canonical portfolio surface. It should keep direct access to Projects, Skills, Experience, Certifications, CTF, Blog preview, Resume, and Contact.

Add or refine an "Enter Sandbox" path only where it supports the current flow. The homepage should not require the visitor to understand or use the sandbox.

### Sandbox Route

`/sandbox` becomes the opt-in world mode. It should load as a full-screen interactive scene with:

- orbital ruins around the existing shattered-star visual language,
- visible route back to the homepage,
- reduced-motion and no-WebGL fallback,
- scanner and object detail interactions,
- mission checklist and discovery tracker,
- accessible HUD list for every important object.

The route should share content and visual language with the existing 3D system, but it should not overload the current homepage `SpaceCanvas` with sandbox-specific state.

### Expansion Slots

The initial design should leave clear boundaries for later systems:

- terminal overlay,
- richer missions,
- simulation grid,
- Packet Runner integration,
- hidden logs and deeper case-study fragments,
- additional `.glb` hero models and model packs.

These are not v1 requirements.

## Component Architecture

### `app/sandbox/page.tsx`

Server route shell for `/sandbox`.

Responsibilities:

- route metadata,
- static layout frame,
- accessible fallback text,
- mounting one client sandbox experience island.

### `SandboxExperience`

Client component that owns the route-level interaction state.

Responsibilities:

- selected object,
- scanner state,
- guided orbit versus free-flight mode,
- intro mission state,
- completed objective ids,
- discovered object ids,
- desktop and mobile HUD layout,
- fallback state passed from WebGL checks.

This component should be the coordinator, not the place where every mesh or panel is implemented.

### `SandboxCanvas`

Full-screen React Three Fiber scene for the sandbox.

Responsibilities:

- orbital ruins scene composition,
- Derelict Relay hero object,
- procedural debris field,
- artifact markers,
- lighting and postprocessing,
- GPU-tier and viewport scaling,
- object hit targets,
- object selection callbacks,
- model fallback paths.

It should reuse existing 3D patterns where practical: memoized geometry, ref mutation inside `useFrame`, large invisible hit targets, WebGL fallback, and the existing asset-ledger discipline.

### `SandboxControls`

Camera and movement layer.

Responsibilities:

- guided orbit as the default,
- optional free-flight mode,
- visible mode toggle,
- reset camera action,
- exit free-flight action,
- mobile-safe controls,
- reduced-motion behavior.

Free flight must be optional, escapable, and resettable.

### `SandboxHUD`

Tactical console and light mission overlay.

Responsibilities:

- scanner output,
- selected object details,
- proof links,
- mission objective checklist,
- discovery tracker,
- control hints,
- object list for keyboard and fallback users,
- route back to home, resume, and contact.

The HUD should not become a dense dashboard. It should explain the scene and make each scan useful.

### `sandbox-world.json`

Static data contract for the sandbox.

Recommended responsibilities:

- zones,
- object ids,
- object kind,
- display name,
- lore name,
- scan text,
- portfolio proof text,
- related homepage section,
- related proof links,
- mission objective mapping,
- model or procedural asset reference,
- fallback display copy.

Use local JSON conventions already present in `content/data/`. Add runtime schema validation only if the content becomes external, user-authored, or API-loaded.

## First Playable Loop

The v1 loop is:

1. Enter `/sandbox` from the homepage.
2. Start in guided orbit with clear controls.
3. See an intro objective pointing to the Derelict Relay.
4. Trigger a scanner pulse.
5. Highlight nearby portfolio artifacts and ruins.
6. Select an object.
7. Read object details, scan output, proof text, and links in the tactical console.
8. Mark the discovery and update the checklist for the current session.

Every scan should produce a useful result: a discovery, an object detail panel, a proof link, or mission progress. Avoid empty visual-only scanner effects in v1.

## Content Model

Discoverable objects should blend world fiction with real proof.

Examples:

- Derelict Relay: identity, contact, and navigation hub.
- Project artifact: flagship project proof, stack, status, and link.
- CTF wreckage: achievement or challenge-safe fake token content.
- Skill array: grouped capabilities and technical domains.
- Resume vault: direct route to `/resume` and PDF.
- Blog beacon: existing blog preview now, deeper writeups later.

The lore should support the portfolio, not bury it. Normal labels such as Projects, Skills, CTF, Resume, and Contact should remain visible beside lore names.

## Asset Strategy

Use a hybrid strategy.

### Procedural First

Build these procedurally in v1:

- debris fields,
- orbit rings,
- artifact markers,
- simple ruined panels,
- scan volumes,
- low-detail stations,
- environmental lines and pulses,
- model fallbacks.

### Selective Hero Model

Prioritize the **Derelict Relay** as the first realistic `.glb` hero object.

The relay is the right first model because it naturally supports:

- first scan,
- restored signal objective,
- object details,
- discovery tracking,
- later terminal connection,
- later mission expansion.

Every non-procedural asset must go through the existing asset-ledger policy before runtime use: source, license, credit, review status, runtime path, fallback, format, and size budget.

## Performance And Fallbacks

Performance rules:

- Keep homepage and `/sandbox` bundles separated as much as practical.
- Lazy-load heavy sandbox assets after the route shell appears.
- Scale detail by GPU tier, viewport size, reduced motion, page visibility, and WebGL support.
- Use procedural or impostor substitutes when models fail or are too heavy.
- Avoid first-load dependency on external assets.
- Do not introduce backend persistence in v1.

Fallback rules:

- No-WebGL users still get the mission checklist and object archive.
- Reduced-motion users get a calm inspectable experience or static fallback.
- Mobile users get guided orbit and HUD-first object access; free flight can be simplified or disabled if needed.
- Every canvas action must have a HUD/list equivalent.
- Model loading failure must not make the route blank.

## Accessibility

Accessibility is part of the design, not a cleanup pass.

Required behavior:

- All important objects are selectable from a non-canvas HUD list.
- Object details and proof links are readable without pointer precision.
- Free-flight mode can be exited by visible control and keyboard.
- Focus must not get trapped inside canvas controls.
- The route must expose clear navigation back to the homepage.
- Reduced-motion preferences are honored.
- Mission progress and discovery status should be visible as text, not only spatial effects.

## Non-Goals For v1

- Do not replace the homepage with the sandbox.
- Do not add accounts, auth, database persistence, or public leaderboards.
- Do not add enemies, scoring, combat, or full minigame mechanics.
- Do not require users to use free flight to access portfolio content.
- Do not make canvas interaction the only navigation path.
- Do not commit large unreviewed model or texture dumps.
- Do not add lore-only interactions that do not improve portfolio comprehension.

## Recommended Implementation Order

1. Read local Next.js 16 docs relevant to App Router routes and client components before implementation.
2. Create the `/sandbox` route shell and client island boundary.
3. Define the `sandbox-world.json` data contract and TypeScript types.
4. Add a sandbox store or local state boundary for selected object, scanner, controls, mission, and discovery state.
5. Build a procedural `SandboxCanvas` with orbital ruins, object markers, and fallback rendering.
6. Add the Tactical Console HUD with object list, object details, scanner output, checklist, and discovery tracker.
7. Add guided orbit controls, reset behavior, and the optional free-flight mode.
8. Add the Derelict Relay as a procedural version first, then replace or enhance it with an approved `.glb` asset once the ledger entry is ready.
9. Wire homepage entry CTA to `/sandbox`.
10. Add browser smoke coverage for route load, object selection, scanner action, mobile, reduced motion, fallback, and console errors.

## Verification Gates

Minimum repo verification:

```bash
npm run verify:system
npm run lint
npx tsc --noEmit
npm run build
```

Browser verification should run against `npm run start`.

Required browser checks for this feature:

- `/sandbox` route loads without console errors,
- canvas or fallback is nonblank,
- desktop object selection works,
- scanner action updates the HUD,
- mission checklist updates,
- discovery tracker updates,
- homepage remains usable and links into sandbox,
- route back to home works,
- mobile layout has no overlapping controls,
- reduced-motion path is calm and usable,
- no-WebGL or forced fallback still shows object archive and mission copy.

## Rejection Criteria

Reject an implementation if it:

- makes the homepage harder to read,
- requires canvas interaction for core portfolio access,
- adds realistic assets without ledger and fallback,
- has no mobile or reduced-motion fallback,
- adds heavy game mechanics to v1,
- introduces backend persistence,
- passes build but lacks browser smoke,
- treats canvas existence as proof of visual success without checking rendered output or fallback content.

# Black Hole Galaxy Showcase Design

## Status

Direction approved in conversation. Written spec is awaiting user review before implementation planning.

## Goal

Evolve `Archive of the Shattered Star` into a maximum-visual-art 3D portfolio showcase centered on a black hole and four orbiting portfolio systems, while keeping the site usable as a recruiter-facing portfolio.

The result should feel like a hyperreal outer-space archive: black hole, photon ring, accretion disk, distorted starfield, neutron-star system, ruined planets, moons, Dyson fragments, shipyards, defense lattices, comms arrays, and portfolio evidence mapped to readable section labels.

The design must preserve direct access to Projects, Skills, Resume, Blog, Contact, CTF proof, and credentials. Visual spectacle is an enhancement, not the navigation source of truth.

## Core Direction

Use **Four Systems of the Event Horizon**.

The central object is **The Null Archive**, a supermassive black-hole navigation hub. Four systems orbit it as evidence clusters. The current neutron-star scene becomes a preserved first system rather than being deleted or rewritten blindly.

The entire universe is viewed through a damaged archival sensor array. This art lens makes mixed sources coherent: generated textures, NASA-derived planetary maps, Blender-authored GLB models, procedural shaders, and tactical labels all appear as reconstructed archive evidence.

## Four Systems

### 1. Identity System

Purpose: communicate who Praneesh is.

Sections:

- Home
- About
- Resume

Visual anchors:

- Black Hole Core / Archive Kernel
- Caldera Garden
- Iris Archive
- Eidolon Prime
- Dossier Lens

Proof labels should mention: cybersecurity student, B.Tech CSE Cybersecurity, 2027, CTF player, builder, resume PDF.

### 2. Build System

Purpose: communicate what Praneesh can build.

Sections:

- Projects
- Skills

Visual anchors:

- Vulcanis Ash
- Ark Shipyard Skeleton
- RedCalibur Drydock
- Axec Command Foundry
- Mnemosyne Engine
- Defense Lattice
- Compiler Husk

Proof labels should mention flagship builds and core stack before lore.

### 3. Proof System

Purpose: communicate external proof, milestones, competitions, and credentials.

Sections:

- Experience
- Certifications
- CTF

Visual anchors:

- Orison Relay
- Beacon Chain
- Bastion Null
- Seal Vault
- Kharon Redoubt
- Fleet Graveyard
- Red Lock

Proof labels should mention timeline, certifications, H7CTF, Pragyan, L3m0nCTF infrastructure, and verified achievements.

### 4. Transmission System

Purpose: communicate writing and conversion paths.

Sections:

- Blog
- Contact

Visual anchors:

- Collapsed Gate
- Broken Hyperlane Arc
- Pelagos Vault
- Long-range Comms Array
- Frost Relay

Proof labels should mention writeups, build notes, email, GitHub, LinkedIn, and collaboration paths.

## Visual Thesis

The universe should feel ancient, cold, damaged, and readable through one forensic interface.

Use these roles for the existing palette:

- `#030406`, `#07111a`, `#081018`: absolute space, shadows, panel surfaces.
- `#c7d0d8`, `#e6eef5`, `#dceeff`: neutron light, ash text, lens glare.
- `#58f3ff`: active scan, radiation, selected targets, corona edges.
- `#6fa8ff`: gravity paths, navigation, cold technical infrastructure.
- `#ff7a45`, `#8a3f2d`: damage, heat scars, accretion dust, breached hulls.
- `#b8894d`: ancient metal, Dyson fragments, credential relics.
- `#d94a4a`: rare threat state for CTF/quarantine only.

Avoid asset-pack collage, generic colorful nebulae, equal-brightness planets, clean sci-fi chrome, purple/green cyberpunk dominance, and lore-heavy labels that hide the actual portfolio value.

## Interaction Model

Use three layers:

1. Portfolio page first.
2. Tactical star map second.
3. Free exploration third.

Required behavior:

- DOM navigation remains canonical for all sections.
- Canvas clicks and camera focus are progressive enhancement.
- Normal section names are always primary: Projects, Skills, CTF, Contact.
- Lore names are secondary: Ark Shipyard, Defense Lattice, Kharon Redoubt, Comms Array.
- Galaxy overview shows The Null Archive plus four systems.
- System focus moves toward one cluster without hijacking page scroll.
- Object focus shows a tactical label with section name, proof line, and action.
- Free-fly mode remains optional and disabled or simplified on mobile/reduced motion.
- Section scroll can gently sync the camera target, but cannot block reading.

## Recommended Implementation Order

1. Reconcile current planning state before future feature planning.
2. Define scene v2 data contract with `systems[]`, scoped node ids, fallback metadata, and verifier updates.
3. Add asset ledger and asset manifest rules before importing external/generated assets.
4. Build The Null Archive as an isolated black-hole component with procedural fallback.
5. Generalize camera and orbit math for system centers and scoped node ids.
6. Render the existing neutron-star scene as the first orbiting system.
7. Add distant impostors for the other three systems.
8. Add one hero planet texture pipeline, starting with Caldera Garden.
9. Add one GLB megastructure pilot, starting with Ark Shipyard Skeleton.
10. Expand the remaining systems progressively behind GPU and asset budgets.

## Non-Goals

- Do not implement a physically accurate relativistic simulator.
- Do not make canvas interaction the only way to navigate.
- Do not require large external assets for first render.
- Do not commit raw 4K/8K texture dumps.
- Do not add full raymarched gravitational lensing in the first pass.
- Do not replace recruiter-readable content with lore-only copy.

## Review Gates

Implementation planning may start only after this spec package is reviewed.

Any implementation should be rejected if it:

- Adds visual density without improving portfolio comprehension.
- Adds external/generated assets without source, license, attribution, and fallback.
- Passes lint/build but lacks production browser smoke.
- Checks canvas existence but not rendered pixels.
- Regresses mobile, reduced motion, no-WebGL, context-loss, or keyboard navigation.
- Ignores local Next 16 docs for framework changes.


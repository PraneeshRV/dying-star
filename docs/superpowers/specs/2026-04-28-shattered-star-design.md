# Archive of the Shattered Star Design

## Status

Approved for implementation planning.

## Goal

Rewrite the portfolio around a new core idea: a post-apocalyptic intergalactic civilization preserved as a damaged tactical archive around a neutron star. The visitor experiences the site as both an archaeologist and a war-map reader, recovering artifacts from a ruined Kardashev-scale system.

The site must remain usable as a portfolio. Recruiters and collaborators should still find projects, skills, resume, blog, and contact paths quickly without decoding the lore.

## Chosen Direction

Use `Plan C: Archive of the Shattered Star`.

This direction combines:

- Archaeological archive: ancient, forensic, mysterious, artifact-driven.
- Tactical war map: damaged, precise, hostile, full of scans, warnings, and system-state overlays.
- Readable portfolio structure: real section names stay visible, with lore subtitles and contextual visual anchors.

## Realism Contract

The experience should be cinematic and astrophysics-inspired, not a full physical simulator. A browser cannot realistically simulate a neutron star, relativistic gravity, radiation, orbital mechanics, and all celestial interactions with scientific accuracy in real time.

The implementation should still feel serious and physically grounded:

- Neutron star visuals use compact scale, intense white-blue emission, magnetic scars, dark surface regions, corona glow, X-ray-style jets, radiation bands, accretion dust, gravitational halo approximation, and shader turbulence.
- Celestial bodies rotate on their axes and revolve around the star or their parent body.
- Orbital speeds, rotations, and distances are art-directed for readability, but should preserve relative scale cues.
- The system is zoomable, movable, observable, and visitable through camera controls and guided focus targets.
- The scene should support free observation plus section-targeted camera movement.
- Low-end devices must receive a cinematic fallback rather than a broken or blank heavy scene.

## Visual System

The homepage becomes a dense tactical ruin system, not a decorative backdrop.

Primary scene elements:

- Realistic-feeling neutron star as the gravitational and visual center.
- Dyson sphere around the neutron star with 67% remaining structure and 33% visible destruction.
- Damaged shell panels, warped ribs, broken struts, ember-hot attack scars, and debris fields.
- Seven to nine major planets with distinct ruined civilization states.
- Twelve or more moons, vault moons, city moons, mined moons, and cracked satellite bodies.
- Multiple orbital bands with visible revolutions and tactical labels.
- Broken intergalactic pathway remnants: hyperlane arcs, dead jump gates, severed beacon chains, and distorted navigation corridors.
- Megastructure ruins: broken orbital rings, derelict habitat cylinders, mass-driver spine, ark shipyard, comms array wreck, collapsed gate, fleet graveyard, tether ruins, defense lattice, and data vaults.

The star and Dyson sphere remain dominant. Planets, moons, pathways, and megastructures appear at different depths so the scene feels large without becoming noisy.

## Palette

Use a dark tactical ruin palette:

- Void Black: `#030406`
- Neutron Ash: `#c7d0d8`
- Cherenkov Cyan: `#58f3ff`
- Dying Ember: `#ff7a45`
- Oxidized Gold: `#b8894d`
- Ruin Rust: `#8a3f2d`
- Gravity Blue: `#6fa8ff`
- Threat Red: `#d94a4a`

Color should come from physics, damage, and interface state: neutron light, radiation, burning impact damage, oxidized megastructure metal, warning overlays, and ash-gray text.

Avoid the old neon cyber look as the dominant mood.

## Interaction Model

The outer-space scene must be scalable, zoomable, visitable, observable, and movable.

Required interaction behaviors:

- Users can orbit, pan, and zoom the scene on capable devices.
- Users can focus or "visit" celestial bodies and megastructures through section anchors.
- Hover and focus states reveal tactical metadata: name, damage state, linked section, archive confidence, and threat/radiation state.
- Guided camera transitions can move between the star, planets, moons, ruins, and section-linked relics.
- All major celestial bodies rotate.
- Planets revolve around the neutron star.
- Moons revolve around their parent planets where represented.
- Megastructures can rotate, drift, fracture, or pulse depending on their type.
- Reduced-motion mode disables aggressive camera movement and uses gentle static states.
- Mobile and low-GPU modes preserve the concept with simplified geometry, sprite impostors, or static cinematic fallback.

## Content Mapping

Keep real section labels visible, with lore subtitles:

- `About` -> `Operator Record`, tied to an archive moon or identity vault.
- `Projects` -> `Recovered Megastructure Blueprints`, tied to shipyards, Dyson fragments, and fleet wreckage.
- `Skills` -> `Knowledge Matrix`, tied to a defense lattice or data vault.
- `Experience` -> `Signal Chronology`, tied to broken intergalactic pathway beacons.
- `Certifications` -> `Authority Seals`, tied to vault moons or clearance relics.
- `CTF` -> `Breach Archive`, tied to tomb worlds, quarantine zones, and war scars.
- `Blog` -> `Recovered Transmissions`, tied to deep-space beacons, collapsed pathway relays, and archive signal fragments.
- `Contact` -> `Long-range Comms Array`, tied to a damaged relay structure.
- `Resume` -> `Recovered Dossier`, still direct and recruiter-friendly.

## Blog Direction

The blog becomes `Recovered Transmissions`.

Posts should feel like decoded technical signals:

- Technical writeups.
- Security notes.
- Project retrospectives.
- Research logs.
- CTF analyses.
- Engineering breakdowns.

The public navigation label should remain `Blog`, with `Recovered Transmissions` as the lore subtitle.

## Minigame Direction

Replace or heavily retheme `Packet Runner` into `Signal Salvage`.

Core idea: the visitor pilots a small archive probe through Dyson debris, radiation cones, dead drones, gravity shear zones, and broken hyperlane fragments to recover transmission shards.

Requirements:

- Simple keyboard and touch controls.
- Short sessions.
- No account system.
- No backend dependency.
- Tactical HUD style.
- Rewards can unlock lore snippets or point toward portfolio sections.
- Hazards include neutron radiation pulses, Dyson debris, hostile defense remnants, gravity shear, and gate instability.
- Use Canvas or R3F depending on implementation risk and performance.

## Archive Console

The terminal becomes an `Archive Console`.

Candidate commands:

- `scan`
- `projects`
- `skills`
- `experience`
- `transmissions`
- `breaches`
- `resume`
- `contact`
- `salvage`
- `map`
- `clear`

The console should feel like an old archive AI recovering damaged records, but commands must remain discoverable and useful.

## Architecture

Use the existing Next.js, React, TypeScript, Tailwind, React Three Fiber, and Three.js stack.

Proposed component boundaries:

- `components/3d/NeutronStar`: neutron star material, corona, radiation effects, jets, glow, dark scars.
- `components/3d/DysonSphere`: 67% intact shell, 33% destroyed shell, broken panel generation, debris.
- `components/3d/OrbitalBodies`: planets, moons, rotations, revolutions, section metadata.
- `components/3d/Megastructures`: orbital rings, habitat cylinders, gates, shipyards, comm arrays, mass drivers, fleet debris.
- `components/3d/PathwayRemnants`: collapsed hyperlanes, beacon chains, intergalactic route fragments.
- `components/3d/SystemCamera`: orbit controls, guided focus, zoom targets, reduced-motion behavior.
- `components/3d/SystemFallback`: low-GPU and reduced-motion visual fallback.
- `components/sections/*`: retheme section copy and wrappers while preserving readable labels.
- `components/terminal/*`: archive console behavior in a later phase.
- `app/globals.css`: new tactical ruin palette and global visual tokens.

Large scene pieces should remain separate components with clear props and metadata. Avoid rebuilding the full star system as one monolithic component.

## Data Model

Use structured local data for celestial and section metadata.

Each body or structure should define:

- Stable id.
- Display name.
- Lore subtitle.
- Portfolio section target, if any.
- Orbit parent.
- Orbit radius.
- Orbit speed.
- Rotation speed.
- Visual type.
- Damage state.
- Tactical status.
- Short scan text.

This keeps the scene scalable and makes it possible to add more planets, moons, and ruins without hardcoding every label inside JSX.

## Accessibility And Usability

The site must not depend only on 3D interactions.

Requirements:

- Normal scroll navigation still works.
- Section links remain in the DOM and keyboard-accessible.
- 3D labels have non-3D equivalents.
- Reduced-motion mode is respected.
- Low-GPU fallback still exposes all sections.
- Text contrast must remain high over dark backgrounds.
- Recruiter-critical paths remain direct: Projects, Skills, Resume, Contact, Blog.

## Performance Strategy

The scene can be ambitious, but it must degrade cleanly.

Required strategy:

- GPU tier detection before choosing heavy effects.
- Cap geometry counts on low and medium tiers.
- Use instancing or generated buffers for repeated panels, debris, stars, and markers.
- Avoid heavy post-processing on low tier.
- Lazy-load noncritical scene details.
- Pause or reduce animation when the tab is hidden.
- Provide static or simplified fallback for weak devices.
- Test desktop, mobile viewport, reduced motion, and fallback states.

## Roadmap Impact

Insert a new phase before the remaining roadmap work:

1. `Core Concept Reforge`
   Rewrite visual system, section language, palette, 3D scene model, fallbacks, and navigation metaphors around `Archive of the Shattered Star`.

2. `Contact API`
   Implement practical contact form/API work after the concept is stable.

3. `3D Performance And Fallbacks`
   Harden GPU detection, fallbacks, mobile behavior, and loading states for the heavier scene.

4. `Archive Console And Motion`
   Retheme terminal, scroll effects, hover overlays, and section transitions.

5. `Signal Salvage Minigame`
   Build the new minigame.

6. `Recovered Transmissions Blog`
   Add blog posts as decoded technical transmissions.

7. `Launch Polish`
   SEO, accessibility, copy pass, performance, browser smoke, and final polish.

## Verification Plan

For implementation phases, run:

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- Browser smoke against `npm run start` for runtime/UI changes.
- Desktop and mobile viewport checks.
- Canvas or WebGL sanity checks that the scene is nonblank.
- Reduced-motion check.
- Low-GPU/fallback check.

## Open Constraints

There are no open design blockers.

Implementation should preserve the approved ambition while making performance-based tradeoffs explicit. If a fully detailed object is too expensive for real-time rendering, use layered simplification: close-up detail for focused visits, lower-detail impostors for distant bodies, and tactical labels for context.

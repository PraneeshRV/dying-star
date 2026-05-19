# Portfolio System Map Design

## Status

Companion spec for `2026-05-01-black-hole-galaxy-design.md`. Awaiting user review before implementation planning.

## Rule

Plain portfolio labels come first. Lore names support the visual system but must not make recruiters decode the site.

Example:

- Primary label: `Projects`
- Secondary label: `Ark Shipyard Skeleton`
- Proof line: `Flagship builds: RedCalibur, Axec-CLI, L3m0nCTF`

## Section Mapping

| Section | System | Celestial Anchor | Visual Metaphor | Interaction | Proof-Focused Label |
| --- | --- | --- | --- | --- | --- |
| Home | Identity | Black Hole Core / Archive Kernel | Evidence pulled into one gravitational archive | Enter Archive expands the galaxy map | Cybersecurity student, CTF player, builder |
| About | Identity | Caldera Garden + Iris Archive | Identity record preserved in a ruined garden world | Scan pulse reveals profile facts | B.Tech CSE Cybersecurity, 2027 |
| Resume | Identity | Eidolon Prime + Dossier Lens | Formal dossier recovered from capital ruins | View/download resume | Resume PDF: complete evaluator snapshot |
| Projects | Build | Vulcanis Ash + Ark Shipyard Skeleton | Projects as recovered engineering blueprints | Orbit dock highlights project categories | RedCalibur, Axec-CLI, L3m0nCTF |
| Skills | Build | Mnemosyne Engine + Defense Lattice | Skill graph as surviving technical infrastructure | Focus node groups skills | OSINT, Forensics, Web, Linux, Docker, Rust |
| Experience | Proof | Orison Relay + Beacon Chain | Timeline as recovered signal history | Step through beacon events | Education, CTFs, infrastructure, milestones |
| Certifications | Proof | Bastion Null + Seal Vault | Credentials as protected records | Open seal cards | PJPT WIP and B.Tech Cybersecurity |
| CTF | Proof | Kharon Redoubt + Fleet Graveyard | Breach archive from competitions and battles | Open breach records | H7CTF finalist, Pragyan 8th, L3m0nCTF infra |
| Blog | Transmission | Collapsed Gate / Hyperlane Remnant | Technical writing as recovered transmissions | Tune signal by tag | Writeups, labs, build notes |
| Contact | Transmission | Pelagos Vault + Long-range Comms Array | Recruiter/collaborator communication channel | Activate relay opens contact paths | Email, GitHub, LinkedIn |

## Existing System Preservation

The current `Archive of the Shattered Star` remains important. It should become the first fully detailed orbiting system.

Preserve:

- Neutron star identity.
- Aurelian Dyson Remnant with visible destruction.
- Current planet, moon, megastructure, and pathway ids.
- Section mapping from `content/data/shattered-system.json`.
- Existing DOM navigation and section ids.
- Existing invisible hit target pattern for reliable object selection.

## New Galaxy-Level Content Structure

The galaxy layer adds a parent structure above the current system.

Recommended hierarchy:

```text
BlackHoleGalaxy
  center: The Null Archive
  systems:
    identity
    build
    proof
    transmission
  routes:
    inter-system hyperlane scars
    signal paths
    gravity-safe camera arcs
```

The current single-system data should either become `systems[0]` or remain as `shatteredSystem` while a wrapper composes it as one orbiting cluster. The second option is safer for early phases.

## Label Contract

Each visible focus label should include:

- Plain section name.
- Lore name.
- One concrete proof line.
- One action or destination.
- Short scan text.

Label example:

```text
Projects
Ark Shipyard Skeleton
Flagship builds: RedCalibur, Axec-CLI, L3m0nCTF
Open Projects
```

Avoid labels that only say things like `thermal scars active` without explaining portfolio value.

## Lore Guardrails

Use carefully:

- `breach`, `quarantine`, `war tomb`, and `attack telemetry` are acceptable for CTF only.
- `authority seals` is acceptable for certifications.
- Avoid `clearance` language that could imply real security clearance.
- Avoid hiding resume, contact, or project proof behind easter eggs.
- Avoid making The Null Archive compete with the neutron star in the current system. The black hole is the galaxy hub; the neutron star is the detailed home-system core.


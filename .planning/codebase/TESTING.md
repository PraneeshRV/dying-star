# Testing Patterns

**Analysis Date:** 2026-04-27

## Test Framework

**Runner:**
- Not configured.
- No `vitest.config.*`, `jest.config.*`, `playwright.config.*`, `cypress.config.*`, `*.test.*`, or `*.spec.*` files are detected outside `node_modules`.
- `package.json` has no `test`, `test:watch`, `coverage`, or `e2e` scripts.
- Local Next 16 testing guidance is available in `node_modules/next/dist/docs/01-app/02-guides/testing/index.md`, `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`, and `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`.

**Assertion Library:**
- Not configured.
- `vitest`, `jest`, `@testing-library/react`, `@testing-library/dom`, `@playwright/test`, and `cypress` are not listed in `package.json`.

**Run Commands:**
```bash
npm run lint                                                        # Biome lint/format check
npx tsc --noEmit                                                   # TypeScript type-check
npm run build                                                      # Next 16 production build
python3 /home/praneesh/antigravity-skills/skills/webapp-testing/scripts/with_server.py --server "npm run start" --port 3000 --timeout 60 -- python3 /tmp/dying_star_smoke.py
                                                                    # External production browser smoke, not an in-repo script
```

## Verification Results

**Passed on 2026-04-27:**
- `npm run lint`
  - Ran `biome check`.
  - Checked 52 files.
  - No fixes applied.
- `npx tsc --noEmit`
  - Exited successfully with no diagnostics.
- `npm run build`
  - Ran `next build` with Next.js 16.2.4 and Turbopack.
  - Compiled successfully.
  - Completed TypeScript validation.
  - Generated static routes: `/`, `/_not-found`, `/resume`.
- `python3 /home/praneesh/antigravity-skills/skills/webapp-testing/scripts/with_server.py --server "npm run start" --port 3000 --timeout 60 -- python3 /tmp/dying_star_smoke.py`
  - Started production server through `npm run start`.
  - Verified home sections.
  - Verified `canvas` is present.
  - Verified `/resume` route and resume iframe/link.
  - Reported `console_errors=0`.

**Current smoke state:**
- No maintained in-repo smoke script exists.
- `/tmp/dying_star_smoke.py` is an external temporary harness, not part of the repository.
- Browser smoke currently covers a reduced-motion Chromium pass against production start for `app/page.tsx` and `app/resume/page.tsx`.
- Browser smoke does not currently cover mobile viewport, normal-motion animation behavior, keyboard navigation, WebGL pixel output, hash navigation, or `/not-found` routing.

## Test File Organization

**Location:**
- Not configured.
- When adding tests, follow local Next docs:
  - Unit/component tests may be colocated near `app/`, `components/`, `hooks/`, `lib/`, and `stores/`, or placed under a root `__tests__/` directory.
  - Browser E2E tests should live under `tests/` when Playwright is introduced.

**Naming:**
- Recommended unit/component names: `*.test.ts` and `*.test.tsx`.
- Recommended Playwright names: `*.spec.ts`.
- Keep smoke tests explicit in the filename, for example `tests/home-smoke.spec.ts` or `tests/resume-smoke.spec.ts`.

**Structure:**
```text
__tests__/                    # Optional shared Vitest tests
components/**/*.test.tsx      # Colocated component tests
hooks/**/*.test.ts            # Hook tests with browser API mocks
lib/**/*.test.ts              # Pure utility tests
stores/**/*.test.ts           # Zustand store contract tests
tests/**/*.spec.ts            # Playwright E2E and browser smoke tests
```

## Test Structure

**Suite Organization:**
```typescript
// No in-repo automated test suite exists.
// Use this shape when Vitest is introduced:
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

test("renders the project filter controls", () => {
  // Arrange: render a component with stable fixture data.
  // Act: interact through user-visible roles/text.
  // Assert: check accessible output, not implementation details.
});
```

**Patterns:**
- Unit tests should start with pure helpers in `lib/utils.ts`, enum maps in section components, and Zustand state transitions in `stores/globalStore.ts`.
- Component tests should assert visible output and accessibility roles for `components/ui/Button.tsx`, `components/ui/ProjectCard.tsx`, `components/ui/GlitchText.tsx`, and `components/ui/TypewriterText.tsx`.
- Hook tests need browser API stubs for `window.matchMedia` in `hooks/useMediaQuery.ts` and `hooks/useReducedMotion.ts`.
- Animation-heavy component tests need controlled timers or `requestAnimationFrame` mocks for `components/ui/BootLoader.tsx`, `components/ui/TypewriterText.tsx`, and `components/ui/CustomCursor.tsx`.
- Async Server Components should be covered with E2E tests where possible, matching Next's local guidance in `node_modules/next/dist/docs/01-app/02-guides/testing/index.md` and `vitest.md`.

## Mocking

**Framework:** Not configured

**Patterns:**
```typescript
// Recommended when Vitest is added.
// Stub browser APIs used by hooks and client components:
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }),
});
```

**What to Mock:**
- `window.matchMedia` for `hooks/useMediaQuery.ts`, `hooks/useReducedMotion.ts`, and reduced-motion branches in `components/ui/TypewriterText.tsx`.
- `requestAnimationFrame` and `cancelAnimationFrame` for `components/ui/TypewriterText.tsx`, `components/ui/ProjectCard.tsx`, and animation timing tests.
- `@pmndrs/detect-gpu` for deterministic `components/3d/SpaceCanvas.tsx` tier behavior.
- Motion libraries in isolated component tests only when animation output blocks stable assertions.

**What NOT to Mock:**
- Do not treat mocked React Three Fiber unit tests as proof that `components/3d/*` renders correctly. WebGL, canvas, shaders, and postprocessing need browser smoke or visual checks.
- Do not mock Next route rendering for E2E coverage of `app/page.tsx`, `app/resume/page.tsx`, `app/not-found.tsx`, or metadata behavior.
- Do not mock static content in broad smoke tests; use `content/data/projects.json`, `content/data/skills.json`, `content/data/profile.json`, and `content/data/ctf-achievements.json` to catch integration issues.

## Fixtures and Factories

**Test Data:**
```typescript
import type { Project, Skill } from "@/types";

const projectFixture: Project = {
  id: "fixture-project",
  title: "Fixture Project",
  description: "Stable project used by tests.",
  techStack: ["TypeScript"],
  category: "tools",
  status: "active",
};

const skillFixture: Skill = {
  name: "Testing",
  category: "development",
  proficiency: 4,
};
```

**Location:**
- No test fixture directory exists.
- Current production content fixtures live in `content/data/*.json` and are consumed directly by `components/sections/*.tsx`.
- Add shared test fixtures under `tests/fixtures/` or `__tests__/fixtures/` when a test runner is introduced.

## Coverage

**Requirements:** None enforced

**View Coverage:**
```bash
# Not configured. Add a test runner and coverage script before using coverage commands.
```

**Recommended minimum coverage areas:**
- `lib/utils.ts`: `cn` class composition and `formatDate` formatting.
- `stores/globalStore.ts`: default values and setter/toggler behavior.
- `hooks/useMediaQuery.ts` and `hooks/useReducedMotion.ts`: initial state, listener setup, listener cleanup.
- `components/ui/Button.tsx`: anchor vs button rendering, external-link attributes, variants, default button type.
- `components/ui/ProjectCard.tsx`: status labels, source link behavior, tech stack rendering, pointer leave reset.
- `components/ui/TypewriterText.tsx`: reduced-motion immediate render, empty string behavior, completion callback behavior.
- `components/sections/ProjectsSection.tsx`: filter behavior, WIP logic, empty state.
- `components/sections/SkillsSection.tsx`: grouping by `Skill["category"]` and proficiency display.
- `components/3d/SpaceCanvas.tsx`: GPU tier scaling through mocked `getGPUTier`.

## Test Types

**Unit Tests:**
- Not configured.
- Best first targets are `lib/utils.ts`, `stores/globalStore.ts`, `hooks/useMediaQuery.ts`, and `hooks/useReducedMotion.ts`.
- Use Vitest and React Testing Library if unit/component tests are added, following `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`.

**Component Tests:**
- Not configured.
- Target reusable UI in `components/ui/` before large section components.
- Assert user-visible roles, labels, text, and attributes. Avoid snapshot-only coverage for animation-heavy components.

**Integration Tests:**
- Not configured.
- Target JSON content integration in `components/sections/AboutSection.tsx`, `components/sections/ProjectsSection.tsx`, `components/sections/SkillsSection.tsx`, `components/sections/ExperienceSection.tsx`, and `components/sections/CTFSection.tsx`.
- Add content-shape validation for `content/data/*.json` if content starts changing frequently.

**E2E Tests:**
- Not configured in the repository.
- Playwright is the best fit for route smoke, accessibility navigation, reduced-motion contexts, canvas presence, console errors, `/resume` iframe/link behavior, and 404 behavior.
- Local setup guidance is in `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`.
- Run Playwright against production code with `npm run build` and `npm run start`, matching the local Next guidance.

## Common Patterns

**Async Testing:**
```typescript
// Recommended for browser/E2E tests when Playwright is added.
await page.goto("/", { waitUntil: "domcontentloaded" });
await expect(page.locator("#home")).toBeVisible();
await expect(page.locator("canvas")).toHaveCount(1);
```

**Error Testing:**
```typescript
// Recommended for component tests when a test runner is added.
// Assert fallback UI when `components/3d/WebGLErrorBoundary.tsx` catches render errors.
// Spy on `console.error` and restore it after the test.
```

**Browser Smoke Pattern:**
```typescript
// Recommended Playwright coverage based on the external smoke harness:
// 1. Visit `/` in a production server.
// 2. Capture console errors.
// 3. Assert sections `#home`, `#about`, `#projects`, `#skills`, `#experience`, `#ctf`, `#contact`.
// 4. Assert one or more `canvas` elements or the fallback path when WebGL is unavailable.
// 5. Visit `/resume` and assert `iframe[title="Praneesh R V resume PDF"]` plus `a[href="/resume.pdf"]`.
// 6. Fail on console errors.
```

## Manual and Browser QA Gaps

**High priority:**
- Add a maintained Playwright suite under `tests/` for the production smoke currently handled by `/tmp/dying_star_smoke.py`.
- Add desktop and mobile viewport checks for `app/page.tsx`, especially the first viewport, floating nav, section layout, and responsive grid wrapping.
- Add a normal-motion browser pass in addition to reduced-motion coverage for `components/ui/BootLoader.tsx`, `components/ui/FloatingNav.tsx`, and `components/ui/TypewriterText.tsx`.
- Add WebGL validation beyond canvas existence for `components/3d/SpaceCanvas.tsx`, `components/3d/NeutronStar.tsx`, `components/3d/Starfield.tsx`, and `components/3d/OrbitalPlanets.tsx`.

**Medium priority:**
- Add keyboard-only smoke for section navigation, project filter tabs, CTF button, resume links, and focus visibility.
- Add route smoke for `app/not-found.tsx`.
- Add checks for external links generated from `content/data/projects.json` and `content/data/profile.json`.
- Add content schema validation for `content/data/*.json`.

**Low priority:**
- Add visual regression snapshots for stable UI modules after layout settles: `components/ui/Button.tsx`, `components/ui/ProjectCard.tsx`, `components/sections/ProjectsSection.tsx`.
- Add performance smoke for bundle regressions and WebGL frame budget once a benchmark target exists.

---

*Testing analysis: 2026-04-27*

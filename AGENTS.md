<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:gsd-project-rules -->
# GSD Project Rules

This repo is managed with Get Shit Done planning artifacts under `.planning/`.

- Read `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, and `.planning/STATE.md` before planning substantial work.
- Read `.planning/codebase/` before changing architecture, framework configuration, data flow, tests, or integrations.
- Current execution target is Phase 1 in `.planning/ROADMAP.md`: Finish Content Shell.
- Keep planning commits scoped to `.planning/` and instruction files; keep code commits scoped to implementation files.
- Minimum verification for user-facing changes: `npm run lint`, `npx tsc --noEmit`, `npm run build`, plus browser smoke against `npm run start` when UI/runtime behavior changes.
<!-- END:gsd-project-rules -->

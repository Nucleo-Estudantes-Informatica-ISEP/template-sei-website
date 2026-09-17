# 02 — Astro as the framework

**Status:** Accepted

## Context

Before scoping this project, a first pass assumed a more complex system was
needed: a frontend, a backend admin CRUD for organizers to edit content
through a UI, and a shared domain layer between them — the kind of stack a
content-management-driven site would need. The project's kickoff meeting
clarified this: the site is static. Content (dates, committees, speakers,
program, ...) is set once per edition by whoever's building that edition's
fork, not edited live through an admin UI by non-technical organizers at
runtime.

## Discussion

- **A. Full-stack system (Laravel + Inertia + React/TypeScript)** — a
  Laravel backend (Eloquent ORM, admin CRUD for organizers) serving a
  React/TypeScript frontend through Inertia, avoiding a separate REST/GraphQL
  API layer. The original pre-meeting assumption; dropped once the
  static-only requirement was confirmed, since a database and an editing
  backend would serve a requirement that didn't exist.
- **B. WordPress** — the last two SEI editions were built this way, so
  reusing it would mean no change in technology. Passed over for two
  reasons: the team has more experience with JS/TS (Astro, Next) than PHP,
  and building from scratch gives freedom over look and implementation that
  WordPress's theme/plugin model restricts.
- **C. Static site generator (Astro)** — no backend, no database; content
  set once per edition through committed files. Astro's component model
  works with plain JS/TS modules without pulling in a full client-side SPA
  framework's runtime — a fit for a mostly-static, content-driven site with
  only light interactivity (nav, language switcher, back-to-top). The team
  also already knew Astro.

## Decision

**C.** Use Astro. With the backend/CRUD scope dropped, the framework choice
mattered far less than it would have for the original system — Astro's fit
for static output plus existing team familiarity settled it, and it kept
the stack in JS/TS rather than reverting to WordPress's PHP.

### Consequences

- No backend, database, or runtime admin UI — per-edition content mostly
  lives in `src/data/<domain>/*.json` (one directory per domain, e.g.
  `edition/`, `committees/`, `program/`), hand-edited and zod-validated (see
  [`docs/implementation/architecture.md`](../implementation/architecture.md)).
  Deliberate exceptions exist: genuinely static prose lives in components
  instead of JSON, and the Program page's translation cache
  (`src/data/program/program-translation-cache.json`) has its own
  parsing/fallback behavior rather than the standard schema-validated path.
  An organizer who wants a CRUD-style editing experience doesn't get one; editing means
  editing JSON (or, for static prose, code) in a fork.
- Static output (`astro build`) is what makes the Docker/nginx deploy setup
  (`Dockerfile`, `docker-compose.app.yml`) simple — serving prebuilt files,
  no app server or database to run alongside it.
- Moving off WordPress means no more relying on its plugin ecosystem or
  admin UI — organizers used to editing content there will need to adjust
  to a code-based, per-edition workflow instead.
- Revisiting this later (e.g. an edition wanting organizer-editable content
  without a code change) would mean reopening the backend/CRUD scope this
  decision closed, not just swapping frameworks.

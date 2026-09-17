# 01 — One repository per SEI edition

**Status:** Accepted

## Context

DEI-ISEP required that the history of past SEI editions stay clean — each
year's site, as it existed and looked at the time, needs to remain intact
and inspectable on its own, not overwritten or reshaped by later years'
changes.

## Discussion

- **A. Single repository, edition selected by a switch** — one shared
  codebase, with the active edition picked via an env var or a per-year
  branch. Every edition runs the same, continuously evolving code; a
  template-level change (a component rewrite, a schema change, a dependency
  bump) would retroactively change how an old edition's site looks or
  behaves, or old editions would need active maintenance to keep building
  as the shared code moves on.
- **B. Template repo + one separate repository per edition** — this repo
  holds only the reusable template; each yearly edition (SEI'26, SEI'27,
  ...) is created as its own repository from it and doesn't pull further
  template updates automatically.

## Decision

**B.** This repo is a template, not a website. Each edition gets its own
repository, created from this template, and stays that way — picking up a
later template change is a deliberate act by that edition's maintainers,
not something that happens to it.

### Consequences

- Each edition's deploy is fully isolated — its own Coolify deployment, own
  `main`/`dev` branches, own release history — with no cross-edition
  coordination needed to ship or roll back.
- Past editions are naturally preserved as-is: once SEI'26's repo stops
  being actively worked on, nothing in this template repo or in SEI'27's
  repo can change how SEI'26 looked or behaved.
- This repo's own issue tracker only ever covers template mechanics
  (`sei-website-template` milestone) — it has no visibility into, and never
  tracks, any specific edition's content work. See
  [`AGENTS.md`](../../AGENTS.md) → "What this repo is".
- The cost: template fixes/improvements don't reach existing edition repos
  automatically. Each edition repo has to deliberately merge in template
  updates to benefit from them, and a template bug found after an edition
  forked won't self-heal there.

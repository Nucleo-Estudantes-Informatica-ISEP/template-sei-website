# 01 — One repository per SEI edition

**Status:** Accepted

## Context

DEI-ISEP requires the history of past SEI editions to stay clean — each
year's site, as it looked at the time, must remain intact and inspectable
on its own, not overwritten or reshaped by later years' changes.

## Discussion

- **A. Single repository, editions tracked by release** — the approach used
  by [fallstack-website](https://github.com/Nucleo-Estudantes-Informatica-ISEP/fallstack-website):
  one continuously evolving codebase, with each year's edition marked as a
  `<year>-edition` git tag on `main`. A template-level change (a component
  rewrite, a schema change, a dependency bump) lands on the same branch
  every edition's tag was cut from, so recovering exactly how an old
  edition looked means checking out its tag rather than reading the
  current `main`.
- **B. Template repo + one separate repository per edition** — this repo
  holds only the reusable template; each yearly edition (SEI'26, SEI'27,
  ...) is created as its own repository from it and doesn't pull further
  template updates automatically.

## Decision

**B.** This repo is a template, not a website. Each edition gets its own
repository, created from this template, and stays that way — picking up a
later template change is a deliberate act by that edition's maintainers,
not something that happens to it. Isolating each edition into its own
repository was the simpler way to guarantee DEI's history requirement,
even at the cost of creating more repositories over time — a past edition
just sits there, unaffected by anything, rather than depending on a tag
still resolving correctly against a moving `main`.

### Consequences

- Each edition's deploy is fully isolated — its own Coolify deployment, own
  `main`/`dev` branches, own release history — with no cross-edition
  coordination needed to ship or roll back.
- Past editions are preserved as-is: once SEI'26's repo stops being
  actively worked on, nothing in this template repo or in SEI'27's repo can
  change how SEI'26 looked or behaved.
- This repo's own issue tracker only ever covers template mechanics
  (`sei-website-template` milestone) — it has no visibility into, and never
  tracks, any specific edition's content work. See
  [`AGENTS.md`](../../AGENTS.md) "What this repo is".
- Template fixes and improvements don't reach existing edition repos
  automatically. Each edition repo has to deliberately merge in template
  updates to benefit from them, and a template bug found after an edition
  forked won't self-heal there.
- More repositories to create and track over time, one per edition, instead
  of one repository with more tags.

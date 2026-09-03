# AGENTS.md

Reference for AI agents (and humans) working in this repo — workflow, stack, layout, and conventions that aren't obvious from reading one file. This is a living doc: fill in each section as the mechanism it describes actually lands, rather than writing ahead of the code.

---

## What this repo is

A reusable Astro template for SEI symposium websites — **not** a specific edition's website. It carries the NEI-ISEP-blue base style, a one-file `styles.override.css` re-skin mechanism, en/pt i18n, and per-edition content driven by JSON (not hardcoded in components). See the [design comp reference](https://github.com/Nucleo-Estudantes-Informatica-ISEP/template-sei-website/issues/11) for the target pages.

Each yearly SEI edition (SEI'26, SEI'27, ...) is hosted as its **own separate repository**, created from this template; when this template gets updated, edition repos pull those updates in. Consequences of that:

- This repo's issue tracker only ever covers template mechanics — everything here lives under the `sei-website-template` milestone.
- This repo has no visibility into, and never tracks, any specific edition's content work (banner, dates, speakers, QR code, post-event photos) — that's tracked in that edition's own repo, under its own milestone.

---

## Contribution workflow

Two long-lived branches, matching the other NEI-ISEP repos (`fallstack-website`, `unclassed`, `antirecurso`): `dev` is where work lands, `main` is the release branch. `main` stays the repo's default branch.

For every requested task:

1. Create a branch from `dev` named `<type>/<short-kebab-case-description>`, following the [Conventional Branch](https://conventionalbranch.org/) spec:
   - `feature/` or `feat/` — new functionality
   - `bugfix/` or `fix/` — bug fixes
   - `docs/` — documentation-only changes (README, AGENTS.md, code comments)
   - `chore/` — other non-code tasks (config, deps, tooling)
2. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, ...):
   - No AI co-author trailer (no `Co-Authored-By` line) on any commit.
   - Subject line under 72 characters.
   - Split unrelated concerns into separate commits instead of one bulk commit.
3. Push the branch and open a PR into `dev`, never `main` directly — reference the issue it addresses with `Closes #N` (the closing keyword only actually fires when the PR that closes it lands on the default branch, i.e. once `dev` gets promoted to `main`).
4. `dev` requires the same green CI and review as `main` (see the ruleset table below) but no release label. Once a batch of work on `dev` is ready to ship, open a `dev` → `main` promotion PR and apply exactly one `release:major`, `release:minor`, or `release:patch` label before merging — a required check blocks that merge otherwise. Dependabot PRs and docs/`.github`-only PRs are exempt and need no label. Merging a labeled promotion PR auto-tags the next semver version and publishes a GitHub Release.
5. This template repo has no live deployment of its own, so neither branch here gates a deploy — `dev` and `main` just need green CI and (for `main`) the release label. **This does not apply to edition repos created from this template**: their `main` is what's actually deployed live via Coolify, and each edition repo makes its own call on whether to keep a `dev` staging branch gating that deployment.

---

## Stack

| Layer           | Tech                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Framework       | Astro 7, static output                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Language        | TypeScript, strict (`astro/tsconfigs/strict`)                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Styling         | CSS custom properties in `src/styles/tokens.css` — no Tailwind/CSS framework. `src/styles/styles.override.css` is the edition re-skin entry point and is loaded after tokens and shared primitives.                                                                                                                                                                                                                                                                                                       |
| i18n            | Flat dot-notation `en.json`/`pt.json` dictionaries, typed translation helper, and Astro locale-prefixed routing                                                                                                                                                                                                                                                                                                                                                                                           |
| Content         | Zod-validated JSON under `src/data/`; `site.json` holds shared edition config, while page-specific datasets are being added incrementally (#9–#10 remain pending)                                                                                                                                                                                                                                                                                                                                         |
| Package manager | pnpm, pinned via Corepack (`packageManager` in `package.json`)                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Deploy          | Multi-stage Docker build served by unprivileged nginx on port 8080; `docker-compose.app.yml` is the Coolify entry point                                                                                                                                                                                                                                                                                                                                                                                   |
| CI              | GitHub Actions on PRs into `dev` or `main`: lint/typecheck/format/build + Docker build check, dependency review + secret scan, CodeQL — all via org-shared `Nucleo-Estudantes-Informatica-ISEP/.github` workflows/actions. Release-label enforcement only runs on PRs into `main` (the `dev` → `main` promotion PR). Dependabot targets `dev`, covering npm, github-actions, and docker, grouping weekly minor/patch updates. Branch protection is enforced via GitHub Rulesets on both `dev` and `main`. |

## Common commands

```bash
pnpm dev            # astro dev — foreground dev server
pnpm build          # astro build — static output to dist/
pnpm preview         # astro preview — serve the built dist/ locally
pnpm lint           # eslint .
pnpm format         # prettier --write .
pnpm format:check   # prettier --check . — what CI runs on every PR into dev or main
pnpm validate:data  # validate site.json against its zod schema
pnpm typecheck      # validate data, then run astro check
docker compose -f docker-compose.app.yml up --build # production-like container
```

No test suite exists yet — there's no `pnpm test` script and no testing-foundation issue currently tracked in this milestone; verification today is lint + typecheck + a manual check against `pnpm preview`.

## Development

- **Humans:** `pnpm dev` (runs `astro dev` in the foreground — watch the output, `Ctrl+C` to stop).
- **AI agents / automation:** start it in background mode instead, so it doesn't block your shell:

  ```
  astro dev --background
  ```

  Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`.

---

## Architecture

### Current layout (`src/`)

```
assets/       # starter Astro/background SVGs from the scaffold — replace once real design assets exist
components/   # Astro components — currently just the scaffold's Welcome.astro placeholder; core partials (button/tag/nav/table/...) land in #3
data/         # shared site config JSON, history dataset, zod schemas, and typed loaders; further page datasets land in #9–#10
i18n/         # en/pt dictionaries and typed URL/translation helpers
layouts/      # currently just the scaffold's default Layout.astro — the real shared layout (nav, banner, footer, back-to-top) lands in #11
pages/        # file-based routing — currently just the scaffold's default index.astro
styles/       # tokens.css, primitives.css, and styles.override.css (edition token overrides)
```

`public/` holds static assets served as-is — currently just the scaffold's default favicon.

This section is intentionally thin right now. Update it as each of #2–#22 lands rather than letting it go stale.

---

## Conventions

- **Design tokens, not hardcoded values:** colors/spacing/type must come from CSS custom properties (`var(--color-*)`, etc.), never a hardcoded hex or px value. Editions re-skin the site by redeclaring only the desired tokens in `src/styles/styles.override.css`; it is loaded after `tokens.css` and `primitives.css`.
- **Content in JSON, not components:** per-edition data (dates, committees, speakers, history entries, site config) belongs in the JSON files under `src/data/` (#7–#10), validated with zod — not hardcoded into `.astro` files. Genuinely static prose (e.g. Author Guidelines body copy, #14) is the one deliberate exception.
- **User-facing text goes through i18n:** once #5 lands, no new hardcoded PT/EN copy in components — add it to `en.json`/`pt.json` instead, flat dot-notation keys.
- **Template vs. edition content stay apart:** mechanics/scaffolding issues belong to `sei-website-template`; real SEI'26 data belongs to `sei-2026-edition`. Don't fold one into the other.

---

## Verification (definition of done)

Before considering a task done:

1. Run `pnpm lint` and fix anything flagged in touched files.
2. Run `pnpm typecheck` (`astro check`) — keep it clean.
3. Run `pnpm format:check` (or `pnpm format` to fix) — keep formatting consistent.
4. Run `pnpm build`, then `pnpm preview` and actually exercise the changed page/component in a browser — don't just read the diff.
5. Don't report a task complete on "it compiles" or "lint passed" alone; state plainly if something couldn't be manually verified.

---

## Gotchas

- **TypeScript is constrained to the 6.x line, not "pinned" to one exact version.** `package.json` declares `^6.0.3` (a caret range) because `typescript-eslint` and `@astrojs/check`'s peer ranges cap below TypeScript 7 as of this writing — `pnpm-lock.yaml` currently resolves that to exactly `6.0.3`, but a plain `pnpm update typescript` could move it to a newer 6.x release. Don't `pnpm add -D typescript@latest` — check the new version's peers resolve cleanly first.
- **Node `>=22.12.0` is required** (Astro 7's minimum) — `ci.yml` pins exactly this version; don't let it drift from `engines.node` in `package.json`.
- **`CLAUDE.md` just re-imports `AGENTS.md`** via Claude Code's `@file` import syntax — edit `AGENTS.md`, not `CLAUDE.md`.

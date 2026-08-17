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
3. Push the branch and open a PR into `dev`, never directly into `main` — reference the issue it addresses with `Refs #N`, not `Closes #N`: GitHub only auto-closes an issue via a closing keyword when the PR targets the repo's default branch (`main` here), so on a `dev`-targeted PR that keyword is a no-op. Close the issue manually once the PR merges.
4. `main` is what an edition repo created from this template actually deploys live (via Coolify). Before merging `dev` into `main` in such a repo, check the currently-hosted instance rather than trusting green CI alone — this template repo itself has no live deployment, but the rule carries into every repo created from it.

---

## Stack

| Layer           | Tech                                                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework       | Astro 7, static output                                                                                                                                                                |
| Language        | TypeScript, strict (`astro/tsconfigs/strict`)                                                                                                                                         |
| Styling         | CSS custom properties as design tokens — no Tailwind/CSS framework. Base token sheet, shared component partials, and the `styles.override.css` cascade are not yet added (#2, #3, #4) |
| i18n            | Flat dot-notation `en.json`/`pt.json` dictionaries, typed translation helper, and Astro locale-prefixed routing                                                                       |
| Content         | Per-page JSON (`site.json`, `history.json`, `committees.json`, `speakers.json`) under `src/data/`, zod-validated — not yet added (#7–#10)                                             |
| Package manager | pnpm, pinned via Corepack (`packageManager` in `package.json`)                                                                                                                        |
| Deploy          | Multi-stage Docker build served by unprivileged nginx on port 8080; `docker-compose.app.yml` is the Coolify entry point                                                               |
| CI              | GitHub Actions runs lint, typecheck, formatting, and build on PRs into `dev`; Dependabot groups weekly minor/patch npm updates                                                        |

## Common commands

```bash
pnpm dev            # astro dev — foreground dev server
pnpm build          # astro build — static output to dist/
pnpm preview         # astro preview — serve the built dist/ locally
pnpm lint           # eslint .
pnpm format         # prettier --write .
pnpm format:check   # prettier --check . — what CI will run once #24 lands
pnpm typecheck      # astro check
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
data/         # per-edition content JSON lands here (#7–#10) — currently empty (.gitkeep only)
i18n/         # en/pt dictionaries and typed URL/translation helpers
layouts/      # currently just the scaffold's default Layout.astro — the real shared layout (nav, banner, footer, back-to-top) lands in #11
pages/        # file-based routing — currently just the scaffold's default index.astro
```

`public/` holds static assets served as-is — currently just the scaffold's default favicon.

This section is intentionally thin right now. Update it as each of #2–#22 lands rather than letting it go stale.

---

## Conventions

- **Design tokens, not hardcoded values:** once #2/#4 land, colors/spacing/type must come from CSS custom properties (`var(--color-*)`, etc.), never a hardcoded hex or px value — that's what lets `styles.override.css` re-skin the whole site by touching one file.
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
- **Node `>=22.12.0` is required** (Astro 7's minimum) — keep this in mind when #24 (CI) picks a Node version.
- **`CLAUDE.md` just re-imports `AGENTS.md`** via Claude Code's `@file` import syntax — edit `AGENTS.md`, not `CLAUDE.md`.

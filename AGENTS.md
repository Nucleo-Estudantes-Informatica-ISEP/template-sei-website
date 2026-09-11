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
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
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
pnpm test           # tsx --test src/data/*.test.ts — mocked unit tests, no browser/e2e coverage
docker compose -f docker-compose.app.yml up --build # production-like container
```

There's no broader testing foundation or e2e coverage yet, and no tracked issue for one — `pnpm test` today only covers `src/data/*.test.ts` (introduced in #95 to mock the EasyChair translation API call). Verification for everything else is lint + typecheck + a manual check against `pnpm preview`.

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

### Program page data (EasyChair sync, #86)

`Program.astro` no longer just reads `program.json` directly — `src/data/program.ts` tries to refresh it from EasyChair on every build/dev start:

- If `site.links.easyChairProgram` is set, `program.ts` fetches that URL (EasyChair's public Smart Program page — plain server-rendered HTML, no auth, no JS/API involved) and `src/data/easychair.ts` parses its `.session` blocks into the same `{morning, afternoon}` shape as `program.json`. Parallel tracks sharing a time slot (e.g. "Session 4A"/"4B") are kept as separate rows, each with its own title, `chair`, and `room` pulled straight from EasyChair — not collapsed into one summary row.
- The result is validated with the same `programSchema` as the static file (`program.schema.mjs`) before use.
- If the link is unset, the fetch fails, times out (8s), or the parsed result doesn't validate, it logs a warning and falls back to the committed `program.json` — the build never hard-fails over this.
- **This only works for single-day events.** EasyChair's Smart Program index page (`https://easychair.org/smart-program/<CONF>/`) _is_ the schedule when the conference is one day; for a multi-day conference it's a day picker instead, which has no `.session` entries and falls back the same way an unreachable URL would.
- EasyChair's actual session titles tend to be longer/more detailed than the hand-curated defaults in `program.json` (e.g. a full keynote title+subtitle instead of just "Keynote") — the parser doesn't try to editorially shorten them, just lightly cleans the "Session N: " prefix and surrounding quotes.
- To enable this for a real edition, point `site.links.easyChairProgram` at that edition's Smart Program URL — no other changes needed. `program.json` still needs to stay valid and reasonably current on its own, since it's what ships whenever the live fetch can't be used.

### Program page translations (EasyChair sync, #97)

EasyChair has no localization feature, so scraped session titles come back as plain, single-language text (often already mixed EN/PT). `src/data/translate.ts` optionally translates them per-locale:

- `program.schema.mjs`'s `title`/`desc` are `localizedTextSchema` (same union — plain string, or `{en, pt}` — used by `speakers.schema.mjs`/`topics.schema.mjs`/`gallery.schema.mjs`), and `Program.astro` reads them with the existing `localize(text, lang)` helper. `program.json`'s hand-curated strings need no changes — a plain string is still valid.
- `chair`/`room` are never translated — they're people's names and room codes, not prose.
- Translation only runs when `GOOGLE_TRANSLATE_API_KEY` is set (Google Cloud Translation, Basic/NMT tier — the first 500,000 characters/month are free, ~$10/million after; a single edition's schedule text is a few hundred to a couple thousand characters), see `.env.example`. With no key configured, `localizeTexts` returns every string unchanged and both locales show the original scraped text — the pre-#97 behavior.
- Translations are cached in the checked-in `src/data/program-translation-cache.json`, keyed by a hash of the source text, so unchanged content across builds/editions never re-hits the API — and a maintainer can hand-correct a specific bad machine translation by editing that file's `en`/`pt` values directly. In an ephemeral build (e.g. the Docker build stage) a cache write failure is caught and logged, not fatal — that build's in-memory translations are still used, just not persisted; committing the file from a local run is what makes it durable across builds.

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
4. Run `pnpm test` if the change touches anything under `src/data/*.test.ts` covers.
5. Run `pnpm build`, then `pnpm preview` and actually exercise the changed page/component in a browser — don't just read the diff.
6. Don't report a task complete on "it compiles" or "lint passed" alone; state plainly if something couldn't be manually verified.

---

## Gotchas

- **TypeScript is constrained to the 6.x line, not "pinned" to one exact version.** `package.json` declares `^6.0.3` (a caret range) because `typescript-eslint` and `@astrojs/check`'s peer ranges cap below TypeScript 7 as of this writing — `pnpm-lock.yaml` currently resolves that to exactly `6.0.3`, but a plain `pnpm update typescript` could move it to a newer 6.x release. Don't `pnpm add -D typescript@latest` — check the new version's peers resolve cleanly first.
- **Node `>=22.12.0` is required** (Astro 7's minimum) — `ci.yml` pins exactly this version; don't let it drift from `engines.node` in `package.json`.
- **`CLAUDE.md` just re-imports `AGENTS.md`** via Claude Code's `@file` import syntax — edit `AGENTS.md`, not `CLAUDE.md`.
- **`pnpm build`/`pnpm dev` make an outbound network call when `site.links.easyChairProgram` is set** (see [Program page data](#program-page-data-easychair-sync-86)) — expect a slower Program page build and don't be surprised by a build-time fetch in a repo that's otherwise fully static/offline. `pnpm validate:data` never does this; it only checks the committed `program.json`.
- **A second, separate outbound call happens if `GOOGLE_TRANSLATE_API_KEY` is also set** (see [Program page translations](#program-page-translations-easychair-sync-97)) — same non-fatal-on-failure behavior, but a second external service in the build path is a second thing that can be slow or rate-limited. Unset (the default), it's a no-op.

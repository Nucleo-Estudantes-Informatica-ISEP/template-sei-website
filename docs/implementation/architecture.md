# Architecture

How this repo's implementation is laid out: what each top-level `src/`
directory is for, how a page assembles from that, and how data flows from a
JSON file to rendered HTML.

For contribution workflow, stack choices, and CI, see [`AGENTS.md`](../../AGENTS.md).
For editing per-edition content, see [`docs/edition-setup.md`](../edition-setup.md).
For the i18n/translation mechanism specifically, see [`docs/translation-system.md`](translation-system.md).

## `src/` layout

| Directory     | Contents                                                                                                                                                                                                                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets/`     | Starter Astro/background SVGs from the scaffold.                                                                                                                                                                                                                                                                 |
| `components/` | `.astro` components — one per page section (Home, Program, Speakers, Committees, Submissions, History, Registration) plus shared primitives (Nav, Footer, Seo, Button, Tag, BackToTop, LanguageSwitcher) and the layout-level `Welcome.astro` scaffold leftover.                                                 |
| `data/`       | Per-edition content: `*.json` (the data), `*.schema.mjs` (zod validation), `*.ts` (typed loader — parses the JSON through its schema and exports a typed value). Also `easychair.ts` and `translate.ts`, the Program page's EasyChair-sync and Google-Translate integrations — see `docs/translation-system.md`. |
| `i18n/`       | `en.json` / `pt.json` flat dictionaries, the typed `t()` helper (`utils.ts`), and nav link definitions (`routes.ts`).                                                                                                                                                                                            |
| `layouts/`    | `Layout.astro` — the shared page shell (nav, footer, SEO tags).                                                                                                                                                                                                                                                  |
| `pages/`      | File-based routing: `src/pages/en/<name>.astro` and `src/pages/pt/<name>.astro` per page, plus a root `index.astro` that redirects to the default locale.                                                                                                                                                        |
| `styles/`     | `tokens.css` (design tokens), `primitives.css` (shared component styles), `styles.override.css` (edition re-skin entry point, loaded last).                                                                                                                                                                      |

`public/` holds static assets served as-is (favicon, images referenced by
`site.json` with a leading `/`).

## Data flow: JSON → schema → loader → component

Each content file follows the same three-file pattern:

1. **`src/data/<name>.json`** — the actual per-edition content, hand-edited.
2. **`src/data/<name>.schema.mjs`** — a zod schema describing its shape.
   Shared field types (`localizedTextSchema`, `publicAssetPath`, `yearSchema`,
   `routeSlug`, `timeSchema`, ...) live in `primitives.schema.mjs`.
3. **`src/data/<name>.ts`** — imports the JSON and schema, calls
   `schema.parse(jsonData)`, and exports both the parsed, typed value and its
   inferred TypeScript type (`z.infer<typeof schema>`). Components import
   from this file, never the raw `.json` directly — the parse is what turns
   an invalid edit into a build-time error with a field path, instead of a
   silently wrong render.

`program.ts` is the one exception with extra logic: it tries an EasyChair
live sync before falling back to `program.json`'s `schema.parse()` result —
see [`docs/translation-system.md`](translation-system.md) for that mechanism, since the sync path also
runs scraped text through Google Translate.

`pnpm validate:data` (`scripts/validate-data.mjs`) runs the same
`schema.parse()` step for every `*.json` file outside of a full Astro build,
so a bad edit is caught without needing `pnpm build` — with one exception:
`program-translation-cache.json` has no zod schema and isn't covered by
`pnpm validate:data`. It's parsed and shape-checked separately by
`translate.ts`, with a non-fatal fallback to an empty cache on invalid
content — see [`docs/edition-setup.md`](../edition-setup.md).

## Routing and pages

Astro's i18n routing (`astro.config.mjs`) is configured with
`defaultLocale: "pt"`, `locales: ["pt", "en"]`, and
`routing: { prefixDefaultLocale: true }` — every page lives under an
explicit `/en/` or `/pt/` prefix, including the default locale. Each page
has two files, `src/pages/en/<name>.astro` and `src/pages/pt/<name>.astro`,
both rendering the same `src/components/<Name>.astro` component with a
different `lang` — there's no single dynamic `[lang]` route.

`site.json`'s `pages` object (`home`, `program`, `speakers`, ...) holds the
URL slug used to build internal links and to detect the current page for
`aria-current`, via `getRelativeLocaleUrl(lang, site.pages[id])`. It does
**not** drive Astro's actual routing — renaming a slug there without
renaming the matching file(s) under `src/pages/en/` and `src/pages/pt/`
breaks that page's links. Nav label text is a separate, fixed mapping in
`src/i18n/routes.ts` (`NAV_LINKS`, `PageId`), keyed off the same ids.

## Styling

`styles.override.css` is the only file an edition should normally touch to
change the site's look — it loads after `tokens.css` and `primitives.css`
and only needs to redeclare the CSS custom properties it wants changed under
`:root { ... }`. Components are expected to consume `var(--color-*)`,
`var(--space-*)`, etc. rather than hardcoding values; a few components (e.g.
`Nav.astro`) still have one-off hardcoded values predating that convention —
`styles.override.css` doesn't reach those.

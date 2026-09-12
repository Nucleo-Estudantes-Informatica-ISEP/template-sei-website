# Template usage guide

This walks a committee through turning a fresh fork of this template into a
specific SEI edition's site: which file to edit for each piece of content,
copy, or styling, and how to check the result.

If you're looking for contribution workflow, stack details, or the
EasyChair sync mechanics instead, see [`AGENTS.md`](../AGENTS.md).

Every file under `src/data/*.json` is validated against a zod schema
(`src/data/*.schema.mjs`) on every build, dev start, and `pnpm validate:data`
run — an invalid edit fails loudly with a path to the offending field rather
than silently rendering wrong. Run `pnpm validate:data` after editing any
JSON file in this guide.

## Site-wide config — `src/data/site.json`

One JSON object, validated by `src/data/site.schema.mjs`. Fields, grouped as
they appear in the file:

| Group            | Field                                                                                                                              | Notes                                                                                                                                                                                                                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `edition`        | `name`                                                                                                                             | Short form shown across the UI, e.g. `"SEI'26"`.                                                                                                                                                                                                                                        |
|                  | `fullName`                                                                                                                         | Long form, or `null` to fall back to `name`.                                                                                                                                                                                                                                            |
|                  | `year`                                                                                                                             | Integer, 2000–2100.                                                                                                                                                                                                                                                                     |
| `seo`            | `description`                                                                                                                      | Meta description.                                                                                                                                                                                                                                                                       |
|                  | `ogImage`                                                                                                                          | Public path (must start with `/`), e.g. `/images/banner.webp`.                                                                                                                                                                                                                          |
| `pages`          | `home`, `program`, `speakers`, `committees`, `submissions`, `history`, `registration`                                              | Route slugs. `home` must stay `""`; the rest must be lowercase kebab-case (or empty). Drives both routing and nav labels via `PageId` in `src/i18n/routes.ts`.                                                                                                                          |
| `importantDates` | array of 5                                                                                                                         | Fixed set of ids — `paperSubmission`, `acceptanceNotification`, `cameraReady`, `symposiumInscription`, `symposiumDay` — each with a `date` (`YYYY-MM-DD`) or `null` for "TBA". The set of ids and the array length are fixed by the schema; this isn't a place to add extra milestones. |
| `links`          | `easyChairSubmission`, `easyChairProgram`, `registration`, `proceedings`, `lncsTemplateLatex`, `lncsTemplateWord`, `callForPapers` | Each an absolute URL or `null`. `easyChairProgram` also drives the Program page's live EasyChair sync — see `AGENTS.md`.                                                                                                                                                                |
| `images`         | `banner`, `eventPhoto`, `proceedingsCover`, `logo`, `qrCode`                                                                       | Public asset paths; all but `banner`/`logo` may be `null` until the asset exists.                                                                                                                                                                                                       |
| `contact`        | `email`                                                                                                                            | Must be a valid email.                                                                                                                                                                                                                                                                  |
| `social`         | `linkedin`                                                                                                                         | Absolute URL or `null`.                                                                                                                                                                                                                                                                 |
| `venue`          | `name`, `addressLine1`, `postalCode`, `city`, `country`                                                                            | Plain strings.                                                                                                                                                                                                                                                                          |
| `footerLogos`    | array, min 1                                                                                                                       | `{ src, alt, href }` — partner/department logos in the footer band. `href` may be `null`.                                                                                                                                                                                               |
| `supportLogos`   | array, exactly 3                                                                                                                   | `{ src, alt, href }` — sponsor slots; `src`/`href` may be `null` before sponsors are confirmed.                                                                                                                                                                                         |

Place any new image assets under `public/images/` and reference them with a
leading `/` (e.g. `/images/banner.webp`).

## Content files — `src/data/*.json`

Each of these is a standalone JSON file with its own schema. Update the data,
then run `pnpm validate:data`.

| File              | Shape                                                                                                                                                                                                                                                                                          | Schema                  | Used by                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `history.json`    | Array of past editions: `{ year, banner, url, alt, dateLabel, description }`, newest year first, no duplicate years.                                                                                                                                                                           | `history.schema.mjs`    | History page.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `committees.json` | `{ organizing: [{ name, org }], scientific: [{ name, org }] }`, each list min 1 entry.                                                                                                                                                                                                         | `committees.schema.mjs` | Committees page; the Home page's committee-count teaser derives its numbers from these array lengths.                                                                                                                                                                                                                                                                                                                                                                       |
| `speakers.json`   | Array of `{ name, role, affiliation, bio, photo?, links? }`. `role`/`bio` accept a plain string or `{ en, pt }`; `links` is `[{ label, url }]`.                                                                                                                                                | `speakers.schema.mjs`   | Speakers page; Home page's speaker teaser shows the first 3 entries.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `topics.json`     | Array of `{ name }`, `name` is `{ en, pt }` (or a plain string).                                                                                                                                                                                                                               | `topics.schema.mjs`     | Submissions page topic list; Home page's topics-count stat derives from this array's length.                                                                                                                                                                                                                                                                                                                                                                                |
| `gallery.json`    | Array of `{ label, src?, alt? }` — past-event photos shown at the bottom of the Program page. `label`/`alt` accept a plain string or `{ en, pt }`. Entries without `src` still render as a labelled placeholder.                                                                               | `gallery.schema.mjs`    | Program page photo gallery.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `program.json`    | `{ morning: [...], afternoon: [...] }`, each an array of `{ time, title, desc?, tag?, chair?, room?, kind? }` in ascending `HH:MM` order, afternoon starting no earlier than morning ends. `title`/`desc` accept a plain string or `{ en, pt }`. `kind` is `"session"` (default) or `"break"`. | `program.schema.mjs`    | Program page. **Only the fallback/manual source** — if `site.links.easyChairProgram` is set, the live page instead syncs from EasyChair at build time and only falls back to this file on failure. Keep it valid and current regardless, since it's what ships whenever the live fetch can't be used. See `AGENTS.md` → "Program page data (EasyChair sync)" for the full mechanism, including how EasyChair-synced titles can optionally be machine-translated per locale. |

### Localized text fields

Fields typed `localizedTextSchema` (`role`, `bio`, gallery `label`/`alt`,
topic `name`, program `title`/`desc`) accept **either**:

- a plain string — shown as-is in both `en` and `pt`, or
- `{ "en": "...", "pt": "..." }` — shown per the page's current locale.

`chair`/`room` in `program.json` are plain strings only — they're people's
names and room codes, never translated.

## Adding or editing UI copy — `src/i18n/en.json` / `src/i18n/pt.json`

Anything that isn't per-edition content but is still user-facing text (nav
labels, button labels, section headings, static copy) lives in these two
flat, dot-notation dictionaries — never hardcoded in a component. To add or
change a string:

1. Add/edit the same key in **both** `en.json` and `pt.json`.
2. Reference it from a component with the existing `t("your.key")` helper
   (`useTranslations(lang)` from `src/i18n/utils.ts`) — see any `.astro` file
   under `src/components/` or `src/pages/` for the pattern already in use.
3. A key present in one dictionary but missing from the other will fail
   `pnpm typecheck` (`TranslationKey` is derived from `pt.json`'s keys), so
   they can't silently drift apart.

Some copy takes `{placeholder}` interpolation (e.g.
`"footer.copyrightLine": "© {year} {edition} — ..."`) — check the call site
for how placeholders are substituted before assuming plain string swap-in is
enough.

## Re-skinning — `src/styles/styles.override.css`

This is the **only** file an edition should need to touch to change the
site's look. It loads after `tokens.css` (base values) and `primitives.css`
(shared component styles) and only needs to redeclare the CSS custom
properties this edition wants to change under `:root { ... }` — everything
left out keeps its default from `tokens.css`. The file itself lists every
available token (colors, typography, spacing, radii, shadows); open it for
the full list and an example block.

Never hardcode a color/spacing/font value directly in a component or in
`styles.override.css` outside of a `:root` variable — components must only
ever consume `var(--color-*)`, `var(--space-*)`, etc., so a single token
change here re-skins the whole site consistently.

## Verifying your changes

After editing any of the above:

```bash
pnpm validate:data   # JSON files validate against their zod schemas
pnpm typecheck        # validate:data, then astro check (also catches i18n key drift)
pnpm format:check     # or `pnpm format` to fix
pnpm build && pnpm preview   # then open the built site and click through the changed page(s)
```

`pnpm dev` (or `astro dev --background` for automation) is faster for
iterating on styling/copy changes than a full build.

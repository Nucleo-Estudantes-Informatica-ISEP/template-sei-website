# Template usage guide

This walks a committee through turning a fresh fork of this template into a
specific SEI edition's site: which file to edit for each piece of content,
copy, or styling, and how to check the result.

If you're looking for contribution workflow, stack details, or the
EasyChair sync mechanics instead, see [`AGENTS.md`](../AGENTS.md).

Every content file under `src/data/*.json` listed in this guide is validated
against a zod schema (`src/data/*.schema.mjs`) on every build, dev start, and
`pnpm validate:data` run — an invalid edit fails loudly with a path to the
offending field rather than silently rendering wrong. Run
`pnpm validate:data` after editing any JSON file in this guide.

The one exception is `src/data/program-translation-cache.json` — it has no
zod schema and isn't covered by `pnpm validate:data`. It's the machine-
translation cache for the Program page's EasyChair-synced titles (see
`AGENTS.md` → "Program page translations"); a maintainer may hand-edit its
`en`/`pt` values to correct a bad translation. `translate.ts` parses and
shape-validates the whole file on load — invalid JSON, or syntactically
valid JSON where any entry is missing a `source`/`en`/`pt` string, is
silently treated as an empty cache (every affected string is re-translated
on the next build with a translation API key configured) rather than
failing the build.

## Site-wide config — `src/data/site.json`

One JSON object, validated by `src/data/site.schema.mjs`. Fields, grouped as
they appear in the file:

| Group            | Field                                                                                                                              | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `edition`        | `name`                                                                                                                             | Short form shown across the UI, e.g. `"SEI'26"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|                  | `fullName`                                                                                                                         | Long form, or `null` to fall back to `name`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|                  | `year`                                                                                                                             | Integer, 2000–2100.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `seo`            | `description`                                                                                                                      | Meta description.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|                  | `ogImage`                                                                                                                          | Public path (must start with `/`), e.g. `/images/banner.webp`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `pages`          | `home`, `program`, `speakers`, `committees`, `submissions`, `history`, `registration`                                              | Slugs used to build internal links (nav, footer, CTAs) via `getRelativeLocaleUrl(lang, site.pages[id])`, and to detect the current page for `aria-current`. `home` must stay `""`; the rest must be lowercase kebab-case (or empty). **These do not drive Astro's actual routing** — each page still lives at a fixed file under `src/pages/en/<name>.astro` / `src/pages/pt/<name>.astro` (e.g. `program` → `program.astro`), so changing a slug here without renaming the matching route file(s) breaks that page's links. Nav/menu label text is a separate, fixed mapping in `src/i18n/routes.ts` (`NAV_LINKS`/`PageId`) keyed off these same ids — it isn't derived from the slug string itself. |
| `importantDates` | array of 5                                                                                                                         | Fixed set of ids — `paperSubmission`, `acceptanceNotification`, `cameraReady`, `symposiumInscription`, `symposiumDay` — each with a `date` (`YYYY-MM-DD`) or `null` for "TBA". The schema enforces the array length, that each id is one of the five, **and** that each of the five occurs exactly once; this isn't a place to add extra milestones or repeat an id.                                                                                                                                                                                                                                                                                                                                  |
| `links`          | `easyChairSubmission`, `easyChairProgram`, `registration`, `proceedings`, `lncsTemplateLatex`, `lncsTemplateWord`, `callForPapers` | Each an absolute URL or `null`. `easyChairProgram` also drives the Program page's live EasyChair sync — see `AGENTS.md`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `images`         | `banner`, `eventPhoto`, `proceedingsCover`, `logo`, `qrCode`                                                                       | Public asset paths; all but `banner`/`logo` may be `null` until the asset exists.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `contact`        | `email`                                                                                                                            | Must be a valid email.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `social`         | `linkedin`                                                                                                                         | Absolute URL or `null`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `venue`          | `name`, `addressLine1`, `postalCode`, `city`, `country`                                                                            | Plain strings.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `footerLogos`    | array, min 1                                                                                                                       | `{ src, alt, href }` — partner/department logos; despite the field name, currently rendered in the Home page's `partners` section (`Home.astro`), not in `Footer.astro`. `href` may be `null`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `supportLogos`   | array, exactly 3                                                                                                                   | `{ src, alt, href }` — sponsor slots; `src`/`href` may be `null` before sponsors are confirmed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

Place any new image assets under `public/images/` and reference them with a
leading `/` (e.g. `/images/banner.webp`).

## Content files — `src/data/*.json`

Each of these is a standalone JSON file with its own schema. Update the data,
then run `pnpm validate:data`.

| File              | Shape                                                                                                                                                                                                                                                                                                                                                                                                                             | Schema                  | Used by                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `history.json`    | Array of past editions: `{ year, banner, url, alt, dateLabel, description }`, newest year first, no duplicate years.                                                                                                                                                                                                                                                                                                              | `history.schema.mjs`    | History page.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `committees.json` | `{ organizing: [{ name, org }], scientific: [{ name, org }] }`, each list min 1 entry.                                                                                                                                                                                                                                                                                                                                            | `committees.schema.mjs` | Committees page; the Home page's committee-count teaser derives its numbers from these array lengths.                                                                                                                                                                                                                                                                                                                                                                       |
| `speakers.json`   | Array of `{ name, role, affiliation, bio, photo?, links? }`. `role`/`bio` accept a plain string or `{ en, pt }`; `links` is `[{ label, url }]`.                                                                                                                                                                                                                                                                                   | `speakers.schema.mjs`   | Speakers page; Home page's speaker teaser shows the first 3 entries.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `topics.json`     | Array of `{ name }`, `name` is `{ en, pt }` (or a plain string).                                                                                                                                                                                                                                                                                                                                                                  | `topics.schema.mjs`     | Submissions page topic list; Home page's topics-count stat derives from this array's length.                                                                                                                                                                                                                                                                                                                                                                                |
| `gallery.json`    | Array of `{ label, src?, alt? }` — past-event photos shown at the bottom of the Program page. `label`/`alt` accept a plain string or `{ en, pt }`. Entries without `src` still render as a labelled placeholder.                                                                                                                                                                                                                  | `gallery.schema.mjs`    | Program page photo gallery.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `program.json`    | `{ morning: [...], afternoon: [...] }`, each an array of `{ time, title, desc?, tag?, chair?, room?, kind? }` in ascending `HH:MM` order, with the first afternoon item's `time` not earlier than the last morning item's `time` (the schema only compares start times — it has no notion of an item's duration or end time). `title`/`desc` accept a plain string or `{ en, pt }`. `kind` is `"session"` (default) or `"break"`. | `program.schema.mjs`    | Program page. **Only the fallback/manual source** — if `site.links.easyChairProgram` is set, the live page instead syncs from EasyChair at build time and only falls back to this file on failure. Keep it valid and current regardless, since it's what ships whenever the live fetch can't be used. See `AGENTS.md` → "Program page data (EasyChair sync)" for the full mechanism, including how EasyChair-synced titles can optionally be machine-translated per locale. |

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
3. A key present in `pt.json` but missing from `en.json` will fail
   `pnpm typecheck` (`TranslationKey` is derived from `pt.json`'s keys, and
   `en.json` is checked against that same key set). This doesn't fully
   guarantee the two files are identical in both directions, though — an
   extra key added only to `en.json` (with no `pt.json` counterpart) isn't
   caught by this check. Always add the same key to both files rather than
   relying on typecheck to catch a one-sided addition.

Some copy takes `{placeholder}` interpolation (e.g.
`"footer.copyrightLine": "© {year} {edition} — ..."`) — check the call site
for how placeholders are substituted before assuming plain string swap-in is
enough.

## Re-skinning — `src/styles/styles.override.css`

This is the **primary** file an edition should touch to change the site's
look. It loads after `tokens.css` (base values) and `primitives.css` (shared
component styles) and only needs to redeclare the CSS custom properties this
edition wants to change under `:root { ... }` — everything left out keeps
its default from `tokens.css`. The file itself lists every available token
(colors, typography, spacing, radii, shadows, motion); open it for the full
list and an example block.

Never hardcode a new color/spacing/font value directly in a component or in
`styles.override.css` outside of a `:root` variable — components should
consume `var(--color-*)`, `var(--space-*)`, etc., so a token change here
re-skins consistently. That said, this isn't fully the case yet throughout
the codebase today: a few components (e.g. `Nav.astro`) still have some
one-off hardcoded values (translucency, border colors, pixel gaps) that
predate this convention and aren't tokenized. Re-skinning through
`styles.override.css` alone won't reach those — treat them as known gaps
rather than assuming every visual detail is themeable this way.

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

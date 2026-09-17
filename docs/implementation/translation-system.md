# i18n and translation

Three layers, in increasing order of moving parts: static UI copy, per-edition
localized content, and the EasyChair/Google Translate pipeline that fills in
localized content automatically for the Program page.

For file/directory layout, see
[`docs/implementation/architecture.md`](architecture.md). For why the site
is bilingual with a manual switcher, see
[`docs/decisions/03-add-language-choice-to-the-website.md`](../decisions/03-add-language-choice-to-the-website.md);
for why Google Translate specifically, see
[`docs/decisions/04-google-translate-for-program-i18n.md`](../decisions/04-google-translate-for-program-i18n.md).

## Layer 1 — static UI copy (`src/i18n/en.json` / `pt.json`)

Any user-facing text that isn't per-edition content — nav labels, button
labels, section headings, static copy — lives in two flat, dot-notation
dictionaries. Never hardcoded in a component.

- `src/i18n/translations.ts` exports `useTranslations(lang)`, which returns a
  `t(key)` function; `type TranslationKey = keyof typeof pt` — the key type
  is derived from `pt.json`, and `en.json` is typed against that same key
  set (`Record<Lang, Record<TranslationKey, string>>`).
  - A key present in `pt.json` but missing from `en.json` fails
    `pnpm typecheck`. It does **not** catch the reverse: a key added only to
    `en.json` passes unnoticed. Always add the same key to both files.
- `getLangFromUrl(url)` reads the locale off the URL's first path segment
  (`/en/...` / `/pt/...`), matching `astro.config.mjs`'s
  `routing: { prefixDefaultLocale: true }` (default locale `pt`).
- Some values take `{placeholder}` interpolation, e.g.
  `"footer.copyrightLine": "© {year} {edition} — ..."` — check the call site
  for how placeholders are substituted before assuming a plain string
  swap-in is enough.
- `src/i18n/routes.ts` (`NAV_LINKS`, `FOOTER_NAV_LINKS`,
  `FOOTER_PARTICIPATION_LINKS`) maps each page id to a `TranslationKey` for
  its nav label — a separate, fixed mapping, not derived from the page's
  URL slug.

## Layer 2 — localized content fields (`localizedTextSchema`)

Per-edition content (`src/data/<domain>/*.json`) is data, not chrome:
written once per edition rather than needing a translator's pass through a
dictionary. `src/data/primitives.schema.mjs` defines:

```js
export const localizedTextSchema = z.union([
  z.string().min(1),
  z.object({ en: z.string().min(1), pt: z.string().min(1) }),
]);
```

Any field typed `localizedTextSchema` accepts **either** a plain string
(shown as-is in both locales) **or** an explicit `{ "en": "...", "pt": "..." }`
object (shown per the page's current locale). Fields using it: speaker
`role`/`bio`, gallery `label`/`alt`, topic `name`, program `title`/`desc`.
Components read these with `localize(text, lang)` (`src/i18n/translations.ts`),
which just does `typeof text === "string" ? text : text[lang]`.

`chair`/`room` in `program.json` are deliberately **not**
`localizedTextSchema` — plain strings only, since they're people's names and
room codes, never translated.

## Layer 3 — EasyChair sync + Google Translate (Program page only)

This layer exists because EasyChair has no localization feature: its Smart
Program page returns scraped session titles as plain, single-language text
(often already mixed EN/PT), unlike every other content source in the repo,
which is hand-authored per locale from the start (or, per Layer 2, a plain
string deliberately shown unchanged in both locales).

**Sync (`src/data/program/easychair.ts`, `program.ts`).** If `site.links.easyChairProgram`
is set, `program.ts` fetches that URL — EasyChair's public Smart Program page,
plain server-rendered HTML, no auth — with an 8s timeout, and
`parseEasyChairProgram()` parses its `.session` blocks into
`{ time, title, kind, tag?, chair?, room? }` rows. Parallel tracks sharing a
time slot (e.g. "Session 4A"/"4B") stay separate rows. This only works for a
single-day conference — EasyChair's Smart Program index page _is_ the
schedule when the event is one day; for a multi-day event it's a day picker
instead, with no `.session` entries, which falls back the same way an
unreachable URL would. Any fetch/parse/validation failure is caught and
logged as a warning; `program.ts` falls back to the committed `program.json`
rather than failing the build.

**Translate (`src/data/program/translate.ts`).** Before the synced result is
returned, `easychair.ts` runs every scraped `title` through
`localizeTexts(texts)`:

- With `GOOGLE_TRANSLATE_API_KEY` unset, every string maps to itself — both
  locales show the original scraped text, and `title` stays a plain string
  (still valid against `localizedTextSchema`).
- With a key configured, each **distinct** source string is looked up in a
  checked-in cache (`src/data/program/program-translation-cache.json`), keyed by a
  16-hex-char SHA-256 prefix of the source text. Cache misses are batch-
  translated to `en` and `pt` in parallel via the Google Cloud Translation
  v2 REST API (`POST translation.googleapis.com/language/translate/v2`,
  Basic/NMT tier), written back into the cache, and the cache file is
  persisted to disk (`writeFileSync`) so unchanged content never re-hits the
  API on a later build.
  - A maintainer can hand-correct a bad machine translation by editing that
    cache entry's `en`/`pt` value directly — nothing recomputes an entry
    that's already cached.
  - A cache write failure (e.g. the Docker build stage's read-only
    filesystem) is caught and logged, not fatal — that build's in-memory
    translations are still used, just not persisted; committing the file
    from a local run is what makes it durable across builds.
  - Any translation request failure falls back to the original text for
    every affected string, the same as having no key configured — the build
    never hard-fails over this.
- `chair`/`room` are never passed to `localizeTexts` — only `title`
  currently goes through this pipeline (`desc` is scraped as empty by the
  EasyChair parser today, so there's nothing to translate there yet).

**Enabling this for a real edition:** point `site.links.easyChairProgram` at
that edition's Smart Program URL and set `GOOGLE_TRANSLATE_API_KEY` (see
`.env.example`) — no other changes needed. `program.json` still needs to
stay valid and reasonably current on its own, since it's what ships whenever
the live fetch or translation can't be used.

**Build-time cost:** enabling `site.links.easyChairProgram` adds one
outbound fetch to every `pnpm build`/`pnpm dev`; also setting
`GOOGLE_TRANSLATE_API_KEY` adds, on a cache miss, two parallel outbound
calls to Google Translate (one per locale). All are non-fatal on failure,
but expect a slower Program page build — this repo is otherwise fully
static/offline. `pnpm validate:data` never triggers any of these calls —
it only checks the committed `program.json`.

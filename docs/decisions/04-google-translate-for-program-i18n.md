# 04 — Google Translate for Program page i18n

**Status:** Accepted (#97)

## Context

#86 added a build-time sync of the Program page's schedule from EasyChair's
public Smart Program page. EasyChair has no localization feature, so the
scraped session titles/descriptions come back as plain, single-language text
(often already mixed EN/PT — e.g. an English "Keynote Session -" label
wrapping a Portuguese talk title). This was explicitly out of scope for #86
and broke the site's otherwise-consistent en/pt localization, since every
other content source (`speakers.json`, `topics.json`, `gallery.json`, the
hand-curated `program.json`) is authored per locale from the start via
`localizedTextSchema`.

Constraints going in:

- `chair`/`room` must never be machine-translated — they're people's names
  and room codes, not prose.
- Must not turn a working build into a failing one — same non-fatal fallback
  posture as #86's EasyChair fetch (unreachable/unusable - fall back to
  showing the original text, not a build failure).
- A single edition's schedule text is small — a few hundred to a couple
  thousand characters — so any per-character API cost only matters if it's
  meaningfully above zero for that volume.
- Should reuse the existing `localizedTextSchema`/`localize(text, lang)`
  pattern already used elsewhere, rather than introducing a second way of
  representing localized text.

## Discussion

- **A. Google Cloud Translation (Basic/NMT tier)** — batch REST API, gated
  behind an optional `GOOGLE_TRANSLATE_API_KEY`. Free for the first 500,000
  characters/month, $20/million after — comfortably covers a single
  edition's schedule text with no expected ongoing cost.

No alternative provider (e.g. DeepL, Azure/AWS Translate) was formally
evaluated in writing before this decision — the choice was made directly
against the constraints above, not a comparison between vendors. If that
changes, this record should be updated or superseded rather than silently
drifting from what the code does.

## Decision

**A.** Use Google Cloud Translation (Basic/NMT tier) via its v2 REST API.

- `program.schema.mjs`'s `title`/`desc` became `localizedTextSchema` — the
  same union type as the other localized-content schemas — so
  hand-curated `program.json` needed no changes (a plain string is still
  valid) and `Program.astro` needed no new rendering path, just the
  existing `localize(text, lang)` call.
- Translations are cached in a checked-in JSON file
  (`src/data/program/program-translation-cache.json`), keyed by a hash of the
  source text, so unchanged content across builds/editions never re-hits
  the API, and a maintainer can hand-correct one bad translation by editing
  the cached value directly.
- With no key configured, or on any request failure, every string falls
  back to itself (shown as-is in both locales) — consistent with #86's
  fallback posture, never a hard build failure.

### Consequences

- Requires a maintainer to create a GCP project with billing enabled and
  supply an API key per deployment that wants live translation — optional
  infrastructure, not required for the template to work.
- A second, independent outbound network call at build/dev time (on top of
  the EasyChair fetch from #86) when the key is set — see
  [`docs/implementation/translation-system.md`](../implementation/translation-system.md#layer-3--easychair-sync--google-translate-program-page-only)
  for the non-fatal-on-failure behavior this implies.
- Translation quality is machine-translation quality, not editorial — the
  cache-file hand-correction path exists to patch a wrong or awkward
  translation without touching code.
- Ties the Program page's automatic-translation feature to a single vendor;
  switching providers later means replacing `translateBatch()` in
  `src/data/program/translate.ts` and re-keying or discarding the existing cache
  (its entries aren't provider-tagged).

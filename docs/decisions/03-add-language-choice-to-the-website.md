# 03 — Add language choice to the website

**Status:** Accepted

## Context

The original SEI website was English-only. English fits the event itself —
a symposium expecting international submissions/attendees — but ISEP is a
Portuguese institution, and not every visitor (organizers, local students,
press) is comfortable reading English. Two separate questions followed from
that: whether to support Portuguese at all, and, once bilingual, how a
visitor ends up seeing the right one.

## Discussion

**Whether to support Portuguese:**

- **A. English-only** — keep the original site's scope. Simplest to
  maintain, but leaves out visitors not comfortable in English, on a site
  hosted by a Portuguese institution.
- **B. English + Portuguese (en/pt)** — covers both the symposium's
  international audience and ISEP's local one.

**How the visitor's language is picked:**

- **A. Browser-based auto-detection** — infer the language from
  `Accept-Language`/`navigator.language` and serve that locale by default,
  no visible control. Rejected: browser-reported language is unreliable
  (shared/library computers, browsers left on a non-native default, VPNs),
  and a static build has no server-side request to read that header from
  at build time — auto-detection would need to happen client-side, after
  first paint, which either flashes the wrong locale or needs JS before
  rendering anything.
- **B. Manual switcher** — a visible control lets the visitor pick, and the
  choice is explicit rather than guessed.

## Decision

**B + B.** Support English and Portuguese, and let the visitor choose via a
manual switcher (`LanguageSwitcher.astro`) rather than inferring it.

- Astro's i18n routing (`astro.config.mjs`) is configured with
  `locales: ["pt", "en"]`, `defaultLocale: "pt"`, and
  `routing: { prefixDefaultLocale: true }` — every page lives under an
  explicit `/en/` or `/pt/` prefix, including the default, so the active
  locale is always visible in and driven by the URL, not hidden client
  state. `pt` was set as the default given the institution's home
  language, with `en` a first-class, equally supported alternative rather
  than a fallback.
- The switcher itself (`src/components/LanguageSwitcher.astro`) is a static
  link list — each option is a real `<a href>` to the same page under the
  other locale prefix (via `getRelativeLocaleUrl`), not a JS-driven
  content swap — so it works with no client JS and is crawlable/shareable
  per locale.

### Consequences

- All content and UI copy needs both `en` and `pt` values (see
  [`docs/implementation/translation-system.md`](../implementation/translation-system.md))
  — an edition can't ship with only one locale filled in without the other
  silently falling back to raw source text/untranslated copy.
- No auto-redirect based on browser or geolocation — a Portuguese-reading
  visitor lands on `pt` (the default) or `en` depending on which URL they
  arrive at, and switches manually if that's wrong. A deliberate tradeoff:
  a small first-load friction for a predictable, debuggable result instead
  of a guess that can be wrong.
- Every page needs two routed files (`src/pages/en/<name>.astro` and
  `src/pages/pt/<name>.astro`) rather than one dynamic `[lang]` route — see
  [`docs/implementation/architecture.md`](../implementation/architecture.md)
  → "Routing and pages".

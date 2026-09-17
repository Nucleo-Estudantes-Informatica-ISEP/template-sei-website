# SEI-ISEP Website Template

Astro 7 (static), TypeScript strict, en/pt i18n. Reusable template — each
edition (SEI'26, SEI'27, ...) forks it into its own repo.

## Commands

- `pnpm dev`: Dev server (agents: `astro dev --background`)
- `pnpm build`: Static build to `dist/`
- `pnpm preview`: Serve built `dist/` locally
- `pnpm lint`: `eslint .`
- `pnpm format`: `prettier --write .`
- `pnpm validate:data`: Validate JSON content against zod schemas (except
  `program-translation-cache.json` — no schema, own parse/fallback logic)
- `pnpm typecheck`: `validate:data` + `astro check`
- `pnpm test`: `tsx --test src/data/*.test.ts src/data/*/*.test.ts`
- `pnpm exec tsx --test src/data/program/translate.test.ts`: Single test file

## Architecture

- Full layout, data flow, and routing: `docs/implementation/architecture.md`

## Code Style

- Colors/spacing/type via CSS custom properties only, never hardcoded hex/px
- Per-edition data in `src/data/<domain>/*.json`, never hardcoded in
  `.astro` files — genuinely static prose (e.g. Author Guidelines body
  copy) is the deliberate exception and stays in components
- UI copy via `en.json`/`pt.json`, flat dot-notation keys, never hardcoded

## Rules

- Template repo, not a website — no edition-specific content here
- TypeScript constrained to the 6.x line (`^6.0.3`, a range not an exact
  pin) — peer ranges cap below 7.x; don't `add -D typescript@latest` without
  checking peers resolve first
- Node `>=22.12.0` required, must match `ci.yml`
- Edit `AGENTS.md`, not `CLAUDE.md` (it just re-imports this file)
- Build/dev hits the network if `easyChairProgram`/`GOOGLE_TRANSLATE_API_KEY`
  are set — non-fatal on failure

## Testing

- `tsx --test`, colocated per domain under `src/data/<domain>/`
- Mock the Google Translate API call, never call it for real
- No database or backend to mock

## Security

- Only secret: `GOOGLE_TRANSLATE_API_KEY`, via `.env`, never committed
- `program-translation-cache.json` is committed — text only, never a key
- Only external input is EasyChair's public page, fetched and parsed at build

## Commit and PR Guidelines

- Branch/commit/PR/issue rules: `docs/agents/contribution.md`

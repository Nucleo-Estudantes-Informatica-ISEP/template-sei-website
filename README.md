# SEI-ISEP Website Template

Reusable [Astro](https://astro.build/) template for SEI-ISEP symposium websites.

## Installation

Requires Node `>=22.12.0` and [pnpm](https://pnpm.io/) via Corepack.

1. **Create a new project** — click **"Use this template"** above, or clone this repo.
2. **Install dependencies:**

```bash
corepack enable
pnpm install
```

3. **Configure environment variables** — copy `.env.example` to `.env`.
   `GOOGLE_TRANSLATE_API_KEY` is optional: it enables machine translation of
   the EasyChair-synced Program page text; left unset, that text just shows
   unchanged in both locales instead of failing the build.
4. **Set up a new edition** — follow [`docs/edition-setup.md`](docs/edition-setup.md).
5. **Understand the implementation** — [`docs/implementation/architecture.md`](docs/implementation/architecture.md)
   (file layout, data flow, routing) and [`docs/implementation/translation-system.md`](docs/implementation/translation-system.md)
   (i18n and the EasyChair/Google Translate pipeline). Design decisions with
   a real alternative behind them are in [`docs/decisions/`](docs/decisions/).

## Usage

```bash
pnpm dev      # start dev server
pnpm build    # static build to dist/
pnpm preview  # serve the built dist/ locally
```

Full command list in [`package.json`](package.json#L8) `scripts`, or
[AGENTS.md](AGENTS.md#commands).

## Contributing

Branch naming, commit, and PR conventions are in `docs/agents/contribution.md`
(added by #115). Issues here are template-mechanics only, tracked under the
`sei-website-template` milestone — edition-specific content issues belong in
that edition's own repo.

## Support

Open an [issue](https://github.com/Nucleo-Estudantes-Informatica-ISEP/template-sei-website/issues)
for template bugs or mechanism requests.

## License

No open-source license. All rights reserved.

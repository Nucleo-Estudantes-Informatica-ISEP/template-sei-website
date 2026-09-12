# template-sei-website

Template for SEI Websites

## Setting up a new edition

Forking this template for a new SEI edition? See the
[template usage guide](docs/usage-guide.md) for which file to edit for each
mechanism — site config, per-page content, translations, and re-skinning.

## Design review sample content

`chore/design-review` includes mock speaker profiles, committee lists and
illustrative images from the supplied Figma exports. These are design fixtures,
not confirmed SEI participants or photographs documenting previous editions.
Replace them in `src/data/` and `public/images/design-review/` for each edition.

Speaker roles and biographies, gallery labels and image descriptions accept
either a plain string or an `{ "en": "...", "pt": "..." }` object.
Gallery entries use `src` for the public image path and `alt` for its description;
label-only entries still display a placeholder.

Image sources: `Section-1.png` (about), `Section-5.png` (speaker portraits),
`Section-12.png` (illustrative proceedings image), `Section-14.png` (gallery),
and `image 17.png` (banner). Images were extracted from the supplied exports
and stored as WebP. The proceedings image is illustrative, not a published cover.
Speaker biographies and the 34 scientific / 10 organizing committee entries
follow `Section-7.png` and `Section-9.png`; English biographies are translations.
Registration QR codes and support logos remain unset until usable assets and
destinations are supplied.

# Architecture decisions

Short records of decisions that shaped this template's implementation, where
the reasoning isn't obvious from the code and is worth keeping for the next
time it's questioned or revisited.

Not every change needs one — only decisions with a real alternative that was
passed over (a library/service choice, a tradeoff between two designs), not
routine implementation work.

Format: `NN-short-title.md`, numbered sequentially starting at `01`.
Copy [`00-decision-template.md`](00-decision-template.md) for a new entry:
**Status** (accepted/superseded), **Context** (the problem, constraints),
**Discussion** (options considered), **Decision** (what was chosen, and
why), **Consequences** (what that commits to, what it rules out).

Decisions are discrete and supersedable: a later ADR can supersede an
earlier one (mark the old one's **Status** as `Superseded by NN`) rather
than editing it in place or folding everything into one monolithic log.

A PR that settles a meaningful design decision should add or update the
corresponding ADR here as part of that PR, not as separate follow-up work.

## Index

- [01 — One repository per SEI edition](01-one-repository-per-edition.md)
- [02 — Astro as the framework](02-astro-as-the-framework.md)
- [03 — Add language choice to the website](03-add-language-choice-to-the-website.md)
- [04 — Google Translate for Program page i18n](04-google-translate-for-program-i18n.md)

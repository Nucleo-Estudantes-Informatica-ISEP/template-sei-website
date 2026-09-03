import type { TranslationKey } from "./utils";

export type NavLink = { slug: string; labelKey: TranslationKey };

export const NAV_LINKS: NavLink[] = [
  { slug: "", labelKey: "nav.home" },
  { slug: "program", labelKey: "nav.program" },
  { slug: "speakers", labelKey: "nav.speakers" },
  { slug: "committees", labelKey: "nav.committees" },
  { slug: "author-guidelines", labelKey: "nav.authorGuidelines" },
  { slug: "history", labelKey: "nav.history" },
];

export const FOOTER_NAV_LINKS: NavLink[] = [
  { slug: "", labelKey: "nav.home" },
  { slug: "program", labelKey: "nav.program" },
  { slug: "speakers", labelKey: "nav.speakers" },
  { slug: "committees", labelKey: "nav.committees" },
];

export const FOOTER_PARTICIPATION_LINKS: NavLink[] = [
  { slug: "author-guidelines", labelKey: "nav.authorGuidelines" },
  { slug: "registration", labelKey: "nav.registration" },
  { slug: "history", labelKey: "nav.history" },
];

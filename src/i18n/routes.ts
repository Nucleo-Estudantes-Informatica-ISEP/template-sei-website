import type { TranslationKey } from "./utils";
import type { site } from "../data/site";

export type PageId = keyof typeof site.pages;
export type NavLink = { id: PageId; labelKey: TranslationKey };

export const NAV_LINKS: NavLink[] = [
  { id: "home", labelKey: "nav.home" },
  { id: "program", labelKey: "nav.program" },
  { id: "speakers", labelKey: "nav.speakers" },
  { id: "committees", labelKey: "nav.committees" },
  { id: "authorGuidelines", labelKey: "nav.authorGuidelines" },
  { id: "history", labelKey: "nav.history" },
];

export const FOOTER_NAV_LINKS: NavLink[] = [
  { id: "home", labelKey: "nav.home" },
  { id: "program", labelKey: "nav.program" },
  { id: "speakers", labelKey: "nav.speakers" },
  { id: "committees", labelKey: "nav.committees" },
];

export const FOOTER_PARTICIPATION_LINKS: NavLink[] = [
  { id: "submissions", labelKey: "nav.submissions" },
  { id: "registration", labelKey: "nav.registration" },
  { id: "history", labelKey: "nav.history" },
];

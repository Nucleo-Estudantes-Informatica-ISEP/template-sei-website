/**
 * SEI — data schemas
 * All content collections are validated against these schemas at build time
 * via `src/data/index.ts`. Adding or editing content never requires touching
 * components — only the matching data file.
 */
import { z } from "zod";

const required = z.string().trim().min(1, "Field cannot be empty");

/* ------------------------------------------------------------------ */

/** Accepts site-internal paths (`/page/`) or absolute URLs (http, mailto…). */
const hrefSchema = z
  .string()
  .refine(
    (value) => value.startsWith("/") || /^[a-z][a-z0-9+.-]*:/i.test(value),
    "Must be a site path or an absolute URL",
  );

export const linkSchema = z.object({
  label: required,
  url: hrefSchema,
});

export type Link = z.infer<typeof linkSchema>;

/** Strict absolute-URL link (external platforms). */
export const externalLinkSchema = z.object({
  label: required,
  url: z.url("Must be a valid absolute URL"),
});

export type ExternalLink = z.infer<typeof externalLinkSchema>;

/* ------------------------------------------------------------------ */

export const dateRangeSchema = z.object({
  /** Single key date (e.g. symposium day). */
  at: z.coerce.date().optional(),
  /** Period (e.g. submission window). */
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const importantDateSchema = z
  .object({
    label: required,
    description: z.string().optional(),
    /** Marks the most urgent / currently open date. */
    highlight: z.boolean().default(false),
    range: dateRangeSchema,
    href: hrefSchema.optional(),
  })
  .refine((d) => d.range.at || (d.range.from && d.range.to), {
    message: "A date must define either `at` or a `from`/`to` window",
  });

export type ImportantDate = z.infer<typeof importantDateSchema>;
export type ImportantDateInput = z.input<typeof importantDateSchema>;

/* ------------------------------------------------------------------ */

export const speakerSchema = z.object({
  name: required,
  role: required,
  affiliation: required,
  /** Key into `src/data/images.ts`. Falls back to a monogram avatar. */
  photo: z.string().optional(),
  bio: required,
  links: z.array(externalLinkSchema).default([]),
  status: z.enum(["confirmed", "pending"]).default("confirmed"),
});

export type Speaker = z.infer<typeof speakerSchema>;
export type SpeakerInput = z.input<typeof speakerSchema>;

/* ------------------------------------------------------------------ */

export const committeeMemberSchema = z.object({
  name: required,
  /** Optional role within the committee. */
  role: z.string().optional(),
  institution: required,
});

export const committeeSchema = z.object({
  id: z.string(),
  title: required,
  description: z.string().optional(),
  members: z.array(committeeMemberSchema),
});

export type Committee = z.infer<typeof committeeSchema>;

/* ------------------------------------------------------------------ */

export const topicSchema = z.object({
  name: required,
  /** Optional short descriptor shown as tooltip/subtitle. */
  note: z.string().optional(),
});

export const submissionRuleSchema = z.object({
  title: required,
  body: required,
});

export const submissionStepSchema = z.object({
  title: required,
  body: required,
});

export const reviewCriterionSchema = z.object({
  title: required,
  body: required,
});

export const submissionsSchema = z.object({
  intro: z.array(required),
  topics: z.array(topicSchema),
  callForPapers: z.array(submissionRuleSchema),
  steps: z.array(submissionStepSchema),
  review: z.array(reviewCriterionSchema),
  platform: externalLinkSchema,
  contactEmail: z.email("Must be a valid e-mail"),
  template: externalLinkSchema,
});

export type Submissions = z.infer<typeof submissionsSchema>;

/* ------------------------------------------------------------------ */

export const programBlockSchema = z.object({
  time: required,
  title: required,
  detail: z.string().optional(),
  type: z.enum(["registration", "talk", "break", "session", "closing"]),
});

export const programSchema = z.object({
  intro: z.string(),
  fullProgram: externalLinkSchema.optional(),
  dayLabel: required,
  blocks: z.array(programBlockSchema),
});

export type Program = z.infer<typeof programSchema>;
export type ProgramInput = z.input<typeof programSchema>;
export type ProgramBlock = z.infer<typeof programBlockSchema>;

/* ------------------------------------------------------------------ */

export const photoSchema = z.object({
  alt: required,
  caption: z.string().optional(),
  /** Key into `src/data/images.ts`. Falls back to generated art. */
  image: z.string().optional(),
});

export type Photo = z.infer<typeof photoSchema>;

/* ------------------------------------------------------------------ */

export const editionSchema = z.object({
  year: z.number().int().positive(),
  number: z.number().int().positive(),
  theme: z.string().optional(),
  tagline: z.string().optional(),
  href: z.url("Must be a valid URL"),
});

export type Edition = z.infer<typeof editionSchema>;

/* ------------------------------------------------------------------ */

export const registrationSchema = z.object({
  intro: z.array(required),
  notes: z.array(required),
  feeLabel: required,
  deadline: z.coerce.date(),
  cta: externalLinkSchema,
  /** URL encoded into the QR code shown on the page. */
  qrPayload: z.url("Must be a valid URL"),
  qrAlt: required,
});

export type Registration = z.infer<typeof registrationSchema>;

/* ------------------------------------------------------------------ */

export const siteSchema = z.object({
  name: required,
  shortName: required,
  editionYear: z.number().int().positive(),
  editionNumber: z.number().int().positive(),
  editionLabel: required,
  tagline: required,
  description: required,
  dateLabel: required,
  location: required,
  hero: z.object({
    kicker: required,
    title: required,
    lead: required,
    primaryCta: linkSchema,
    secondaryCta: linkSchema,
  }),
  banner: z.object({
    alt: required,
    caption: z.string().optional(),
  }),
  about: z.object({
    paragraphs: z.array(required),
    stats: z.array(
      z.object({
        value: required,
        label: required,
      }),
    ),
  }),
  highlight: z.object({
    title: required,
    body: required,
    cta: linkSchema.optional(),
  }),
  nav: z.array(
    z.object({
      label: required,
      href: z.string().min(1),
    }),
  ),
  footer: z.object({
    blurb: required,
    address: required,
    contacts: z.array(linkSchema),
    socials: z.array(externalLinkSchema),
  }),
});

export type Site = z.infer<typeof siteSchema>;
export type SiteInput = z.input<typeof siteSchema>;

export type CommitteeInput = z.input<typeof committeeSchema>;
export type SubmissionsInput = z.input<typeof submissionsSchema>;
export type PhotoInput = z.input<typeof photoSchema>;
export type EditionInput = z.input<typeof editionSchema>;
export type RegistrationInput = z.input<typeof registrationSchema>;

import { z } from "zod";
import {
  publicAssetPath,
  optionalUrl,
  yearSchema,
  routeSlug,
} from "./primitives.schema.mjs";

export const siteConfigSchema = z.object({
  edition: z.object({
    name: z.string().min(1),
    year: yearSchema,
  }),
  pages: z.object({
    home: z.literal(""),
    program: routeSlug,
    speakers: routeSlug,
    committees: routeSlug,
    authorGuidelines: routeSlug,
    history: routeSlug,
    registration: routeSlug,
  }),
  importantDates: z
    .array(
      z.object({
        id: z.enum([
          "paperSubmission",
          "acceptanceNotification",
          "cameraReady",
        ]),
        date: z.iso.date().nullable(),
      }),
    )
    .length(3),
  links: z.object({
    easyChairSubmission: optionalUrl,
    easyChairProgram: optionalUrl,
    registration: optionalUrl,
    proceedings: optionalUrl,
  }),
  images: z.object({
    banner: publicAssetPath,
    proceedingsCover: publicAssetPath,
    logo: publicAssetPath,
  }),
  contact: z.object({
    email: z.email(),
  }),
  social: z.object({
    linkedin: optionalUrl,
  }),
  venue: z.object({
    name: z.string().min(1),
    addressLine1: z.string().min(1),
    postalCode: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
  }),
  footerLogos: z
    .array(
      z.object({
        src: publicAssetPath,
        alt: z.string().min(1),
        href: optionalUrl,
      }),
    )
    .min(1),
});

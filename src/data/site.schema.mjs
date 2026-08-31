import { z } from "zod";
import {
  publicAssetPath,
  optionalUrl,
  yearSchema,
} from "./primitives.schema.mjs";

export const siteConfigSchema = z.object({
  edition: z.object({
    name: z.string().min(1),
    year: yearSchema,
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

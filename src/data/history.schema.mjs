import { z } from "zod";
import {
  publicAssetPath,
  absoluteUrl,
  yearSchema,
} from "./primitives.schema.mjs";

export const historySchema = z
  .array(
    z.object({
      year: yearSchema,
      banner: publicAssetPath,
      url: absoluteUrl,
      alt: z.string().min(1),
      dateLabel: z.string().min(1),
      description: z.string().min(1),
    }),
  )
  .min(1)
  .superRefine((history, ctx) => {
    const seenYears = new Set();
    for (let i = 0; i < history.length; i++) {
      const { year } = history[i];
      if (seenYears.has(year)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate year found: ${year}`,
          path: [i, "year"],
        });
      } else {
        seenYears.add(year);
      }

      if (i > 0 && history[i - 1].year <= year) {
        ctx.addIssue({
          code: "custom",
          message: `Newest year must come first. Year ${year} is not newer than ${history[i - 1].year}.`,
          path: [i, "year"],
        });
      }
    }
  });

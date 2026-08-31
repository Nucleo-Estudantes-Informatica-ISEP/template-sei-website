import { z } from "zod";
import { publicAssetPath, absoluteUrl } from "./primitives.schema.mjs";

export const historySchema = z
  .array(
    z.object({
      year: z.number().int().min(2000).max(2100),
      banner: publicAssetPath,
      url: absoluteUrl,
      alt: z.string().min(1),
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

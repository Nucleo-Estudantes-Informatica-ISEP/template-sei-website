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
  .refine(
    (history) => {
      const years = history.map((entry) => entry.year);
      return new Set(years).size === years.length; // Check for unique years
    },
    {
      message: "Years must be unique",
    },
  )
  .refine(
    (history) => {
      for (let i = 0; i < history.length - 1; i++) {
        if (history[i].year <= history[i + 1].year) {
          return false; // Newest year should be first
        }
      }
      return true;
    },
    {
      message: "Newest year should be first",
    },
  );

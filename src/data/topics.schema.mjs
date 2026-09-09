import { z } from "zod";
import { localizedTextSchema } from "./primitives.schema.mjs";

export const topicsSchema = z
  .array(
    z.object({
      name: localizedTextSchema,
    }),
  )
  .min(1);

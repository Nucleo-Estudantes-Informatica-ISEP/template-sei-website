import { z } from "zod";

export const topicsSchema = z
  .array(
    z.object({
      name: z.string().min(1),
    }),
  )
  .min(1);

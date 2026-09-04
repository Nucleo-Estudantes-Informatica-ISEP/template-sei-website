import { z } from "zod";

export const gallerySchema = z.array(
  z.object({
    label: z.string().min(1),
  }),
);

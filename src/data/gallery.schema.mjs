import { z } from "zod";

export const galleryItemSchema = z.object({
  label: z.string().min(1),
});

export const gallerySchema = z.object({
  gallery: z.array(galleryItemSchema),
});

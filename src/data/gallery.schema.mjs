import { z } from "zod";
import { publicAssetPath, localizedTextSchema } from "./primitives.schema.mjs";

export const gallerySchema = z.array(
  z.object({
    label: localizedTextSchema,
    src: publicAssetPath.optional(),
    alt: localizedTextSchema.optional(),
  }),
);

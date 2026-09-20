import type { z } from "zod";

import galleryData from "./gallery.json";
import { gallerySchema } from "./gallery.schema.mjs";

export const gallery = gallerySchema.parse(galleryData);
export type GalleryConfig = z.infer<typeof gallerySchema>;

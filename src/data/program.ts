import type { z } from "zod";

import programData from "./program.json";
import { programSchema } from "./program.schema.mjs";
import galleryData from "./gallery.json";
import { gallerySchema } from "./gallery.schema.mjs";

export const program = programSchema.parse(programData);
export type ProgramConfig = z.infer<typeof programSchema>;
export const gallery = gallerySchema.parse(galleryData);
export type GalleryConfig = z.infer<typeof gallerySchema>;

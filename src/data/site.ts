import type { z } from "zod";

import siteData from "./site.json";
import { siteConfigSchema } from "./site.schema.mjs";

export const site = siteConfigSchema.parse(siteData);
export type SiteConfig = z.infer<typeof siteConfigSchema>;

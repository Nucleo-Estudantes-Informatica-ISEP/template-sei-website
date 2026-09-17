import type { z } from "zod";

import siteData from "./edition.json";
import { siteConfigSchema } from "./edition.schema.mjs";

export const site = siteConfigSchema.parse(siteData);
export type SiteConfig = z.infer<typeof siteConfigSchema>;

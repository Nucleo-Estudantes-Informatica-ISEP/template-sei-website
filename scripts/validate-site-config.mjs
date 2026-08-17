import siteData from "../src/data/site.json" with { type: "json" };
import { siteConfigSchema } from "../src/data/site.schema.mjs";

siteConfigSchema.parse(siteData);

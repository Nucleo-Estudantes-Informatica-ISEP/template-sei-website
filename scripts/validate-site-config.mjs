import siteData from "../src/data/site.json" with { type: "json" };
import { siteConfigSchema } from "../src/data/site.schema.mjs";
import committeesData from "../src/data/committees.json" with { type: "json" };
import { committeesSchema } from "../src/data/committees.schema.mjs";

siteConfigSchema.parse(siteData);
committeesSchema.parse(committeesData);

import siteData from "../src/data/site.json" with { type: "json" };
import { siteConfigSchema } from "../src/data/site.schema.mjs";
import historyData from "../src/data/history.json" with { type: "json" };
import { historySchema } from "../src/data/history.schema.mjs";

siteConfigSchema.parse(siteData);
historySchema.parse(historyData);
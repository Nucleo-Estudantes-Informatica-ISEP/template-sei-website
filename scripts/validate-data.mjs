import siteData from "../src/data/site.json" with { type: "json" };
import { siteConfigSchema } from "../src/data/site.schema.mjs";
import historyData from "../src/data/history.json" with { type: "json" };
import { historySchema } from "../src/data/history.schema.mjs";
import programData from "../src/data/program.json" with { type: "json" };
import { programSchema } from "../src/data/program.schema.mjs";

const registry = [
  { data: siteData, schema: siteConfigSchema },
  { data: historyData, schema: historySchema },
  { data: programData, schema: programSchema },
];

for (const { data, schema } of registry) {
  schema.parse(data);
}

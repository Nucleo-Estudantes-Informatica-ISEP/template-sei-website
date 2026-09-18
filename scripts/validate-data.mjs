import siteData from "../src/data/edition/edition.json" with { type: "json" };
import { siteConfigSchema } from "../src/data/edition/edition.schema.mjs";
import historyData from "../src/data/history/history.json" with { type: "json" };
import { historySchema } from "../src/data/history/history.schema.mjs";
import programData from "../src/data/program/program.json" with { type: "json" };
import { programSchema } from "../src/data/program/program.schema.mjs";
import committeesData from "../src/data/committees/committees.json" with { type: "json" };
import { committeesSchema } from "../src/data/committees/committees.schema.mjs";
import galleryData from "../src/data/gallery/gallery.json" with { type: "json" };
import { gallerySchema } from "../src/data/gallery/gallery.schema.mjs";
import speakersData from "../src/data/speakers/speakers.json" with { type: "json" };
import { speakersSchema } from "../src/data/speakers/speakers.schema.mjs";
import topicsData from "../src/data/topics/topics.json" with { type: "json" };
import { topicsSchema } from "../src/data/topics/topics.schema.mjs";

const registry = [
  { data: siteData, schema: siteConfigSchema },
  { data: historyData, schema: historySchema },
  { data: programData, schema: programSchema },
  { data: committeesData, schema: committeesSchema },
  { data: galleryData, schema: gallerySchema },
  { data: speakersData, schema: speakersSchema },
  { data: topicsData, schema: topicsSchema },
];

for (const { data, schema } of registry) {
  schema.parse(data);
}

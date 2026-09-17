import { test } from "node:test";
import assert from "node:assert/strict";

import siteData from "./edition.json";
import { siteConfigSchema } from "./edition.schema.mjs";

test("siteConfigSchema accepts the committed edition.json", () => {
  assert.doesNotThrow(() => siteConfigSchema.parse(siteData));
});

test("siteConfigSchema rejects importantDates with a repeated id", () => {
  const invalid = {
    ...siteData,
    importantDates: Array.from({ length: 5 }, () => ({
      id: "paperSubmission",
      date: null,
    })),
  };

  assert.throws(() => siteConfigSchema.parse(invalid));
});

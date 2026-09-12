import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { localizeTexts } from "./translate";

const CACHE_PATH = fileURLToPath(
  new URL("./program-translation-cache.json", import.meta.url),
);

test("localizeTexts hits the v2 endpoint and caches a successful response", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  process.env.GOOGLE_TRANSLATE_API_KEY = "test-key";

  // Unique per run so it never collides with a real cached entry, and so
  // repeated test runs don't fight over a stale cache hit.
  const sourceText = `__translate_test_probe__${Date.now()}`;
  const requestedUrls: string[] = [];

  globalThis.fetch = (async (url: string | URL) => {
    requestedUrls.push(url.toString());
    return {
      ok: true,
      status: 200,
      json: async () => ({
        data: { translations: [{ translatedText: `translated:${url}` }] },
      }),
    } as Response;
  }) as typeof fetch;

  try {
    const result = await localizeTexts([sourceText]);
    const entry = result.get(sourceText);

    assert.ok(entry && typeof entry === "object", "expected a translated pair");
    assert.equal(requestedUrls.length, 2, "expected one request per language");
    for (const url of requestedUrls) {
      assert.match(
        url,
        /^https:\/\/translation\.googleapis\.com\/language\/translate\/v2\?/,
        `unexpected endpoint: ${url}`,
      );
    }
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.GOOGLE_TRANSLATE_API_KEY;
    else process.env.GOOGLE_TRANSLATE_API_KEY = originalKey;

    // Don't leave the test's throwaway entry in the checked-in cache file.
    const cache = JSON.parse(readFileSync(CACHE_PATH, "utf8")) as Record<
      string,
      { source: string }
    >;
    for (const [hash, value] of Object.entries(cache)) {
      if (value.source === sourceText) delete cache[hash];
    }
    writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + "\n", "utf8");
  }
});

import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Lang } from "../i18n/utils";

const CACHE_PATH = fileURLToPath(
  new URL("./program-translation-cache.json", import.meta.url),
);
const TRANSLATE_TIMEOUT_MS = 10_000;

interface CacheEntry {
  source: string;
  en: string;
  pt: string;
}

type Cache = Record<string, CacheEntry>;

function hashText(text: string): string {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

function isCacheEntry(value: unknown): value is CacheEntry {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as CacheEntry).source === "string" &&
    typeof (value as CacheEntry).en === "string" &&
    typeof (value as CacheEntry).pt === "string"
  );
}

/**
 * Parses and shape-validates the cache file's contents. A hand-edit that
 * produces invalid JSON *or* syntactically valid JSON with the wrong
 * structure (e.g. a non-string `en`/`pt`, or a missing field) is treated the
 * same way: the whole cache is dropped and rebuilt from scratch rather than
 * risking a malformed entry reaching `localizeTexts`'s callers.
 */
export function parseCache(raw: string): Cache {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    Array.isArray(parsed) ||
    !Object.values(parsed).every(isCacheEntry)
  ) {
    return {};
  }
  return parsed as Cache;
}

function loadCache(): Cache {
  if (!existsSync(CACHE_PATH)) return {};
  try {
    return parseCache(readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache: Cache): void {
  try {
    writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + "\n", "utf8");
  } catch (error) {
    // Read-only filesystem (e.g. the Docker build stage) — this build's
    // in-memory translations are still used, just not persisted for the
    // next one. Committing the cache file is what makes it durable.
    console.warn(
      "[translate.ts] Could not persist translation cache:",
      error instanceof Error ? error.message : error,
    );
  }
}

async function translateBatch(
  texts: string[],
  target: Lang,
  apiKey: string,
): Promise<string[]> {
  const params = new URLSearchParams({ key: apiKey, target, format: "text" });
  for (const text of texts) params.append("q", text);

  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?${params}`,
    { method: "POST", signal: AbortSignal.timeout(TRANSLATE_TIMEOUT_MS) },
  );
  if (!response.ok) {
    throw new Error(`Google Translate request failed: HTTP ${response.status}`);
  }
  const body = (await response.json()) as {
    data: { translations: { translatedText: string }[] };
  };
  return body.data.translations.map((t) => t.translatedText);
}

/**
 * Translates each distinct source string into both `en` and `pt`, using
 * (and updating) an on-disk cache keyed by source text so unchanged
 * content never re-hits the API across builds — see #97. Requires
 * GOOGLE_TRANSLATE_API_KEY; with no key configured, or on any translation
 * failure, every string maps to itself (shown as-is in both locales)
 * rather than failing the build.
 */
export async function localizeTexts(
  texts: string[],
): Promise<Map<string, string | Record<Lang, string>>> {
  const result = new Map<string, string | Record<Lang, string>>();
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    for (const text of texts) result.set(text, text);
    return result;
  }

  const cache = loadCache();
  const uncached = [...new Set(texts)].filter((text) => !cache[hashText(text)]);

  if (uncached.length > 0) {
    try {
      const [enResults, ptResults] = await Promise.all([
        translateBatch(uncached, "en", apiKey),
        translateBatch(uncached, "pt", apiKey),
      ]);
      uncached.forEach((text, i) => {
        cache[hashText(text)] = {
          source: text,
          en: enResults[i],
          pt: ptResults[i],
        };
      });
      saveCache(cache);
    } catch (error) {
      console.warn(
        "[translate.ts] Translation request failed, falling back to original text:",
        error instanceof Error ? error.message : error,
      );
    }
  }

  for (const text of texts) {
    const entry = cache[hashText(text)];
    result.set(text, entry ? { en: entry.en, pt: entry.pt } : text);
  }
  return result;
}

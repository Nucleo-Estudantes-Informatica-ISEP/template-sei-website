import type { z } from "zod";

import programData from "./program.json";
import { programSchema } from "./program.schema.mjs";
import galleryData from "./gallery.json";
import { gallerySchema } from "./gallery.schema.mjs";
import { site } from "./site";
import { fetchEasyChairProgram } from "./easychair";

export type ProgramConfig = z.infer<typeof programSchema>;

// program.json must always be a valid fallback on its own, independent of
// whether the EasyChair fetch below succeeds.
const fallbackProgram = programSchema.parse(programData);

async function loadProgram(): Promise<ProgramConfig> {
  const easyChairUrl = site.links.easyChairProgram;
  if (!easyChairUrl) return fallbackProgram;

  try {
    const fetched = await fetchEasyChairProgram(easyChairUrl);
    return programSchema.parse(fetched);
  } catch (error) {
    // EasyChair unreachable, its page shape changed, or the parsed result
    // failed schema validation — never hard-fail the build over this (#86),
    // fall back to the last-committed program.json instead.
    console.warn(
      `[program.ts] Could not sync program from EasyChair (${easyChairUrl}), falling back to program.json.`,
      error instanceof Error ? error.message : error,
    );
    return fallbackProgram;
  }
}

export const program = await loadProgram();

export const gallery = gallerySchema.parse(galleryData);
export type GalleryConfig = z.infer<typeof gallerySchema>;

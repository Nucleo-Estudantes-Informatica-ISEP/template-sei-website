/**
 * SEI — data hub.
 * Imports every content collection, validates it against the shared schemas
 * and exposes typed, parsed data to pages and components. Any data problem
 * fails the build with a clear message instead of rendering broken pages.
 */
import {
  committeeSchema,
  editionSchema,
  importantDateSchema,
  photoSchema,
  programSchema,
  registrationSchema,
  siteSchema,
  speakerSchema,
  submissionsSchema,
} from "./schemas";
import { imageKeys } from "./images";

import { committees as rawCommittees } from "./committees";
import { importantDates as rawDates } from "./dates";
import { history as rawHistory } from "./history";
import { photos as rawPhotos } from "./photos";
import { program as rawProgram } from "./program";
import { registration as rawRegistration } from "./registration";
import { site as rawSite } from "./site";
import { speakers as rawSpeakers } from "./speakers";
import { submissions as rawSubmissions } from "./submissions";

export { imageRegistry, resolveImage, imageKeys } from "./images";
export type { ImageKey } from "./images";

/** Validate that referenced images actually exist in the registry. */
function assertImageKeys(owner: string, keys: Array<string | undefined>) {
  const known = imageKeys as string[];
  for (const key of keys) {
    if (key && !known.includes(key)) {
      throw new Error(`[data] ${owner} references unknown image key "${key}"`);
    }
  }
}

/** Validate + parse every collection, failing fast with context. */
function parseData() {
  const site = siteSchema.parse(rawSite);

  const importantDates = rawDates.map((d, i) => {
    try {
      return importantDateSchema.parse(d);
    } catch (e) {
      throw new Error(`[data] invalid important date at index ${i}: ${e}`);
    }
  });

  const speakers = rawSpeakers.map((s, i) => {
    try {
      assertImageKeys(`speaker at index ${i}`, [s.photo]);
      return speakerSchema.parse(s);
    } catch (e) {
      throw new Error(`[data] invalid speaker at index ${i}: ${e}`);
    }
  });

  const committees = rawCommittees.map((c, i) => {
    try {
      return committeeSchema.parse(c);
    } catch (e) {
      throw new Error(`[data] invalid committee at index ${i}: ${e}`);
    }
  });

  const submissions = submissionsSchema.parse(rawSubmissions);
  const program = programSchema.parse(rawProgram);

  const photos = rawPhotos.map((p, i) => {
    try {
      assertImageKeys(`photo at index ${i}`, [p.image]);
      return photoSchema.parse(p);
    } catch (e) {
      throw new Error(`[data] invalid photo at index ${i}: ${e}`);
    }
  });

  const history = rawHistory.map((e, i) => {
    try {
      return editionSchema.parse(e);
    } catch (err) {
      throw new Error(`[data] invalid edition at index ${i}: ${err}`);
    }
  });

  const registration = registrationSchema.parse(rawRegistration);

  return {
    site,
    importantDates,
    speakers,
    committees,
    submissions,
    program,
    photos,
    history,
    registration,
  };
}

const data = parseData();

export const {
  site,
  importantDates,
  speakers,
  committees,
  submissions,
  program,
  photos,
  history,
  registration,
} = data;

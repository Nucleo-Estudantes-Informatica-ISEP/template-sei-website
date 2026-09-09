import type { z } from "zod";

import speakersData from "./speakers.json";
import { speakerSchema, speakersSchema } from "./speakers.schema.mjs";

export const speakers = speakersSchema.parse(speakersData);
export type Speaker = z.infer<typeof speakerSchema>;

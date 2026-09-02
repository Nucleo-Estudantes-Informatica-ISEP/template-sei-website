import type { z } from "zod";

import programData from "./program.json";
import { programSchema } from "./program.schema.mjs";

export const program = programSchema.parse(programData);
export type ProgramConfig = z.infer<typeof programSchema>;

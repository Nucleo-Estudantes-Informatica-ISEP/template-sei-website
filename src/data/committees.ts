import type { z } from "zod";

import committeesData from "./committees.json";
import { committeesSchema } from "./committees.schema.mjs";

export const committees = committeesSchema.parse(committeesData);
export type CommitteesConfig = z.infer<typeof committeesSchema>;

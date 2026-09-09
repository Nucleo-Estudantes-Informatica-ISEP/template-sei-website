import type { z } from "zod";

import topicsData from "./topics.json";
import { topicsSchema } from "./topics.schema.mjs";

export const topics = topicsSchema.parse(topicsData);
export type TopicsConfig = z.infer<typeof topicsSchema>;

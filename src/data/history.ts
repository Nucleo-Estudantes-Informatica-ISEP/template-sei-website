import type { z } from "zod";

import historyData from "./history.json";
import { historySchema } from "./history.schema.mjs";

export const history = historySchema.parse(historyData);
export type HistoryConfig = z.infer<typeof historySchema>;

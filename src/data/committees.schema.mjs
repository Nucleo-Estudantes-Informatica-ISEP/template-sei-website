import { z } from "zod";

const member = z.object({
  name: z.string().min(1),
  org: z.string().min(1),
});

export const committeesSchema = z.object({
  organizing: z.array(member).min(1),
  scientific: z.array(member).min(1),
});

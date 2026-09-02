import { z } from "zod";

const member = z.object({
  name: z.string().min(1),
  affiliation: z.string().min(1),
});

export const committeesSchema = z.object({
  organizationCommittee: z.array(member).min(1),
  technicalScientificCommittee: z.array(member).min(1),
});

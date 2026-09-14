import { z } from "zod";
import { timeSchema, localizedTextSchema } from "./primitives.schema.mjs";

export const scheduleItemSchema = z.object({
  time: timeSchema,
  // A plain string (program.json's hand-curated entries) or a per-locale
  // {en, pt} pair (EasyChair-synced entries run through translate.ts, #97).
  title: localizedTextSchema,
  desc: localizedTextSchema.optional(),
  tag: z.string().min(1).optional(),
  // Never localized — these are people's names and room codes.
  chair: z.string().min(1).optional(),
  room: z.string().min(1).optional(),
  // "break" gets a distinct (non-highlighted) treatment in the UI —
  // everything else, including parallel sessions sharing a time slot
  // with siblings, is a "session".
  kind: z.enum(["session", "break"]).default("session"),
});

function assertAscendingTimes(items, ctx, group) {
  for (let i = 1; i < items.length; i++) {
    if (items[i].time < items[i - 1].time) {
      ctx.addIssue({
        code: "custom",
        message: `Block time ${items[i].time} is out of order, should be after ${items[i - 1].time}`,
        path: [group, i, "time"],
      });
    }
  }
}

export const programSchema = z
  .object({
    morning: z.array(scheduleItemSchema).min(1),
    afternoon: z.array(scheduleItemSchema).min(1),
  })
  .superRefine((program, ctx) => {
    assertAscendingTimes(program.morning, ctx, "morning");
    assertAscendingTimes(program.afternoon, ctx, "afternoon");

    const lastMorning = program.morning.at(-1);
    const firstAfternoon = program.afternoon[0];
    if (firstAfternoon.time < lastMorning.time) {
      ctx.addIssue({
        code: "custom",
        message: `Afternoon block time ${firstAfternoon.time} is out of order, should be after ${lastMorning.time}`,
        path: ["afternoon", 0, "time"],
      });
    }
  });

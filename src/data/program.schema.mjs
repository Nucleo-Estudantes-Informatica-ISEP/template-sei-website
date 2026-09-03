import { z } from "zod";
import { timeSchema } from "./primitives.schema.mjs";

export const scheduleItemSchema = z.object({
  time: timeSchema,
  title: z.string().min(1),
  desc: z.string().nullable(),
  tag: z.string().min(1).optional(),
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
  });

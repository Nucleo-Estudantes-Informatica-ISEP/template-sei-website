import { z } from "zod";
import { timeSchema } from "./primitives.schema.mjs";

export const scheduleItemSchema = z.object({
  time: timeSchema,
  title: z.string().min(1),
  desc: z.string().nullable(),
  tag: z.string().optional(),
});

export const programSchema = z
  .object({
    morning: z.array(scheduleItemSchema).min(1),
    afternoon: z.array(scheduleItemSchema).min(1),
  })
  .superRefine((program, ctx) => {
    const items = [...program.morning, ...program.afternoon];

    for (let i = 1; i < items.length; i++) {
      const prevTime = items[i - 1].time;
      const currTime = items[i].time;

      if (prevTime >= currTime) {
        const period = period.morning.length ? "morning" : "afternoon";
        const index =
          i < program.morning.length ? i : i - program.morning.length;
        ctx.addIssue({
          code: "custom",
          message: `Schedule items in ${period} must be in ascending order of time. Time ${prevTime} is not less than ${currTime}.`,
          path: [period, index, "time"],
        });
      }
    }
  });

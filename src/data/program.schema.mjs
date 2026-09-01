import { z } from "zod";
import { timeSchema } from "./primitives.schema.mjs";

const types = ["registration", "talk", "break", "session", "closing"];

const startType = types.at(0); // "registration"
const closingType = types.at(-1); // "closing"

export const scheduleBlockSchema = z.object({
  time: timeSchema,
  title: z.string().min(1),
  detail: z.string().nullable(),
  type: z.enum(types),
});

export const programSchema = z
  .array(scheduleBlockSchema)
  .min(1)
  .superRefine((program, ctx) => {
    if (program[0].type !== startType) {
      ctx.addIssue({
        code: "custom",
        message: `Program must start with a ${startType} block`,
        path: [0, "type"],
      });
    }

    if (program[program.length - 1].type !== closingType) {
      ctx.addIssue({
        code: "custom",
        message: `Program must end with a ${closingType} block`,
        path: [program.length - 1, "type"],
      });
    }

    for (let i = 1; i < program.length - 1; i++) {
      if (program[i].time < program[i - 1].time) {
        ctx.addIssue({
          code: "custom",
          message: `Block time ${program[i].time} is out of order, should be after ${program[i - 1].time}`,
          path: [i, "time"],
        });
      }
    }
  });

import { z } from "zod";

export const publicAssetPath = z.string().startsWith("/");
export const absoluteUrl = z.url();
export const optionalUrl = z.url().nullable();
export const yearSchema = z.number().int().min(2000).max(2100);
export const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format. Expected HH:MM.");
export const dateLabelSchema = z
  .string()
  .regex(
    /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}$/,
    'Invalid date label format. Expected "Mon YYYY".',
  )
  .superRefine((value, ctx) => {
    const year = Number(value.split(" ")[1]);

    const result = yearSchema.safeParse(year);

    if (!result.success) {
      ctx.addIssue({
        code: "custom",
        message: "Year must be between 2000 and 2100.",
        path: ["dateLabel"],
      });
    }
  });

import { z } from "zod";

export const publicAssetPath = z.string().startsWith("/");
export const absoluteUrl = z.url();
export const optionalUrl = z.url().nullable();
export const yearSchema = z.number().int().min(2000).max(2100);
export const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format. Expected HH:MM.");

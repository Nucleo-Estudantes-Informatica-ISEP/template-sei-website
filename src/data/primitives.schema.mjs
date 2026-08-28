import { z } from "zod";

export const publicAssetPath = z.string().startsWith("/");
export const absoluteUrl = z.url();
export const optionalUrl = z.url().nullable();

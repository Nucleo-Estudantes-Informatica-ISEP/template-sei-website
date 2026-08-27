import { z } from "zod";

const publicAssetPath = z.string().startsWith("/");
const absoluteUrl = z.url();

export const historySchema = z.array(
    z.object({
        year: z.number().int().min(2000).max(2100),
        banner: publicAssetPath,
        url: absoluteUrl,
        alt: z.string().min(1),
    })
);
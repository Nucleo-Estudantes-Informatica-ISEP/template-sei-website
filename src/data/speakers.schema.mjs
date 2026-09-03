import { z } from "zod";
import { absoluteUrl, publicAssetPath } from "./primitives.schema.mjs";

const speakerLinkSchema = z.object({
  label: z.string().min(1),
  url: absoluteUrl,
});

export const speakerSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  photo: publicAssetPath.optional(),
  links: z.array(speakerLinkSchema).default([]),
});

export const speakersSchema = z.array(speakerSchema).min(1);

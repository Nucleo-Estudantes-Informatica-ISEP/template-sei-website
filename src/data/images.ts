/**
 * SEI — asset registry
 * Maps stable string keys to imported Astro assets. Content files reference
 * images by key (never by path), so swapping art never touches data files.
 */
import type { ImageMetadata } from "astro";

import banner from "../assets/banner.png";
import logoIcon from "../assets/logo-icon.png";
import deiLogo from "../assets/dei-logo.png";
import neiLogo from "../assets/nei-logo.png";
import isepLogo from "../assets/isep-logo.png";
import isepLogoWeb from "../assets/isep-logo-web.png";
import sponsor from "../assets/sponsor.png";

export const imageRegistry = {
  banner,
  logoIcon,
  deiLogo,
  neiLogo,
  isepLogo,
  isepLogoWeb,
  sponsor,
} as const satisfies Record<string, ImageMetadata>;

export type ImageKey = keyof typeof imageRegistry;

export const imageKeys = Object.keys(imageRegistry) as ImageKey[];

/** Resolve a data key into an Astro asset (undefined when missing). */
export function resolveImage(
  key: string | undefined,
): ImageMetadata | undefined {
  if (!key) return undefined;
  return imageRegistry[key as ImageKey];
}

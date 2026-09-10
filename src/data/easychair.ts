import * as cheerio from "cheerio";
import type { z } from "zod";
import { programSchema } from "./program.schema.mjs";

type ProgramConfig = z.infer<typeof programSchema>;

interface RawItem {
  time: string;
  title: string;
  kind: "session" | "break";
  tag?: string;
  chair?: string;
  room?: string;
}

const FETCH_TIMEOUT_MS = 8_000;

function cleanTitle(rawTitle: string): string {
  return rawTitle
    .replace(/^Session\s+[0-9A-Za-z]+\s*:?\s*/i, "")
    .trim()
    .replace(/^["“](.+)["”]$/, "$1")
    .trim();
}

function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function detectTag(title: string): string | undefined {
  if (/keynote/i.test(title)) return "Keynote";
  if (/round\s*table|panel/i.test(title)) return "Panel";
  return undefined;
}

/**
 * EasyChair's Smart Program page is plain server-rendered HTML (see
 * https://easychair.org/smart-program/<CONF>/ for a single-day event —
 * that index page IS the full schedule, no JS/API involved). Each
 * `.session` div is either a coffeebreak/lunchbreak marker or a real
 * session with a `.heading .interval` + `.heading .title`, and
 * (usually) a `.session_chair .chair_names` and `.room .room_name`.
 *
 * Parallel tracks (e.g. "Session 4A" / "Session 4B") share the same
 * interval and are kept as separate rows rather than collapsed — the
 * UI distinguishes `kind: "session"` rows from `kind: "break"` ones,
 * not "how many things happened at this time".
 */
export function parseEasyChairProgram(html: string): {
  morning: RawItem[];
  afternoon: RawItem[];
} {
  const $ = cheerio.load(html);

  const items: RawItem[] = [];
  let lunchIndex = -1;

  $(".session").each((_, el) => {
    const $el = $(el);
    const coffee = $el.children(".coffeebreak").first();
    const lunch = $el.children(".lunchbreak").first();
    const breakEl = coffee.length ? coffee : lunch.length ? lunch : null;

    if (breakEl) {
      const time = breakEl
        .find(".interval")
        .first()
        .text()
        .trim()
        .split("-")[0]
        .trim();
      const title = coffee.length ? "Coffee break" : "Lunch break";
      if (!time) return;
      if (title === "Lunch break") lunchIndex = items.length;
      items.push({ time, title, kind: "break" });
      return;
    }

    const heading = $el.find(".heading").first();
    const interval = heading.find(".interval").first().text().trim();
    const rawTitle = heading.find(".title").first().text().trim();
    if (!interval || !rawTitle) return;

    const time = interval.split("-")[0].trim();
    const title = cleanTitle(rawTitle);
    const tag = detectTag(title);
    const chair = collapseWhitespace(
      $el.find(".session_chair .chair_names").first().text(),
    );
    const room = collapseWhitespace(
      $el.find(".room .room_name").first().text(),
    );

    items.push({
      time,
      title,
      kind: "session",
      ...(tag && { tag }),
      ...(chair && { chair }),
      ...(room && { room }),
    });
  });

  if (items.length === 0) {
    throw new Error("No .session entries found on the EasyChair program page");
  }

  const splitAt = lunchIndex >= 0 ? lunchIndex + 1 : items.length;
  const morning = items.slice(0, splitAt);
  const afternoon = items.slice(splitAt);

  if (morning.length === 0 || afternoon.length === 0) {
    throw new Error(
      "Could not split the EasyChair program into morning/afternoon (no lunch break found)",
    );
  }

  return { morning, afternoon };
}

export async function fetchEasyChairProgram(
  url: string,
): Promise<ProgramConfig> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`EasyChair program fetch failed: HTTP ${response.status}`);
  }
  const html = await response.text();
  return parseEasyChairProgram(html);
}

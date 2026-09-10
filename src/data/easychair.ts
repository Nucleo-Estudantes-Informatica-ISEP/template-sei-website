import * as cheerio from "cheerio";
import type { z } from "zod";
import { programSchema } from "./program.schema.mjs";

type ProgramConfig = z.infer<typeof programSchema>;

const FETCH_TIMEOUT_MS = 8_000;

interface RawSession {
  interval: string;
  title: string;
  isBreak: boolean;
}

function toRoman(n: number): string {
  const table: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  let remaining = n;
  for (const [value, symbol] of table) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result || String(n);
}

function cleanTitle(rawTitle: string): string {
  return rawTitle
    .replace(/^Session\s+[0-9A-Za-z]+\s*:?\s*/i, "")
    .trim()
    .replace(/^["“](.+)["”]$/, "$1")
    .trim();
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
 * session with a `.heading .interval` + `.heading .title`.
 */
export function parseEasyChairProgram(html: string): ProgramConfig {
  const $ = cheerio.load(html);

  const raw: RawSession[] = [];
  $(".session").each((_, el) => {
    const $el = $(el);
    const coffee = $el.children(".coffeebreak").first();
    const lunch = $el.children(".lunchbreak").first();
    const breakEl = coffee.length ? coffee : lunch.length ? lunch : null;

    if (breakEl) {
      raw.push({
        interval: breakEl.find(".interval").first().text().trim(),
        title: coffee.length ? "Coffee break" : "Lunch break",
        isBreak: true,
      });
      return;
    }

    const heading = $el.find(".heading").first();
    const interval = heading.find(".interval").first().text().trim();
    const title = heading.find(".title").first().text().trim();
    if (interval && title) {
      raw.push({ interval, title, isBreak: false });
    }
  });

  if (raw.length === 0) {
    throw new Error("No .session entries found on the EasyChair program page");
  }

  // Group consecutive sessions that share the same time interval — those
  // are parallel tracks (e.g. "Session 4A" / "Session 4B") and collapse
  // into a single overview row, since this page shows a summary, not the
  // full per-track detail (that's what the EasyChair link itself is for).
  const groups: RawSession[][] = [];
  for (const session of raw) {
    const last = groups.at(-1);
    if (last && last[0].interval === session.interval) {
      last.push(session);
    } else {
      groups.push([session]);
    }
  }

  const items: { time: string; title: string; desc?: string; tag?: string }[] =
    [];
  let parallelGroupCount = 0;
  let lunchIndex = -1;

  groups.forEach((group, i) => {
    const time = group[0].interval.split("-")[0].trim();

    if (group[0].isBreak) {
      items.push({ time, title: group[0].title });
      if (group[0].title === "Lunch break") lunchIndex = i;
      return;
    }

    if (group.length > 1) {
      parallelGroupCount += 1;
      items.push({
        time,
        title: `Paper sessions ${toRoman(parallelGroupCount)}`,
        desc: `${group.length} parallel peer-reviewed sessions.`,
      });
      return;
    }

    const title = cleanTitle(group[0].title);
    const tag = detectTag(title);
    items.push({ time, title, ...(tag && { tag }) });
  });

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

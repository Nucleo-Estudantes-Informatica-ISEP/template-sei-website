import type { Lang } from "@/i18n/translations";

// Parses as UTC midnight and formats in UTC — a date-only ISO string
// (`"2026-04-10"`) must render the same calendar day regardless of the
// build machine's local timezone.
export function formatDate(
  date: string | null,
  lang: Lang,
  fallback: string,
): string {
  if (!date) return fallback;
  return new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

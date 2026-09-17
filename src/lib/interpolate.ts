export function interpolate(
  text: string,
  vars: Record<string, string>,
): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}

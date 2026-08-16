/**
 * SEI — important dates for the current edition.
 * `highlight` marks the single most urgent date (pulse + accent).
 */
import type { ImportantDateInput } from "./schemas";

export const importantDates: ImportantDateInput[] = [
  {
    label: "Submissão de artigos",
    description:
      "São aceites artigos originais em português, espanhol ou inglês.",
    range: { from: new Date("2026-10-16"), to: new Date("2026-11-02") },
  },
  {
    label: "Notificação de aceitação",
    range: { from: new Date("2026-11-09"), to: new Date("2026-11-16") },
  },
  {
    label: "Submissão da versão final",
    description: "Versão final, incorporando as sugestões dos revisores.",
    range: { from: new Date("2026-11-23"), to: new Date("2026-11-30") },
  },
  {
    label: "Prazo de inscrição",
    description: "A entrada é gratuita — mas a inscrição é obrigatória.",
    range: { at: new Date("2026-12-04") },
    highlight: true,
  },
  {
    label: "Simpósio",
    description:
      "Um dia completo de keynotes, sessões de artigos e networking.",
    range: { at: new Date("2026-12-08") },
    href: "/program/",
  },
];

/**
 * SEI — registration details.
 * `qrPayload` is the URL encoded into the QR code on the registration page.
 */
import type { RegistrationInput } from "./schemas";

export const registration: RegistrationInput = {
  intro: [
    "A participação no SEI é gratuita, mas a inscrição é obrigatória para garantir o seu lugar e o respetivo crachá.",
    "Registe-se através da plataforma externa abaixo até ao encerramento do prazo. Os autores com artigos aceites devem igualmente inscrever-se.",
  ],
  notes: [
    "Entrada gratuita — inscrição obrigatória.",
    "Autores que apresentem artigos aceites devem inscrever-se.",
    "As inscrições encerram a 4 de dezembro de 2026.",
  ],
  feeLabel: "Gratuito",
  deadline: new Date("2026-12-04"),
  cta: {
    label: "Inscrever aqui",
    url: "https://forms.office.com/e/GFeneUqpPF",
  },
  qrPayload: "https://forms.office.com/e/GFeneUqpPF",
  qrAlt: "Código QR de ligação ao formulário de inscrição do SEI’26",
};

/**
 * SEI — photo gallery.
 * Add an `image` key once photos exist; until then each item renders
 * generated placeholder art (the system stays visually designed).
 */
import type { PhotoInput } from "./schemas";

export const photos: PhotoInput[] = [
  {
    alt: "Palco da sessão plenária durante o SEI",
    caption: "Sessão Plenária / Keynote",
  },
  { alt: "Apresentação de artigos científicos", caption: "Sessões de Artigos" },
  {
    alt: "Audiência e participantes durante a mesa-redonda",
    caption: "Mesa-Redonda",
  },
  {
    alt: "Momento de networking e coffee break",
    caption: "Pausa para Café e Networking",
  },
  {
    alt: "Fotografia de grupo da comunidade SEI",
    caption: "Fotografia de Grupo",
  },
  {
    alt: "Sessão de encerramento e entrega do prémio de melhor artigo",
    caption: "Encerramento e Prémios",
  },
];

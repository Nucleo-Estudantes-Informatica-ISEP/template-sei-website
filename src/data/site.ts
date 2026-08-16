/**
 * SEI — site identity & global configuration.
 * Edit this file to move the template to a new edition.
 */
import type { SiteInput } from "./schemas";

export const site: SiteInput = {
  name: "Simpósio de Engenharia Informática",
  shortName: "SEI",

  /* Current edition */
  editionYear: 2026,
  editionNumber: 8,
  editionLabel: "SEI’26",

  tagline: "Onde estudantes, investigadores e a indústria se encontram.",
  description:
    "SEI — Simpósio de Engenharia Informática é o simpósio anual de Engenharia Informática do ISEP. Um dia completo de keynotes, apresentações de artigos e debate sobre a investigação e prática na área.",

  dateLabel: "8 de dezembro de 2026",
  location: "ISEP — Porto, Portugal",

  hero: {
    kicker: "SEI’26 · 8.ª edição",
    title: "Simpósio de Engenharia Informática",
    lead: "Um dia completo para partilhar, debater e refletir sobre a investigação, desenvolvimentos e práticas em Engenharia Informática — com oradores convidados, sessões de artigos com revisão por pares e um espaço desenhado para a conversa.",
    primaryCta: { label: "Inscrição", url: "/registration/" },
    secondaryCta: { label: "Submeter um artigo", url: "/submit/" },
  },

  banner: {
    alt: "Banner do evento SEI’26",
    caption: "SEI’26 — 8.ª edição",
  },

  about: {
    paragraphs: [
      "Fiel às suas raízes, o SEI traz ao palco estudantes e profissionais da área de Engenharia Informática para partilhar, debater e refletir sobre a investigação, os desenvolvimentos e as práticas nesta área.",
      "Nascido e organizado no ISEP, o simpósio é o ponto de encontro entre a comunidade académica — estudantes de licenciatura, mestrado e doutoramento — e os profissionais que moldam a indústria. As submissões são revistas por pares, publicadas e apresentadas num único e intenso dia.",
    ],
    stats: [
      { value: "8", label: "edições" },
      { value: "20+", label: "áreas temáticas" },
      { value: "40+", label: "membros das comissões" },
      { value: "100%", label: "presencial" },
    ],
  },

  /* Dynamic / urgent information shown on the home page. */
  highlight: {
    title: "Inscrições abertas",
    body: "A participação é gratuita, mas a inscrição é obrigatória. A aceitação de artigos decorre através do EasyChair até 2 de novembro de 2026.",
    cta: { label: "Inscreva-se aqui", url: "/registration/" },
  },

  nav: [
    { label: "Início", href: "/" },
    { label: "Programa", href: "/program/" },
    { label: "Oradores", href: "/speakers/" },
    { label: "Comissões", href: "/committees/" },
    { label: "Submissões", href: "/submit/" },
    { label: "Inscrição", href: "/registration/" },
    { label: "Histórico", href: "/history/" },
  ],

  footer: {
    blurb:
      "O simpósio anual de Engenharia Informática do ISEP — organizado pelo DEI e NEI.",
    address:
      "Instituto Superior de Engenharia do Porto\nRua Dr. António Bernardino de Almeida, 431\n4249-015 Porto, Portugal",
    contacts: [
      { label: "sei@dei.isep.ipp.pt", url: "mailto:sei@dei.isep.ipp.pt" },
      { label: "DEI — ISEP", url: "https://www.dei.isep.ipp.pt/" },
      { label: "NEI-ISEP", url: "https://www.nei-isep.org/" },
      { label: "ISEP", url: "https://www.isep.ipp.pt/" },
    ],
    socials: [],
  },
};

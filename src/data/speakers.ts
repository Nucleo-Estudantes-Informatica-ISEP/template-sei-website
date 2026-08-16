/**
 * SEI — invited speakers.
 * Set `status: "pending"` for speakers still to be confirmed.
 * An empty array renders the page’s empty state.
 */
import type { SpeakerInput } from "./schemas";

export const speakers: SpeakerInput[] = [
  {
    name: "Hugo Ferreira",
    role: "Orador Principal (Keynote)",
    affiliation: "Ethiack",
    bio: "Diretor de Operações de Hacking na Ethiack e docente no ISTEC-Porto, com mais de sete anos de experiência em segurança informática. Entusiasta de engenharia social e hacking ético, liderou Live Hacking Events, publicou CVEs e gere equipas dedicadas a encontrar vulnerabilidades em organizações para que possam ser mitigadas antes de serem exploradas.",
    links: [
      { label: "Ethiack", url: "https://www.ethiack.com/" },
      { label: "LinkedIn", url: "https://www.linkedin.com/" },
    ],
    status: "confirmed",
  },
  {
    name: "Pedro Pinto",
    role: "Moderador da Mesa-Redonda",
    affiliation: "ISEP",
    bio: "Professor Adjunto no ISEP e investigador no GECAD e INESC TEC. Antigo DPO e diretor do Mestrado em Cibersegurança no IPVC. Os seus interesses abrangem telecomunicações, redes e sistemas, cibersegurança, proteção de dados e privacidade, contando com distinções em programas de recompensas por vulnerabilidades e colaborações como perito para a Procuradoria-Geral da República e para a Comissão Europeia.",
    links: [{ label: "ISEP", url: "https://www.isep.ipp.pt/" }],
    status: "confirmed",
  },
  {
    name: "Rui Moura",
    role: "Orador Convidado",
    affiliation: "Critical TechWorks",
    bio: "Especialista em cibersegurança, soluções avançadas e gestão de projetos. Liderou projetos globais de grande escala em identificação eletrónica, ePassports e segurança da informação na Europa, Ásia, África e Américas, liderando atualmente a área de Cyber Security and Infrastructure na Critical TechWorks no Porto.",
    links: [
      {
        label: "Critical TechWorks",
        url: "https://www.criticaltechworks.com/",
      },
    ],
    status: "confirmed",
  },
  {
    name: "A anunciar brevemente",
    role: "Orador Convidado",
    affiliation: "ISEP",
    bio: "Esta sessão será anunciada assim que a confirmação do orador for concluída. Acompanhe as novidades nos canais oficiais do SEI.",
    links: [],
    status: "pending",
  },
];

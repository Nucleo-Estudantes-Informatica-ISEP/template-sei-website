/**
 * SEI — committees.
 * Long lists are rendered with search + alphabetical grouping, so feel free
 * to add every member here.
 */
import type { CommitteeInput } from "./schemas";

export const committees: CommitteeInput[] = [
  {
    id: "technical",
    title: "Comissão Técnico-Científica",
    description:
      "Investigadores e docentes responsáveis pela revisão e avaliação de todos os artigos submetidos.",
    members: [
      { name: "Alexandre Gouveia", institution: "ISEP" },
      { name: "Álvaro Rocha", institution: "ISEG" },
      { name: "Ana Rita Teixeira", institution: "ISEP" },
      { name: "Anabela Serrano", institution: "ISCAP" },
      { name: "Augusto Sousa", institution: "FEUP" },
      { name: "Bertil Marques", institution: "ISEP" },
      { name: "Catarina Oliveira", institution: "ISEP" },
      { name: "Emanuel Silva", institution: "ISEP" },
      { name: "Fátima Leal", institution: "UPT" },
      { name: "Fátima Rodrigues", institution: "ISEP" },
      { name: "Helder Pinto", institution: "ISTEC" },
      { name: "João Pascoal Faria", institution: "FEUP" },
      { name: "Jorge Duarte", institution: "ISEP" },
      { name: "José Marinho", institution: "ISEP" },
      { name: "Luís Alves", institution: "IPB" },
      { name: "Marílio Cardoso", institution: "ISEP" },
      { name: "Mário Cruz", institution: "ESE" },
      { name: "Mário Pinto", institution: "ESMAD" },
      { name: "Nuno Bettencourt", institution: "ISEP" },
      { name: "Orlando Sousa", institution: "ISEP" },
      { name: "Paula Quadros Flores", institution: "ESE" },
      { name: "Paula Tavares", institution: "ISEP" },
      { name: "Paulo Baltarejo", institution: "ISEP" },
      { name: "Paulo Maio", institution: "ISEP" },
      { name: "Paulo Proença", institution: "ISEP" },
      { name: "Pedro Pinto", institution: "ISEP" },
      { name: "Piedade Carvalho", institution: "ISEP" },
      { name: "Raquel Faria", institution: "ISEP" },
      { name: "Rosa Reis", institution: "ISEP" },
      { name: "Rui Marques", institution: "ISEP" },
      { name: "Sérgio Moreira", institution: "ISEP" },
      { name: "Tânia Rocha", institution: "UTAD" },
      { name: "Telmo Matos", institution: "FEUP" },
      { name: "Teresa Terroso", institution: "ESMAD" },
    ],
  },
  {
    id: "organizing",
    title: "Comissão Organizadora",
    description:
      "A equipa responsável pela coordenação do simpósio, desde o programa à logística.",
    members: [
      { name: "Carolina Sá", institution: "NEI-ISEP" },
      { name: "Catarina Oliveira", institution: "ISEP" },
      { name: "Emanuel Silva", institution: "ISEP" },
      { name: "Marílio Cardoso", institution: "ISEP" },
      { name: "Nuno Morgado", institution: "ISEP" },
      { name: "Paulo Proença", institution: "ISEP" },
      { name: "Piedade Carvalho", institution: "ISEP" },
      { name: "Rafael Vieira", institution: "NEI-ISEP" },
      { name: "Ricardo Meireles", institution: "NEI-ISEP" },
      { name: "Sérgio Moreira", institution: "ISEP" },
    ],
  },
];

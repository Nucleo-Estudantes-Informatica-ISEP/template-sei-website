/**
 * SEI — program & gallery.
 */
import type { ProgramInput } from "./schemas";

export const program: ProgramInput = {
  intro:
    "Um dia único e intenso de keynotes, sessões de artigos com revisão por pares e conversa. O programa abaixo é o resumo; o horário completo com todas as apresentações está disponível no EasyChair.",
  dayLabel: "Terça-feira, 8 de dezembro · ISEP, Porto",
  fullProgram: {
    label: "Programa completo",
    url: "https://easychair.org/smart-program/SEI25/",
  },
  blocks: [
    {
      time: "08:30",
      title: "Registo e welcome coffee",
      type: "registration",
    },
    {
      time: "09:15",
      title: "Sessão de abertura",
      detail: "Discurso de boas-vindas e apresentação do simpósio.",
      type: "session",
    },
    {
      time: "09:45",
      title: "Keynote",
      detail: "Keynote de um orador convidado de referência na área.",
      type: "talk",
    },
    {
      time: "11:00",
      title: "Coffee break",
      type: "break",
    },
    {
      time: "11:30",
      title: "Sessões de artigos I",
      detail:
        "Apresentações de artigos com revisão por pares, em sessões paralelas.",
      type: "session",
    },
    {
      time: "13:00",
      title: "Pausa para almoço",
      type: "break",
    },
    {
      time: "14:15",
      title: "Sessões de artigos II",
      detail:
        "Apresentações de artigos com revisão por pares, em sessões paralelas.",
      type: "session",
    },
    {
      time: "16:00",
      title: "Mesa-redonda",
      detail:
        "Oradores convidados e membros das comissões debatem o futuro da área.",
      type: "talk",
    },
    {
      time: "17:15",
      title: "Prémio de melhor artigo e encerramento",
      detail: "Reconhecimento do melhor artigo e discurso de encerramento.",
      type: "closing",
    },
  ],
};

/**
 * SEI — submissions: topics, rules, process and review.
 */
import type { SubmissionsInput } from "./schemas";

export const submissions: SubmissionsInput = {
  intro: [
    "O SEI acolhe artigos originais abrangendo um amplo espectro de temas em Engenharia Informática. Os artigos são revistos por pares, apresentados no simpósio e publicados nas atas do evento.",
    "Os artigos aceites devem seguir o modelo LNCS e ser submetidos através do EasyChair antes do término do prazo.",
  ],

  topics: [
    { name: "Inteligência Artificial" },
    { name: "Ferramentas Computacionais para Trabalho Colaborativo" },
    { name: "Computação Gráfica, Visão e Aplicações" },
    { name: "Redes de Computadores" },
    { name: "Sistemas Críticos" },
    { name: "Sistemas de Apoio à Decisão" },
    { name: "Comércio Eletrónico" },
    { name: "Ferramentas Eletrónicas no Ensino e Aprendizagem" },
    { name: "Interação Pessoa-Computador" },
    { name: "Recuperação de Informação" },
    { name: "Segurança da Informação" },
    { name: "Sistemas de Informação" },
    { name: "Internet das Coisas (IoT)" },
    { name: "Técnicas e Paradigmas de Programação" },
    { name: "Robótica e Automação Industrial Inteligente" },
    { name: "Jogos Sérios (Serious Games)" },
    { name: "Modelagem e Simulação" },
    { name: "Arquitetura e Desenvolvimento de Software" },
    { name: "Qualidade de Software" },
  ],

  callForPapers: [
    {
      title: "Idiomas",
      body: "O SEI aceita submissões de artigos originais em português, espanhol ou inglês.",
    },
    {
      title: "Extensão",
      body: "Cada artigo deve ter no mínimo 6 e no máximo 10 páginas A4.",
    },
    {
      title: "Primeiro autor",
      body: "O primeiro autor de cada artigo deve ser estudante — de Licenciatura, Mestrado, Doutoramento ou outro nível do ensino superior.",
    },
    {
      title: "Formato",
      body: "As submissões devem seguir o template oficial LNCS e ser enviadas em formato PDF.",
    },
    {
      title: "Anonimato",
      body: "Os nomes dos autores, afiliações e auto-referências não devem constar na versão inicial — apenas na versão final (camera-ready).",
    },
  ],

  steps: [
    {
      title: "Descarregar o template",
      body: "Obtenha o template oficial LNCS e formate o seu artigo de acordo com as diretrizes.",
    },
    {
      title: "Preparar a versão anónima",
      body: "Remova qualquer informação que possa identificar os autores para revisão cega.",
    },
    {
      title: "Submeter através do EasyChair",
      body: "Crie ou inicie sessão na sua conta EasyChair, selecione “New Submission” e preencha o formulário.",
    },
    {
      title: "Carregar e confirmar",
      body: "Envie o ficheiro PDF e submeta. Receberá um e-mail de confirmação de submissão.",
    },
    {
      title: "Receber a revisão",
      body: "Os autores serão notificados sobre a decisão; artigos aceites requerem o envio da versão final até à data limite.",
    },
  ],

  review: [
    {
      title: "Duplamente cego",
      body: "Todos os artigos são submetidos a um processo de revisão por pares duplamente cego.",
    },
    {
      title: "Notificação",
      body: "Os autores correspondentes são notificados sobre o resultado da revisão e a decisão final.",
    },
    {
      title: "Versão final (Camera-ready)",
      body: "Os artigos aceites devem incorporar as recomendações dos revisores até ao prazo estipulado.",
    },
    {
      title: "Verificação final",
      body: "Se as sugestões não forem cumpridas na versão final, a Comissão Técnico-Científica reserva-se o direito de excluir o artigo.",
    },
  ],

  platform: {
    label: "Submeter no EasyChair",
    url: "https://easychair.org/conferences?conf=sei25",
  },

  contactEmail: "sei@dei.isep.ipp.pt",

  template: {
    label: "Template LNCS",
    url: "https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines",
  },
};

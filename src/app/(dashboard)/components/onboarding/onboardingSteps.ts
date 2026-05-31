// src/components/onboarding/onboardingSteps.ts
import { HighlightStep } from "./OnboardingHighlight"

// Steps para o Dashboard
export const dashboardSteps: HighlightStep[] = [
  {
    id: 1,
    title: "Bem-vindo ao Dashboard!",
    description: "Aqui você visualiza todas as métricas do seu negócio em tempo real.",
    selector: ".stats-cards-container",
    tips: ["Acompanhe suas receitas, despesas e lucro diariamente."]
  },
  {
    id: 2,
    title: "Filtros de Período",
    description: "Use os filtros para analisar dados de hoje, mês ou ano.",
    selector: ".period-filters",
    tips: ["Experimente filtrar por diferentes períodos para ver a evolução."]
  },
  {
    id: 3,
    title: "Metas do Negócio",
    description: "Acompanhe o progresso das suas metas de faturamento, despesas e lucro.",
    selector: ".metas-container",
    tips: ["Clique nas metas para configurar novos valores."]
  },
  {
    id: 4,
    title: "Gráfico Financeiro",
    description: "Visualize a evolução das suas receitas e despesas ao longo do tempo.",
    selector: ".finance-chart",
    tips: ["Passe o mouse sobre as linhas para ver detalhes."]
  },
  {
    id: 5,
    title: "Ações Rápidas",
    description: "Acesse rapidamente as principais funcionalidades do sistema.",
    selector: ".quick-actions",
    tips: ["Use estes botões para lançar vendas, criar fichas ou adicionar produtos."]
  }
]

// Steps para o Planejamento
export const planejamentoSteps: HighlightStep[] = [
  {
    id: 1,
    title: "Planejamento Financeiro",
    description: "Gerencie suas despesas fixas, variáveis e metas.",
    selector: ".planejamento-container",
    action: {
      label: "Entendi",
      onClick: () => {}
    }
  },
  {
    id: 2,
    title: "Despesas Fixas",
    description: "Configure suas despesas mensais como aluguel, energia, internet, etc.",
    selector: ".despesas-fixas-table",
    action: {
      label: "Configurar",
      href: "/planejamento/editar/despesas-fixas"
    },
    tips: ["Adicione todas as despesas fixas do seu negócio."]
  },
  {
    id: 3,
    title: "Despesas Variáveis",
    description: "Configure as taxas de cartão e aluguel de maquininhas.",
    selector: ".despesas-variaveis-card",
    action: {
      label: "Configurar",
      href: "/planejamento/editar/despesas-variaveis"
    },
    tips: ["Configure as taxas de débito, crédito e voucher."]
  },
  {
    id: 4,
    title: "Funcionários",
    description: "Cadastre seus funcionários e configure provisões.",
    selector: ".folha-salarial-table",
    action: {
      label: "Configurar",
      href: "/planejamento/editar/funcionarios"
    },
    tips: ["Adicione todos os funcionários com seus salários."]
  },
  {
    id: 5,
    title: "Metas Mensais",
    description: "Defina metas de faturamento para cada mês.",
    selector: ".metas-mensais-table",
    action: {
      label: "Configurar",
      href: "/planejamento/editar/metas-mensais"
    },
    tips: ["Defina metas realistas baseadas no histórico."]
  }
]
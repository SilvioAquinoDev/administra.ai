// src/app/(dashboard)/planejamento/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  Users, 
  CreditCard,
  BarChart3,
  Settings,
  Percent,
  Calculator,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatCurrency, formatPercentage } from "@/lib/utils"

// Tipos
interface Indicadores {
  markUp: number
  despesasFixas: number
  despesasVariaveis: number
  cmv: number
  lucroDesejado: number
}

interface MetaMensal {
  mes: number
  metaDiariaAlmoco: number
  metaDiariaJanta: number
  diasTrabalhados: number
}

interface Acompanhamento {
  mes: number
  faturamentoAlmoco: number
  faturamentoJanta: number
  faturamentoTotal: number
}

export default function PlanejamentoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [indicadores, setIndicadores] = useState<Indicadores>({
    markUp: 0,
    despesasFixas: 0,
    despesasVariaveis: 0,
    cmv: 0,
    lucroDesejado: 15
  })
  const [metaMensal, setMetaMensal] = useState<MetaMensal | null>(null)
  const [acompanhamento, setAcompanhamento] = useState<Acompanhamento | null>(null)
  const [totalFixas, setTotalFixas] = useState(0)
  const [totalVariaveisPct, setTotalVariaveisPct] = useState(0)

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      const mesAtual = new Date().getMonth() + 1
      const anoAtual = new Date().getFullYear()

      // Carregar metas do mês atual
      const metasResponse = await fetch(`/api/planejamento/metas?ano=${anoAtual}&mes=${mesAtual}`)
      const metasData = await metasResponse.json()
      if (metasData.success) {
        setMetaMensal(metasData.data)
      }

      // Carregar acompanhamento
      const acompanhamentoResponse = await fetch(`/api/planejamento/acompanhamento?ano=${anoAtual}&mes=${mesAtual}`)
      const acompanhamentoData = await acompanhamentoResponse.json()
      if (acompanhamentoData.success) {
        setAcompanhamento(acompanhamentoData.data)
      }

      // Carregar despesas fixas
      const fixasResponse = await fetch(`/api/planejamento/despesas-fixas?ano=${anoAtual}`)
      const fixasData = await fixasResponse.json()
      if (fixasData.success) {
        const total = fixasData.dados.reduce((sum: number, item: any) => sum + (item.valor || 0), 0)
        setTotalFixas(total)
      }

      // Carregar despesas variáveis
      const variaveisResponse = await fetch(`/api/planejamento/despesas-variaveis?ano=${anoAtual}`)
      const variaveisData = await variaveisResponse.json()
      if (variaveisData.success) {
        const totalPct = variaveisData.dados.reduce((sum: number, item: any) => sum + (item.percentual || 0), 0)
        setTotalVariaveisPct(totalPct)
      }

      // Calcular indicadores
      calcularIndicadores()
      
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  function calcularIndicadores() {
    // Baseado nos percentuais do sistema original
    const pctFixas = (totalFixas / 30000) * 100 // Considerando faturamento base de R$30k
    const pctVariaveis = totalVariaveisPct
    const lucro = indicadores.lucroDesejado
    const cmvCalculado = 100 - (pctFixas + pctVariaveis + lucro)
    const markUpCalculado = 100 / cmvCalculado

    setIndicadores({
      ...indicadores,
      despesasFixas: pctFixas,
      despesasVariaveis: pctVariaveis,
      cmv: cmvCalculado,
      markUp: markUpCalculado
    })
  }

  const metaMensalAlmoco = metaMensal ? metaMensal.metaDiariaAlmoco * metaMensal.diasTrabalhados : 0
  const metaMensalJanta = metaMensal ? metaMensal.metaDiariaJanta * metaMensal.diasTrabalhados : 0
  const metaTotal = metaMensalAlmoco + metaMensalJanta
  
  const realAlmoco = acompanhamento?.faturamentoAlmoco || 0
  const realJanta = acompanhamento?.faturamentoJanta || 0
  const realTotal = realAlmoco + realJanta
  const percentualMeta = metaTotal > 0 ? (realTotal / metaTotal) * 100 : 0

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Planejamento Financeiro</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie metas, despesas e indicadores do seu negócio
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/planejamento/metas-mensais")}>
            <Target className="mr-2 h-4 w-4" />
            Metas
          </Button>
          <Button variant="outline" onClick={() => router.push("/planejamento/taxas-cartao")}>
            <CreditCard className="mr-2 h-4 w-4" />
            Taxas
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Meta Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metaTotal)}</div>
            <p className="text-xs opacity-90">Almoço: {formatCurrency(metaMensalAlmoco)} | Janta: {formatCurrency(metaMensalJanta)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-600 to-green-500 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Realizado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(realTotal)}</div>
            <p className="text-xs opacity-90">
              {percentualMeta.toFixed(0)}% da meta • {formatCurrency(realTotal - metaTotal)} de diferença
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mark-Up</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{indicadores.markUp.toFixed(2)}x</div>
            <p className="text-xs opacity-90">Fator multiplicador para precificação</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-600 to-orange-500 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CMV Máximo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(indicadores.cmv)}</div>
            <p className="text-xs opacity-90">Custo com produção recomendado</p>
          </CardContent>
        </Card>
      </div>

      {/* Progresso da Meta */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso da Meta Mensal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Progresso atual</span>
            <span className="font-medium">{percentualMeta.toFixed(0)}% da meta</span>
          </div>
          <Progress value={percentualMeta} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Meta: {formatCurrency(metaTotal)}</span>
            <span>Realizado: {formatCurrency(realTotal)}</span>
            <span>Faltam: {formatCurrency(Math.max(0, metaTotal - realTotal))}</span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Configurações */}
      <Tabs defaultValue="indicadores" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="indicadores">
            <BarChart3 className="mr-2 h-4 w-4" />
            Indicadores
          </TabsTrigger>
          <TabsTrigger value="fixas">
            <DollarSign className="mr-2 h-4 w-4" />
            Despesas Fixas
          </TabsTrigger>
          <TabsTrigger value="variaveis">
            <Percent className="mr-2 h-4 w-4" />
            Despesas Variáveis
          </TabsTrigger>
          <TabsTrigger value="funcionarios">
            <Users className="mr-2 h-4 w-4" />
            Funcionários
          </TabsTrigger>
          <TabsTrigger value="configuracoes">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        {/* Indicadores */}
        <TabsContent value="indicadores">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição dos Custos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Despesas Fixas</span>
                      <span className="font-medium">{formatPercentage(indicadores.despesasFixas)}</span>
                    </div>
                    <Progress value={indicadores.despesasFixas} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Despesas Variáveis</span>
                      <span className="font-medium">{formatPercentage(indicadores.despesasVariaveis)}</span>
                    </div>
                    <Progress value={indicadores.despesasVariaveis} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CMV (Produção)</span>
                      <span className="font-medium">{formatPercentage(indicadores.cmv)}</span>
                    </div>
                    <Progress value={indicadores.cmv} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Lucro Desejado</span>
                      <span className="font-medium">{formatPercentage(indicadores.lucroDesejado)}</span>
                    </div>
                    <Progress value={indicadores.lucroDesejado} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análise de Saúde Financeira</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mark-Up</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{indicadores.markUp.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground">(Ideal: 2.0 - 3.5)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Despesas Fixas</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatPercentage(indicadores.despesasFixas)}</span>
                      <span className="text-xs text-muted-foreground">(Ideal: 30% - 45%)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Despesas Variáveis</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatPercentage(indicadores.despesasVariaveis)}</span>
                      <span className="text-xs text-muted-foreground">(Ideal: 5% - 15%)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CMV</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatPercentage(indicadores.cmv)}</span>
                      <span className="text-xs text-muted-foreground">(Ideal: 35% - 45%)</span>
                    </div>
                  </div>

                  <Alert className="mt-4" variant={percentualMeta >= 80 ? "success" : "warning"}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {percentualMeta >= 100 
                        ? "🎉 Meta de faturamento alcançada! Parabéns!" 
                        : percentualMeta >= 80 
                        ? "📈 Próximo da meta! Continue assim!"
                        : "⚠️ Atenção! Faturamento abaixo da meta. Reveja suas estratégias."}
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Despesas Fixas */}
        <TabsContent value="fixas">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Despesas Fixas</CardTitle>
              <Button onClick={() => router.push("/planejamento/despesas-fixas")}>
                Gerenciar
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Despesas fixas são custos que não variam com o faturamento, como aluguel, contas, salários, etc.
              </p>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total de Despesas Fixas:</span>
                <span className="text-primary">{formatCurrency(totalFixas)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Despesas Variáveis */}
        <TabsContent value="variaveis">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Despesas Variáveis</CardTitle>
              <Button onClick={() => router.push("/planejamento/despesas-variaveis")}>
                Gerenciar
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Despesas variáveis são custos que variam com o faturamento, como taxas de cartão, impostos, etc.
              </p>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total de Despesas Variáveis:</span>
                <span className="text-primary">{formatPercentage(totalVariaveisPct)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Funcionários */}
        <TabsContent value="funcionarios">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Folha Salarial</CardTitle>
              <Button onClick={() => router.push("/planejamento/funcionarios")}>
                Gerenciar
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gerencie os salários e provisões dos funcionários (13º, férias, FGTS, INSS Patronal)
              </p>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total da Folha + Encargos:</span>
                <span className="text-primary">{formatCurrency(totalFixas * 0.4)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações */}
        <TabsContent value="configuracoes">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => router.push("/planejamento/metas-mensais")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Metas Mensais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Defina metas de faturamento para cada mês do ano
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => router.push("/planejamento/taxas-cartao")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Taxas de Cartão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Configure taxas de cartão e aluguel de maquininhas
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => router.push("/planejamento/provisoes")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Provisões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Configure provisões da folha salarial (13º, férias, FGTS, INSS)
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
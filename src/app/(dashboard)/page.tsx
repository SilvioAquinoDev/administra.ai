// src/app/(dashboard)/dashboard/page.tsx
"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Store, Users, Package, DollarSign, TrendingUp, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatCurrency } from "@/lib/utils"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalFichas: 0,
    totalReceitas: 0,
    totalDespesas: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      carregarStats()
    }
  }, [session])

  async function carregarStats() {
    try {
      const [produtosRes, fichasRes, livroRes] = await Promise.all([
        fetch("/api/produtos?limit=1"),
        fetch("/api/fichas-tecnicas?limit=1"),
        fetch("/api/livro-diario/resumo/saldo")
      ])

      const produtosData = await produtosRes.json()
      const fichasData = await fichasRes.json()
      const livroData = await livroRes.json()

      setStats({
        totalProdutos: produtosData.total || 0,
        totalFichas: fichasData.total || 0,
        totalReceitas: livroData.total_entradas || 0,
        totalDespesas: livroData.total_saidas || 0
      })
    } catch (error) {
      console.error("Erro ao carregar stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const isInTrial = session?.user?.isInTrial
  const trialEndsAt = session?.user?.trialEndsAt ? new Date(session.user.trialEndsAt) : null
  const daysLeft = trialEndsAt ? Math.ceil((trialEndsAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Bem-vindo, {session?.user?.name || "Usuário"}!
          </p>
        </div>
      </div>

      {/* Trial Alert */}
      {isInTrial && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você está no período de teste gratuito. {daysLeft} dias restantes.
            {daysLeft <= 3 && " Assine um plano para continuar usando o sistema!"}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProdutos}</div>
            <p className="text-xs opacity-80">produtos cadastrados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-600 to-green-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fichas Técnicas</CardTitle>
            <Users className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFichas}</div>
            <p className="text-xs opacity-80">fichas cadastradas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalReceitas)}</div>
            <p className="text-xs opacity-80">total em receitas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-600 to-red-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <DollarSign className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalDespesas)}</div>
            <p className="text-xs opacity-80">total em despesas</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" onClick={() => router.push("/nfe")}>
              Lançar Nova Venda
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/fichas-tecnicas/nova")}>
              Criar Ficha Técnica
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/nfe/produtos/novo")}>
              Adicionar Produto
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status da assinatura:</span>
              <span className="font-medium">
                {isInTrial ? "Período de teste" : session?.user?.subscriptionStatus === "active" ? "Ativa" : "Expirada"}
              </span>
            </div>
            {isInTrial && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fim do teste:</span>
                <span className="font-medium">{trialEndsAt?.toLocaleDateString("pt-BR")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Versão do sistema:</span>
              <span className="font-medium">2.0.0</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
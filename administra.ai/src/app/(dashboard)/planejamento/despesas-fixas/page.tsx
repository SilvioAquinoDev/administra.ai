// src/app/(dashboard)/planejamento/despesas-fixas/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Save, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatCurrency } from "@/lib/utils"

interface DespesaFixa {
  id?: number
  nome: string
  valor: number
}

const DESPESAS_PADRAO: DespesaFixa[] = [
  { nome: "ALUGUEL", valor: 1200 },
  { nome: "CELPE", valor: 700 },
  { nome: "COMPESA", valor: 310 },
  { nome: "TELEFONE", valor: 112 },
  { nome: "INTERNET", valor: 70 },
  { nome: "CONTABILIDADE", valor: 350 },
  { nome: "SOFTWARE GESTAO", valor: 144.4 },
  { nome: "MANUT. BANCOS", valor: 99 },
  { nome: "PASSAGEM FUNCIN.", valor: 635 },
  { nome: "INSS", valor: 446 },
  { nome: "MERCANTIL", valor: 200 },
  { nome: "MAQUINETAS", valor: 120 },
  { nome: "CARRO", valor: 0 },
  { nome: "COMBUSTIVEL", valor: 200 },
  { nome: "BOMBEIROS", valor: 30 },
  { nome: "IPTU", valor: 150 },
  { nome: "ANOTAI", valor: 0 },
  { nome: "GAS", valor: 1330 },
  { nome: "CELULAR", valor: 20 },
  { nome: "PRO-LABORE", valor: 1500 }
]

export default function DespesasFixasPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [despesas, setDespesas] = useState<DespesaFixa[]>(DESPESAS_PADRAO)
  const [anoReferencia, setAnoReferencia] = useState(new Date().getFullYear())

  useEffect(() => {
    carregarDespesas()
  }, [anoReferencia])

  async function carregarDespesas() {
    try {
      const response = await fetch(`/api/planejamento/despesas-fixas?ano=${anoReferencia}`)
      const data = await response.json()
      if (data.success && data.dados && data.dados.length > 0) {
        setDespesas(data.dados)
      }
    } catch (error) {
      console.error("Erro ao carregar despesas:", error)
    } finally {
      setLoading(false)
    }
  }

  async function salvarDespesas() {
    setSaving(true)
    try {
      const response = await fetch("/api/planejamento/despesas-fixas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dados: despesas,
          ano: anoReferencia
        })
      })
      const data = await response.json()
      if (data.success) {
        alert("Despesas fixas salvas com sucesso!")
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Erro ao salvar:", error)
      alert("Erro ao salvar despesas fixas")
    } finally {
      setSaving(false)
    }
  }

  function resetarPadrao() {
    if (confirm("Tem certeza que deseja restaurar as despesas fixas padrão?")) {
      setDespesas([...DESPESAS_PADRAO])
    }
  }

  function adicionarDespesa() {
    setDespesas([...despesas, { nome: "Nova Despesa", valor: 0 }])
  }

  function removerDespesa(index: number) {
    if (despesas.length <= 1) {
      alert("Mantenha pelo menos uma despesa cadastrada!")
      return
    }
    const novasDespesas = [...despesas]
    novasDespesas.splice(index, 1)
    setDespesas(novasDespesas)
  }

  function atualizarDespesa(index: number, campo: keyof DespesaFixa, valor: string | number) {
    const novasDespesas = [...despesas]
    if (campo === "valor") {
      novasDespesas[index].valor = Number(valor) || 0
    } else {
      novasDespesas[index].nome = valor as string
    }
    setDespesas(novasDespesas)
  }

  const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Despesas Fixas</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie os custos fixos do seu negócio
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <select
            className="rounded-md border border-input px-3 py-2 text-sm"
            value={anoReferencia}
            onChange={(e) => setAnoReferencia(Number(e.target.value))}
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>
      </div>

      <Alert>
        <AlertDescription>
          Despesas fixas são custos que não variam com o faturamento, como aluguel, contas de luz/água, salários, etc.
          Os valores são rateados automaticamente: 73% para Almoço e 27% para Janta.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Despesas Fixas</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetarPadrao}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Restaurar Padrão
            </Button>
            <Button variant="outline" size="sm" onClick={adicionarDespesa}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="px-2 py-2 text-left">Despesa</th>
                      <th className="px-2 py-2 text-right">Valor Mensal (R$)</th>
                      <th className="px-2 py-2 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {despesas.map((despesa, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-2 py-2">
                          <Input
                            value={despesa.nome}
                            onChange={(e) => atualizarDespesa(index, "nome", e.target.value)}
                            className="h-8"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <Input
                            type="number"
                            step="10"
                            value={despesa.valor}
                            onChange={(e) => atualizarDespesa(index, "valor", e.target.value)}
                            className="h-8 text-right"
                          />
                        </td>
                        <td className="px-2 py-2 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removerDespesa(index)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t bg-gray-50">
                    <tr>
                      <td className="px-2 py-3 font-semibold">TOTAL</td>
                      <td className="px-2 py-3 text-right font-bold text-primary">
                        {formatCurrency(totalDespesas)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-6 flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
                <Button onClick={salvarDespesas} className="flex-1" disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Salvando..." : "Salvar Despesas Fixas"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
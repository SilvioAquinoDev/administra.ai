// src/app/(dashboard)/planejamento/despesas-variaveis/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, CreditCard, Percent } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatCurrency, formatPercentage } from "@/lib/utils"

interface DespesaVariavel {
  nome: string
  percentual: number
}

interface TaxasConfig {
  distribuicaoVendas: { debito: number; credito: number; voucher: number }
  distribuicaoMaquininhas: { infinitepay: number; stone: number; caixa: number }
  taxas: {
    debito: { infinitepay: number; stone: number; caixa: number }
    credito: { infinitepay: number; stone: number; caixa: number }
    voucher: number
  }
  aluguelMaquininhas: { stone1: number; stone2: number }
  manutencao: number
  simplesNacional: number
}

export default function DespesasVariaveisPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [taxas, setTaxas] = useState<TaxasConfig>({
    distribuicaoVendas: { debito: 40, credito: 50, voucher: 10 },
    distribuicaoMaquininhas: { infinitepay: 50, stone: 30, caixa: 20 },
    taxas: {
      debito: { infinitepay: 1.37, stone: 2.34, caixa: 4.48 },
      credito: { infinitepay: 3.15, stone: 6.44, caixa: 5.78 },
      voucher: 7.0
    },
    aluguelMaquininhas: { stone1: 59.90, stone2: 19.90 },
    manutencao: 1.0,
    simplesNacional: 8.0
  })
  const [resultados, setResultados] = useState({
    debitoMedia: 0,
    creditoMedia: 0,
    taxaMediaGeral: 0,
    aluguelTotal: 0,
    percentualAluguel: 0,
    totalDespesasVariaveis: 0
  })

  useEffect(() => {
    carregarConfig()
  }, [])

  async function carregarConfig() {
    try {
      const response = await fetch("/api/planejamento/taxas-cartao")
      const data = await response.json()
      if (data.success && data.config) {
        setTaxas(data.config)
      }
    } catch (error) {
      console.error("Erro ao carregar taxas:", error)
    } finally {
      setLoading(false)
    }
    calcularTaxas()
  }

  function calcularTaxas() {
    // Calcular taxa média de débito
    let taxaDebitoMedia = 0
    for (const [maquina, percentual] of Object.entries(taxas.distribuicaoMaquininhas)) {
      taxaDebitoMedia += taxas.taxas.debito[maquina as keyof typeof taxas.taxas.debito] * (percentual / 100)
    }

    // Calcular taxa média de crédito
    let taxaCreditoMedia = 0
    for (const [maquina, percentual] of Object.entries(taxas.distribuica
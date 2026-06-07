import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const data = searchParams.get('data')

    if (!data) {
      return NextResponse.json(
        { error: 'Data é obrigatória' },
        { status: 400 }
      )
    }

    // Divide a data no formato YYYY-MM-DD
    const [year, month, day] = data.split('-').map(Number)
    
    // Cria a data início e fim no timezone local (Brasil)
    // Para buscar no banco que está em UTC, precisamos converter
    const dataInicioLocal = new Date(year, month - 1, day, 0, 0, 0, 0)
    const dataFimLocal = new Date(year, month - 1, day, 23, 59, 59, 999)
    
    // Converte para UTC para fazer a query no banco
    const dataInicioUTC = new Date(dataInicioLocal.getTime() - (dataInicioLocal.getTimezoneOffset() * 60000))
    const dataFimUTC = new Date(dataFimLocal.getTime() - (dataFimLocal.getTimezoneOffset() * 60000))

    console.log('Data selecionada (local):', data)
    console.log('Buscando caixas entre (UTC):', dataInicioUTC.toISOString(), 'e', dataFimUTC.toISOString())

    // Buscar caixas abertos ou fechados na data selecionada
    const caixas = await prisma.caixaAbertura.findMany({
      where: {
        dataAbertura: {
          gte: dataInicioUTC,
          lte: dataFimUTC
        }
      },
      orderBy: {
        dataAbertura: 'desc'
      },
      include: {
        vendas: true,
        vendasManuais: true,
        retiradas: true,
        fechamento: true
      }
    })

    console.log('Caixas encontrados:', caixas.length)
    
    // Se não encontrou caixas, tenta buscar ignorando o horário (apenas pela data)
    if (caixas.length === 0) {
      console.log('Tentando busca alternativa...')
      
      // Busca todos os caixas e filtra por data no JavaScript
      const todosCaixas = await prisma.caixaAbertura.findMany({
        include: {
          vendas: true,
          vendasManuais: true,
          retiradas: true,
          fechamento: true
        }
      })
      
      // Filtra pela data no timezone local
      const caixasFiltrados = todosCaixas.filter(caixa => {
        const dataAbertura = new Date(caixa.dataAbertura)
        const dataAberturaLocal = new Date(dataAbertura.getTime() + (dataAbertura.getTimezoneOffset() * 60000))
        
        return dataAberturaLocal.getDate() === day && 
               dataAberturaLocal.getMonth() === month - 1 && 
               dataAberturaLocal.getFullYear() === year
      })
      
      if (caixasFiltrados.length > 0) {
        caixas.push(...caixasFiltrados)
        console.log('Encontrado via busca alternativa:', caixasFiltrados.length)
      }
    }

    if (!caixas || caixas.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Nenhum caixa encontrado para esta data' 
        },
        { status: 404 }
      )
    }

    // Pegar o primeiro caixa da data
    const caixa = caixas[0]
    console.log('Caixa selecionado:', { 
      id: caixa.id, 
      status: caixa.status, 
      dataAbertura: caixa.dataAbertura,
      dataAberturaLocal: new Date(caixa.dataAbertura).toLocaleString('pt-BR')
    })

    // Cálculos baseados no modal de fechar caixa
    const valorAbertura = caixa.valorInicial || 0
    
    // Vendas em dinheiro (sistema + manual)
    const vendasDinheiroSistema = caixa.vendas
      .filter(v => v.tipoPagamento === 'DINHEIRO')
      .reduce((total, v) => total + (v.valorTotal || 0), 0)
    
    const vendasDinheiroManuais = caixa.vendasManuais
      .filter(v => v.tipoPagamento === 'DINHEIRO')
      .reduce((total, v) => total + (v.valor || 0), 0)
    
    const vendasDinheiro = vendasDinheiroSistema + vendasDinheiroManuais

    // Totais gerais
    const totalVendasSistema = caixa.vendas.reduce((total, v) => total + (v.valorTotal || 0), 0)
    const totalVendasManuais = caixa.vendasManuais.reduce((total, v) => total + (v.valor || 0), 0)
    const totalGeralVendas = totalVendasSistema + totalVendasManuais

    const totalRetiradas = caixa.retiradas.reduce((total, r) => total + (r.valor || 0), 0)
    const saldoFinal = valorAbertura + vendasDinheiro - totalRetiradas

    // Vendas por tipo de pagamento
    const tiposPagamento = ['DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'VR', 'OUTRO']
    const vendasPorFormaPagamento: { [key: string]: number } = {}

    tiposPagamento.forEach(tipo => {
      const vendasSistema = caixa.vendas
        .filter(v => v.tipoPagamento === tipo)
        .reduce((total, v) => total + (v.valorTotal || 0), 0)
      
      const vendasManuaisTipo = caixa.vendasManuais
        .filter(v => v.tipoPagamento === tipo)
        .reduce((total, v) => total + (v.valor || 0), 0)
      
      vendasPorFormaPagamento[tipo] = vendasSistema + vendasManuaisTipo
    })

    // Montar resposta
    const dadosCaixa = {
      id: caixa.id,
      dataAbertura: caixa.dataAbertura.toISOString(),
      dataFechamento: caixa.fechamento?.dataFechamento?.toISOString(),
      valorAbertura: valorAbertura,
      observacao: caixa.observacao,
      status: caixa.status,
      
      // Resumo financeiro
      valor_abertura: valorAbertura,
      vendas_dinheiro: vendasDinheiro,
      total_vendas: totalGeralVendas,
      total_retiradas: totalRetiradas,
      saldo_final: saldoFinal,
      
      // Detalhamento
      vendas_por_forma_pagamento: vendasPorFormaPagamento,
      retiradas: caixa.retiradas.map(retirada => ({
        data: retirada.dataRetirada.toISOString(),
        valor: retirada.valor,
        observacao: retirada.observacao || ''
      })),

      // Dados do fechamento se existir
      fechamento: caixa.fechamento ? {
        data_fechamento: caixa.fechamento.dataFechamento.toISOString(),
        valor_abertura: caixa.fechamento.valorAbertura,
        total_vendas: caixa.fechamento.totalVendas,
        retiradas: caixa.fechamento.retiradas,
        saldo_final: caixa.fechamento.saldoFinal,
        observacoes: caixa.fechamento.observacoes
      } : null,

      // Dados adicionais
      total_vendas_sistema: totalVendasSistema,
      total_vendas_manuais: totalVendasManuais,
      quantidade_vendas: caixa.vendas.length,
      quantidade_vendas_manuais: caixa.vendasManuais.length,
      quantidade_retiradas: caixa.retiradas.length
    }

    return NextResponse.json({ 
      success: true, 
      data: dadosCaixa 
    })

  } catch (error) {
    console.error('Erro geral na consulta de caixa:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
// src/components/caixa/impressao/ComprovanteTermico.tsx
'use client'

import { CaixaAbertura, Venda, Retirada, VendaManual } from '@/types/caixa'
import { formatarMoeda, formatarTipoPagamento } from '@/lib/utils'

interface ComprovanteTermicoProps {
  tipo: 'fechamento' | 'parcial'
  caixaAtual: CaixaAbertura
  vendas: Venda[]
  retiradas: Retirada[]
  vendasManuais: { [key: string]: VendaManual[] }
  onImprimir?: () => void
}

export default function ComprovanteTermico({ 
  tipo, 
  caixaAtual, 
  vendas, 
  retiradas,
  vendasManuais, 
  onImprimir 
}: ComprovanteTermicoProps) {
  
  const valorAbertura = caixaAtual?.valorInicial || 0
  const vendasDinheiro = vendas
    .filter(v => v.tipoPagamento === 'DINHEIRO')
    .reduce((total, v) => total + v.valorTotal, 0)
  const todasVendas = vendas.reduce((total, v) => total + v.valorTotal, 0)
  const totalRetiradas = retiradas.reduce((total, r) => total + r.valor, 0)
  const saldoFinal = valorAbertura + vendasDinheiro - totalRetiradas
  const faturamentoFinal = todasVendas - totalRetiradas

  const tiposPagamento = ['DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'VR', 'OUTRO']
  
  const totaisPorTipo: { [key: string]: number } = {}
  tiposPagamento.forEach(tipo => {
    totaisPorTipo[tipo] = vendas
      .filter(venda => venda.tipoPagamento === tipo)
      .reduce((total, venda) => total + venda.valorTotal, 0)
  })

  const dataAtual = new Date().toLocaleString('pt-BR')

  const gerarConteudoImpressao = () => {
    return `
      <div class="impressao-termica">
        <div class="text-center">
          <div class="fw-bold">RESTAURANTE EMPORIO DO SABOR</div>
          <div>CNPJ: 30.569.448/0001-91</div>
        </div>
        <div class="text-center">
          <div class="fw-bold">${tipo === 'fechamento' ? 'FECHAMENTO DE CAIXA' : 'COMPROVANTE DE CAIXA'}</div>
          <div>${tipo === 'fechamento' ? 'RELATÓRIO FINAL' : 'RELATÓRIO PARCIAL'}</div>
          <div>Data: ${dataAtual}</div>
        </div>
        <div class="linha-divisoria"></div>
        <table>
          <tr><td class="text-left">Valor de Abertura:</td><td class="text-right">${formatarMoeda(valorAbertura)}</td></tr>
          <tr><td class="text-left">Vendas em Dinheiro:</td><td class="text-right">${formatarMoeda(vendasDinheiro)}</td></tr>
          <tr><td class="text-left">Total de Vendas:</td><td class="text-right">${formatarMoeda(todasVendas)}</td></tr>
          <tr><td class="text-left">Total de Retiradas:</td><td class="text-right">${formatarMoeda(totalRetiradas)}</td></tr>
        </table>
        <div class="linha-divisoria"></div>
        <div class="fw-bold text-center">VENDAS POR FORMA PAGTO</div>
        <table>
          ${tiposPagamento.map(tipo => {
            if (totaisPorTipo[tipo] > 0) {
              return `<tr><td class="text-left">${formatarTipoPagamento(tipo)}:</td><td class="text-right">${formatarMoeda(totaisPorTipo[tipo])}</td></tr>`
            }
            return ''
          }).join('')}
        </table>
        <div class="linha-divisoria"></div>
        <div class="fw-bold text-center">DETALHES DAS RETIRADAS</div>
        ${retiradas.length > 0 ? retiradas.map(retirada => `
          <table><tr>
            <td class="text-right" style="width: 40%;">${formatarMoeda(retirada.valor)}</td>
            <td class="text-left" style="width: 60%;"><small>${(retirada.observacao || 'Sem observação').substring(0, 35)}</small></td>
          </tr></table>
        `).join('') : '<div class="text-center">Nenhuma retirada</div>'}
        <div class="linha-divisoria"></div>
        <table>
          <tr><td class="text-left fw-bold">Saldo em Dinheiro:</td><td class="text-right fw-bold">${formatarMoeda(saldoFinal)}</td></tr>
          <tr><td class="text-left fw-bold">Faturamento Final:</td><td class="text-right fw-bold">${formatarMoeda(faturamentoFinal)}</td></tr>
        </table>
        <div class="linha-divisoria"></div>
        <div class="text-center">
          <div>*** ${tipo === 'fechamento' ? 'CAIXA FECHADO' : 'CAIXA ABERTO'} ***</div>
          <div>Restaurante Emporio do Sabor</div>
        </div>
        <div class="text-center">--- CORTE AQUI ---</div>
      </div>
    `
  }

  const handleImprimir = () => {
    const conteudo = gerarConteudoImpressao()
    const janelaImpressao = window.open('', '_blank')
    if (!janelaImpressao) return
    
    janelaImpressao.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Impressão Térmica</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.2;
            margin: 0;
            padding: 5px;
            width: 80mm;
            background: white;
            color: black;
          }
          .text-center { text-align: center; }
          .text-left { text-align: left; }
          .text-right { text-align: right; }
          .fw-bold { font-weight: bold; }
          .linha-divisoria { border-top: 1px dashed black; margin: 4px 0; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 3px 2px; border: none; }
          .small { font-size: 10px; }
          @media print {
            body { margin: 0; padding: 5px; width: 80mm; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>${conteudo}</body>
      </html>
    `)
    
    janelaImpressao.document.close()
    setTimeout(() => {
      janelaImpressao.print()
      setTimeout(() => {
        janelaImpressao.close()
        onImprimir?.()
      }, 500)
    }, 500)
  }

  return (
    <div className="preview-termica">
      <div dangerouslySetInnerHTML={{ __html: gerarConteudoImpressao() }} />
      <div className="text-center mt-4 no-print">
        <button 
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
          onClick={handleImprimir}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Imprimir Comprovante
        </button>
      </div>
    </div>
  )
}
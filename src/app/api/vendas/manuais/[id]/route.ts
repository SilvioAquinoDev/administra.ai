// app/api/vendas/manuais/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params  // Aguardar a Promise
    console.log('🗑️ Recebendo solicitação de exclusão para venda manual:', id)

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID da venda manual é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a venda manual existe
    const vendaManualExistente = await prisma.vendaManual.findUnique({
      where: { id }
    })

    if (!vendaManualExistente) {
      return NextResponse.json(
        { success: false, error: 'Venda manual não encontrada' },
        { status: 404 }
      )
    }

    console.log('🔄 Excluindo venda manual:', {
      id: vendaManualExistente.id,
      tipoPagamento: vendaManualExistente.tipoPagamento,
      valor: vendaManualExistente.valor,
      descricao: vendaManualExistente.descricao
    })

    // Excluir a venda manual
    await prisma.vendaManual.delete({
      where: { id }
    })

    console.log('✅ Venda manual excluída com sucesso:', id)

    return NextResponse.json({
      success: true,
      message: 'Venda manual excluída com sucesso',
      data: {
        id: vendaManualExistente.id,
        tipoPagamento: vendaManualExistente.tipoPagamento,
        valor: vendaManualExistente.valor
      }
    }, { status: 200 })

  } catch (error: any) {
    console.error('❌ Erro ao excluir venda manual:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Venda manual não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor: ' + error.message },
      { status: 500 }
    )
  }
}
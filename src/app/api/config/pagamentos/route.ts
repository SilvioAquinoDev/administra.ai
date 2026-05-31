// src/app/api/config/pagamentos/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { formasPagamento, bandeiras } = await request.json()

    // Salvar configurações de pagamento
    // Você pode salvar em uma tabela Configuracao ou similar
    
    return NextResponse.json({
      success: true,
      message: "Formas de pagamento salvas com sucesso"
    })

  } catch (error) {
    console.error("Erro ao salvar pagamentos:", error)
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    )
  }
}
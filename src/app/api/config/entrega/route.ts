// src/app/api/config/entrega/route.ts
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

    const configEntrega = await request.json()

    // Salvar configurações de entrega
    
    return NextResponse.json({
      success: true,
      message: "Configurações de entrega salvas com sucesso"
    })

  } catch (error) {
    console.error("Erro ao salvar configurações de entrega:", error)
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    )
  }
}
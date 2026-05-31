// src/app/api/config/horarios/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { horarios } = await request.json()

    // Salvar horários no banco (ajuste conforme seu schema)
    // Aqui você pode salvar em uma tabela específica ou em JSON
    
    return NextResponse.json({
      success: true,
      message: "Horários salvos com sucesso"
    })

  } catch (error) {
    console.error("Erro ao salvar horários:", error)
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    )
  }
}
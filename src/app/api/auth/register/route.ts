// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validações
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      )
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar usuário com período trial de 14 dias
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 14)

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        passwordHash: hashedPassword,
        trialEndsAt
      }
    })

    // Criar dados iniciais para o usuário (despesas fixas padrão)
    const despesasFixasPadrao = [
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

    await prisma.planejamentoConfig.create({
      data: {
        userId: user.id,
        tipo: "despesas_fixas",
        dados: despesasFixasPadrao,
        anoReferencia: new Date().getFullYear()
      }
    })

    // Criar metas mensais padrão
    const anoAtual = new Date().getFullYear()
    for (let mes = 1; mes <= 12; mes++) {
      await prisma.planejamentoFaturamento.create({
        data: {
          userId: user.id,
          ano: anoAtual,
          mes,
          metaDiariaAlmoco: 0,
          metaDiariaJanta: 0,
          diasTrabalhados: 26,
          lucroDesejado: 15
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: "Usuário criado com sucesso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        trialEndsAt: user.trialEndsAt
      }
    })

  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return NextResponse.json(
      { error: "Erro interno ao criar usuário" },
      { status: 500 }
    )
  }
}
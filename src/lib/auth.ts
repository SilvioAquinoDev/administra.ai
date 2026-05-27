// src/lib/auth.ts (atualizado com suporte a nome)
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

declare module "next-auth" {
  interface User {
    id: string
    name?: string | null
    email?: string | null
    trialEndsAt?: string
    subscriptionStatus?: string | null
    isInTrial?: boolean
  }
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      trialEndsAt?: string
      subscriptionStatus?: string | null
      isInTrial?: boolean
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            subscription: {
              where: { status: "active" },
              take: 1,
            },
          },
        })

        if (!user || !user.passwordHash) {
          throw new Error("Usuário não encontrado")
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)

        if (!isValid) {
          throw new Error("Senha incorreta")
        }

        // Verificar período trial
        const isInTrial = user.trialEndsAt && user.trialEndsAt > new Date()
        const hasActiveSubscription = user.subscription?.status === "active"

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          trialEndsAt: user.trialEndsAt?.toISOString(),
          subscriptionStatus: user.subscription?.status || null,
          isInTrial: isInTrial || false,
          hasActiveSubscription: hasActiveSubscription || false,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.trialEndsAt = user.trialEndsAt
        token.subscriptionStatus = user.subscriptionStatus
        token.isInTrial = user.isInTrial
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.trialEndsAt = token.trialEndsAt as string
        session.user.subscriptionStatus = token.subscriptionStatus as string
        session.user.isInTrial = token.isInTrial as boolean
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
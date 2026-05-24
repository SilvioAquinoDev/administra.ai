// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rotas públicas (não requerem autenticação)
const publicRoutes = [
  '/login',
  '/register',
  '/api/auth',
  '/api/health',
  '/api/webhooks',
]

// Rotas de assinatura (requerem assinatura ativa)
const subscriptionRequiredRoutes = [
  '/dashboard',
  '/nfe',
  '/livro-diario',
  '/fluxo-caixa',
  '/planejamento',
  '/fichas-tecnicas',
  '/insumos',
  '/notas-processadas',
  '/contas-bancarias',
  '/fechamento-mensal',
]

export default withAuth(
  async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Verificar se é rota pública
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next()
    }

    // Se não tem token, redirecionar para login
    if (!token) {
      const url = new URL('/login', req.url)
      url.searchParams.set('callbackUrl', encodeURI(pathname))
      return NextResponse.redirect(url)
    }

    // Verificar se a rota requer assinatura ativa
    if (subscriptionRequiredRoutes.some(route => pathname.startsWith(route))) {
      // Verificar se o usuário está em período trial
      const trialEndsAt = token.trialEndsAt ? new Date(token.trialEndsAt as string) : null
      const isInTrial = trialEndsAt && trialEndsAt > new Date()

      // Verificar se tem assinatura ativa
      const hasActiveSubscription = token.subscriptionStatus === 'active'

      if (!isInTrial && !hasActiveSubscription) {
        console.log(`Acesso negado para ${pathname}: trial=${isInTrial}, subscription=${hasActiveSubscription}`)
        const url = new URL('/assinatura', req.url)
        return NextResponse.redirect(url)
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
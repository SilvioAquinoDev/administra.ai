// src/types/next-auth.d.ts
import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    trialEndsAt?: string
    subscriptionStatus?: string | null
    isInTrial?: boolean
    hasActiveSubscription?: boolean
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      trialEndsAt?: string
      subscriptionStatus?: string | null
      isInTrial?: boolean
      hasActiveSubscription?: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    trialEndsAt?: string
    subscriptionStatus?: string | null
    isInTrial?: boolean
    hasActiveSubscription?: boolean
  }
}
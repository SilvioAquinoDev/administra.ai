// src/hooks/useOnboarding.ts
"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

interface OnboardingConfig {
  [key: string]: {
    enabled: boolean
    steps: any[]
    completed: boolean
  }
}

export function useOnboarding() {
  const pathname = usePathname()
  const [currentOnboarding, setCurrentOnboarding] = useState<any>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Configuração de onboarding por rota
  const onboardingConfig: OnboardingConfig = {
    "/": {
      enabled: true,
      steps: [], // dashboardSteps
      completed: false
    },
    "/planejamento": {
      enabled: true,
      steps: [], // planejamentoSteps
      completed: false
    },
    "/fichas-tecnicas": {
      enabled: true,
      steps: [], // fichasSteps
      completed: false
    },
    "/nfe": {
      enabled: true,
      steps: [], // nfeSteps
      completed: false
    }
  }

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboarding_completed")
    const pageOnboardingCompleted = localStorage.getItem(`onboarding_${pathname}_completed`)
    
    if (!onboardingCompleted && !pageOnboardingCompleted && onboardingConfig[pathname]?.enabled) {
      setCurrentOnboarding(onboardingConfig[pathname])
      setShowOnboarding(true)
    }
  }, [pathname])

  const completeOnboarding = () => {
    localStorage.setItem(`onboarding_${pathname}_completed`, "true")
    setShowOnboarding(false)
  }

  const skipOnboarding = () => {
    localStorage.setItem("onboarding_completed", "true")
    setShowOnboarding(false)
  }

  return {
    showOnboarding,
    currentOnboarding,
    completeOnboarding,
    skipOnboarding
  }
}
// src/app/(dashboard)/layout.tsx (atualizado com autenticação)
"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Menu, 
  X, 
  Home, 
  ShoppingBag, 
  Package, 
  Users, 
  Store, 
  Clock,
  CreditCard,
  Truck,
  Ticket,
  QrCode,
  Plug,
  HelpCircle,
  LogOut
} from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: ShoppingBag, label: "Registros NFEs", href: "/nfe" },
    { icon: Package, label: "Fichas Tecnicas", href: "/fichas-tecnicas" },
    { icon: Users, label: "Planejamento", href: "/planejamento" },
    { icon: Store, label: "Minha loja", href: "/config/loja" },
    { icon: Clock, label: "Livro Diário", href: "/livro-diario" },
    { icon: CreditCard, label: "Fechamento Mensal", href: "/fechamento-mensal" },
    { icon: Truck, label: "Contas bancarias", href: "/contas-bancarias" },
    { icon: Ticket, label: "Fluxo de Caixa", href: "/fluxo-caixa" },
  ]

  const configItems = [
    { icon: QrCode, label: "QR Code", href: "/config/qrcode" },
    { icon: Plug, label: "Integrações", href: "/config/integracoes" },
  ]

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col bg-white shadow-lg lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 px-4 border-b">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Store className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold">Emporio do Sabor</span>
        </div>

        {/* Menu Principal */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase text-gray-400">Menu</p>
          {menuItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-gray-700 transition hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </div>
            </a>
          ))}

          <p className="mb-2 mt-4 px-3 text-xs font-semibold uppercase text-gray-400">
            Configurações
          </p>
          {configItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-gray-700 transition hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </div>
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 transform bg-white shadow-xl transition-transform duration-300 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Store className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">Emporio do Sabor</span>
          </div>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-2">
          {menuItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </a>
          ))}
          <div className="border-t my-2 pt-2">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white px-4 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 hover:bg-gray-100">
              <HelpCircle className="h-5 w-5 text-gray-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-medium text-primary">
                  {session.user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {session.user?.name || session.user?.email?.split("@")[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
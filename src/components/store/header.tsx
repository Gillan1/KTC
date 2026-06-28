"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/auth-store"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Phone, Globe, LogOut, LogIn, Shield, X } from "lucide-react"
import { asset } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface HeaderProps {
  onToggleSidebar: () => void
  onNavigate: (view: string) => void
}

export function Header({ onToggleSidebar, onNavigate }: HeaderProps) {
  const { isAdmin, username, logout, setShowLoginDialog } = useAuthStore()
  const { t, language, toggleLanguage } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: "home", label: t.home },
    { id: "products", label: t.products },
    { id: "branches", label: t.branches },
    { id: "about", label: t.about },
    { id: "contact", label: t.contact },
  ]

  const handleNav = (view: string) => {
    onNavigate(view)
    setMobileMenuOpen(false)
  }

  const handleAdminLogin = () => {
    setShowLoginDialog(true)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-200/50 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-16 items-center gap-2 px-3 sm:px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden flex-shrink-0"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Logo + Company Name */}
        <button
          onClick={() => handleNav("home")}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-emerald-50 border border-emerald-200">
            <img
              src={asset("/images/ktc/logo.jpg")}
              alt="KTC Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block text-right">
            <h1 className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-400 leading-tight">
              {t.storeName}
            </h1>
            <p className="text-[10px] text-muted-foreground">{t.storeSlogan}</p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 mx-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Spacer for mobile */}
        <div className="flex-1 md:hidden" />

        {/* WhatsApp number - prominent */}
        <a
          href="https://wa.me/249122011111"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
        >
          <Phone className="h-4 w-4" />
          <span dir="ltr">0122011111</span>
        </a>

        {/* Badge */}
        {isAdmin && (
          <Badge className="hidden lg:inline-flex bg-emerald-600 text-white">
            <Shield className="h-3 w-3 me-1" />
            {t.adminBadge}
          </Badge>
        )}

        {/* Language toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          className="flex-shrink-0"
          title={language === "ar" ? "English" : "العربية"}
        >
          <Globe className="h-5 w-5" />
        </Button>

        {/* Admin login/logout */}
        {isAdmin ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="flex-shrink-0"
            title={t.logout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdminLogin}
            className="hidden sm:flex gap-1.5 flex-shrink-0 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden lg:inline">{t.adminLogin}</span>
          </Button>
        )}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-200/50 bg-white dark:bg-gray-950">
          <nav className="flex flex-col p-2 gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="px-4 py-3 text-sm font-medium text-right text-foreground hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors min-h-[44px]"
              >
                {item.label}
              </button>
            ))}
            <a
              href="https://wa.me/249122011111"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 mt-2 rounded-lg bg-emerald-600 text-white font-bold"
            >
              <Phone className="h-4 w-4" />
              <span dir="ltr">0122011111</span>
            </a>
            {!isAdmin && (
              <button
                onClick={handleAdminLogin}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-emerald-300 text-emerald-700"
              >
                <LogIn className="h-4 w-4" />
                {t.adminLogin}
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

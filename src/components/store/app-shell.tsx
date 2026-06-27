"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/store/auth-store"
import { useProductStore } from "@/store/product-store"
import { useLanguage } from "@/hooks/use-language"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { HomeView } from "./home-view"
import { ProductGrid } from "./product-grid"
import { BranchesView } from "./branches-view"
import { AboutView } from "./about-view"
import { ContactView } from "./contact-view"
import { SettingsView } from "./settings-view"
import { AdminLoginDialog } from "./admin-login-dialog"
import { Phone, MapPin } from "lucide-react"
import { asset } from "@/lib/utils"

export type ViewType = "home" | "products" | "branches" | "about" | "contact" | "settings"

export function AppShell() {
  const { isAdmin } = useAuthStore()
  const { fetchProducts, fetchBranches } = useProductStore()
  const { t, language } = useLanguage()
  const [activeView, setActiveView] = useState<ViewType>("home")

  useEffect(() => {
    fetchProducts()
    fetchBranches()
  }, [fetchProducts, fetchBranches])

  const renderContent = () => {
    switch (activeView) {
      case "home":
        return <HomeView onNavigate={(v) => setActiveView(v as ViewType)} />
      case "products":
        return <ProductGrid />
      case "branches":
        return <BranchesView />
      case "about":
        return <AboutView />
      case "contact":
        return <ContactView />
      case "settings":
        return isAdmin ? <SettingsView /> : null
      default:
        return <HomeView onNavigate={(v) => setActiveView(v as ViewType)} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        onToggleSidebar={() => {}}
        onNavigate={(v) => {
          if (v === "settings" && !isAdmin) {
            useAuthStore.getState().setShowLoginDialog(true)
          } else {
            setActiveView(v as ViewType)
          }
        }}
      />

      <div className="flex flex-1">
        <Sidebar
          activeView={activeView}
          onViewChange={(v) => setActiveView(v as ViewType)}
        />

        <main className="flex-1 overflow-x-hidden min-w-0">
          {renderContent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-gradient-to-r from-emerald-700 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-start">
            {/* Company info */}
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/20">
                  <img src={asset("/images/ktc/logo.jpg")} alt="KTC" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-sm">{t.storeName}</h3>
              </div>
              <p className="text-xs text-white/80">{t.storeSlogan}</p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-sm mb-2">{t.contactTitle}</h4>
              <a href="tel:0122011111" className="flex items-center justify-center sm:justify-start gap-2 text-sm hover:text-amber-300 transition-colors">
                <Phone className="h-4 w-4" />
                <span dir="ltr">0122011111</span>
              </a>
              <p className="flex items-center justify-center sm:justify-start gap-2 text-xs text-white/80 mt-1">
                <MapPin className="h-3 w-3" />
                {language === "ar" ? "الخرطوم - السودان" : "Khartoum - Sudan"}
              </p>
            </div>

            {/* Working hours */}
            <div>
              <h4 className="font-bold text-sm mb-2">{t.workingHours}</h4>
              <p className="text-xs text-white/80">{t.workingHoursValue}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20 text-center text-xs text-white/70">
            © {new Date().getFullYear()} {t.storeName} - KTC. {language === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved"}
          </div>
        </div>
      </footer>

      <AdminLoginDialog open={useAuthStore((s) => s.showLoginDialog)} />
    </div>
  )
}

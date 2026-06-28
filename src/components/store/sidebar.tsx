"use client"

import { useProductStore, categories, sudanStates } from "@/store/product-store"
import { useLanguage } from "@/hooks/use-language"
import { cn } from "@/lib/utils"
import { MapPin, ChevronDown } from "lucide-react"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { selectedState, setSelectedState } = useProductStore()
  const { t, language } = useLanguage()

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 border-e border-emerald-200/50 bg-white/50 dark:bg-gray-950/50">
      <div className="sticky top-16 p-4 space-y-4 h-[calc(100vh-4rem)] overflow-y-auto">
        {/* State selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            {t.selectState}
          </label>
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full h-10 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">{t.allStates}</option>
              {sudanStates.map((s) => (
                <option key={s.id} value={s.id}>
                  {language === "ar" ? s.nameAr : s.nameEn}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">{t.category}</h3>
          <div className="space-y-1">
            <button
              onClick={() => onViewChange("products")}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-right",
                activeView === "products"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : "hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              )}
            >
              <span>📦</span>
              {t.allCategories}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onViewChange("products")}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors text-right"
              >
                <span>{cat.icon}</span>
                <span className="flex-1 text-right">
                  {language === "ar" ? cat.nameAr : cat.nameEn}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

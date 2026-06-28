"use client"

import { useState, useMemo } from "react"
import { useProductStore, categories, type Category } from "@/store/product-store"
import { useLanguage } from "@/hooks/use-language"
import { ProductCard } from "./product-card"
import { PackageOpen, Search, MapPin, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { sudanStates } from "@/store/product-store"

export function ProductGrid() {
  const { products, isLoading, selectedState, setSelectedState } = useProductStore()
  const { t, language } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = useMemo(() => {
    let result = products

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter((p) => {
        const nameMatch = p.nameAr.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q)
        const brandMatch = (p.brand || "").toLowerCase().includes(q)
        const descMatch = (p.descriptionAr || "").toLowerCase().includes(q) || (p.descriptionEn || "").toLowerCase().includes(q)
        return nameMatch || brandMatch || descMatch
      })
    }

    return result
  }, [products, activeCategory, searchQuery])

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 space-y-4">
      {/* State selector - mobile */}
      <div className="lg:hidden">
        <div className="relative">
          <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full h-10 rounded-lg border border-emerald-200 bg-white ps-10 pe-8 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.search}
          className="ps-10 h-10 bg-muted/30 border-0 focus-visible:ring-1"
        />
      </div>

      {/* Category filter */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              activeCategory === "all"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            )}
          >
            {t.allCategories}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5",
                activeCategory === cat.id
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              )}
            >
              <span>{cat.icon}</span>
              <span>{language === "ar" ? cat.nameAr : cat.nameEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <PackageOpen className="h-20 w-20 mb-4 opacity-40 text-muted-foreground" />
          <h3 className="text-lg font-bold text-foreground mb-2">
            {t.noProducts}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {t.noProductsDesc}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import { useLanguage } from "@/hooks/use-language"
import { useProductStore, categories } from "@/store/product-store"
import { motion } from "framer-motion"
import { asset } from "@/lib/utils"
import { Phone, MapPin, ArrowLeft, Sun, Zap, Droplet, Wheat, Wrench } from "lucide-react"

interface HomeViewProps {
  onNavigate: (view: string) => void
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const { t, language } = useLanguage()
  const { products, branches } = useProductStore()
  const isAr = language === "ar"

  const categoryIcons: Record<string, React.ReactNode> = {
    solar: <Sun className="h-8 w-8" />,
    generators: <Zap className="h-8 w-8" />,
    pumps: <Droplet className="h-8 w-8" />,
    mills: <Wheat className="h-8 w-8" />,
    equipment: <Wrench className="h-8 w-8" />,
  }

  return (
    <div className="space-y-6" dir={isAr ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-amber-600 p-6 sm:p-10 text-white text-center relative">
          {/* Decorative elements */}
          <div className="absolute top-0 end-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 start-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 w-20 h-20 rounded-2xl overflow-hidden shadow-lg bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <img
                src={asset("/images/ktc/logo.jpg")}
                alt="KTC"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <h1 className="text-2xl sm:text-4xl font-bold mb-2">
              {t.heroTitle}
            </h1>
            <p className="text-white/90 text-sm sm:text-lg mb-6 max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => onNavigate("products")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-700 font-bold hover:bg-emerald-50 transition-colors shadow-md"
              >
                {t.browseProducts}
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              </button>
              <button
                onClick={() => onNavigate("branches")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/30 font-bold hover:bg-white/30 transition-colors"
              >
                <MapPin className="h-4 w-4" />
                {t.viewBranches}
              </button>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/249122011111"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors shadow-lg"
            >
              <Phone className="h-4 w-4" />
              <span dir="ltr">0122011111</span>
            </a>
          </div>
        </div>
      </motion.section>

      {/* Categories */}
      <section className="px-3 sm:px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-foreground mb-4">
          {isAr ? "فئات المنتجات" : "Product Categories"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              onClick={() => onNavigate("products")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 border border-emerald-100 dark:border-emerald-900/30 shadow-md hover:shadow-xl hover:scale-105 transition-all text-center group"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-100 dark:from-emerald-950/40 dark:to-amber-950/30 flex items-center justify-center mb-3 text-emerald-600 group-hover:scale-110 transition-transform">
                {categoryIcons[cat.id]}
              </div>
              <h3 className="font-bold text-sm text-foreground mb-1">
                {isAr ? cat.nameAr : cat.nameEn}
              </h3>
              <p className="text-[10px] text-muted-foreground line-clamp-2">
                {cat.desc}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section className="px-3 sm:px-4">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 text-white text-center">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl sm:text-3xl font-bold">{products.length || "16"}+</p>
              <p className="text-xs sm:text-sm text-white/80">{t.statProducts}</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold">{branches.length || "18"}</p>
              <p className="text-xs sm:text-sm text-white/80">{t.statBranches}</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold">10+</p>
              <p className="text-xs sm:text-sm text-white/80">{t.statYears}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

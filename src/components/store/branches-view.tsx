"use client"

import { useState, useMemo } from "react"
import { useProductStore, sudanStates } from "@/store/product-store"
import { useLanguage } from "@/hooks/use-language"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, User, Building2, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"

export function BranchesView() {
  const { branches, fetchBranches } = useProductStore()
  const { t, language } = useLanguage()
  const [stateFilter, setStateFilter] = useState("all")

  // fetchBranches should be called by AppShell on mount
  const filteredBranches = useMemo(() => {
    if (stateFilter === "all") return branches
    return branches.filter((b) => b.state === stateFilter)
  }, [branches, stateFilter])

  return (
    <div className="p-3 sm:p-4 space-y-4" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
          {t.branchesTitle}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          {t.branchesDesc}
        </p>
      </motion.div>

      {/* State filter */}
      <div className="relative max-w-md mx-auto">
        <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
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

      {/* Branches grid */}
      {filteredBranches.length === 0 ? (
        <div className="text-center py-16">
          <Building2 className="h-16 w-16 mx-auto mb-4 opacity-40 text-muted-foreground" />
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredBranches.map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.5) }}
            >
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-foreground">
                        {branch.nameAr}
                      </h3>
                      <Badge variant="outline" className="mt-1 text-xs">
                        <MapPin className="h-3 w-3 me-1" />
                        {branch.state}
                      </Badge>
                    </div>
                  </div>

                  {branch.addressAr && (
                    <p className="text-sm text-muted-foreground flex items-start gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
                      {branch.addressAr}
                    </p>
                  )}

                  {branch.manager && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      {branch.manager}
                    </p>
                  )}

                  {branch.phone && (
                    <a
                      href={`https://wa.me/249${branch.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                    >
                      <Phone className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400" dir="ltr">
                        {branch.phone}
                      </span>
                    </a>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

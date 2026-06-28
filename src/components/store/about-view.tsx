"use client"

import { useLanguage } from "@/hooks/use-language"
import { motion } from "framer-motion"
import { asset } from "@/lib/utils"
import { Target, Eye, TrendingUp, Building2, Package, Users, Award } from "lucide-react"

export function AboutView() {
  const { t, language } = useLanguage()
  const isAr = language === "ar"

  const stats = [
    { icon: <Building2 className="h-6 w-6" />, value: "18+", label: t.statBranches },
    { icon: <Package className="h-6 w-6" />, value: "16+", label: t.statProducts },
    { icon: <Users className="h-6 w-6" />, value: "1000+", label: t.statCustomers },
    { icon: <Award className="h-6 w-6" />, value: "10+", label: t.statYears },
  ]

  return (
    <div className="p-3 sm:p-4 space-y-6" dir={isAr ? "rtl" : "ltr"}>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-3">
          {t.aboutTitle}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
          {t.aboutDesc}
        </p>
      </motion.div>

      {/* Company poster */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="rounded-2xl overflow-hidden shadow-xl border border-emerald-200/50">
          <img
            src={asset("/images/ktc/company-poster.jpg")}
            alt="KTC Company Poster"
            className="w-full h-auto"
          />
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/20 rounded-xl p-4 text-center border border-emerald-100 dark:border-emerald-900/30"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center mb-2">
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/30 shadow-md"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
              <Target className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
              {t.ourMission}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t.missionDesc}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-amber-100 dark:border-amber-900/30 shadow-md"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
              <Eye className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400">
              {t.ourVision}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t.visionDesc}
          </p>
        </motion.div>
      </div>

      {/* Truck delivery image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src={asset("/images/ktc/truck-delivery.jpg")}
            alt="KTC Delivery Truck"
            className="w-full h-auto object-cover"
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {isAr ? "شاحناتنا توصل المنتجات لكل ولايات السودان" : "Our trucks deliver to all Sudan states"}
        </p>
      </motion.div>
    </div>
  )
}

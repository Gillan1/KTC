"use client"

import { useLanguage } from "@/hooks/use-language"
import { motion } from "framer-motion"
import { Phone, MapPin, Clock, MessageCircle, Building } from "lucide-react"

export function ContactView() {
  const { t, language } = useLanguage()
  const isAr = language === "ar"

  const contactMethods = [
    {
      icon: <Phone className="h-8 w-8" />,
      title: t.phoneLabel,
      value: "0122011111",
      href: "https://wa.me/249122011111",
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: t.whatsapp,
      value: "0122011111",
      href: "https://wa.me/249122011111",
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: t.addressLabel,
      value: isAr ? "الخرطوم - السودان" : "Khartoum - Sudan",
      href: "https://maps.google.com/?q=Khartoum",
      color: "from-amber-500 to-orange-600",
      bgColor: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: t.workingHours,
      value: t.workingHoursValue,
      href: null,
      color: "from-violet-500 to-purple-600",
      bgColor: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30",
    },
  ]

  return (
    <div className="p-3 sm:p-4 space-y-6" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
          {t.contactTitle}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          {t.contactDesc}
        </p>
      </motion.div>

      {/* Contact methods grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto">
        {contactMethods.map((method, i) => {
          const content = (
            <div className={`bg-gradient-to-br ${method.bgColor} rounded-2xl p-5 border border-emerald-100 dark:border-emerald-900/30 h-full`}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} text-white flex items-center justify-center mb-3 shadow-lg`}>
                {method.icon}
              </div>
              <h3 className="font-bold text-base text-foreground mb-1">
                {method.title}
              </h3>
              <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-400" dir="ltr">
                {method.value}
              </p>
            </div>
          )

          if (method.href) {
            return (
              <motion.a
                key={i}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="block hover:scale-105 transition-transform"
              >
                {content}
              </motion.a>
            )
          }

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {content}
            </motion.div>
          )
        })}
      </div>

      {/* Big call button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <a
          href="https://wa.me/249122011111"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
        >
          <Phone className="h-6 w-6" />
          {t.callNow}: <span dir="ltr">0122011111</span>
        </a>
      </motion.div>

      {/* Branches info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/30 shadow-md"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
            <Building className="h-5 w-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-base text-foreground">
            {isAr ? "فروعنا في كل ولايات السودان" : "Our branches across Sudan"}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isAr
            ? "لدينا 18 فرعاً في جميع ولايات السودان لخدمتك. تواصل معنا عبر الهاتف أو زر أقرب فرع لك. فريقنا جاهز لمساعدتك في اختيار المعدات المناسبة لاحتياجاتك من الطاقة الشمسية والبابورات الزراعية والمولدات الكهربائية."
            : "We have 18 branches across all Sudan states to serve you. Contact us by phone or visit your nearest branch. Our team is ready to help you choose the right equipment for your solar energy, agricultural pumps, and generators needs."}
        </p>
      </motion.div>
    </div>
  )
}

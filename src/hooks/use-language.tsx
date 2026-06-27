"use client"

import * as React from "react"
import { translations, type Language } from "@/lib/i18n"

const STORAGE_KEY = "ktc-language"
const DEFAULT_LANGUAGE: Language = "ar"

// نوع الترجمات المسطحة: كل مفتاح يعطي نصاً مباشرة
type FlatTranslations = Record<string, string>

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  dir: "rtl" | "ltr"
  t: FlatTranslations
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null)

function readStoredLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "ar" || stored === "en") return stored
  } catch {
    /* ignore */
  }
  return DEFAULT_LANGUAGE
}

function applyDocumentAttributes(language: Language) {
  if (typeof document === "undefined") return
  const dir = language === "ar" ? "rtl" : "ltr"
  document.documentElement.lang = language
  document.documentElement.dir = dir
}

// تحويل translations إلى كائن مسطح للغة معينة
function getFlatTranslations(language: Language): FlatTranslations {
  const result: FlatTranslations = {}
  for (const key of Object.keys(translations)) {
    const entry = translations[key as keyof typeof translations]
    result[key] = entry[language] || entry.ar || key
  }
  return result
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>(DEFAULT_LANGUAGE)
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    const stored = readStoredLanguage()
    if (stored !== DEFAULT_LANGUAGE) {
      setLanguageState(stored)
    }
    applyDocumentAttributes(stored)
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    if (!hydrated) return
    applyDocumentAttributes(language)
  }, [language, hydrated])

  const setLanguage = React.useCallback((lang: Language) => {
    setLanguageState(lang)
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore */
    }
  }, [])

  const toggleLanguage = React.useCallback(() => {
    setLanguageState((prev) => {
      const next: Language = prev === "ar" ? "en" : "ar"
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const flatT = React.useMemo(() => getFlatTranslations(language), [language])

  const value = React.useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      dir: language === "ar" ? "rtl" : "ltr",
      t: flatT,
    }),
    [language, setLanguage, toggleLanguage, flatT]
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = React.useContext(LanguageContext)
  if (!ctx) {
    return {
      language: DEFAULT_LANGUAGE,
      setLanguage: () => {},
      toggleLanguage: () => {},
      dir: "rtl",
      t: getFlatTranslations(DEFAULT_LANGUAGE),
    }
  }
  return ctx
}

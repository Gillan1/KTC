"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/auth-store"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Mail, Lock, AlertCircle, Shield } from "lucide-react"
import { toast } from "sonner"

interface AdminLoginDialogProps {
  open: boolean
}

export function AdminLoginDialog({ open }: AdminLoginDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const setShowLoginDialog = useAuthStore((s) => s.setShowLoginDialog)
  const { t, language } = useLanguage()

  const handleLogin = async () => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setError(language === "ar" ? "الرجاء إدخال البريد وكلمة المرور" : "Please enter email and password")
      return
    }

    setError("")
    setLoading(true)
    const result = await login(trimmedEmail, password)
    setLoading(false)

    if (!result.success) {
      setError(result.error || t.loginFailed)
      toast.error(result.error || t.loginFailed)
    } else {
      toast.success(language === "ar" ? "مرحباً بك أيها المسؤول" : "Welcome, Admin")
      setEmail("")
      setPassword("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  const handleOpenChange = (openState: boolean) => {
    if (!openState) {
      setShowLoginDialog(false)
      setError("")
      setEmail("")
      setPassword("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" dir={language === "ar" ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <Shield className="h-5 w-5" />
            {t.adminLogin}
          </DialogTitle>
          <DialogDescription>{t.adminLoginDesc}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="admin-email" className="text-sm font-medium text-foreground">
              {t.email}
            </label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="admin@example.com"
                className="ps-10 h-12 text-base"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-sm font-medium text-foreground">
              {t.password}
            </label>
            <div className="relative">
              <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                className="ps-10 h-12 text-base"
                dir="ltr"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            {t.cancel}
          </Button>
          <Button
            onClick={handleLogin}
            disabled={loading || !email.trim() || !password}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {loading ? t.loading : t.login}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

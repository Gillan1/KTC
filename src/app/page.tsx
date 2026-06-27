"use client"

import { useAuthStore } from "@/store/auth-store"
import { AppShell } from "@/components/store/app-shell"
import { AdminLoginDialog } from "@/components/store/admin-login-dialog"
import { useEffect, useState, useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

export default function Home() {
  const initAuth = useAuthStore((s) => s.initAuth)
  const showLoginDialog = useAuthStore((s) => s.showLoginDialog)
  const mounted = useHasMounted()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (mounted && !hydrated) {
      // Use queueMicrotask to avoid cascading renders warning
      queueMicrotask(() => {
        setHydrated(true)
        initAuth()
      })
    }
  }, [mounted, initAuth, hydrated])

  if (!mounted || !hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 animate-pulse" />
          </div>
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    )
  }

  return (
    <>
      <AppShell />
      <AdminLoginDialog open={showLoginDialog} />
    </>
  )
}

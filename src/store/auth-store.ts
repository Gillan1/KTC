'use client'

import { create } from 'zustand'
import { getSupabase } from '@/lib/supabase'

interface AuthState {
  username: string | null
  isAdmin: boolean
  isAuthenticated: boolean
  isLoading: boolean
  showLoginDialog: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  initAuth: () => Promise<void>
  setShowLoginDialog: (show: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  isAdmin: false,
  isAuthenticated: true,
  isLoading: true,
  showLoginDialog: false,

  setShowLoginDialog: (show) => set({ showLoginDialog: show }),

  initAuth: async () => {
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        set({
          username: session.user.email || 'admin',
          isAdmin: true,
          isAuthenticated: true,
          isLoading: false
        })
      } else {
        set({
          username: null,
          isAdmin: false,
          isAuthenticated: true,
          isLoading: false
        })
      }

      supabase.auth.onAuthStateChange((_event, sess) => {
        if (sess?.user) {
          set({
            username: sess.user.email || 'admin',
            isAdmin: true,
            isAuthenticated: true,
            isLoading: false,
            showLoginDialog: false
          })
        } else {
          set({
            username: null,
            isAdmin: false,
            isAuthenticated: true,
            isLoading: false
          })
        }
      })
    } catch (e) {
      console.error('Auth init error:', e)
      set({ isLoading: false, isAuthenticated: true, isAdmin: false })
    }
  },

  login: async (email: string, password: string) => {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        return { success: false, error: error.message }
      }
      set({
        username: data.user?.email || 'admin',
        isAdmin: true,
        isAuthenticated: true,
        isLoading: false,
        showLoginDialog: false
      })
      return { success: true }
    } catch (e) {
      console.error('Login error:', e)
      return { success: false, error: 'حدث خطأ غير متوقع' }
    }
  },

  logout: async () => {
    try {
      const supabase = getSupabase()
      await supabase.auth.signOut()
    } catch (e) {
      console.error('Logout error:', e)
    } finally {
      set({
        username: null,
        isAdmin: false,
        isAuthenticated: true,
        showLoginDialog: false
      })
    }
  }
}))

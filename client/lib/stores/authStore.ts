import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/types'

export type AuthTokens = {
  user: User | null
  accessToken: string
  refreshToken?: string
  expiresAt?: number
}

type AuthState = {
  user: User | null
  tokens: AuthTokens | null
  setUser: (user: User) => void
  clearSession: () => void
  setTokens: (tokens: AuthTokens) => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      setUser: (user) => set({ user }),
      clearSession: () => set({ user: null, tokens: null }),
      setTokens: (tokens) => set({ tokens }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export default useAuthStore;
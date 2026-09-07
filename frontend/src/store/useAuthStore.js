import { create } from 'zustand'
import { authApi } from '../services/api'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: true,
  busy: false,
  error: '',

  clearError: () => set({ error: '' }),
  signIn: async (credentials) => {
    set({ busy: true, error: '' })
    try {
      const session = await authApi.login(credentials)
      set({ user: session.user, token: session.token, loading: false })
      return session
    } catch (error) {
      set({ error: error.message })
      throw error
    } finally { set({ busy: false }) }
  },
  signUp: async (details) => {
    set({ busy: true, error: '' })
    try {
      const session = await authApi.signup(details)
      set({ user: session.user, token: session.token, loading: false })
      return session
    } catch (error) {
      set({ error: error.message })
      throw error
    } finally { set({ busy: false }) }
  },
  restoreSession: async (providedToken = get().token) => {
    if (!providedToken) return set({ loading: false })
    set({ loading: true, error: '' })
    try {
      const user = await authApi.me(providedToken)
      set({ user, token: providedToken })
      return user
    } catch (error) {
      set({ user: null, token: null, error: error.message })
      throw error
    } finally { set({ loading: false }) }
  },
  logout: async () => {
    const { token } = get()
    set({ busy: true, error: '' })
    try {
      if (token) await authApi.logout(token)
    } catch (error) {
      set({ error: error.message })
      throw error
    } finally {
      // Always clear this in-memory-only session, even if the server is unavailable.
      set({ user: null, token: null, busy: false, loading: false })
    }
  },
}))

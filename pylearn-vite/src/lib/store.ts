import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  // Presentation
  currentSlide: number
  setSlide: (n: number) => void
  nextSlide: (max: number) => void
  prevSlide: () => void

  // Settings
  fontSize: number
  setFontSize: (n: number) => void
  theme: 'dark' | 'light'
  toggleTheme: () => void
  presenterMode: boolean
  togglePresenterMode: () => void
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  // Panel zoom and view layout mode
  viewMode: 'content' | 'content-visual' | 'all-four'
  setViewMode: (mode: 'content' | 'content-visual' | 'all-four') => void
  zoomedPanel: 'none' | 'editor' | 'viz' | 'explanation'
  setZoomedPanel: (p: AppState['zoomedPanel']) => void

  // Code per slide
  codeOverrides: Record<string, string>
  codeOverrideVersion: number
  setCodeOverride: (slideId: string | number, code: string) => void
  resetCodeOverride: (slideId: string | number) => void

  // Monetization & Pro Membership
  isPro: boolean
  setIsPro: (status: boolean) => void
  proModalOpen: boolean
  proModalReason: string
  openProModal: (reason?: string) => void
  closeProModal: () => void

  // User Accounts & Authentication
  user: {
    id: string
    email: string
    name: string
    avatarUrl?: string
    isPro: boolean
    planType: string
  } | null
  authToken: string | null
  authModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  setUser: (user: AppState['user']) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentSlide: 0,
      setSlide: (n) => set({ currentSlide: n, sidebarOpen: false }),
      nextSlide: (max) => set((s) => ({ currentSlide: Math.min(s.currentSlide + 1, max - 1), sidebarOpen: false })),
      prevSlide: () => set((s) => ({ currentSlide: Math.max(s.currentSlide - 1, 0), sidebarOpen: false })),

      fontSize: 14,
      setFontSize: (n) => {
        document.documentElement.style.setProperty('--font-scale', String(n / 14))
        set({ fontSize: n })
      },
      theme: 'dark',
      toggleTheme: () => set((s) => {
        const next = s.theme === 'dark' ? 'light' : 'dark'
        document.documentElement.classList.remove('dark', 'light')
        document.documentElement.classList.add(next)
        return { theme: next }
      }),
      presenterMode: false,
      togglePresenterMode: () => set((s) => ({ presenterMode: !s.presenterMode })),
      sidebarOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      viewMode: 'content-visual',
      setViewMode: (mode) => set({ viewMode: mode, zoomedPanel: 'none' }),
      zoomedPanel: 'none',
      setZoomedPanel: (p) => set({ zoomedPanel: p }),

      codeOverrides: {},
      codeOverrideVersion: 0,
      setCodeOverride: (id, code) => set((s) => ({
        codeOverrides: {
          ...s.codeOverrides,
          [id]: code,
          [String(id)]: code,
        },
        codeOverrideVersion: (s.codeOverrideVersion || 0) + 1,
      })),
      resetCodeOverride: (id) => set((s) => {
        const next = { ...s.codeOverrides }
        delete next[id]
        delete next[String(id)]
        return { codeOverrides: next, codeOverrideVersion: (s.codeOverrideVersion || 0) + 1 }
      }),

      // Monetization
      isPro: false,
      setIsPro: (status) => set((s) => ({
        isPro: status,
        user: s.user ? { ...s.user, isPro: status } : s.user
      })),
      proModalOpen: false,
      proModalReason: '',
      openProModal: (reason = 'Unlock all verified solutions, real-world system designs, and AI Mentor.') =>
        set({ proModalOpen: true, proModalReason: reason }),
      closeProModal: () => set({ proModalOpen: false, proModalReason: '' }),

      // User Accounts & Authentication
      user: null,
      authToken: null,
      authModalOpen: false,
      openAuthModal: () => set({ authModalOpen: true }),
      closeAuthModal: () => set({ authModalOpen: false }),
      setUser: (user) => {
        set({ user, isPro: Boolean(user?.isPro) })
      },
      logout: () => {
        localStorage.removeItem('pylearn_auth_token')
        set({ user: null, authToken: null, isPro: false })
      },
    }),
    {
      name: 'pylearn-store',
      partialize: (s) => ({
        fontSize: s.fontSize,
        theme: s.theme,
        codeOverrides: s.codeOverrides,
        isPro: s.isPro,
        user: s.user,
        authToken: s.authToken,
      }),
    }
  )
)

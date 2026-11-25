import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Check, Lock, Mail, ArrowRight, ShieldCheck, Zap, User } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'

export default function AuthModal() {
  const { authModalOpen, closeAuthModal, setUser } = useAppStore()
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!authModalOpen) return null

  const handleOAuthLogin = async (provider: 'Google' | 'GitHub') => {
    setLoading(true)
    setError(null)
    
    // Simulate OAuth / connect to provider
    setTimeout(async () => {
      const mockId = `usr_${provider.toLowerCase()}_${Math.floor(Math.random() * 8999 + 1000)}`
      const mockEmail = `learner.${mockId}@gmail.com`
      const mockName = `${provider} Student`

      localStorage.setItem('pylearn_auth_token', `mock_${mockId}`)

      try {
        const profile = await api.getSubscriptionStatus(`mock_${mockId}`)
        setUser({
          id: mockId,
          email: mockEmail,
          name: mockName,
          isPro: profile.is_pro,
          planType: profile.plan_type
        })
      } catch {
        setUser({
          id: mockId,
          email: mockEmail,
          name: mockName,
          isPro: false,
          planType: 'free'
        })
      }

      setLoading(false)
      closeAuthModal()
    }, 600)
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.')
      return
    }

    setLoading(true)
    setError(null)

    setTimeout(async () => {
      const userId = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_')
      const token = `mock_${userId}`
      localStorage.setItem('pylearn_auth_token', token)

      try {
        const sub = await api.getSubscriptionStatus(token)
        setUser({
          id: userId,
          email,
          name: name.trim() || userId,
          isPro: sub.is_pro,
          planType: sub.plan_type
        })
      } catch {
        setUser({
          id: userId,
          email,
          name: name.trim() || userId,
          isPro: false,
          planType: 'free'
        })
      }

      setLoading(false)
      closeAuthModal()
    }, 500)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-[#181920] border-2 border-black rounded-2xl shadow-brutal-xl overflow-hidden flex flex-col z-10 select-none"
        >
          {/* Header */}
          <div className="p-5 border-b-2 border-black flex items-center justify-between bg-[#121316]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#a3e635] border-2 border-black shadow-brutal-sm flex items-center justify-center text-black font-black text-base rotate-[-2deg]">
                ⚡
              </div>
              <div>
                <h2 className="text-lg font-black text-white">
                  {tab === 'signin' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
                </h2>
                <p className="text-[11px] font-mono text-zinc-400">
                  Sync your progress & code across all devices
                </p>
              </div>
            </div>

            <button
              onClick={closeAuthModal}
              className="w-7 h-7 rounded-lg bg-[#27272a] text-zinc-300 hover:text-white border-2 border-black shadow-brutal-sm flex items-center justify-center transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <X size={15} />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-2 bg-[#101118] border-b-2 border-black gap-2">
            <button
              onClick={() => { setTab('signin'); setError(null); }}
              className={`py-1.5 font-mono text-xs font-black rounded-lg border-2 border-black transition-all ${
                tab === 'signin'
                  ? 'bg-[#facc15] text-black shadow-brutal-sm -translate-x-0.5 -translate-y-0.5'
                  : 'bg-[#181920] text-zinc-400 hover:text-white'
              }`}
            >
              SIGN IN
            </button>
            <button
              onClick={() => { setTab('signup'); setError(null); }}
              className={`py-1.5 font-mono text-xs font-black rounded-lg border-2 border-black transition-all ${
                tab === 'signup'
                  ? 'bg-[#38bdf8] text-black shadow-brutal-sm -translate-x-0.5 -translate-y-0.5'
                  : 'bg-[#181920] text-zinc-400 hover:text-white'
              }`}
            >
              CREATE ACCOUNT
            </button>
          </div>

          {/* Form Body */}
          <div className="p-5 space-y-4 bg-[#181920]">
            {/* Social 1-Click Login */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleOAuthLogin('Google')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-zinc-100 text-black font-black text-xs rounded-xl border-2 border-black shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>CONTINUE WITH GOOGLE</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthLogin('GitHub')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#24292e] hover:bg-[#2f363d] text-white font-black text-xs rounded-xl border-2 border-black shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>CONTINUE WITH GITHUB</span>
              </button>
            </div>

            {/* Separator */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">OR EMAIL</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-2.5 rounded-lg bg-red-500/10 border-2 border-red-500 text-red-400 text-xs font-mono font-bold">
                ⚠️ {error}
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {tab === 'signup' && (
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-3 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="e.g. Alex Turing"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#121316] border-2 border-black rounded-xl text-xs text-white placeholder-zinc-600 font-mono focus:outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#121316] border-2 border-black rounded-xl text-xs text-white placeholder-zinc-600 font-mono focus:outline-none focus:border-[#facc15]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#121316] border-2 border-black rounded-xl text-xs text-white placeholder-zinc-600 font-mono focus:outline-none focus:border-[#a3e635]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 bg-[#a3e635] text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5"
              >
                <span>{loading ? 'AUTHENTICATING...' : tab === 'signin' ? 'LOG IN →' : 'GET STARTED →'}</span>
              </button>
            </form>
          </div>

          {/* Footer note */}
          <div className="p-3 border-t-2 border-black bg-[#121316] text-center">
            <span className="text-[10px] font-mono text-zinc-500 flex items-center justify-center gap-1">
              <ShieldCheck size={12} className="text-[#a3e635]" />
              <span>Encrypted JWT Sessions • Zero Spam Guaranteed</span>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

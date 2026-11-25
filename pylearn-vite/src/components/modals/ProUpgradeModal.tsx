import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Sparkles,
  Check,
  Zap,
  ShieldCheck,
  Code2,
  Lock,
  ArrowRight,
  Brain,
  Award,
  Layers
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'

export default function ProUpgradeModal() {
  const { isPro, setIsPro, proModalOpen, closeProModal, proModalReason } = useAppStore()
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual')
  const [isProcessing, setIsProcessing] = useState(false)

  if (!proModalOpen) return null

  const handleSimulateUpgrade = async () => {
    setIsProcessing(true)
    try {
      await api.activatePlan(selectedPlan)
    } catch (e) {
      console.warn('Backend offline, applying local upgrade:', e)
    }
    setTimeout(() => {
      setIsPro(true)
      setIsProcessing(false)
      closeProModal()
    }, 500)
  }

  const features = [
    {
      icon: <Sparkles size={16} className="text-amber-400" />,
      title: '120+ Verified Optimal Solutions & Walkthroughs',
      desc: 'Instant access to step-by-step algorithmic derivations, optimal Python code, and complexity proofs.'
    },
    {
      icon: <Layers size={16} className="text-cyan-400" />,
      title: 'Real-Time System Design Scenarios',
      desc: 'Production patterns: JWT token parsers, Token bucket rate limiters, LRU TTL caches, Celery workers.'
    },
    {
      icon: <Brain size={16} className="text-purple-400" />,
      title: '🤖 AI Code Mentor (Interactive Debugger)',
      desc: 'Get immediate hints, bug explanations, and edge-case recommendations when your code fails.'
    },
    {
      icon: <Code2 size={16} className="text-emerald-400" />,
      title: 'Company-Tagged Problem Sets',
      desc: 'Curated tracks targeting Google, Amazon, Microsoft, and high-growth AI startups.'
    },
    {
      icon: <Award size={16} className="text-pink-400" />,
      title: 'Verifiable Certificate & GitHub Portfolio Export',
      desc: 'Export verified Capstone projects directly to your GitHub profile for technical interviews.'
    }
  ]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeProModal}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-[#181920] border-2 border-black rounded-2xl shadow-brutal-xl overflow-hidden flex flex-col z-10 select-none max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="p-6 pb-4 border-b-2 border-black flex items-start justify-between bg-[#121316]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#facc15] border-2 border-black shadow-brutal-sm flex items-center justify-center text-black font-black text-lg rotate-[-2deg]">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">UNLOCK PRO ACCESS</h2>
                  <span className="sticker-badge bg-[#f472b6] text-black text-[10px] rotate-[2deg]">
                    CAREER PASS
                  </span>
                </div>
                <p className="text-xs font-mono text-zinc-400 mt-0.5">
                  {proModalReason || 'Accelerate your transition to Senior AI & Backend Engineer.'}
                </p>
              </div>
            </div>

            <button
              onClick={closeProModal}
              className="w-7 h-7 rounded-lg bg-[#27272a] text-zinc-300 hover:text-white border-2 border-black shadow-brutal-sm flex items-center justify-center transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <X size={16} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#181920]">
            {/* Features Checklist */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-black uppercase tracking-wider text-zinc-400">
                EVERYTHING INCLUDED IN PRO:
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {features.map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[#121316] border-2 border-black shadow-brutal-sm"
                  >
                    <div className="p-1 rounded-md bg-[#27272a] border border-black shrink-0 mt-0.5">
                      {feat.icon}
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">{feat.title}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed font-medium">
                        {feat.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Selection */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-black uppercase tracking-wider text-zinc-400">
                SELECT YOUR PASS:
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {/* Monthly Plan */}
                <div
                  onClick={() => setSelectedPlan('monthly')}
                  className={`p-4 rounded-xl border-2 border-black cursor-pointer transition-all relative ${
                    selectedPlan === 'monthly'
                      ? 'bg-[#38bdf8] text-black shadow-brutal -translate-x-0.5 -translate-y-0.5'
                      : 'bg-[#121316] text-white shadow-brutal-sm hover:bg-[#22232a]'
                  }`}
                >
                  <span className="sticker-badge bg-[#27272a] text-zinc-300 text-[9px] absolute -top-2.5 right-3">
                    FLEXIBLE
                  </span>
                  <div className={`text-xs font-mono font-black ${selectedPlan === 'monthly' ? 'text-black' : 'text-zinc-300'}`}>
                    Monthly Pass
                  </div>
                  <div className="text-2xl font-black mt-1">
                    ₹499 <span className="text-xs font-mono font-normal">/ mo</span>
                  </div>
                  <div className={`text-[10px] font-mono font-bold mt-1 ${selectedPlan === 'monthly' ? 'text-black/80' : 'text-zinc-400'}`}>
                    Cancel anytime in 1 click
                  </div>
                </div>

                {/* Annual Plan (Discounted) */}
                <div
                  onClick={() => setSelectedPlan('annual')}
                  className={`p-4 rounded-xl border-2 border-black cursor-pointer transition-all relative ${
                    selectedPlan === 'annual'
                      ? 'bg-[#a3e635] text-black shadow-brutal -translate-x-0.5 -translate-y-0.5'
                      : 'bg-[#121316] text-white shadow-brutal-sm hover:bg-[#22232a]'
                  }`}
                >
                  <span className="sticker-badge bg-[#facc15] text-black text-[9px] absolute -top-2.5 right-3 rotate-[2deg]">
                    ⭐ SAVE 35%
                  </span>
                  <div className={`text-xs font-mono font-black ${selectedPlan === 'annual' ? 'text-black' : 'text-zinc-300'}`}>
                    1-Year Annual Pass
                  </div>
                  <div className="text-2xl font-black mt-1">
                    ₹3,999 <span className="text-xs font-mono font-normal">/ yr</span>
                  </div>
                  <div className={`text-[10px] font-mono font-bold mt-1 ${selectedPlan === 'annual' ? 'text-black/90' : 'text-[#a3e635]'}`}>
                    Just ₹333 / month (4 Months Free!)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer / Checkout Action */}
          <div className="p-4 border-t-2 border-black bg-[#121316] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
              <ShieldCheck size={16} className="text-[#a3e635]" />
              <span>UPI, Cards, NetBanking • 7-Day Guarantee</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleSimulateUpgrade}
                disabled={isProcessing}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#a3e635] text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
              >
                <span>{isProcessing ? 'ACTIVATING PRO...' : 'ACTIVATE PRO PASS →'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

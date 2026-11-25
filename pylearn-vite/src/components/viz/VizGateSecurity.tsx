'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Shield, Building, Coffee, AlertCircle } from 'lucide-react'

interface Props {
  data: {
    title?: string
    scenario?: 'if_only' | 'if_else' | 'if_elif_else'
    gateType?: string
    defaultCondition?: boolean
    initialScore?: number
  }
}

export default function VizGateSecurity({ data }: Props) {
  // Normalize scenario from either gateType or scenario
  const rawType = (data.gateType || data.scenario || 'if').toLowerCase().replace(/_/g, '-')
  const isIfOnly = rawType === 'if' || rawType === 'if-only'
  const isIfElse = rawType === 'if-else'
  const isIfElifElse = rawType === 'if-elif-else'

  const [hasPass, setHasPass] = useState(data.defaultCondition ?? true)
  const [userRole, setUserRole] = useState<'vip' | 'staff' | 'visitor'>('staff')

  // Calculate logic outcome
  let isAllowed = false
  let destination = ''
  let statusText = ''
  let codeSnippet = ''
  let badgeColor = ''

  if (isIfOnly) {
    isAllowed = hasPass
    destination = hasPass ? 'Main Office Building' : 'Stopped at Gate (No Entry)'
    statusText = hasPass ? 'if condition is True: Gate Opens' : 'if condition is False: Branch Skipped'
    codeSnippet = hasPass ? 'if has_pass: # True -> Gate opens!' : 'if has_pass: # False -> Does nothing'
    badgeColor = hasPass ? '#22c55e' : '#ef4444'
  } else if (isIfElse) {
    isAllowed = hasPass
    destination = hasPass ? 'Main Office Building (Branch A)' : 'Visitor Desk & Canteen (Branch B)'
    statusText = hasPass ? 'if True: Access Granted to Office' : 'else: Diverted to Visitor Canteen'
    codeSnippet = hasPass ? 'if destination == "OFFICE": # Branch A' : 'else: # Condition False -> Branch B fallback'
    badgeColor = hasPass ? '#22c55e' : '#fb923c'
  } else {
    // if-elif-else
    if (userRole === 'vip') {
      isAllowed = true
      destination = 'Reserved VIP Executive Bay'
      statusText = 'if role == "VIP": Fast-track lane'
      codeSnippet = 'if role == "VIP": # Priority lane unlocked'
      badgeColor = '#c084fc'
    } else if (userRole === 'staff') {
      isAllowed = true
      destination = 'Employee Parking & Workstations'
      statusText = 'elif role == "STAFF": Staff Gate'
      codeSnippet = 'elif role == "STAFF": # Employee access granted'
      badgeColor = '#38bdf8'
    } else {
      isAllowed = false
      destination = 'Visitor Desk & Canteen'
      statusText = 'else: Supervised Guest Access'
      codeSnippet = 'else: # Fallback visitor check-in'
      badgeColor = '#fb923c'
    }
  }

  return (
    <div className="flex flex-col gap-3 select-none w-full">
      {/* Interactive Controls Bar */}
      <div className="flex items-center justify-between bg-[#161722] p-2 rounded-xl border border-zinc-800 text-xs flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
            Test Condition:
          </span>

          {!isIfElifElse ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setHasPass(true)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border-2 border-black transition-all flex items-center gap-1.5 ${
                  hasPass
                    ? 'bg-[#22c55e] text-black shadow-brutal-sm -translate-x-0.5 -translate-y-0.5'
                    : 'bg-[#22232e] text-zinc-300 hover:text-white'
                }`}
              >
                <Check size={13} className="stroke-[3]" />
                <span>Has Security Pass (True)</span>
              </button>
              <button
                onClick={() => setHasPass(false)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border-2 border-black transition-all flex items-center gap-1.5 ${
                  !hasPass
                    ? 'bg-[#ef4444] text-white shadow-brutal-sm -translate-x-0.5 -translate-y-0.5'
                    : 'bg-[#22232e] text-zinc-300 hover:text-white'
                }`}
              >
                <X size={13} className="stroke-[3]" />
                <span>No Pass (False)</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setUserRole('vip')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border-2 border-black transition-all ${
                  userRole === 'vip'
                    ? 'bg-[#c084fc] text-black shadow-brutal-sm -translate-x-0.5 -translate-y-0.5'
                    : 'bg-[#22232e] text-zinc-300 hover:text-white'
                }`}
              >
                ⭐ VIP (if)
              </button>
              <button
                onClick={() => setUserRole('staff')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border-2 border-black transition-all ${
                  userRole === 'staff'
                    ? 'bg-[#38bdf8] text-black shadow-brutal-sm -translate-x-0.5 -translate-y-0.5'
                    : 'bg-[#22232e] text-zinc-300 hover:text-white'
                }`}
              >
                💼 Staff (elif)
              </button>
              <button
                onClick={() => setUserRole('visitor')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border-2 border-black transition-all ${
                  userRole === 'visitor'
                    ? 'bg-[#fb923c] text-black shadow-brutal-sm -translate-x-0.5 -translate-y-0.5'
                    : 'bg-[#22232e] text-zinc-300 hover:text-white'
                }`}
              >
                ☕ Visitor (else)
              </button>
            </div>
          )}
        </div>

        {/* Live Status Pill */}
        <span
          className="text-[10px] font-mono font-black px-2 py-0.5 rounded border border-black shadow-brutal-sm uppercase"
          style={{ backgroundColor: badgeColor, color: '#000000' }}
        >
          {isAllowed ? '✓ ACCESS GRANTED' : '✕ ACCESS DENIED / DIVERTED'}
        </span>
      </div>

      {/* Visual Simulation Track (Dark High-Contrast Canvas) */}
      <div className="relative bg-[#101118] border-2 border-black rounded-xl p-4 overflow-hidden flex items-center justify-between min-h-[110px] shadow-brutal-sm">
        {/* Road markings in the background */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] border-t-2 border-dashed border-zinc-800 pointer-events-none" />

        {/* The Animated Car */}
        <motion.div
          animate={{
            x: isAllowed
              ? 175
              : isIfOnly
              ? 20
              : 175,
            y: !isAllowed && !isIfOnly ? 32 : 0,
          }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          className="flex flex-col items-center z-10"
        >
          <div className="relative">
            <span className="text-3xl filter drop-shadow">🚗</span>
            {!isAllowed && isIfOnly && (
              <span className="absolute -top-1 -right-1 text-xs">⛔</span>
            )}
          </div>
          <span className="text-[10px] font-mono font-bold text-zinc-400 mt-0.5">
            Car
          </span>
        </motion.div>

        {/* Security Gate & Barrier Arm */}
        <div className="flex flex-col items-center relative z-10 mx-6">
          {/* Dual LED Traffic Light */}
          <div className="w-5 h-11 bg-black rounded-full flex flex-col items-center justify-around py-1 mb-1 border-2 border-zinc-700 shadow-md">
            {/* Red Light */}
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                !isAllowed
                  ? 'bg-[#ef4444] shadow-[0_0_10px_#ef4444]'
                  : 'bg-zinc-800'
              }`}
            />
            {/* Green Light */}
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                isAllowed
                  ? 'bg-[#22c55e] shadow-[0_0_10px_#22c55e]'
                  : 'bg-zinc-800'
              }`}
            />
          </div>

          {/* Barrier Arm with Smooth Spring Rotation */}
          <div className="relative w-16 h-2">
            <motion.div
              animate={{ rotate: isAllowed ? -65 : 0 }}
              style={{ originX: 0, originY: 0.5 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              className={`h-2.5 rounded-full border-2 border-black transition-colors ${
                isAllowed
                  ? 'bg-[#22c55e] shadow-[0_0_8px_#22c55e]'
                  : 'bg-[#ef4444] shadow-[0_0_8px_#ef4444]'
              }`}
            />
          </div>
          <span className="text-[9px] font-mono font-bold text-zinc-500 mt-1 uppercase">
            {isAllowed ? 'Open' : 'Shut'}
          </span>
        </div>

        {/* Destination Target Buildings */}
        <div className="flex flex-col gap-2 min-w-[190px] z-10">
          {/* Office / Allowed Path */}
          <div
            className={`px-3 py-1.5 rounded-xl border-2 transition-all flex items-center gap-2 ${
              isAllowed
                ? 'bg-[#22c55e]/15 border-[#22c55e] text-[#4ade80] font-black shadow-brutal-sm'
                : 'opacity-30 border-zinc-800 bg-[#161722] text-zinc-500'
            }`}
          >
            <Building size={14} className={isAllowed ? 'text-[#4ade80]' : 'text-zinc-600'} />
            <span className="text-xs font-mono font-bold">Main Office Building</span>
          </div>

          {/* Else / Canteen Path (for if_else and if_elif_else) */}
          {!isIfOnly && (
            <div
              className={`px-3 py-1.5 rounded-xl border-2 transition-all flex items-center gap-2 ${
                !isAllowed
                  ? 'bg-[#fb923c]/20 border-[#fb923c] text-[#fb923c] font-black shadow-brutal-sm'
                  : 'opacity-30 border-zinc-800 bg-[#161722] text-zinc-500'
              }`}
            >
              <Coffee size={14} className={!isAllowed ? 'text-[#fb923c]' : 'text-zinc-600'} />
              <span className="text-xs font-mono font-bold">Visitor Desk & Canteen</span>
            </div>
          )}
        </div>
      </div>

      {/* Code Execution Outcome Caption */}
      <div className="bg-[#161722] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs font-mono flex items-center justify-between text-zinc-300">
        <div className="flex items-center gap-2 truncate">
          <span className="text-[#facc15] font-black">▶ {codeSnippet}</span>
          <span className="text-zinc-500 hidden sm:inline">|</span>
          <span className="text-zinc-400 hidden sm:inline">Destination: <strong className="text-white">{destination}</strong></span>
        </div>
        <span className="text-[10px] text-zinc-400 font-bold flex-shrink-0 ml-2">
          {isAllowed ? '✓ EXECUTED' : '⊘ BLOCKED'}
        </span>
      </div>
    </div>
  )
}

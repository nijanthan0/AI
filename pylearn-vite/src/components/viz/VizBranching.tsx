'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { GitFork, ArrowDown, Check, X, Shield, Sparkles } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizBranching({ data }: Props) {
  const [mode, setMode] = useState<'if_else' | 'multi_tier'>('multi_tier')
  const [score, setScore] = useState<number>(85)

  // Determine active branch
  let activeBranch = 'else'
  if (mode === 'if_else') {
    activeBranch = score >= 50 ? 'if' : 'else'
  } else {
    if (score >= 90) activeBranch = 'tier_platinum'
    else if (score >= 75) activeBranch = 'tier_gold'
    else if (score >= 50) activeBranch = 'tier_silver'
    else activeBranch = 'tier_bronze'
  }

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <GitFork size={15} className="text-[#a3e635]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            DECISION FLOW: IF ➔ ELIF ➔ ELSE MULTI-LANE BRANCHING
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMode('if_else')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border border-black ${
              mode === 'if_else' ? 'bg-[#38bdf8] text-black font-black' : 'bg-[#22232e] text-zinc-400'
            }`}
          >
            if-else (2 Lanes)
          </button>
          <button
            onClick={() => setMode('multi_tier')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border border-black ${
              mode === 'multi_tier' ? 'bg-[#a3e635] text-black font-black' : 'bg-[#22232e] text-zinc-400'
            }`}
          >
            if-elif-else (Tiered)
          </button>
        </div>
      </div>

      {/* Interactive Value Slider */}
      <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold uppercase block">Condition Input:</span>
          <span className="text-white font-mono font-black text-sm">score = {score}</span>
        </div>

        <div className="flex-1 max-w-xs">
          <input
            type="range"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full accent-[#a3e635] cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-zinc-500 font-mono mt-0.5">
            <span>0</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Visual Execution Lanes */}
      <div className="bg-[#181926] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-2">
        <span className="text-[10px] text-zinc-400 font-bold uppercase">
          Sequential Branch Evaluation (Short-Circuits on First True):
        </span>

        {mode === 'multi_tier' ? (
          <div className="space-y-1.5">
            {/* Tier 1 */}
            <div className={`p-2 rounded-lg border-2 flex items-center justify-between transition-all ${
              activeBranch === 'tier_platinum'
                ? 'bg-[#22c55e]/20 border-[#22c55e] text-white shadow-brutal-sm'
                : 'bg-[#12131c] border-zinc-800 text-zinc-500'
            }`}>
              <span className="font-mono text-xs">
                <span className="text-[#c084fc] font-bold">if</span> score &gt;= 90: &nbsp;<span className="text-zinc-400"># Platinum VIP (30% Discount)</span>
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                score >= 90 ? 'bg-[#22c55e] text-black' : 'bg-black/50 text-zinc-500'
              }`}>
                {score >= 90 ? '✓ TRUE (EXECUTED)' : 'FALSE (Skip)'}
              </span>
            </div>

            {/* Tier 2 */}
            <div className={`p-2 rounded-lg border-2 flex items-center justify-between transition-all ${
              activeBranch === 'tier_gold'
                ? 'bg-[#22c55e]/20 border-[#22c55e] text-white shadow-brutal-sm'
                : 'bg-[#12131c] border-zinc-800 text-zinc-500'
            }`}>
              <span className="font-mono text-xs">
                <span className="text-[#c084fc] font-bold">elif</span> score &gt;= 75: &nbsp;<span className="text-zinc-400"># Gold Member (20% Discount)</span>
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                activeBranch === 'tier_gold' ? 'bg-[#22c55e] text-black' : 'bg-black/50 text-zinc-500'
              }`}>
                {score >= 90 ? 'SKIPPED (Already matched)' : score >= 75 ? '✓ TRUE (EXECUTED)' : 'FALSE (Skip)'}
              </span>
            </div>

            {/* Tier 3 */}
            <div className={`p-2 rounded-lg border-2 flex items-center justify-between transition-all ${
              activeBranch === 'tier_silver'
                ? 'bg-[#22c55e]/20 border-[#22c55e] text-white shadow-brutal-sm'
                : 'bg-[#12131c] border-zinc-800 text-zinc-500'
            }`}>
              <span className="font-mono text-xs">
                <span className="text-[#c084fc] font-bold">elif</span> score &gt;= 50: &nbsp;<span className="text-zinc-400"># Silver Member (10% Discount)</span>
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                activeBranch === 'tier_silver' ? 'bg-[#22c55e] text-black' : 'bg-black/50 text-zinc-500'
              }`}>
                {score >= 75 ? 'SKIPPED' : score >= 50 ? '✓ TRUE (EXECUTED)' : 'FALSE'}
              </span>
            </div>

            {/* Tier 4 (Else) */}
            <div className={`p-2 rounded-lg border-2 flex items-center justify-between transition-all ${
              activeBranch === 'tier_bronze'
                ? 'bg-[#22c55e]/20 border-[#22c55e] text-white shadow-brutal-sm'
                : 'bg-[#12131c] border-zinc-800 text-zinc-500'
            }`}>
              <span className="font-mono text-xs">
                <span className="text-[#c084fc] font-bold">else</span>: &nbsp;<span className="text-zinc-400"># Standard Rate (0% Discount)</span>
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                activeBranch === 'tier_bronze' ? 'bg-[#22c55e] text-black' : 'bg-black/50 text-zinc-500'
              }`}>
                {activeBranch === 'tier_bronze' ? 'FALLBACK EXECUTED' : 'SKIPPED'}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className={`p-2 rounded-lg border-2 flex items-center justify-between ${
              activeBranch === 'if' ? 'bg-[#22c55e]/20 border-[#22c55e] text-white' : 'bg-[#12131c] border-zinc-800 text-zinc-500'
            }`}>
              <span className="font-mono text-xs font-bold text-white">if score &gt;= 50: # Access Granted</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${activeBranch === 'if' ? 'bg-[#22c55e] text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                {activeBranch === 'if' ? '✓ EXECUTED' : 'SKIPPED'}
              </span>
            </div>

            <div className={`p-2 rounded-lg border-2 flex items-center justify-between ${
              activeBranch === 'else' ? 'bg-[#ef4444]/20 border-[#ef4444] text-white' : 'bg-[#12131c] border-zinc-800 text-zinc-500'
            }`}>
              <span className="font-mono text-xs font-bold text-white">else: # Access Denied</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${activeBranch === 'else' ? 'bg-[#ef4444] text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                {activeBranch === 'else' ? '✓ EXECUTED' : 'SKIPPED'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

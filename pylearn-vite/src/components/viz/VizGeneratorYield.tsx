'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Zap, Cpu, Database, RotateCcw, ArrowRight } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizGeneratorYield({ data }: Props) {
  const steps = [
    { yieldVal: 10, label: 'Record #10', frameState: 'Suspended at line 4 (num=10)' },
    { yieldVal: 20, label: 'Record #20', frameState: 'Suspended at line 4 (num=20)' },
    { yieldVal: 30, label: 'Record #30', frameState: 'Suspended at line 4 (num=30)' },
    { yieldVal: 40, label: 'Record #40', frameState: 'Suspended at line 4 (num=40)' },
  ]

  const [stepIndex, setStepIndex] = useState<number>(-1) // -1 = created but not started
  const [history, setHistory] = useState<number[]>([])

  const advanceNext = () => {
    if (stepIndex >= steps.length - 1) return // StopIteration

    const nextIdx = stepIndex + 1
    setStepIndex(nextIdx)
    setHistory(prev => [...prev, steps[nextIdx].yieldVal])
  }

  const resetGen = () => {
    setStepIndex(-1)
    setHistory([])
  }

  const isClosed = stepIndex >= steps.length - 1
  const isCreated = stepIndex === -1
  const isSuspended = stepIndex >= 0 && !isClosed

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Zap size={15} className="text-[#facc15]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            GENERATORS & YIELD: STREAMING LAZY EVALUATION
          </span>
        </div>
        <span className="text-[10px] bg-[#a3e635] text-black font-black px-2 py-0.5 rounded border border-black shadow-brutal-sm">
          RAM: 112 Bytes (O(1))
        </span>
      </div>

      {/* Code vs Memory Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Python Generator Function */}
        <div className="bg-[#12131c] p-2.5 rounded-xl border-2 border-black text-[11px] leading-relaxed">
          <span className="text-[#c084fc]">def</span> <span className="text-[#38bdf8]">stream_logs</span>():<br />
          &nbsp;&nbsp;<span className="text-[#c084fc]">for</span> num <span className="text-[#c084fc]">in</span> [10, 20, 30, 40]:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#facc15] font-black underline">yield num</span> <span className="text-zinc-500"># Pauses frame!</span><br />
          <div className="mt-2 pt-2 border-t border-zinc-800 text-[10px] text-zinc-400">
            gen = stream_logs() &nbsp;<span className="text-zinc-500"># Returns generator obj</span><br />
            val = <span className="text-[#a3e635] font-bold">next(gen)</span> &nbsp;&nbsp;&nbsp;<span className="text-zinc-500"># Resumes to next yield</span>
          </div>
        </div>

        {/* State Machine Status Box */}
        <div className="bg-[#181926] p-2.5 rounded-xl border-2 border-black flex flex-col justify-between">
          <div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Generator State</div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full animate-pulse ${
                isCreated ? 'bg-[#38bdf8]' : isSuspended ? 'bg-[#facc15]' : 'bg-[#ef4444]'
              }`} />
              <span className="text-sm font-black text-white font-mono uppercase">
                {isCreated ? 'GEN_CREATED' : isSuspended ? 'GEN_SUSPENDED' : 'GEN_CLOSED (StopIteration)'}
              </span>
            </div>
          </div>

          <div className="text-[10px] bg-black/40 p-2 rounded-lg border border-zinc-800 mt-2 text-zinc-300">
            {isCreated && 'Generator object initialized. No code has executed yet!'}
            {isSuspended && steps[stepIndex].frameState}
            {isClosed && 'Iteration completed. Next call to next() raises StopIteration!'}
          </div>
        </div>
      </div>

      {/* Yield Stream Pipeline */}
      <div className="bg-[#181926] p-3 rounded-xl border-2 border-black flex flex-col gap-2 shadow-brutal-sm">
        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase">
          <span>Streamed Yield Values:</span>
          <span>Buffer: {history.length} / {steps.length} yielded</span>
        </div>

        <div className="flex items-center justify-center gap-2 py-1">
          {steps.map((st, idx) => {
            const hasYielded = idx <= stepIndex
            const isLatest = idx === stepIndex

            return (
              <motion.div
                key={idx}
                animate={{ scale: isLatest ? 1.12 : 1 }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 min-w-[65px] transition-all ${
                  isLatest
                    ? 'bg-[#a3e635] text-black border-black shadow-brutal-sm font-black'
                    : hasYielded
                    ? 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/50'
                    : 'bg-[#12131c] text-zinc-600 border-zinc-800 opacity-50'
                }`}
              >
                <span className="text-[9px] font-bold">yield #{idx + 1}</span>
                <span className="text-base font-black font-mono my-0.5">{st.yieldVal}</span>
                <span className="text-[8px]">
                  {isLatest ? 'ACTIVE' : hasYielded ? 'PRODUCED' : 'PENDING'}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={advanceNext}
          disabled={isClosed}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#facc15] hover:bg-[#eab308] disabled:opacity-40 text-black font-black rounded-xl border-2 border-black shadow-brutal-sm transition-all"
        >
          <Play size={14} />
          <span>CALL next(gen) ➔ YIELD RECORD</span>
        </button>

        <button
          onClick={resetGen}
          className="flex items-center gap-1 px-3 py-2.5 bg-[#27272a] hover:bg-[#3f3f46] text-white font-bold rounded-xl border-2 border-black shadow-brutal-sm"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUp, Zap, RotateCcw, Sparkles } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizMinStack({ data }: Props) {
  const [mainStack, setMainStack] = useState<number[]>([15, 8, 12, 3])
  const [minStack, setMinStack] = useState<number[]>([15, 8, 8, 3])
  const [inputValue, setInputValue] = useState<number>(6)

  const pushVal = () => {
    if (mainStack.length >= 5) return
    const currentMin = minStack.length > 0 ? minStack[minStack.length - 1] : inputValue
    const newMin = Math.min(currentMin, inputValue)

    setMainStack(prev => [...prev, inputValue])
    setMinStack(prev => [...prev, newMin])
  }

  const popVal = () => {
    if (mainStack.length > 0) {
      setMainStack(prev => prev.slice(0, -1))
      setMinStack(prev => prev.slice(0, -1))
    }
  }

  const resetAll = () => {
    setMainStack([15, 8, 12, 3])
    setMinStack([15, 8, 8, 3])
  }

  const currentMin = minStack.length > 0 ? minStack[minStack.length - 1] : 'None'

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Zap size={15} className="text-[#a3e635]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            LEETCODE #155: MIN STACK WITH O(1) getMin()
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#22c55e]/20 border border-[#22c55e] px-2 py-0.5 rounded text-[#22c55e] font-black text-xs">
          <span>getMin() = {currentMin}</span>
        </div>
      </div>

      {/* Dual Stacks Side-by-Side */}
      <div className="grid grid-cols-2 gap-3 bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm">
        {/* Main Stack */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-zinc-400 font-bold uppercase mb-1">
            1. Main Value Stack
          </span>
          <div className="w-full bg-[#1a1b2a] border-2 border-zinc-700 rounded-b-xl flex flex-col-reverse p-2 gap-1 border-t-0 min-h-[95px] justify-start">
            {mainStack.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#38bdf8] text-black font-black text-center py-1 rounded text-xs border border-black"
              >
                {val} {idx === mainStack.length - 1 && '(TOP)'}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Auxiliary Min Stack */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-zinc-400 font-bold uppercase mb-1">
            2. Auxiliary Min Stack (O(1))
          </span>
          <div className="w-full bg-[#1a1b2a] border-2 border-[#a3e635] rounded-b-xl flex flex-col-reverse p-2 gap-1 border-t-0 min-h-[95px] justify-start shadow-brutal-sm">
            {minStack.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#a3e635] text-black font-black text-center py-1 rounded text-xs border border-black"
              >
                min = {val} {idx === minStack.length - 1 && '⭐'}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="flex items-center gap-2 bg-[#181926] p-2.5 rounded-xl border-2 border-black">
        <span className="text-zinc-400 text-xs">Push Value:</span>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(Number(e.target.value))}
          className="w-16 bg-black/60 text-white font-mono text-center py-1 rounded border border-zinc-700 outline-none"
        />

        <button
          onClick={pushVal}
          disabled={mainStack.length >= 5}
          className="px-3 py-1.5 bg-[#a3e635] hover:bg-[#84cc16] disabled:opacity-40 text-black font-black rounded-lg border border-black text-xs shadow-brutal-sm"
        >
          + push(val)
        </button>

        <button
          onClick={popVal}
          disabled={mainStack.length === 0}
          className="px-3 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] disabled:opacity-40 text-white font-black rounded-lg border border-black text-xs shadow-brutal-sm"
        >
          - pop()
        </button>

        <button
          onClick={resetAll}
          className="flex items-center gap-1 ml-auto px-2 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-white font-bold rounded-lg border border-zinc-700 text-[10px]"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  )
}

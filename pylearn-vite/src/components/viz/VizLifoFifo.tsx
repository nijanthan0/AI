'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUp, ArrowRight, RotateCcw, Layers } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizLifoFifo({ data }: Props) {
  const [stack, setStack] = useState<number[]>([10, 20, 30])
  const [queue, setQueue] = useState<number[]>([10, 20, 30])

  const pushStack = () => {
    if (stack.length < 5) {
      setStack(prev => [...prev, (prev[prev.length - 1] || 0) + 10])
    }
  }

  const popStack = () => {
    if (stack.length > 0) {
      setStack(prev => prev.slice(0, -1))
    }
  }

  const enqueue = () => {
    if (queue.length < 5) {
      setQueue(prev => [...prev, (prev[prev.length - 1] || 0) + 10])
    }
  }

  const dequeue = () => {
    if (queue.length > 0) {
      setQueue(prev => prev.slice(1))
    }
  }

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-[#a3e635]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            DATA STRUCTURES: STACK (LIFO) VS QUEUE (FIFO)
          </span>
        </div>
        <span className="text-[10px] bg-black/40 text-zinc-400 px-2 py-0.5 rounded border border-white/10">
          collections.deque: O(1) Speed
        </span>
      </div>

      {/* Side-by-Side Comparison Container */}
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
        {/* Stack (LIFO) */}
        <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#38bdf8] font-black text-xs">1. STACK (LIFO)</span>
              <span className="text-[9px] bg-[#38bdf8]/20 text-[#38bdf8] px-1.5 py-0.2 rounded font-bold">
                Last-In, First-Out
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 mb-2">
              Elements pushed and popped strictly from the TOP.
            </p>
          </div>

          {/* Vertical Stack Drawing */}
          <div className="w-full bg-[#1a1b2a] border-2 border-zinc-700 rounded-b-xl flex flex-col-reverse p-2 gap-1 border-t-0 min-h-[90px] justify-start">
            {stack.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-[#38bdf8] text-black font-black text-center py-1 rounded text-xs border border-black"
              >
                {val} {idx === stack.length - 1 && '(TOP)'}
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 mt-2">
            <button
              onClick={pushStack}
              disabled={stack.length >= 5}
              className="flex-1 py-1.5 bg-[#a3e635] hover:bg-[#84cc16] disabled:opacity-40 text-black font-black rounded-lg border border-black text-[10px]"
            >
              + Push
            </button>
            <button
              onClick={popStack}
              disabled={stack.length === 0}
              className="flex-1 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] disabled:opacity-40 text-white font-black rounded-lg border border-black text-[10px]"
            >
              - Pop
            </button>
          </div>
        </div>

        {/* Queue (FIFO) */}
        <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#facc15] font-black text-xs">2. QUEUE (FIFO)</span>
              <span className="text-[9px] bg-[#facc15]/20 text-[#facc15] px-1.5 py-0.2 rounded font-bold">
                First-In, First-Out
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 mb-2">
              Elements enter at REAR and leave from FRONT.
            </p>
          </div>

          {/* Horizontal Queue Tube */}
          <div className="w-full bg-[#1a1b2a] border-2 border-zinc-700 rounded-xl flex items-center p-2 gap-1 min-h-[90px] overflow-x-auto justify-center">
            {queue.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-[#facc15] text-black font-black text-center px-2 py-2 rounded text-xs border border-black min-w-[42px]"
              >
                {val}
                <div className="text-[8px] font-normal">
                  {idx === 0 ? 'FRONT' : idx === queue.length - 1 ? 'REAR' : ''}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 mt-2">
            <button
              onClick={enqueue}
              disabled={queue.length >= 5}
              className="flex-1 py-1.5 bg-[#a3e635] hover:bg-[#84cc16] disabled:opacity-40 text-black font-black rounded-lg border border-black text-[10px]"
            >
              + Enqueue
            </button>
            <button
              onClick={dequeue}
              disabled={queue.length === 0}
              className="flex-1 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] disabled:opacity-40 text-white font-black rounded-lg border border-black text-[10px]"
            >
              - Dequeue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Repeat, Play, SkipForward, AlertCircle, RotateCcw, CheckCircle2 } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizLoopControl({ data }: Props) {
  const [mode, setMode] = useState<'for' | 'while'>('for')
  const [items, setItems] = useState<number[]>([10, 25, 40, 55, 70, 85])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [accumulator, setAccumulator] = useState<number>(0)
  const [history, setHistory] = useState<string[]>([])
  const [status, setStatus] = useState<'running' | 'break' | 'completed'>('running')

  const resetLoop = (newMode = mode) => {
    setMode(newMode)
    setCurrentIndex(0)
    setAccumulator(0)
    setHistory([])
    setStatus('running')
  }

  // Step forward one iteration
  const stepForward = () => {
    if (status !== 'running') return

    if (currentIndex >= items.length) {
      setStatus('completed')
      setHistory(prev => [...prev, `🏁 Loop finished all ${items.length} items. for-else block executed!`])
      return
    }

    const val = items[currentIndex]
    const nextAcc = accumulator + val
    setAccumulator(nextAcc)
    setHistory(prev => [...prev, `Iteration ${currentIndex + 1}: num=${val} | accumulator=${nextAcc}`])

    if (currentIndex + 1 >= items.length) {
      setCurrentIndex(currentIndex + 1)
      setStatus('completed')
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  // Trigger break statement
  const triggerBreak = () => {
    if (status !== 'running') return
    setStatus('break')
    setHistory(prev => [...prev, `⛔ 'break' statement executed at item ${items[currentIndex]}! Exited loop immediately without executing 'else:' clause.`])
  }

  // Trigger continue statement
  const triggerContinue = () => {
    if (status !== 'running') return
    const val = items[currentIndex]
    setHistory(prev => [...prev, `↷ 'continue' executed on ${val}! Skipped accumulation step.`])
    if (currentIndex + 1 >= items.length) {
      setStatus('completed')
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header and Controls */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Repeat size={15} className="text-[#a3e635]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            LOOP CONTROL ENGINE: for, while, break, continue
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => resetLoop('for')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border border-black ${
              mode === 'for' ? 'bg-[#a3e635] text-black font-black' : 'bg-[#22232e] text-zinc-400'
            }`}
          >
            for loop
          </button>
          <button
            onClick={() => resetLoop('while')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border border-black ${
              mode === 'while' ? 'bg-[#38bdf8] text-black font-black' : 'bg-[#22232e] text-zinc-400'
            }`}
          >
            while loop
          </button>
        </div>
      </div>

      {/* Code Snippet Display */}
      <div className="bg-[#12131c] p-2.5 rounded-xl border-2 border-black text-[11px] text-zinc-300 font-mono">
        <span className="text-[#f472b6]">total</span> = <span className="text-[#38bdf8]">{accumulator}</span><br />
        <span className="text-[#c084fc]">
          {mode === 'for' ? 'for' : 'while'}
        </span>{' '}
        {mode === 'for' ? 'num in [10, 25, 40, 55, 70, 85]:' : 'count < 6:'}<br />
        &nbsp;&nbsp;<span className="text-zinc-500"># Current Element active pointer</span><br />
        &nbsp;&nbsp;<span className="text-[#a3e635]">total += num</span><br />
        &nbsp;&nbsp;<span className="text-[#fb923c]">if total &gt; 100: break</span>
      </div>

      {/* Visual Sequence Array */}
      <div className="bg-[#181926] p-3 rounded-xl border-2 border-black flex flex-col gap-2 shadow-brutal-sm">
        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase">
          <span>Iterated Collection (items)</span>
          <span>Pointer: Index [{currentIndex < items.length ? currentIndex : 'END'}]</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1 justify-center">
          {items.map((val, idx) => {
            const isCurrent = idx === currentIndex && status === 'running'
            const isProcessed = idx < currentIndex

            return (
              <motion.div
                key={idx}
                animate={{ scale: isCurrent ? 1.12 : 1 }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 min-w-[50px] transition-all ${
                  isCurrent
                    ? 'bg-[#a3e635] text-black border-black shadow-brutal-sm font-black -translate-y-1'
                    : isProcessed
                    ? 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/40'
                    : 'bg-[#1e1f2e] text-zinc-500 border-zinc-700/80'
                }`}
              >
                <span className="text-[9px] font-bold">i = {idx}</span>
                <span className="text-sm font-black my-0.5">{val}</span>
                <span className="text-[8px] font-mono">
                  {isCurrent ? '👉 ACTIVE' : isProcessed ? '✓ DONE' : 'WAIT'}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={stepForward}
          disabled={status !== 'running'}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-40 text-black font-black rounded-xl border-2 border-black shadow-brutal-sm transition-all"
        >
          <Play size={13} />
          <span>STEP NEXT ITERATION</span>
        </button>

        <button
          onClick={triggerContinue}
          disabled={status !== 'running'}
          className="flex items-center gap-1 px-3 py-2 bg-[#38bdf8] hover:bg-[#0284c7] disabled:opacity-40 text-black font-bold rounded-xl border-2 border-black shadow-brutal-sm text-[10px]"
        >
          <SkipForward size={12} />
          <span>continue</span>
        </button>

        <button
          onClick={triggerBreak}
          disabled={status !== 'running'}
          className="flex items-center gap-1 px-3 py-2 bg-[#ef4444] hover:bg-[#dc2626] disabled:opacity-40 text-white font-bold rounded-xl border-2 border-black shadow-brutal-sm text-[10px]"
        >
          <AlertCircle size={12} />
          <span>break</span>
        </button>

        <button
          onClick={() => resetLoop()}
          className="flex items-center gap-1 px-3 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white font-bold rounded-xl border-2 border-black shadow-brutal-sm text-[10px]"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Execution Log */}
      <div className="bg-[#12131c] p-2.5 rounded-xl border-2 border-black max-h-[85px] overflow-y-auto space-y-1">
        {history.length === 0 ? (
          <span className="text-zinc-600 text-[10px]">Click [STEP NEXT ITERATION] to watch the loop step through each element...</span>
        ) : (
          history.map((log, i) => (
            <div key={i} className="text-[10px] text-zinc-300 font-mono">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

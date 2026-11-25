'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Play, RotateCcw, Layers } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizParentheses({ data }: Props) {
  const [expr, setExpr] = useState<string>('{[()]}')
  const [stepIdx, setStepIdx] = useState<number>(0)
  const [stack, setStack] = useState<string[]>([])
  const [status, setStatus] = useState<'running' | 'valid' | 'invalid'>('running')
  const [statusMsg, setStatusMsg] = useState<string>('Ready to test')

  const PAIR_MAP: Record<string, string> = { ')': '(', ']': '[', '}': '{' }

  const resetAll = (newExpr = expr) => {
    setExpr(newExpr)
    setStepIdx(0)
    setStack([])
    setStatus('running')
    setStatusMsg('Ready to step through characters')
  }

  const stepForward = () => {
    if (status !== 'running') return

    if (stepIdx >= expr.length) {
      if (stack.length === 0) {
        setStatus('valid')
        setStatusMsg('All brackets matched! Stack is empty ➔ Return True')
      } else {
        setStatus('invalid')
        setStatusMsg(`Unmatched opening brackets remaining: [${stack.join(', ')}] ➔ Return False`)
      }
      return
    }

    const ch = expr[stepIdx]

    if (ch === '(' || ch === '[' || ch === '{') {
      // Push opening bracket
      setStack(prev => [...prev, ch])
      setStatusMsg(`Read '${ch}' ➔ Pushed onto Stack`)
      setStepIdx(stepIdx + 1)
    } else if (ch === ')' || ch === ']' || ch === '}') {
      // Closing bracket: check top of stack
      if (stack.length === 0) {
        setStatus('invalid')
        setStatusMsg(`Read '${ch}' but stack is empty! No matching open bracket ➔ Return False`)
        return
      }

      const top = stack[stack.length - 1]
      if (PAIR_MAP[ch] === top) {
        setStack(prev => prev.slice(0, -1))
        setStatusMsg(`Read '${ch}' ➔ Matched '${top}' at top of stack! Popped successfully.`)
        setStepIdx(stepIdx + 1)
      } else {
        setStatus('invalid')
        setStatusMsg(`Mismatched bracket! Read '${ch}' but top of stack was '${top}' ➔ Return False`)
      }
    } else {
      setStepIdx(stepIdx + 1)
    }
  }

  const PRESETS = ['{[()]}', '([)]', '(]', '()[]{}', '(((']

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-[#38bdf8]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            LEETCODE #20: VALID PARENTHESES (LIFO STACK)
          </span>
        </div>
        <div className="flex items-center gap-1">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => resetAll(p)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                expr === p ? 'bg-[#a3e635] text-black border-black font-black' : 'bg-[#181926] text-zinc-400 border-zinc-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Expression String Stream */}
      <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black flex items-center justify-center gap-2">
        {expr.split('').map((ch, idx) => {
          const isCurrent = idx === stepIdx && status === 'running'
          const isDone = idx < stepIdx

          return (
            <motion.div
              key={idx}
              animate={{ scale: isCurrent ? 1.2 : 1 }}
              className={`w-9 h-9 flex flex-col items-center justify-center rounded-xl border-2 font-mono font-black text-sm transition-all ${
                isCurrent
                  ? 'bg-[#facc15] text-black border-black shadow-brutal-sm -translate-y-1'
                  : isDone
                  ? 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/40'
                  : 'bg-[#1a1b2a] text-zinc-500 border-zinc-700'
              }`}
            >
              <span>{ch}</span>
            </motion.div>
          )
        })}
      </div>

      {/* Visual Vertical Stack Container */}
      <div className="bg-[#181926] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-400 font-bold uppercase mb-1">
            LIFO Bracket Stack (Top ➔ Bottom)
          </span>
          <div className="text-zinc-300 text-[11px] font-sans">
            {statusMsg}
          </div>
        </div>

        {/* Stack Box */}
        <div className="w-32 min-h-[85px] bg-[#12131c] border-2 border-zinc-600 rounded-b-xl flex flex-col-reverse p-1.5 gap-1 border-t-0 shadow-inner">
          {stack.length === 0 ? (
            <div className="text-center text-zinc-600 text-[10px] my-auto">
              (Empty Stack)
            </div>
          ) : (
            stack.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#38bdf8] text-black font-black font-mono text-center py-1 rounded text-xs border border-black shadow-sm"
              >
                {item}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={stepForward}
          disabled={status !== 'running'}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#a3e635] hover:bg-[#84cc16] disabled:opacity-40 text-black font-black rounded-xl border-2 border-black shadow-brutal-sm transition-all"
        >
          <Play size={14} />
          <span>
            {status === 'running'
              ? `STEP CHAR #${stepIdx + 1}: '${expr[stepIdx] || 'END'}'`
              : status === 'valid'
              ? 'VALID PARENTHESES! (True)'
              : 'INVALID PARENTHESES! (False)'}
          </span>
        </button>

        <button
          onClick={() => resetAll()}
          className="flex items-center gap-1 px-3 py-2.5 bg-[#27272a] hover:bg-[#3f3f46] text-white font-bold rounded-xl border-2 border-black shadow-brutal-sm"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  )
}

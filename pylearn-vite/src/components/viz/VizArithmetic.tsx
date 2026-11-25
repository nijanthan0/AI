'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, ArrowRight, RotateCcw, Sparkles } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizArithmetic({ data }: Props) {
  const [valA, setValA] = useState<number>(17)
  const [valB, setValB] = useState<number>(5)
  const [op, setOp] = useState<'+' | '-' | '*' | '/' | '//' | '%' | '**'>('//')
  const [accumulator, setAccumulator] = useState<number>(10)

  const compute = (a: number, b: number, o: string) => {
    switch (o) {
      case '+': return a + b
      case '-': return a - b
      case '*': return a * b
      case '/': return b === 0 ? 'ZeroDivisionError' : Number((a / b).toFixed(4))
      case '//': return b === 0 ? 'ZeroDivisionError' : Math.floor(a / b)
      case '%': return b === 0 ? 'ZeroDivisionError' : a % b
      case '**': return a ** b
      default: return 0
    }
  }

  const applyCompound = (compoundOp: string) => {
    const res = compute(accumulator, 2, compoundOp)
    if (typeof res === 'number') {
      setAccumulator(res)
    }
  }

  const result = compute(valA, valB, op)

  const OPERATORS = [
    { symbol: '+', name: 'Addition', note: 'Normal sum' },
    { symbol: '-', name: 'Subtraction', note: 'Difference' },
    { symbol: '*', name: 'Multiplication', note: 'Product' },
    { symbol: '/', name: 'True Division', note: 'Always returns float (17 / 5 = 3.4)' },
    { symbol: '//', name: 'Floor Division', note: 'Truncates down toward -infinity (17 // 5 = 3)' },
    { symbol: '%', name: 'Modulo', note: 'Remainder (17 % 5 = 2)' },
    { symbol: '**', name: 'Power', note: 'Exponentiation (17 ** 2)' },
  ]

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Calculator size={15} className="text-[#a3e635]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            ARITHMETIC & COMPOUND ASSIGNMENT ENGINE
          </span>
        </div>
        <span className="text-[10px] bg-black/40 text-zinc-400 px-2 py-0.5 rounded border border-white/10">
          CPython Math Model
        </span>
      </div>

      {/* Operator Selector Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
        {OPERATORS.map((o) => (
          <button
            key={o.symbol}
            onClick={() => setOp(o.symbol as any)}
            className={`p-1.5 rounded-lg border-2 transition-all text-left ${
              op === o.symbol
                ? 'bg-[#a3e635] text-black border-black shadow-brutal-sm font-black'
                : 'bg-[#181926] text-zinc-400 border-zinc-700 hover:text-white'
            }`}
          >
            <div className="font-mono text-xs font-black">{o.symbol} &nbsp;({o.name})</div>
          </button>
        ))}
      </div>

      {/* Live Calculation Display */}
      <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm font-black">
          <span className="text-[#38bdf8] bg-black/50 px-2.5 py-1 rounded border border-zinc-800">
            a = {valA}
          </span>
          <span className="text-[#a3e635] text-base">{op}</span>
          <span className="text-[#f472b6] bg-black/50 px-2.5 py-1 rounded border border-zinc-800">
            b = {valB}
          </span>
          <ArrowRight size={16} className="text-zinc-500" />
          <span className="text-white font-mono bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e] px-3 py-1 rounded">
            result = {String(result)}
          </span>
        </div>
        <span className="text-[10px] text-zinc-400">
          {op === '/' && 'Float type'}
          {op === '//' && 'Integer floor'}
          {op === '%' && 'Modulo remainder'}
        </span>
      </div>

      {/* Compound Assignment Demo (x += 2) */}
      <div className="bg-[#181926] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-400 font-bold uppercase">
            Compound Assignment (In-Place Mutation)
          </span>
          <button
            onClick={() => setAccumulator(10)}
            className="flex items-center gap-1 text-[9px] text-zinc-400 hover:text-white"
          >
            <RotateCcw size={10} />
            <span>Reset x to 10</span>
          </button>
        </div>

        <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg border border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 text-xs">Current Variable:</span>
            <code className="text-[#facc15] font-black text-sm">x = {accumulator}</code>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => applyCompound('+')}
              className="px-2 py-1 bg-[#252739] hover:bg-[#a3e635] hover:text-black font-bold rounded border border-black text-[10px]"
            >
              x += 2
            </button>
            <button
              onClick={() => applyCompound('*')}
              className="px-2 py-1 bg-[#252739] hover:bg-[#38bdf8] hover:text-black font-bold rounded border border-black text-[10px]"
            >
              x *= 2
            </button>
            <button
              onClick={() => applyCompound('//')}
              className="px-2 py-1 bg-[#252739] hover:bg-[#f472b6] hover:text-black font-bold rounded border border-black text-[10px]"
            >
              x //= 2
            </button>
            <button
              onClick={() => applyCompound('**')}
              className="px-2 py-1 bg-[#252739] hover:bg-[#facc15] hover:text-black font-bold rounded border border-black text-[10px]"
            >
              x **= 2
            </button>
          </div>
        </div>

        <p className="text-[10px] text-zinc-400">
          Compound operators like <code className="text-white">x += 2</code> evaluate <code className="text-white">x = x + 2</code>, but for mutable objects (like lists), <code className="text-white">+=</code> calls <code className="text-[#a3e635]">__iadd__</code> to mutate the object in place without allocating a new object address!
        </p>
      </div>
    </div>
  )
}

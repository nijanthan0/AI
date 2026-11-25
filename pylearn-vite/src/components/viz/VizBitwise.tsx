'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Binary, ArrowRight, Zap, RefreshCw } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizBitwise({ data }: Props) {
  const [a, setA] = useState<number>(12)
  const [b, setB] = useState<number>(25)
  const [op, setOp] = useState<'&' | '|' | '^' | '<<' | '>>'>('&')

  const to8Bit = (n: number) => {
    const unsigned = (n >>> 0) & 0xff
    return unsigned.toString(2).padStart(8, '0').split('')
  }

  const compute = () => {
    switch (op) {
      case '&': return a & b
      case '|': return a | b
      case '^': return a ^ b
      case '<<': return a << 1
      case '>>': return a >> 1
      default: return 0
    }
  }

  const result = compute()
  const bitsA = to8Bit(a)
  const bitsB = to8Bit(b)
  const bitsRes = to8Bit(result)

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Binary size={15} className="text-[#a3e635]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            BITWISE LOGIC & BINARY REGISTER
          </span>
        </div>
        <span className="text-[10px] bg-black/40 text-zinc-400 px-2 py-0.5 rounded border border-white/10">
          8-Bit Register Representation
        </span>
      </div>

      {/* Operator Selector */}
      <div className="flex items-center gap-1.5 justify-center bg-[#181926] p-2 rounded-xl border-2 border-black">
        {(['&', '|', '^', '<<', '>>'] as const).map((o) => (
          <button
            key={o}
            onClick={() => setOp(o)}
            className={`flex-1 py-1 rounded text-xs font-black border transition-all ${
              op === o
                ? 'bg-[#a3e635] text-black border-black shadow-brutal-sm -translate-y-0.5'
                : 'bg-[#22232e] text-zinc-400 border-zinc-700 hover:text-white'
            }`}
          >
            {o === '&' && 'a & b (AND)'}
            {o === '|' && 'a | b (OR)'}
            {o === '^' && 'a ^ b (XOR)'}
            {o === '<<' && 'a << 1 (Left Shift)'}
            {o === '>>' && 'a >> 1 (Right Shift)'}
          </button>
        ))}
      </div>

      {/* Bit Visualizer Table */}
      <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-2">
        {/* Row A */}
        <div className="flex items-center justify-between">
          <span className="w-20 text-[#38bdf8] font-bold">a = {a}</span>
          <div className="flex items-center gap-1">
            {bitsA.map((bit, i) => (
              <span
                key={i}
                className={`w-7 h-7 flex items-center justify-center rounded font-bold border ${
                  bit === '1' ? 'bg-[#38bdf8] text-black border-black font-black' : 'bg-black/50 text-zinc-600 border-zinc-800'
                }`}
              >
                {bit}
              </span>
            ))}
          </div>
        </div>

        {/* Row B (if binary op) */}
        {op !== '<<' && op !== '>>' && (
          <div className="flex items-center justify-between">
            <span className="w-20 text-[#f472b6] font-bold">b = {b}</span>
            <div className="flex items-center gap-1">
              {bitsB.map((bit, i) => (
                <span
                  key={i}
                  className={`w-7 h-7 flex items-center justify-center rounded font-bold border ${
                    bit === '1' ? 'bg-[#f472b6] text-black border-black font-black' : 'bg-black/50 text-zinc-600 border-zinc-800'
                  }`}
                >
                  {bit}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-zinc-800 my-1" />

        {/* Result Row */}
        <div className="flex items-center justify-between">
          <span className="w-20 text-[#a3e635] font-black">
            {op === '<<' ? 'a << 1' : op === '>>' ? 'a >> 1' : `a ${op} b`} = {result}
          </span>
          <div className="flex items-center gap-1">
            {bitsRes.map((bit, i) => (
              <span
                key={i}
                className={`w-7 h-7 flex items-center justify-center rounded font-bold border ${
                  bit === '1' ? 'bg-[#a3e635] text-black border-black font-black shadow-brutal-sm' : 'bg-black/50 text-zinc-600 border-zinc-800'
                }`}
              >
                {bit}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="bg-[#181926] p-2.5 rounded-xl border-2 border-black flex items-center justify-between shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Expression:</span>
          <span className="text-white font-bold bg-black/40 px-2 py-0.5 rounded border border-white/10">
            {op === '&' && '1 only when BOTH bits are 1'}
            {op === '|' && '1 when AT LEAST ONE bit is 1'}
            {op === '^' && '1 when bits DIFFER (Odd parity)'}
            {op === '<<' && 'Shifts bits left (multiplies by 2)'}
            {op === '>>' && 'Shifts bits right (integer division by 2)'}
          </span>
        </div>
        <span className="text-[#a3e635] font-black text-sm">
          Binary: {result.toString(2)}₂ ({result}₁₀)
        </span>
      </div>
    </div>
  )
}

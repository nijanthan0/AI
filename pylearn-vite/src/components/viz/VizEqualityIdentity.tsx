'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { GitCompare, Check, X, ShieldAlert, Cpu } from 'lucide-react'

interface Props {
  data?: any
}

interface Case {
  title: string
  codeA: string
  codeB: string
  descA: string
  descB: string
  valA: string
  valB: string
  addrA: string
  addrB: string
  sameMemory: boolean
  sameValue: boolean
  explanation: string
}

export default function VizEqualityIdentity({ data }: Props) {
  const [selectedCase, setSelectedCase] = useState<number>(0)

  const CASES: Case[] = [
    {
      title: '1. Small Integer Cache (a=100, b=100)',
      codeA: 'a = 100',
      codeB: 'b = 100',
      descA: 'Cached int block',
      descB: 'Shares cached int',
      valA: '100',
      valB: '100',
      addrA: '0x104b28120',
      addrB: '0x104b28120',
      sameMemory: true,
      sameValue: true,
      explanation: 'CPython pre-allocates integers in range [-5, 256]. Both variables point to the exact same cached object in memory!',
    },
    {
      title: '2. List Literals (a=[1, 2], b=[1, 2])',
      codeA: 'a = [1, 2]',
      codeB: 'b = [1, 2]',
      descA: 'Heap List #1',
      descB: 'Heap List #2',
      valA: '[1, 2]',
      valB: '[1, 2]',
      addrA: '0x105a30890',
      addrB: '0x105a309e0',
      sameMemory: false,
      sameValue: true,
      explanation: 'Each list literal allocates fresh memory. They hold equal contents (== True), but live at different memory addresses (is False)!',
    },
    {
      title: '3. Variable Aliasing (a=[1, 2], b=a)',
      codeA: 'a = [1, 2]',
      codeB: 'b = a',
      descA: 'Original pointer',
      descB: 'Aliased reference',
      valA: '[1, 2]',
      valB: '[1, 2]',
      addrA: '0x105a30890',
      addrB: '0x105a30890',
      sameMemory: true,
      sameValue: true,
      explanation: 'b = a does NOT copy the list! Both names point to the same object. Modifying b.append(3) will mutate a as well!',
    },
    {
      title: '4. None Singleton (x is None)',
      codeA: 'x = None',
      codeB: 'None',
      descA: 'Null pointer',
      descB: 'Built-in Singleton',
      valA: 'None',
      valB: 'None',
      addrA: '0x7ff840118',
      addrB: '0x7ff840118',
      sameMemory: true,
      sameValue: true,
      explanation: 'None is a true singleton in Python. PEP 8 strictly mandates using "if x is None:" because "is" is 3x faster than "==" and cannot be overridden.',
    },
    {
      title: '5. Distinct Objects (Large Ints)',
      codeA: 'a = 100000',
      codeB: 'b = 100000',
      descA: 'Heap Int #1',
      descB: 'Heap Int #2',
      valA: '100000',
      valB: '100000',
      addrA: '0x104b901a0',
      addrB: '0x104b902e0',
      sameMemory: false,
      sameValue: true,
      explanation: 'Integers outside [-5, 256] are allocated separately on the heap when created independently. They are equal, but not identical!',
    },
  ]

  const active = CASES[selectedCase]

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <GitCompare size={15} className="text-[#38bdf8]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            EQUALITY (==) VS IDENTITY (is)
          </span>
        </div>
        <span className="text-[10px] bg-black/40 text-zinc-400 px-2 py-0.5 rounded border border-white/10">
          id() Memory Pointer Inspector
        </span>
      </div>

      {/* Case Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {CASES.map((c, i) => (
          <button
            key={i}
            onClick={() => setSelectedCase(i)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border-2 transition-all whitespace-nowrap ${
              selectedCase === i
                ? 'bg-[#facc15] text-black border-black shadow-brutal-sm -translate-y-0.5'
                : 'bg-[#181926] text-zinc-400 border-zinc-700 hover:text-white'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Memory Architecture Visual Diagram */}
      <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-4">
          {/* Variable A Box */}
          <div className="bg-[#1a1b2a] p-2.5 rounded-xl border border-zinc-700 flex flex-col items-center">
            <span className="text-[#38bdf8] font-black text-xs mb-1">{active.codeA}</span>
            <div className="text-[10px] text-zinc-400 mb-2">{active.descA}</div>
            
            {/* Memory Pointer */}
            <div className="flex flex-col items-center w-full">
              <span className="text-[10px] text-zinc-500 font-bold mb-0.5">pointer ➔ id(a)</span>
              <div className="w-full bg-black/50 p-2 rounded-lg border border-zinc-800 text-center">
                <span className="text-[11px] font-mono text-[#a3e635] font-black">{active.addrA}</span>
                <div className="text-white text-xs font-bold mt-1 bg-white/5 py-0.5 rounded">
                  Value: {active.valA}
                </div>
              </div>
            </div>
          </div>

          {/* Variable B Box */}
          <div className="bg-[#1a1b2a] p-2.5 rounded-xl border border-zinc-700 flex flex-col items-center">
            <span className="text-[#f472b6] font-black text-xs mb-1">{active.codeB}</span>
            <div className="text-[10px] text-zinc-400 mb-2">{active.descB}</div>

            {/* Memory Pointer */}
            <div className="flex flex-col items-center w-full">
              <span className="text-[10px] text-zinc-500 font-bold mb-0.5">pointer ➔ id(b)</span>
              <div className="w-full bg-black/50 p-2 rounded-lg border border-zinc-800 text-center">
                <span className="text-[11px] font-mono text-[#a3e635] font-black">{active.addrB}</span>
                <div className="text-white text-xs font-bold mt-1 bg-white/5 py-0.5 rounded">
                  Value: {active.valB}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Evaluation Badges */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
          {/* Value Equality Check */}
          <div className={`p-2 rounded-xl border-2 flex items-center justify-between ${
            active.sameValue
              ? 'bg-[#22c55e]/15 border-[#22c55e] text-white'
              : 'bg-[#ef4444]/15 border-[#ef4444] text-white'
          }`}>
            <div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase">1. Value Equality</div>
              <div className="text-xs font-black font-mono">a == b</div>
            </div>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded font-black text-xs ${
              active.sameValue ? 'bg-[#22c55e] text-black' : 'bg-[#ef4444] text-white'
            }`}>
              {active.sameValue ? <Check size={12} /> : <X size={12} />}
              <span>{active.sameValue ? 'True' : 'False'}</span>
            </div>
          </div>

          {/* Memory Identity Check */}
          <div className={`p-2 rounded-xl border-2 flex items-center justify-between ${
            active.sameMemory
              ? 'bg-[#22c55e]/15 border-[#22c55e] text-white'
              : 'bg-[#ef4444]/15 border-[#ef4444] text-white'
          }`}>
            <div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase">2. Object Identity</div>
              <div className="text-xs font-black font-mono">a is b (id(a) == id(b))</div>
            </div>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded font-black text-xs ${
              active.sameMemory ? 'bg-[#22c55e] text-black' : 'bg-[#ef4444] text-white'
            }`}>
              {active.sameMemory ? <Check size={12} /> : <X size={12} />}
              <span>{active.sameMemory ? 'True' : 'False'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Callout */}
      <div className="bg-[#181926] p-2.5 rounded-xl border-2 border-black flex items-start gap-2 shadow-brutal-sm">
        <Cpu size={15} className="text-[#facc15] shrink-0 mt-0.5" />
        <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
          {active.explanation}
        </p>
      </div>
    </div>
  )
}

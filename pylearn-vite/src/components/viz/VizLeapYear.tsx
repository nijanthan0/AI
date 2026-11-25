'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizLeapYear({ data }: Props) {
  const [year, setYear] = useState<number>(2024)

  const div4 = year % 4 === 0
  const div100 = year % 100 === 0
  const div400 = year % 400 === 0

  const isLeap = div4 && (!div100 || div400)

  const PRESETS = [2000, 1900, 2024, 2025, 2028, 2100]

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-[#38bdf8]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            PRACTICE 2: GREGORIAN LEAP YEAR FLOWCHART
          </span>
        </div>
        <div className="flex items-center gap-1">
          {PRESETS.map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                year === y ? 'bg-[#38bdf8] text-black border-black font-black' : 'bg-[#181926] text-zinc-400 border-zinc-700'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Main Verdict Card */}
      <div className={`p-3 rounded-xl border-2 flex items-center justify-between shadow-brutal-sm ${
        isLeap ? 'bg-[#22c55e]/20 border-[#22c55e] text-white' : 'bg-[#ef4444]/20 border-[#ef4444] text-white'
      }`}>
        <div className="flex items-center gap-2">
          {isLeap ? <CheckCircle2 size={24} className="text-[#22c55e]" /> : <XCircle size={24} className="text-[#ef4444]" />}
          <div>
            <div className="text-[10px] font-bold uppercase text-zinc-300">Target Year: {year}</div>
            <div className="text-base font-black font-mono">
              {isLeap ? `✓ ${year} is a LEAP YEAR (366 Days)` : `✗ ${year} is a COMMON YEAR (365 Days)`}
            </div>
          </div>
        </div>
        <span className={`text-[10px] font-black px-2.5 py-1 rounded border ${
          isLeap ? 'bg-[#22c55e] text-black border-black' : 'bg-[#ef4444] text-white border-black'
        }`}>
          {isLeap ? 'LEAP YEAR' : 'COMMON YEAR'}
        </span>
      </div>

      {/* 3-Step Rule Breakdown */}
      <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black space-y-1.5 shadow-brutal-sm">
        <span className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">
          Boolean Rule Breakdown:
        </span>

        {/* Rule 1 */}
        <div className="flex items-center justify-between p-1.5 rounded bg-[#1a1b2a] border border-zinc-800">
          <span>1. year % 4 == 0: ({year} % 4 = {year % 4})</span>
          <span className={`text-[10px] font-bold px-1.5 rounded ${div4 ? 'bg-[#22c55e] text-black' : 'bg-[#ef4444] text-white'}`}>
            {div4 ? 'True' : 'False'}
          </span>
        </div>

        {/* Rule 2 */}
        <div className="flex items-center justify-between p-1.5 rounded bg-[#1a1b2a] border border-zinc-800">
          <span>2. year % 100 != 0: ({year} is {div100 ? 'a century' : 'not a century'})</span>
          <span className={`text-[10px] font-bold px-1.5 rounded ${!div100 ? 'bg-[#22c55e] text-black' : 'bg-[#ef4444] text-white'}`}>
            {!div100 ? 'True' : 'False (Century Exception)'}
          </span>
        </div>

        {/* Rule 3 */}
        <div className="flex items-center justify-between p-1.5 rounded bg-[#1a1b2a] border border-zinc-800">
          <span>3. year % 400 == 0: ({year} % 400 = {year % 400})</span>
          <span className={`text-[10px] font-bold px-1.5 rounded ${div400 ? 'bg-[#22c55e] text-black' : 'bg-black/50 text-zinc-500'}`}>
            {div400 ? 'True (Overrides Century)' : 'False'}
          </span>
        </div>
      </div>
    </div>
  )
}

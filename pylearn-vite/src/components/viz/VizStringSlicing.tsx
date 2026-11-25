'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Scissors, RotateCcw, ArrowRight, Sparkles } from 'lucide-react'

interface Props {
  data?: {
    text?: string
    defaultStart?: number
    defaultStop?: number
    defaultStep?: number
  }
}

export default function VizStringSlicing({ data }: Props) {
  const [text, setText] = useState(data?.text || 'PYTHON_PRO')
  const [start, setStart] = useState<number | ''>(0)
  const [stop, setStop] = useState<number | ''>(6)
  const [step, setStep] = useState<number>(1)

  const n = text.length

  // Slicing logic mimicking Python's slice()
  const computeSlice = () => {
    try {
      const s = start === '' ? undefined : Number(start)
      const e = stop === '' ? undefined : Number(stop)
      const st = step === 0 ? 1 : Number(step)

      // Emulate python slice on array of characters
      const chars = text.split('')
      const sliced = []
      
      let actualStart = s === undefined ? (st > 0 ? 0 : n - 1) : s
      let actualStop = e === undefined ? (st > 0 ? n : -n - 1) : e

      // Python negative index conversion for iteration
      if (actualStart < 0) actualStart += n
      if (actualStop < 0) actualStop += n

      if (st > 0) {
        for (let i = actualStart; i < actualStop && i < n; i += st) {
          if (i >= 0) sliced.push({ char: chars[i], index: i })
        }
      } else {
        for (let i = actualStart; i > actualStop && i >= 0; i += st) {
          if (i < n) sliced.push({ char: chars[i], index: i })
        }
      }
      return sliced
    } catch {
      return []
    }
  }

  const slicedItems = computeSlice()
  const slicedIndices = new Set(slicedItems.map(item => item.index))
  const slicedResult = slicedItems.map(item => item.char).join('')

  const PRESETS: { label: string; s: number | ''; e: number | ''; step: number }[] = [
    { label: '[:] Full Copy', s: '', e: '', step: 1 },
    { label: '[::-1] Reverse', s: '', e: '', step: -1 },
    { label: '[0:6] First 6', s: 0, e: 6, step: 1 },
    { label: '[-3:] Last 3', s: -3, e: '', step: 1 },
    { label: '[::2] Step 2', s: '', e: '', step: 2 },
    { label: '[1:-1] Trim ends', s: 1, e: -1, step: 1 },
  ]

  return (
    <div className="flex flex-col h-full text-xs font-mono select-none space-y-3">
      {/* Top Banner & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-1.5 text-white font-black text-[11px] tracking-wide">
          <Scissors size={14} className="text-[#a3e635]" />
          <span>STRING SLICER: text[start:stop:step]</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setStart(p.s)
                setStop(p.e)
                setStep(p.step)
              }}
              className="px-2 py-0.5 bg-[#252739] hover:bg-[#a3e635] hover:text-black text-zinc-300 font-bold rounded border border-black/60 transition-all text-[10px]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Characters Grid */}
      <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm overflow-x-auto">
        <div className="flex items-center justify-center gap-1.5 min-w-max py-2">
          {text.split('').map((char, idx) => {
            const isSelected = slicedIndices.has(idx)
            const negIdx = idx - n

            return (
              <motion.div
                key={idx}
                animate={{ scale: isSelected ? 1.08 : 1 }}
                className={`flex flex-col items-center justify-center rounded-xl p-2 border-2 transition-all min-w-[42px] ${
                  isSelected
                    ? 'bg-[#a3e635] text-black border-black shadow-brutal-sm font-black'
                    : 'bg-[#1e1f2e] text-zinc-400 border-zinc-700/80'
                }`}
              >
                {/* Positive Index */}
                <span className={`text-[10px] font-bold ${isSelected ? 'text-black' : 'text-[#38bdf8]'}`}>
                  {idx}
                </span>

                {/* Character */}
                <span className="text-base font-black my-1 font-mono tracking-wider">
                  {char}
                </span>

                {/* Negative Index */}
                <span className={`text-[10px] font-bold ${isSelected ? 'text-black/80' : 'text-[#f472b6]'}`}>
                  {negIdx}
                </span>
              </motion.div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[10px] pt-2 text-zinc-400 border-t border-zinc-800">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
            Positive: 0 ➔ {n - 1}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#f472b6]" />
            Negative: -{n} ➔ -1
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#a3e635]" />
            Sliced Output
          </span>
        </div>
      </div>

      {/* Control Sliders & Slicing Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-[#181926] p-3 rounded-xl border-2 border-black">
        {/* Start Parameter */}
        <div className="bg-[#222436] p-2 rounded-lg border border-black flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-300">
            <span>start: {start === '' ? 'None (default)' : start}</span>
            <button
              onClick={() => setStart('')}
              className="text-[9px] text-[#38bdf8] hover:underline"
            >
              reset
            </button>
          </div>
          <input
            type="range"
            min={-n}
            max={n}
            value={start === '' ? 0 : start}
            onChange={(e) => setStart(Number(e.target.value))}
            className="w-full accent-[#38bdf8] cursor-pointer"
          />
        </div>

        {/* Stop Parameter */}
        <div className="bg-[#222436] p-2 rounded-lg border border-black flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-300">
            <span>stop: {stop === '' ? 'None (default)' : stop}</span>
            <button
              onClick={() => setStop('')}
              className="text-[9px] text-[#f472b6] hover:underline"
            >
              reset
            </button>
          </div>
          <input
            type="range"
            min={-n}
            max={n}
            value={stop === '' ? n : stop}
            onChange={(e) => setStop(Number(e.target.value))}
            className="w-full accent-[#f472b6] cursor-pointer"
          />
        </div>

        {/* Step Parameter */}
        <div className="bg-[#222436] p-2 rounded-lg border border-black flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-300">
            <span>step: {step}</span>
            <span className="text-[9px] text-zinc-400">{step < 0 ? 'Reversed direction' : 'Forward'}</span>
          </div>
          <div className="flex items-center gap-1">
            {[-2, -1, 1, 2, 3].map((val) => (
              <button
                key={val}
                onClick={() => setStep(val)}
                className={`flex-1 py-1 rounded text-[10px] font-bold border border-black ${
                  step === val ? 'bg-[#a3e635] text-black' : 'bg-[#181926] text-zinc-400 hover:text-white'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sliced Output Result Box */}
      <div className="bg-[#181926] p-3 rounded-xl border-2 border-black flex items-center justify-between shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 text-xs">Evaluated Expression:</span>
          <code className="text-[#a3e635] font-black text-sm bg-black/40 px-2 py-0.5 rounded border border-white/10">
            text[{start === '' ? '' : start}:{stop === '' ? '' : stop}:{step}]
          </code>
        </div>
        <div className="flex items-center gap-2">
          <ArrowRight size={14} className="text-zinc-500" />
          <span className="text-zinc-400 text-xs">Result:</span>
          <span className="text-white font-black text-sm bg-[#38bdf8]/20 border border-[#38bdf8] text-[#38bdf8] px-2.5 py-0.5 rounded">
            "{slicedResult}"
          </span>
          <span className="text-[10px] text-zinc-400">({slicedResult.length} chars)</span>
        </div>
      </div>
    </div>
  )
}

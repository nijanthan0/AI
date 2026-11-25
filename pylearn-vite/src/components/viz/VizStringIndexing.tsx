'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigation, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizStringIndexing({ data }: Props) {
  const word = 'PYTHON'
  const n = word.length
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [customInput, setCustomInput] = useState<string>('0')

  const idxNum = parseInt(customInput, 10)
  const isOutOfRange = isNaN(idxNum) || idxNum >= n || idxNum < -n

  const resolvedChar = !isOutOfRange
    ? idxNum >= 0
      ? word[idxNum]
      : word[n + idxNum]
    : null

  const handleSelectChar = (i: number) => {
    setSelectedIndex(i)
    setCustomInput(String(i))
  }

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Navigation size={15} className="text-[#38bdf8]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            STRING BIDIRECTIONAL INDEXING (0 ➔ N-1 &amp; -N ➔ -1)
          </span>
        </div>
        <span className="text-[10px] bg-black/40 text-zinc-400 px-2 py-0.5 rounded border border-white/10">
          len("{word}") = {n}
        </span>
      </div>

      {/* Interactive String Character Grid */}
      <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col items-center justify-center">
        <span className="text-[10px] text-zinc-500 mb-2 uppercase font-bold">
          Click any character cell to inspect positive &amp; negative indices
        </span>

        <div className="flex items-center gap-2 py-2">
          {word.split('').map((char, i) => {
            const posIdx = i
            const negIdx = i - n
            const isMatch = !isOutOfRange && (idxNum === posIdx || idxNum === negIdx)

            return (
              <motion.div
                key={i}
                onClick={() => handleSelectChar(posIdx)}
                animate={{ scale: isMatch ? 1.15 : 1 }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 cursor-pointer transition-all min-w-[50px] ${
                  isMatch
                    ? 'bg-[#a3e635] text-black border-black shadow-brutal-sm font-black -translate-y-1'
                    : 'bg-[#1e1f2e] text-white border-zinc-700/80 hover:border-zinc-400'
                }`}
              >
                {/* Positive index */}
                <span className={`text-[10px] font-bold ${isMatch ? 'text-black' : 'text-[#38bdf8]'}`}>
                  +{posIdx}
                </span>

                {/* Character */}
                <span className="text-xl font-black my-1 font-mono">{char}</span>

                {/* Negative index */}
                <span className={`text-[10px] font-bold ${isMatch ? 'text-black/80' : 'text-[#f472b6]'}`}>
                  {negIdx}
                </span>
              </motion.div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] text-zinc-400 mt-2 border-t border-zinc-800 pt-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
            Positive: 0 (First char) ➔ {n - 1}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#f472b6]" />
            Negative: -1 (Last char) ➔ -{n}
          </span>
        </div>
      </div>

      {/* Interactive Expression Tester */}
      <div className="bg-[#181926] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-400 font-bold uppercase">Test Index Lookup:</span>
          <div className="flex items-center gap-1">
            {[-6, -1, 0, 5, 6].map((idx) => (
              <button
                key={idx}
                onClick={() => setCustomInput(String(idx))}
                className="px-2 py-0.5 bg-[#252739] hover:bg-[#a3e635] hover:text-black font-mono text-[10px] rounded border border-black"
              >
                [{idx}]
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/60 p-2 rounded-lg border border-zinc-700">
          <span className="text-zinc-400 text-xs">Lookup:</span>
          <span className="text-white font-mono font-bold text-xs">word[</span>
          <input
            type="number"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="w-16 bg-[#181926] text-[#a3e635] font-black text-center px-1 py-0.5 rounded border border-zinc-700 outline-none"
          />
          <span className="text-white font-mono font-bold text-xs">]</span>
          <ArrowRight size={14} className="text-zinc-500 mx-1" />

          {isOutOfRange ? (
            <span className="text-[#ef4444] font-black text-xs flex items-center gap-1">
              <AlertTriangle size={12} />
              IndexError: string index out of range!
            </span>
          ) : (
            <span className="text-[#a3e635] font-black text-xs bg-[#22c55e]/20 px-2 py-0.5 rounded border border-[#22c55e]">
              = "{resolvedChar}"
            </span>
          )}
        </div>
      </div>

      {/* Tip Callout */}
      <div className="bg-[#181926] p-2 rounded-xl border border-zinc-800 text-[10px] text-zinc-300">
        💡 <strong className="text-white">Python Pro-Tip:</strong> Never do <code className="text-[#38bdf8]">word[len(word) - 1]</code> like in C or Java. Simply write <code className="text-[#a3e635]">word[-1]</code> to access the last element in O(1) time.
      </div>
    </div>
  )
}

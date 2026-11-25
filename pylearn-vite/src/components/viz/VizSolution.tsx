'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, Code2, Copy, Check, Play, Clock, HardDrive, Eye, EyeOff } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { SlideSolution } from '@/lib/types'

interface Props {
  data?: any
  solution?: SlideSolution
  slideId?: string
  initialRevealed?: boolean
  onHide?: () => void
}

export default function VizSolution({ data, solution: propSolution, slideId, initialRevealed = false, onHide }: Props) {
  const { setCodeOverride } = useAppStore()
  const [revealed, setRevealed] = useState(initialRevealed)
  const [copied, setCopied] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Sync state if initialRevealed changes
  React.useEffect(() => {
    if (initialRevealed) setRevealed(true)
  }, [initialRevealed])

  // Support both solution passed via props or data
  const sol: SlideSolution | undefined = propSolution || data?.solution || data

  if (!sol) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500 font-mono text-xs">
        No solution data available for this problem.
      </div>
    )
  }

  const handleCopy = () => {
    if (!sol.code) return
    navigator.clipboard.writeText(sol.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLoadToEditor = () => {
    if (!sol.code || !slideId) return
    setCodeOverride(slideId, sol.code)
    setLoaded(true)
    setTimeout(() => setLoaded(false), 2500)
  }

  const handleToggleReveal = () => {
    if (revealed && onHide) {
      onHide()
    }
    setRevealed(!revealed)
  }

  return (
    <div className="h-full flex flex-col justify-between text-xs overflow-y-auto pr-1 select-none">
      {/* Top Banner / Button */}
      <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#181922] border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#facc15] border border-black shadow-brutal-sm flex items-center justify-center text-black font-black text-sm rotate-[-2deg]">
            💡
          </div>
          <div>
            <div className="text-xs font-black text-white">Official Solution & Code</div>
            <div className="text-[10px] text-zinc-400 font-mono">
              {revealed ? 'Click "Load to Editor" to copy code into editor' : 'Inspect verified optimal solution & complexity'}
            </div>
          </div>
        </div>

        <button
          onClick={handleToggleReveal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-black text-xs border-2 border-black transition-all ${
            revealed
              ? 'bg-[#27272a] text-zinc-300 shadow-brutal-sm hover:text-white'
              : 'bg-[#facc15] text-black shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
          }`}
        >
          {revealed ? <EyeOff size={13} /> : <Eye size={13} />}
          <span>{revealed ? 'Hide Solution' : 'Reveal Solution'}</span>
        </button>
      </div>

      {/* Main Solution Area */}
      <AnimatePresence mode="wait">
        {revealed ? (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col gap-2.5 mt-2.5"
          >
            {/* Complexity Badges & Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2">
                {sol.timeComplexity && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#38bdf8]/15 border border-[#38bdf8]/40 text-[#38bdf8] font-mono text-[10px] font-bold">
                    <Clock size={11} /> Time: {sol.timeComplexity}
                  </span>
                )}
                {sol.spaceComplexity && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#c084fc]/15 border border-[#c084fc]/40 text-[#c084fc] font-mono text-[10px] font-bold">
                    <HardDrive size={11} /> Space: {sol.spaceComplexity}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#22232e] hover:bg-[#2c2d3a] border border-black shadow-brutal-sm rounded-lg text-[11px] font-mono font-bold text-zinc-300 hover:text-white transition-all"
                  title="Copy solution code"
                >
                  {copied ? <Check size={12} className="text-[#a3e635]" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                {slideId && (
                  <button
                    onClick={handleLoadToEditor}
                    className={`flex items-center gap-1 px-3 py-1 text-black rounded-lg text-[11px] font-mono font-black border-2 border-black transition-all ${
                      loaded
                        ? 'bg-[#a3e635] shadow-none translate-x-[1px] translate-y-[1px]'
                        : 'bg-[#a3e635] shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5'
                    }`}
                    title="Load this solution directly into the CodeMirror editor to run"
                  >
                    {loaded ? <Check size={12} /> : <Play size={12} />}
                    <span>{loaded ? '✓ Loaded to Editor!' : 'Load to Editor'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Explanation / Intuition */}
            {sol.approach && (
              <div className="p-3 rounded-xl bg-[#161722] border-2 border-black shadow-brutal-sm">
                <div className="text-[10px] font-mono font-black text-[#facc15] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span>💡 Solution Approach & Logic</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-300 whitespace-pre-line font-medium">
                  {sol.approach}
                </p>
                {sol.explanationPoints && sol.explanationPoints.length > 0 && (
                  <ul className="mt-1.5 space-y-1 list-disc list-inside text-[11px] text-zinc-200">
                    {sol.explanationPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Optimal Solution Code Box */}
            {sol.code && (
              <div className="p-2.5 rounded-xl bg-[#161722] border-2 border-black shadow-brutal-sm flex-1 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-1.5 text-[10px] text-zinc-400 uppercase font-mono font-bold">
                  <span className="flex items-center gap-1 text-[#4ade80]">
                    <Code2 size={12} />
                    Verified Solution Code
                  </span>
                  <span className="text-[#a3e635] font-black">
                    {loaded ? '● IN SYNC WITH EDITOR' : 'Ready to Run'}
                  </span>
                </div>
                <pre className="p-2.5 bg-[#0d0e15] rounded-lg border border-black text-[#4ade80] font-mono text-[11px] leading-relaxed overflow-x-auto flex-1 select-text">
                  <code>{sol.code}</code>
                </pre>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center text-zinc-400"
          >
            <div className="w-12 h-12 rounded-xl bg-[#facc15] border-2 border-black shadow-brutal flex items-center justify-center text-black font-black text-xl mb-3 rotate-[-2deg]">
              💡
            </div>
            <div className="text-sm font-black text-white mb-1">
              Give It Your Best Shot First!
            </div>
            <p className="text-xs max-w-xs text-zinc-400 mb-4 font-medium leading-relaxed">
              Write your code in the editor on the right and hit <strong>▶ RUN CODE</strong>. When you are ready, click below to reveal the verified approach and optimal code.
            </p>
            <button
              onClick={handleToggleReveal}
              className="flex items-center gap-2 px-4 py-2 bg-[#facc15] text-black font-black text-xs font-mono uppercase tracking-wider rounded-xl border-2 border-black shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <Lightbulb size={14} />
              <span>Reveal Solution</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

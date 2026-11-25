'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizCycleDetection({ data }: Props) {
  // Cycle linked list: 0: Node(3) -> 1: Node(2) -> 2: Node(0) -> 3: Node(-4) -> back to index 1!
  const cycleList = [3, 2, 0, -4]
  const cycleEntry = 1 // Node(-4) points to index 1 Node(2)

  const [slowIdx, setSlowIdx] = useState<number>(0)
  const [fastIdx, setFastIdx] = useState<number>(0)
  const [iteration, setIteration] = useState<number>(0)
  const [hasCollided, setHasCollided] = useState<boolean>(false)

  const nextIndex = (idx: number, steps: number) => {
    let curr = idx
    for (let s = 0; s < steps; s++) {
      if (curr === cycleList.length - 1) {
        curr = cycleEntry // loop back to Node(2)
      } else {
        curr += 1
      }
    }
    return curr
  }

  const stepForward = () => {
    if (hasCollided) return

    const nextSlow = nextIndex(slowIdx, 1)
    const nextFast = nextIndex(fastIdx, 2)
    const nextIter = iteration + 1

    setSlowIdx(nextSlow)
    setFastIdx(nextFast)
    setIteration(nextIter)

    if (nextSlow === nextFast && nextIter > 0) {
      setHasCollided(true)
    }
  }

  const resetAll = () => {
    setSlowIdx(0)
    setFastIdx(0)
    setIteration(0)
    setHasCollided(false)
  }

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <RefreshCw size={15} className="text-[#facc15]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            LEETCODE #141: FLOYD'S TORTOISE &amp; HARE CYCLE DETECTION
          </span>
        </div>
        <span className="text-[10px] bg-black/40 text-zinc-400 px-2 py-0.5 rounded border border-white/10">
          O(N) Time | O(1) Memory
        </span>
      </div>

      {/* Pointers HUD */}
      <div className="grid grid-cols-2 gap-2 bg-[#12131c] p-2.5 rounded-xl border-2 border-black">
        <div className="p-2 rounded-lg bg-[#1a1b2a] border border-[#38bdf8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🐢</span>
            <div>
              <span className="text-[10px] text-zinc-400 block font-bold">Slow (Tortoise)</span>
              <span className="text-[#38bdf8] font-black text-xs">Node({cycleList[slowIdx]})</span>
            </div>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">+1 step/iter</span>
        </div>

        <div className="p-2 rounded-lg bg-[#1a1b2a] border border-[#f472b6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🐇</span>
            <div>
              <span className="text-[10px] text-zinc-400 block font-bold">Fast (Hare)</span>
              <span className="text-[#f472b6] font-black text-xs">Node({cycleList[fastIdx]})</span>
            </div>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">+2 steps/iter</span>
        </div>
      </div>

      {/* Circular Nodes Layout */}
      <div className="bg-[#181926] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex items-center justify-around">
        {cycleList.map((val, idx) => {
          const isSlowHere = slowIdx === idx
          const isFastHere = fastIdx === idx
          const isCollisionNode = isSlowHere && isFastHere && iteration > 0

          return (
            <motion.div
              key={idx}
              animate={{ scale: isCollisionNode ? 1.2 : isSlowHere || isFastHere ? 1.1 : 1 }}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 min-w-[55px] transition-all relative ${
                isCollisionNode
                  ? 'bg-[#22c55e] text-black border-black shadow-brutal-sm font-black'
                  : isSlowHere
                  ? 'bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]'
                  : isFastHere
                  ? 'bg-[#f472b6]/20 text-[#f472b6] border-[#f472b6]'
                  : 'bg-[#12131c] text-white border-zinc-700'
              }`}
            >
              <span className="text-sm font-black font-mono">{val}</span>
              <div className="flex items-center gap-1 mt-1 text-[10px]">
                {isSlowHere && <span>🐢</span>}
                {isFastHere && <span>🐇</span>}
              </div>
              {idx === cycleList.length - 1 && (
                <span className="text-[8px] text-[#facc15] font-bold mt-1">➔ [2] Loop</span>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Step Action Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={stepForward}
          disabled={hasCollided}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#facc15] hover:bg-[#eab308] disabled:opacity-40 text-black font-black rounded-xl border-2 border-black shadow-brutal-sm transition-all"
        >
          <Play size={14} />
          <span>
            {hasCollided
              ? `COLLISION DETECTED AT Node(${cycleList[slowIdx]})! CYCLE CONFIRMED (return True)`
              : `STEP ${iteration + 1}: advance slow (+1) & fast (+2)`}
          </span>
        </button>

        <button
          onClick={resetAll}
          className="flex items-center gap-1 px-3 py-2.5 bg-[#27272a] hover:bg-[#3f3f46] text-white font-bold rounded-xl border-2 border-black shadow-brutal-sm"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  )
}

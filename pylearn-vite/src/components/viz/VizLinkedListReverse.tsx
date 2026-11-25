'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'

interface Props {
  data?: any
}

interface Node {
  val: number
  id: number
}

export default function VizLinkedListReverse({ data }: Props) {
  const initialNodes: Node[] = [
    { val: 1, id: 1 },
    { val: 2, id: 2 },
    { val: 3, id: 3 },
    { val: 4, id: 4 },
    { val: 5, id: 5 },
  ]

  // Step state: 0 to 5
  // Step 0: prev=None, curr=Node(1)
  // Step 1: reverse Node(1)->None, prev=1, curr=2
  // Step 2: reverse Node(2)->1, prev=2, curr=3
  // Step 3: reverse Node(3)->2, prev=3, curr=4
  // Step 4: reverse Node(4)->3, prev=4, curr=5
  // Step 5: reverse Node(5)->4, prev=5, curr=None (DONE!)
  const [step, setStep] = useState<number>(0)

  const advanceStep = () => {
    if (step < initialNodes.length) {
      setStep((s) => s + 1)
    }
  }

  const resetAll = () => setStep(0)

  const currVal = step < initialNodes.length ? initialNodes[step].val : 'None'
  const prevVal = step > 0 ? initialNodes[step - 1].val : 'None'
  const nextVal = step + 1 < initialNodes.length ? initialNodes[step + 1].val : 'None'

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <ArrowLeft size={15} className="text-[#a3e635]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            LEETCODE #206: REVERSE LINKED LIST (3-POINTERS)
          </span>
        </div>
        <span className="text-[10px] bg-black/40 text-zinc-400 px-2 py-0.5 rounded border border-white/10">
          O(N) Time | O(1) Space
        </span>
      </div>

      {/* 3-Pointer Status HUD */}
      <div className="grid grid-cols-3 gap-2 bg-[#12131c] p-2.5 rounded-xl border-2 border-black">
        <div className="p-2 rounded-lg bg-[#1a1b2a] border border-zinc-700 text-center">
          <span className="text-[10px] text-zinc-500 font-bold block uppercase">prev pointer</span>
          <span className="text-white font-mono font-black text-sm text-[#38bdf8]">
            {prevVal !== 'None' ? `Node(${prevVal})` : 'None'}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-[#1a1b2a] border-2 border-[#a3e635] text-center shadow-brutal-sm">
          <span className="text-[10px] text-[#a3e635] font-black block uppercase">curr pointer</span>
          <span className="text-white font-mono font-black text-sm text-[#a3e635]">
            {currVal !== 'None' ? `Node(${currVal})` : 'None (End)'}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-[#1a1b2a] border border-zinc-700 text-center">
          <span className="text-[10px] text-zinc-500 font-bold block uppercase">next_node pointer</span>
          <span className="text-white font-mono font-black text-sm text-[#f472b6]">
            {nextVal !== 'None' ? `Node(${nextVal})` : 'None'}
          </span>
        </div>
      </div>

      {/* Animated Linked List Nodes Chain */}
      <div className="bg-[#181926] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex items-center justify-center overflow-x-auto min-h-[90px]">
        <div className="flex items-center gap-1 min-w-max py-2">
          {initialNodes.map((node, i) => {
            const isReversed = i < step
            const isCurrent = i === step

            return (
              <React.Fragment key={node.id}>
                <motion.div
                  animate={{ scale: isCurrent ? 1.15 : 1 }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 min-w-[50px] transition-all ${
                    isCurrent
                      ? 'bg-[#a3e635] text-black border-black shadow-brutal-sm font-black'
                      : isReversed
                      ? 'bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]'
                      : 'bg-[#12131c] text-white border-zinc-700'
                  }`}
                >
                  <span className="text-sm font-black font-mono">{node.val}</span>
                  <span className="text-[8px] mt-0.5">
                    {isCurrent ? 'curr' : isReversed ? 'reversed' : 'unreversed'}
                  </span>
                </motion.div>

                {i < initialNodes.length - 1 && (
                  <div className="flex items-center px-1">
                    {isReversed ? (
                      <span className="text-[#38bdf8] font-black text-base flex items-center gap-0.5">
                        <ArrowLeft size={16} />
                      </span>
                    ) : (
                      <span className="text-zinc-600 font-bold text-base flex items-center gap-0.5">
                        <ArrowRight size={16} />
                      </span>
                    )}
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={advanceStep}
          disabled={step >= initialNodes.length}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#a3e635] hover:bg-[#84cc16] disabled:opacity-40 text-black font-black rounded-xl border-2 border-black shadow-brutal-sm transition-all"
        >
          <Play size={14} />
          <span>
            {step < initialNodes.length ? `STEP ${step + 1}: curr.next = prev` : 'COMPLETED: return prev (new head)'}
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

      {/* Code Loop Step Reference */}
      <div className="bg-[#12131c] p-2.5 rounded-xl border border-zinc-800 text-[10px] text-zinc-300 font-mono">
        <span className="text-zinc-500">while curr:</span><br />
        &nbsp;&nbsp;<span className="text-[#f472b6]">next_node = curr.next</span> &nbsp;&nbsp;<span className="text-zinc-500"># 1. Save reference</span><br />
        &nbsp;&nbsp;<span className="text-[#a3e635]">curr.next = prev</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-zinc-500"># 2. Reverse link pointer</span><br />
        &nbsp;&nbsp;<span className="text-[#38bdf8]">prev = curr</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-zinc-500"># 3. Advance prev</span><br />
        &nbsp;&nbsp;<span className="text-white">curr = next_node</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-zinc-500"># 4. Advance curr</span>
      </div>
    </div>
  )
}

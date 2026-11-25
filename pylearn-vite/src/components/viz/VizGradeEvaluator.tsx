'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, GraduationCap } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizGradeEvaluator({ data }: Props) {
  const [score, setScore] = useState<number>(88)

  const getGrade = (s: number) => {
    if (s >= 90) return { grade: 'A', label: 'Outstanding Distinction', color: '#a3e635' }
    if (s >= 80) return { grade: 'B', label: 'Very Good Performance', color: '#38bdf8' }
    if (s >= 70) return { grade: 'C', label: 'Above Average Competency', color: '#facc15' }
    if (s >= 60) return { grade: 'D', label: 'Passing Grade', color: '#fb923c' }
    return { grade: 'F', label: 'Needs Remediation', color: '#ef4444' }
  }

  const { grade, label, color } = getGrade(score)

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <GraduationCap size={15} className="text-[#a3e635]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            PRACTICE 1: ACADEMIC GRADE EVALUATOR
          </span>
        </div>
        <span className="text-[10px] bg-black/40 text-zinc-400 px-2 py-0.5 rounded border border-white/10">
          Tiered Conditional Branching
        </span>
      </div>

      {/* Main Score & Grade Display */}
      <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold uppercase block">Student Score:</span>
          <span className="text-white font-mono font-black text-xl">{score} / 100</span>
        </div>

        {/* Big Grade Badge */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl border-2 border-black shadow-brutal-sm"
          style={{ background: color }}
        >
          <Award size={22} className="text-black" />
          <span className="text-2xl font-black text-black font-mono">
            Grade {grade}
          </span>
        </motion.div>
      </div>

      {/* Interactive Slider */}
      <div className="bg-[#181926] p-3 rounded-xl border-2 border-black flex flex-col gap-1">
        <div className="flex justify-between items-center text-[10px] text-zinc-400 font-bold">
          <span>Drag slider to simulate exam scores:</span>
          <span style={{ color }}>{label}</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-full accent-[#a3e635] cursor-pointer mt-1"
        />
        <div className="flex justify-between text-[9px] text-zinc-500 font-mono mt-0.5">
          <span>0 (F)</span>
          <span>60 (D)</span>
          <span>70 (C)</span>
          <span>80 (B)</span>
          <span>90 (A)</span>
          <span>100</span>
        </div>
      </div>
    </div>
  )
}

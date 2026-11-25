'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Slide, isPracticeSlide } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import QuestionBlock from '@/components/content/QuestionBlock'
import ExplanationBlock from '@/components/content/ExplanationBlock'
import VizEngine from '@/components/viz/VizEngine'
import { Lightbulb } from 'lucide-react'

interface Props { slide: Slide }

export default function LeftPanel({ slide }: Props) {
  const { zoomedPanel } = useAppStore()
  const isFullscreen = zoomedPanel === 'explanation'

  const isPractice = isPracticeSlide(slide)
  const [showSolution, setShowSolution] = useState<boolean>(false)

  // Auto-hide solution when moving to another slide so each practice problem starts fresh
  useEffect(() => {
    setShowSolution(false)
  }, [slide.id])

  const panelRef = useRef<HTMLDivElement>(null)
  const [vizHeight, setVizHeight] = useState<number>(340)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  // Smooth HTML5 pointer capture resizer (Same like Terminal resizer in CodeEditorPanel)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)

    const startY = e.clientY
    const startH = vizHeight
    const target = e.currentTarget
    target.setPointerCapture(e.pointerId)

    const onPointerMove = (ev: PointerEvent) => {
      // Delta: moving mouse UP (ev.clientY < startY) increases visualizer height
      // Moving mouse DOWN (ev.clientY > startY) decreases visualizer height
      const deltaY = startY - ev.clientY
      const panelH = panelRef.current ? panelRef.current.clientHeight : window.innerHeight
      const maxH = Math.max(120, panelH - 120)

      const targetH = Math.max(38, Math.min(maxH, startH + deltaY))
      setVizHeight(targetH)
    }

    const onPointerUp = (ev: PointerEvent) => {
      setIsDragging(false)
      try {
        target.releasePointerCapture(ev.pointerId)
      } catch {}
      target.removeEventListener('pointermove', onPointerMove)
      target.removeEventListener('pointerup', onPointerUp)
      target.removeEventListener('pointercancel', onPointerUp)
    }

    target.addEventListener('pointermove', onPointerMove)
    target.addEventListener('pointerup', onPointerUp)
    target.addEventListener('pointercancel', onPointerUp)
  }

  // Double click resizer bar to toggle between minimized (38px) and default (340px)
  const handleDoubleClickResizer = () => {
    setVizHeight((prev) => (prev <= 48 ? (isFullscreen ? 500 : 340) : 38))
  }

  return (
    <div
      ref={panelRef}
      className={`flex flex-col h-full min-h-0 ${isFullscreen ? '' : 'border-r-2 border-black'} overflow-hidden bg-[#121316] relative select-none`}
    >
      {/* Question Headline Header */}
      <QuestionBlock slide={slide} />

      {/* Explanation Points — Full Width, Scaled Typography */}
      <div className="flex-1 overflow-y-auto min-h-0 select-text">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className={`w-full ${isFullscreen ? 'px-8 md:px-14 py-7' : 'p-5'}`}
          >
            <ExplanationBlock explanation={slide.explanation} isFullscreen={isFullscreen} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Practice Question: Pinned Reveal Solution Action Bar (Live visual hidden until revealed) */}
      {isPractice && !showSolution && (
        <div className="border-t-2 border-black bg-[#15161e] p-3 flex items-center justify-between gap-3 shadow-brutal-sm flex-shrink-0 z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#facc15] border-2 border-black shadow-brutal-xs flex items-center justify-center text-black font-black text-sm rotate-[-2deg] flex-shrink-0">
              💡
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-white flex items-center gap-1.5">
                <span>Official Solution & Walkthrough</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-[#facc15] border border-zinc-700">
                  HIDDEN
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono truncate">
                Write & test your code on the right • Reveal when ready
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSolution(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#facc15] text-black font-black font-mono text-xs rounded-xl border-2 border-black shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex-shrink-0 uppercase"
          >
            <Lightbulb size={13} />
            <span>Reveal Solution</span>
          </button>
        </div>
      )}

      {/* Draggable Resizer Bar (Shown for normal slides OR when solution is revealed) */}
      {(!isPractice || showSolution) && (
        <div
          onPointerDown={handlePointerDown}
          onDoubleClick={handleDoubleClickResizer}
          title="Drag up/down to resize visualizer (Double click to toggle minimize)"
          className={`h-2.5 bg-[#181920] border-t-2 border-black hover:bg-[#a3e635] cursor-row-resize flex items-center justify-center transition-colors group flex-shrink-0 relative z-10 ${
            isDragging ? 'bg-[#a3e635]' : ''
          }`}
        >
          <div className="w-10 h-1 rounded-full bg-zinc-600 group-hover:bg-black transition-colors" />
        </div>
      )}

      {/* Interactive Visualization Container — Resizable & Minimizable */}
      {(!isPractice || showSolution) && (
        <div
          className={`border-t-2 border-black bg-[#181920] flex-shrink-0 overflow-hidden flex flex-col ${
            isDragging ? '' : 'transition-[height] duration-150 ease-out'
          }`}
          style={{ height: `${vizHeight}px`, minHeight: '38px' }}
        >
          <div className="flex-1 min-h-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`viz-${slide.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full w-full"
              >
                <VizEngine
                  viz={slide.viz}
                  solution={slide.solution}
                  slideId={String(slide.id)}
                  height={vizHeight}
                  onSetHeight={setVizHeight}
                  initialRevealed={isPractice && showSolution}
                  onHideSolution={() => setShowSolution(false)}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}


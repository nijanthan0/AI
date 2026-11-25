'use client'

import { useAppStore } from '@/lib/store'
import { Slide } from '@/lib/types'
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'

interface Props {
  currentSlide: number
  totalSlides: number
  slides: Slide[]
  tip: string
}

export default function Footer({ currentSlide, totalSlides, tip }: Props) {
  const { nextSlide, prevSlide } = useAppStore()
  const progressPercent = Math.round(((currentSlide + 1) / totalSlides) * 100)

  return (
    <footer className="flex items-center justify-between px-5 py-2.5 border-t-2 border-black bg-[#181920] flex-shrink-0 select-none z-20 shadow-brutal-sm">
      {/* Presenter Tip */}
      <div className="flex items-center gap-2.5 text-xs text-zinc-300 flex-1 min-w-0 mr-6">
        <span className="sticker-badge bg-[#facc15] text-black text-[10px] flex-shrink-0">
          <Zap size={11} className="fill-black" />
          <span>PRO TIP:</span>
        </span>
        <span className="truncate text-xs font-medium text-zinc-200" title={tip}>
          {tip}
        </span>
      </div>

      {/* Progress & Controls */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Progress Bar with solid border */}
        <div className="hidden sm:flex items-center gap-2.5 text-xs font-mono font-bold text-zinc-300">
          <div className="w-28 bg-[#121316] h-3 rounded-full border-2 border-black overflow-hidden relative shadow-brutal-sm">
            <div
              className="bg-[#a3e635] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-[#a3e635] min-w-[3ch]">{progressPercent}%</span>
        </div>

        {/* Tactile Prev / Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-[#27272a] text-white border-2 border-black shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-20 disabled:pointer-events-none transition-all"
            title="Previous slide (← or ↑)"
          >
            <ChevronLeft size={14} />
            <span>PREV</span>
          </button>

          <button
            onClick={() => nextSlide(totalSlides)}
            disabled={currentSlide === totalSlides - 1}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-[#facc15] text-black border-2 border-black shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-20 disabled:pointer-events-none transition-all"
            title="Next slide (→ or ↓)"
          >
            <span>NEXT</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </footer>
  )
}

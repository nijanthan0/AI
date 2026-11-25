'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Slide } from '@/lib/types'
import { useAppStore } from '@/lib/store'

const TAG_COLORS: Record<string, string> = {
  basics:      'bg-[#a3e635]',
  collections: 'bg-[#38bdf8]',
  oop:         'bg-[#f472b6]',
  functions:   'bg-[#facc15]',
  concepts:    'bg-[#c084fc]',
  ml:          'bg-[#2dd4bf]',
  sql:         'bg-[#38bdf8]',
}

interface Props { slide: Slide }

export default function QuestionBlock({ slide }: Props) {
  const bg = TAG_COLORS[slide.category] || 'bg-[#facc15]'

  return (
    <div className="px-6 pt-5 pb-4 bg-[#181920] border-b-2 border-black flex-shrink-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
        >
          {/* Top Row: Tag & Topic */}
          <div className="flex items-center gap-2 mb-2.5">
            <span className={`sticker-badge ${bg} text-black rotate-[-2deg] text-[10px]`}>
              ⚡ {slide.tag}
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              {slide.categoryLabel || slide.topic}
            </span>
          </div>

          {/* Bold Neobrutal Question Headline */}
          <h2 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight">
            {slide.question}
          </h2>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}


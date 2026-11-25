'use client'

import { motion } from 'framer-motion'

interface Props {
  data?: {
    levels?: { name: string; color: string; width: number }[]
  }
}

export default function VizAIHierarchy({ data }: Props) {
  const levels = Array.isArray(data?.levels) && data.levels.length > 0
    ? data.levels
    : [
        { name: 'Artificial Intelligence (Broad field)', color: '#38bdf8', width: 100 },
        { name: 'Machine Learning (Learns from data)', color: '#a3e635', width: 75 },
        { name: 'Deep Learning (Neural Networks)', color: '#facc15', width: 50 },
        { name: 'Large Language Models (Transformers)', color: '#f43f5e', width: 30 }
      ]

  return (
    <div className="flex flex-col items-center gap-2">
      {levels.map((level, i) => (
        <motion.div
          key={level.name || i}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
          className="rounded-lg flex items-center justify-center text-xs font-bold py-2 px-4"
          style={{
            width: `${level.width}%`,
            background: `${level.color}25`,
            border: `2px solid ${level.color}60`,
            color: level.color,
          }}
        >
          {level.name}
        </motion.div>
      ))}
      <div className="text-xs text-[var(--text-dim)] mt-1">Each inner tier is a specialized subset of the outer field</div>
    </div>
  )
}

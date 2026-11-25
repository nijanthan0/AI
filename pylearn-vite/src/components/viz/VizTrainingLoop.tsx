'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Props {
  data?: {
    steps?: string[]
    colors?: string[]
  }
}

export default function VizTrainingLoop({ data }: Props) {
  const steps = Array.isArray(data?.steps) && data.steps.length > 0
    ? data.steps
    : ['Forward Pass', 'Loss Calculation', 'Backward (Gradients)', 'Optimizer Step']
  const colors = Array.isArray(data?.colors) && data.colors.length >= steps.length
    ? data.colors
    : ['#38bdf8', '#facc15', '#fb923c', '#22c55e']

  const [active, setActive] = useState(0)

  useEffect(() => {
    if (steps.length === 0) return
    const t = setInterval(() => setActive(a => (a + 1) % steps.length), 900)
    return () => clearInterval(t)
  }, [steps.length])

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {steps.map((step, i) => (
        <div key={step || i} className="flex items-center gap-1">
          <motion.div
            animate={{ scale: active === i ? 1.08 : 1, opacity: active === i ? 1 : 0.6 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-center"
            style={{
              background: `${colors[i % colors.length]}25`,
              border: `2px solid ${active === i ? colors[i % colors.length] : colors[i % colors.length] + '40'}`,
              color: colors[i % colors.length],
            }}
          >
            {step}
          </motion.div>
          {i < steps.length - 1 && <span className="text-[var(--text-dim)] text-xs">→</span>}
        </div>
      ))}
    </div>
  )
}

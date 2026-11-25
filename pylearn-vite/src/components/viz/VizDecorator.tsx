'use client'

import { motion } from 'framer-motion'

interface Props {
  data: {
    decoratorName: string
    targetFunction: string
    wrapperActions: string[]
  }
}

export default function VizDecorator({ data }: Props) {
  return (
    <div className="flex items-center gap-4">
      {/* Outer decorator shell */}
      <div className="relative border-2 border-dashed border-[var(--mauve)] bg-[var(--mauve)]/10 rounded-xl p-3 flex flex-col items-center min-w-[200px]">
        <span className="text-xs font-mono font-bold text-[var(--mauve)] mb-2">
          @{data.decoratorName || 'my_decorator'} (Wrapper)
        </span>

        <div className="text-[11px] font-mono text-[var(--green)] mb-1.5 bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--border)]">
          ▶ Before: Start timer / Check auth
        </div>

        {/* Inner Original Function */}
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="bg-[var(--primary)] text-[var(--primary-fg)] font-mono font-bold text-xs px-4 py-2 rounded-lg shadow-sm text-center"
        >
          ⚙ {data.targetFunction || 'process_ai_data()'}
        </motion.div>

        <div className="text-[11px] font-mono text-[var(--sky)] mt-1.5 bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--border)]">
          ✓ After: Log elapsed time & return result
        </div>
      </div>

      <div className="text-xs text-[var(--text-dim)] max-w-[160px] leading-relaxed">
        Decorators take a function, add superpowers around it, and return it without changing the original code!
      </div>
    </div>
  )
}

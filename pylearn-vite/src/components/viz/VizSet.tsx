'use client'

import { motion } from 'framer-motion'

interface Props {
  data?: {
    rawList?: string[]
    uniqueSet?: string[]
  }
}

export default function VizSet({ data }: Props) {
  const rawList = Array.isArray(data?.rawList) && data.rawList.length > 0
    ? data.rawList
    : ['"apple"', '"banana"', '"apple"', '"orange"', '"banana"']
  const uniqueSet = Array.isArray(data?.uniqueSet) && data.uniqueSet.length > 0
    ? data.uniqueSet
    : ['"apple"', '"banana"', '"orange"']

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {/* Raw List */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-[var(--text-dim)] font-mono mb-1">List (with duplicates)</span>
          <div className="flex items-center gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-1.5">
            {rawList.map((item, i) => (
              <div
                key={i}
                className={`px-2 py-1 rounded text-xs font-mono ${
                  item === rawList[0] && i > 0
                    ? 'bg-[var(--red)]/20 text-[var(--red)] line-through'
                    : 'bg-[var(--surface2)] text-[var(--text)]'
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-[var(--primary)] font-bold text-sm"
        >
          set() ➔
        </motion.div>

        {/* Set */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-[var(--primary)] font-mono mb-1">Set {'{ }'} (unique only)</span>
          <div className="flex items-center gap-1.5 bg-[var(--primary)]/10 border-2 border-[var(--primary)] rounded-lg p-1.5">
            {uniqueSet.map((item, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1, type: 'spring' }}
                className="bg-[var(--primary)] text-[var(--primary-fg)] px-2.5 py-1 rounded text-xs font-mono font-bold"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="text-xs text-[var(--text-dim)] mt-1">
        Sets automatically de-duplicate and provide instantaneous <strong className="text-[var(--primary)]">O(1)</strong> containment checks.
      </div>
    </div>
  )
}

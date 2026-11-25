'use client'

import { motion } from 'framer-motion'

interface Props {
  data?: {
    tupleName?: string
    items?: string[]
    description?: string
  } | string[]
}

export default function VizTuple({ data }: Props) {
  let tupleName = 'immutable_record'
  let items: string[] = ['"192.168.1.1"', '443', '"HTTPS"']
  let description = 'Faster than lists and safe for hash keys!'

  if (Array.isArray(data)) {
    items = data.map(String)
  } else if (data && typeof data === 'object') {
    if (data.tupleName) tupleName = data.tupleName
    if (Array.isArray(data.items) && data.items.length > 0) items = data.items
    if (data.description) description = data.description
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center">
          <span className="text-xs text-[var(--text-dim)] font-mono mb-1">{tupleName} (tuple)</span>
          <div className="flex items-center border-2 border-[var(--primary)] bg-[var(--surface)]/80 rounded-xl px-3 py-2 gap-2 shadow-sm">
            <span className="text-xs text-[var(--primary)] font-bold">🔒</span>
            <span className="text-xs text-[var(--text-muted)] font-mono">(</span>
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[var(--surface2)] px-2.5 py-1 rounded-md text-xs font-mono font-semibold text-[var(--text)] border border-[var(--border)]"
              >
                {item}
              </motion.div>
            ))}
            <span className="text-xs text-[var(--text-muted)] font-mono">)</span>
          </div>
        </div>

        <div className="text-xs text-[var(--text-dim)] max-w-[150px] leading-relaxed">
          🔒 <strong className="text-[var(--primary)]">Immutable</strong> — once created, elements cannot be modified, added, or deleted.
        </div>
      </div>
      <div className="text-xs text-[var(--green)] font-mono">
        ✓ {description}
      </div>
    </div>
  )
}

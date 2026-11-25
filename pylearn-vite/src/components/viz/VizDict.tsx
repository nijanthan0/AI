'use client'

import { motion } from 'framer-motion'

interface Pair { key: string; value: string }
interface Props { data?: { pairs?: Pair[] } | Pair[] }

export default function VizDict({ data }: Props) {
  let pairs: Pair[] = []
  if (Array.isArray(data)) {
    pairs = data
  } else if (data && Array.isArray(data.pairs)) {
    pairs = data.pairs
  }

  if (pairs.length === 0) {
    pairs = [
      { key: 'user_id', value: '10842' },
      { key: 'role', value: '"admin"' },
      { key: 'tier', value: '"pro_annual"' },
      { key: 'active', value: 'True' }
    ]
  }

  return (
    <div className="flex gap-3 items-start">
      <div className="bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg overflow-hidden min-w-[180px]">
        <div className="flex px-3 py-1.5 border-b border-[var(--border)] bg-[var(--surface)]">
          <span className="text-xs text-[var(--primary)] font-bold w-20">key</span>
          <span className="text-xs text-[var(--text-dim)]">value</span>
        </div>
        {pairs.map((pair, i) => (
          <motion.div
            key={pair.key || i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex px-3 py-1.5 border-b border-[var(--border)] last:border-b-0"
          >
            <span className="text-xs text-[var(--sky)] font-mono w-20">"{pair.key}"</span>
            <span className="text-xs text-[var(--text)] font-mono">{pair.value}</span>
          </motion.div>
        ))}
      </div>
      <div className="text-xs text-[var(--text-dim)] max-w-[120px] leading-relaxed mt-2">
        Lookup any value instantly using its <strong className="text-[var(--primary)]">key</strong> — O(1) hash table speed
      </div>
    </div>
  )
}

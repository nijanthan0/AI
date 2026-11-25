'use client'

import { motion } from 'framer-motion'

interface Props {
  data?: {
    parent?: { name?: string; emoji?: string; props?: string[]; methods?: string[] }
    children?: { name?: string; emoji?: string; color?: string; extra?: string[]; overrides?: string[] }[]
  }
}

export default function VizInheritance({ data }: Props) {
  const parent = data?.parent || {
    name: 'Animal',
    emoji: '🐾',
    props: ['name: str', 'alive: bool'],
    methods: ['eat()', 'sleep()']
  }
  const parentProps = Array.isArray(parent?.props) ? parent.props : ['name: str', 'alive: bool']

  const children = Array.isArray(data?.children) && data.children.length > 0
    ? data.children
    : [
        { name: 'Dog', emoji: '🐶', color: '#38bdf8', extra: ['bark()'], overrides: ['speak()'] },
        { name: 'Cat', emoji: '🐱', color: '#f472b6', extra: ['purr()'], overrides: ['speak()'] }
      ]

  return (
    <div className="flex flex-col items-center gap-2 text-xs">
      {/* Parent */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--surface)] border-2 border-[var(--primary)]/60 rounded-lg px-3 py-2 text-center min-w-[120px]"
      >
        <div className="font-bold text-[var(--primary)] mb-1">{parent?.emoji || '🏛️'} {parent?.name || 'BaseClass'}</div>
        <div className="text-[var(--text-muted)] font-mono">{parentProps.join(', ')}</div>
      </motion.div>

      {/* Arrow */}
      <div className="flex gap-8 text-[var(--text-dim)]">
        <span>↙</span><span>↘</span>
      </div>

      {/* Children */}
      <div className="flex gap-3">
        {children.map((child, i) => (
          <motion.div
            key={child?.name || i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="bg-[var(--surface)] border-2 rounded-lg px-3 py-2 text-center min-w-[100px]"
            style={{ borderColor: `${child?.color || '#a3e635'}60` }}
          >
            <div className="font-bold mb-1" style={{ color: child?.color || '#a3e635' }}>
              {child?.emoji || '🔹'} {child?.name || `Subclass${i + 1}`}
            </div>
            {Array.isArray(child?.extra) && child.extra.map(e => (
              <div key={e} className="text-[var(--text-muted)] font-mono">{e}</div>
            ))}
            {Array.isArray(child?.overrides) && child.overrides.map(o => (
              <div key={o} className="text-[var(--mauve)] font-mono text-xs">{o} ↺</div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

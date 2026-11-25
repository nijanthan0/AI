'use client'

import { motion } from 'framer-motion'

interface Props {
  data?: {
    className?: string
    classEmoji?: string
    properties?: string[]
    methods?: string[]
    instances?: { name: string; color: string; emoji: string; props?: Record<string, string> }[]
  }
}

export default function VizOOP({ data }: Props) {
  const className = data?.className || 'Car'
  const classEmoji = data?.classEmoji || '🏎️'
  const properties = Array.isArray(data?.properties) && data.properties.length > 0
    ? data.properties
    : ['brand: str', 'speed: int']
  const methods = Array.isArray(data?.methods) && data.methods.length > 0
    ? data.methods
    : ['accelerate()', 'brake()']
  const instances = Array.isArray(data?.instances) && data.instances.length > 0
    ? data.instances
    : [
        { name: 'tesla', color: '#38bdf8', emoji: '⚡', props: { brand: '"Tesla"', speed: '120' } },
        { name: 'porsche', color: '#f43f5e', emoji: '🏎️', props: { brand: '"Porsche"', speed: '240' } }
      ]

  return (
    <div className="flex gap-4 items-start text-xs">
      {/* Blueprint */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
        className="bg-[var(--surface)] border-2 border-[var(--primary)]/60 rounded-lg p-2.5 min-w-[110px]"
      >
        <div className="text-[var(--primary)] font-bold mb-1.5">{classEmoji} {className}</div>
        {properties.map(p => (
          <div key={p} className="text-[var(--text-muted)] border-t border-[var(--border)] py-0.5 font-mono">{p}</div>
        ))}
        {methods.map(m => (
          <div key={m} className="text-[var(--mauve)] border-t border-[var(--border)] py-0.5 font-mono">{m}</div>
        ))}
      </motion.div>

      <div className="flex flex-col items-center gap-1 mt-4 text-[var(--text-dim)]">
        <span className="text-base">⟹</span>
        <span className="text-xs font-mono font-bold">new</span>
      </div>

      {/* Instances */}
      <div className="flex flex-col gap-2">
        {instances.map((inst, i) => (
          <motion.div
            key={inst.name || i}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.12 }}
            className="bg-[var(--surface)] border-2 rounded-lg p-2 min-w-[110px]"
            style={{ borderColor: `${inst.color || '#a3e635'}60` }}
          >
            <div className="font-bold mb-1" style={{ color: inst.color || '#a3e635' }}>
              {inst.emoji || '📦'} {inst.name}
            </div>
            {inst.props && Object.entries(inst.props).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 border-t border-[var(--border)] py-0.5 font-mono text-xs">
                <span className="text-[var(--text-muted)]">{k}</span>
                <span className="text-[var(--text-dim)]">{v}</span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

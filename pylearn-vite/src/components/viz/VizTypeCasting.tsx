'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function VizTypeCasting() {
  const [val, setVal] = useState('100')
  const [targetType, setTargetType] = useState<'int' | 'float' | 'bool' | 'str'>('int')

  let converted: any = val
  let typeLabel = 'str'
  let pythonCode = `int("${val}")`

  if (targetType === 'int') {
    const num = parseInt(val, 10)
    converted = isNaN(num) ? 'ValueError' : num
    typeLabel = 'int'
    pythonCode = `int("${val}") ➔ ${converted}`
  } else if (targetType === 'float') {
    const fl = parseFloat(val)
    converted = isNaN(fl) ? 'ValueError' : fl.toFixed(1)
    typeLabel = 'float'
    pythonCode = `float("${val}") ➔ ${converted}`
  } else if (targetType === 'bool') {
    converted = Boolean(val && val !== '0' && val !== 'False') ? 'True' : 'False'
    typeLabel = 'bool'
    pythonCode = `bool("${val}") ➔ ${converted}`
  } else {
    converted = `"${val}"`
    typeLabel = 'str'
    pythonCode = `str(${val}) ➔ ${converted}`
  }

  return (
    <div className="flex flex-col gap-2.5">
      {/* Type selection controls */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs">
        <span className="text-[var(--text-dim)] font-semibold">Convert to:</span>
        <div className="flex bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)] gap-1">
          {(['int', 'float', 'bool', 'str'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTargetType(t)}
              className={`px-2 py-0.5 rounded font-mono text-xs transition-colors ${
                targetType === t
                  ? 'bg-[var(--primary)] text-[var(--primary-fg)] font-bold'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              {t}()
            </button>
          ))}
        </div>
      </div>

      {/* Visual transformation pipeline */}
      <div className="bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl p-3 flex items-center justify-around min-h-[90px]">
        {/* Input */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold text-[var(--text-dim)] mb-1">Raw Input</span>
          <div className="bg-[var(--surface2)] border-2 border-[var(--mauve)] rounded-lg px-3 py-1.5 text-center min-w-[75px]">
            <input
              type="text"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-16 bg-transparent text-center font-mono font-bold text-xs text-[var(--mauve)] outline-none"
            />
            <div className="text-[10px] text-[var(--text-dim)] font-mono">type: str</div>
          </div>
        </div>

        {/* Transformer Function */}
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="text-[var(--primary)] text-base"
          >
            ⚙
          </motion.div>
          <span className="text-xs font-mono font-bold text-[var(--primary)] mt-1">{targetType}()</span>
        </div>

        {/* Result */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold text-[var(--text-dim)] mb-1">Converted Object</span>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${targetType}-${converted}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[var(--green)]/15 border-2 border-[var(--green)] rounded-lg px-3 py-1.5 text-center min-w-[75px]"
            >
              <div className="font-mono font-bold text-xs text-[var(--green)]">{String(converted)}</div>
              <div className="text-[10px] text-[var(--text-dim)] font-mono">type: {typeLabel}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Python execution log */}
      <div className="bg-[var(--bg-deep)] border border-[var(--border)] px-3 py-1 rounded-lg font-mono text-xs text-[var(--green)]">
        &gt;&gt;&gt; {pythonCode}
      </div>
    </div>
  )
}

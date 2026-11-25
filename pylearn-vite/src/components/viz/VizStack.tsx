'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  data: {
    title: string
    initialItems: string[]
  }
}

export default function VizStack({ data }: Props) {
  const [stack, setStack] = useState<string[]>(data.initialItems || ['call_1()', 'call_2()'])
  const [log, setLog] = useState<string>('Stack initialized')

  const pushItem = () => {
    const newItem = `call_${stack.length + 1}()`
    setStack((prev) => [...prev, newItem])
    setLog(`⬆ PUSH: ${newItem} placed on top of stack`)
  }

  const popItem = () => {
    if (stack.length === 0) {
      setLog('⚠ Stack is empty!')
      return
    }
    const popped = stack[stack.length - 1]
    setStack((prev) => prev.slice(0, prev.length - 1))
    setLog(`⬇ POP: ${popped} removed (Last-In, First-Out)`)
  }

  return (
    <div className="flex items-center gap-6">
      {/* Visual Stack Tower */}
      <div className="flex flex-col-reverse items-center border-b-4 border-x-2 border-[var(--primary)] rounded-b-lg p-2 min-h-[110px] w-36 bg-[var(--surface)]/40 relative">
        <AnimatePresence mode="popLayout">
          {stack.map((item, i) => (
            <motion.div
              key={item}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`w-full py-1.5 px-2 my-0.5 rounded text-center text-xs font-mono font-semibold border ${
                i === stack.length - 1
                  ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-[var(--primary)] shadow'
                  : 'bg-[var(--surface2)] text-[var(--text)] border-[var(--border)]'
              }`}
            >
              {item} {i === stack.length - 1 ? '← TOP' : ''}
            </motion.div>
          ))}
        </AnimatePresence>
        {stack.length === 0 && (
          <span className="text-xs text-[var(--text-dim)] m-auto">Empty Stack</span>
        )}
      </div>

      {/* Controls and info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={pushItem}
            className="px-3 py-1 bg-[var(--green)]/20 text-[var(--green)] border border-[var(--green)]/40 hover:bg-[var(--green)]/30 rounded text-xs font-semibold transition-colors"
          >
            + Push
          </button>
          <button
            onClick={popItem}
            disabled={stack.length === 0}
            className="px-3 py-1 bg-[var(--red)]/20 text-[var(--red)] border border-[var(--red)]/40 hover:bg-[var(--red)]/30 disabled:opacity-30 rounded text-xs font-semibold transition-colors"
          >
            - Pop
          </button>
        </div>
        <div className="text-xs font-mono text-[var(--primary)] min-h-[18px]">
          {log}
        </div>
        <div className="text-xs text-[var(--text-dim)] max-w-[200px]">
          LIFO: Last In, First Out — used by function calls & recursion memory frames.
        </div>
      </div>
    </div>
  )
}

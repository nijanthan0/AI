'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function VizAsyncEventLoop() {
  const [activeTask, setActiveTask] = useState(0)
  const tasks = [
    { name: 'fetch_user_data()', status: 'await I/O', color: 'var(--sky)' },
    { name: 'ai_model_predict()', status: 'running', color: 'var(--primary)' },
    { name: 'save_to_database()', status: 'ready', color: 'var(--green)' },
  ]

  useEffect(() => {
    const t = setInterval(() => {
      setActiveTask((prev) => (prev + 1) % tasks.length)
    }, 1400)
    return () => clearInterval(t)
  }, [tasks.length])

  return (
    <div className="flex flex-col gap-2">
      {/* Visual Pipeline */}
      <div className="bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl p-3 flex items-center justify-around min-h-[95px]">
        {/* Task Queue */}
        <div className="flex flex-col gap-1 min-w-[120px]">
          <span className="text-[10px] uppercase font-bold text-[var(--text-dim)] font-mono">Tasks Queue</span>
          {tasks.map((task, i) => (
            <div
              key={task.name}
              className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                activeTask === i
                  ? 'border-[var(--primary)] bg-[var(--primary)]/20 text-[var(--text)] font-bold'
                  : 'border-[var(--border)] bg-[var(--bg-deep)] text-[var(--text-dim)]'
              }`}
            >
              {task.name}
            </div>
          ))}
        </div>

        {/* The Event Loop Spinner */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold text-[var(--primary)] font-mono mb-1">Event Loop</span>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="w-10 h-10 rounded-full border-2 border-dashed border-[var(--primary)] flex items-center justify-center text-sm"
          >
            🔄
          </motion.div>
          <span className="text-[9px] text-[var(--text-dim)] font-mono mt-1">Non-Blocking</span>
        </div>

        {/* Worker execution */}
        <div className="flex flex-col items-center min-w-[100px]">
          <span className="text-[10px] uppercase font-bold text-[var(--green)] font-mono mb-1">Active Worker</span>
          <div className="bg-[var(--green)]/15 border border-[var(--green)] rounded-lg p-2 text-center w-full shadow-sm">
            <div className="font-mono text-xs font-bold text-[var(--green)]">
              {tasks[activeTask].name.slice(0, 12)}...
            </div>
            <div className="text-[10px] text-[var(--text-dim)] font-mono mt-0.5">
              status: {tasks[activeTask].status}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-deep)] border border-[var(--border)] px-3 py-1 rounded-lg font-mono text-xs text-[var(--green)]">
        ⚡ asyncio Event Loop: While one task waits on network I/O, the loop instantly switches to run other tasks!
      </div>
    </div>
  )
}

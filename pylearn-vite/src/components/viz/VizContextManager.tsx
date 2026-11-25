'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function VizContextManager() {
  const [phase, setPhase] = useState<'enter' | 'work' | 'exit'>('work')

  return (
    <div className="flex flex-col gap-2">
      {/* Phase buttons */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-[var(--text-dim)] font-semibold">Simulate with statement:</span>
        <button
          onClick={() => setPhase('enter')}
          className={`px-2 py-0.5 rounded font-mono text-xs ${
            phase === 'enter' ? 'bg-[var(--green)] text-black font-bold' : 'bg-[var(--surface)] text-[var(--text)]'
          }`}
        >
          1. __enter__()
        </button>
        <button
          onClick={() => setPhase('work')}
          className={`px-2 py-0.5 rounded font-mono text-xs ${
            phase === 'work' ? 'bg-[var(--primary)] text-black font-bold' : 'bg-[var(--surface)] text-[var(--text)]'
          }`}
        >
          2. Execute Block
        </button>
        <button
          onClick={() => setPhase('exit')}
          className={`px-2 py-0.5 rounded font-mono text-xs ${
            phase === 'exit' ? 'bg-[var(--peach)] text-black font-bold' : 'bg-[var(--surface)] text-[var(--text)]'
          }`}
        >
          3. __exit__() (Cleanup)
        </button>
      </div>

      {/* Visual Resource Lifecycle */}
      <div className="bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl p-3 flex items-center justify-around min-h-[95px]">
        {/* Step 1 */}
        <div className={`p-2 rounded-lg border text-center transition-all min-w-[90px] ${
          phase === 'enter' ? 'border-[var(--green)] bg-[var(--green)]/15 scale-105' : 'border-[var(--border)] opacity-60'
        }`}>
          <div className="text-base mb-0.5">🔓</div>
          <div className="text-[10px] font-mono font-bold text-[var(--green)]">__enter__()</div>
          <div className="text-[9px] text-[var(--text-dim)]">Acquire Resource</div>
        </div>

        <div className="text-[var(--text-dim)]">➔</div>

        {/* Step 2 */}
        <div className={`p-2 rounded-lg border text-center transition-all min-w-[110px] ${
          phase === 'work' ? 'border-[var(--primary)] bg-[var(--primary)]/15 scale-105' : 'border-[var(--border)] opacity-60'
        }`}>
          <div className="text-base mb-0.5">⚡</div>
          <div className="text-[10px] font-mono font-bold text-[var(--primary)]">with block runs</div>
          <div className="text-[9px] text-[var(--text-dim)]">Read / Write Data</div>
        </div>

        <div className="text-[var(--text-dim)]">➔</div>

        {/* Step 3 */}
        <div className={`p-2 rounded-lg border text-center transition-all min-w-[90px] ${
          phase === 'exit' ? 'border-[var(--peach)] bg-[var(--peach)]/15 scale-105' : 'border-[var(--border)] opacity-60'
        }`}>
          <div className="text-base mb-0.5">🔒</div>
          <div className="text-[10px] font-mono font-bold text-[var(--peach)]">__exit__()</div>
          <div className="text-[9px] text-[var(--text-dim)]">Guaranteed Close</div>
        </div>
      </div>

      <div className="bg-[var(--bg-deep)] border border-[var(--border)] px-3 py-1 rounded-lg font-mono text-xs text-[var(--green)]">
        &gt;&gt;&gt; with open("model_weights.bin", "rb") as f: data = f.read() # File auto-closed!
      </div>
    </div>
  )
}

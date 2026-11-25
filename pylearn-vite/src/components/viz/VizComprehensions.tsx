import React, { useState } from 'react'
import { Cpu, Database, ArrowRight, Zap } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizComprehensions({ data }: Props) {
  const [filterMode, setFilterMode] = useState<'all' | 'even' | 'square'>('even')
  const rawNums = [1, 2, 3, 4, 5, 6, 7, 8]

  const filteredNums = rawNums.filter((n) => {
    if (filterMode === 'even') return n % 2 === 0
    return true
  })

  const transformed = filteredNums.map((n) => (filterMode === 'square' ? n * n : n * 2))

  return (
    <div className="h-full flex flex-col gap-3 text-xs overflow-y-auto pr-1">
      {/* Mode selection */}
      <div className="flex items-center gap-2 bg-[var(--surface)] p-2 rounded-lg border border-[var(--border)]">
        <span className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-wider">Condition:</span>
        <button
          onClick={() => setFilterMode('even')}
          className={`px-2.5 py-1 rounded text-xs transition-colors ${
            filterMode === 'even'
              ? 'bg-emerald-600 text-white font-medium'
              : 'bg-[var(--surface-hover)] text-[var(--text-dim)]'
          }`}
        >
          Even Only (x % 2 == 0)
        </button>
        <button
          onClick={() => setFilterMode('square')}
          className={`px-2.5 py-1 rounded text-xs transition-colors ${
            filterMode === 'square'
              ? 'bg-emerald-600 text-white font-medium'
              : 'bg-[var(--surface-hover)] text-[var(--text-dim)]'
          }`}
        >
          Square (x ** 2)
        </button>
        <button
          onClick={() => setFilterMode('all')}
          className={`px-2.5 py-1 rounded text-xs transition-colors ${
            filterMode === 'all'
              ? 'bg-emerald-600 text-white font-medium'
              : 'bg-[var(--surface-hover)] text-[var(--text-dim)]'
          }`}
        >
          All (x * 2)
        </button>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-2 gap-2 flex-1">
        {/* Imperative 4-line loop */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Cpu size={12} />
                Traditional Loop
              </span>
              <span className="text-[10px] text-zinc-400">4 lines</span>
            </div>
            <pre className="bg-[var(--bg)] p-2 rounded font-mono text-[11px] leading-relaxed border border-[var(--border)] text-zinc-300">
              <code>{`res = []
for x in nums:
    if x % 2 == 0:
        res.append(x * 2)`}</code>
            </pre>
          </div>
          <div className="mt-2 text-[10px] text-[var(--text-dim)] border-t border-[var(--border)] pt-1.5">
            Slower due to repeated attribute lookup on <code>.append()</code>
          </div>
        </div>

        {/* Pythonic 1-line List Comprehension */}
        <div className="bg-[var(--surface)] border border-emerald-500/40 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Zap size={12} />
                List Comprehension
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">1 line (C-Speed)</span>
            </div>
            <pre className="bg-[var(--bg)] p-2 rounded font-mono text-[11px] leading-relaxed border border-emerald-500/20 text-emerald-200">
              <code>{`res = [
  ${filterMode === 'square' ? 'x ** 2' : 'x * 2'} 
  for x in nums 
  ${filterMode === 'even' ? 'if x % 2 == 0' : ''}
]`}</code>
            </pre>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 border-t border-[var(--border)] pt-1.5 flex items-center gap-1">
            <Zap size={10} /> Up to 35% faster (optimized bytecode)
          </div>
        </div>
      </div>

      {/* Output Transformation Pipeline */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider flex items-center gap-1">
            <Database size={12} className="text-blue-400" />
            Input Pipeline ➔ Evaluated List
          </span>
          <span className="text-[10px] font-mono text-zinc-400">Length: {transformed.length}</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto p-1 font-mono text-xs">
          <div className="flex gap-1">
            {rawNums.map((n, i) => (
              <span
                key={i}
                className={`px-1.5 py-0.5 rounded text-[11px] ${
                  (filterMode === 'even' && n % 2 === 0) || filterMode !== 'even'
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                    : 'bg-zinc-800/60 text-zinc-500 line-through'
                }`}
              >
                {n}
              </span>
            ))}
          </div>
          <ArrowRight size={14} className="text-zinc-500 shrink-0" />
          <div className="flex gap-1">
            {transformed.map((val, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold text-[11px]"
              >
                {val}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

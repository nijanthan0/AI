'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function VizBST() {
  const [searchVal, setSearchVal] = useState('65')
  const [highlightPath, setHighlightPath] = useState<string[]>([])
  const [log, setLog] = useState('Binary Search Tree: Left < Parent < Right')

  const handleSearch = () => {
    const target = parseInt(searchVal, 10)
    if (isNaN(target)) return

    const path: string[] = ['50']
    if (target < 50) {
      path.push('30')
      if (target < 30) path.push('20')
      else if (target > 30) path.push('40')
    } else if (target > 50) {
      path.push('70')
      if (target < 70) path.push('60')
      else if (target > 70) path.push('80')
    }

    setHighlightPath(path)
    setLog(`🔍 Search(${target}): Traversed path [${path.join(' ➔ ')}] in O(log n) steps!`)
  }

  const isHighlighted = (val: string) => highlightPath.includes(val)

  return (
    <div className="flex flex-col gap-2">
      {/* Search Toolbar */}
      <div className="flex items-center justify-between text-xs flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="search"
            className="w-16 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded px-2 py-0.5 text-xs font-mono outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-2.5 py-0.5 rounded bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/40 hover:bg-[var(--primary)]/30 font-semibold text-xs"
          >
            Search (O(log n))
          </button>
        </div>
        <span className="text-[11px] text-[var(--text-dim)] font-mono">Tree Property: L &lt; Node &lt; R</span>
      </div>

      {/* Visual Tree Hierarchy */}
      <div className="bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl p-2.5 flex flex-col items-center gap-1 min-h-[105px]">
        {/* Level 0: Root 50 */}
        <motion.div
          animate={{ scale: isHighlighted('50') ? 1.15 : 1 }}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs ${
            isHighlighted('50')
              ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-white shadow-lg'
              : 'bg-[var(--surface2)] text-[var(--text)] border-[var(--primary)]'
          }`}
        >
          50
        </motion.div>

        {/* Level 1: Left 30, Right 70 */}
        <div className="flex items-center justify-around w-48 text-[11px] text-[var(--text-dim)]">
          <span>↙</span>
          <span>↘</span>
        </div>
        <div className="flex items-center justify-around w-48">
          <motion.div
            animate={{ scale: isHighlighted('30') ? 1.15 : 1 }}
            className={`w-7 h-7 rounded-full border flex items-center justify-center font-mono text-xs ${
              isHighlighted('30')
                ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-white'
                : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
            }`}
          >
            30
          </motion.div>
          <motion.div
            animate={{ scale: isHighlighted('70') ? 1.15 : 1 }}
            className={`w-7 h-7 rounded-full border flex items-center justify-center font-mono text-xs ${
              isHighlighted('70')
                ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-white'
                : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
            }`}
          >
            70
          </motion.div>
        </div>

        {/* Level 2: Children */}
        <div className="flex items-center justify-around w-64 text-[10px] text-[var(--text-dim)]">
          <span>↙ ↘</span>
          <span>↙ ↘</span>
        </div>
        <div className="flex items-center justify-around w-64 text-[11px] font-mono">
          <span className={`px-1.5 py-0.5 rounded ${isHighlighted('20') ? 'bg-[var(--green)] text-black font-bold' : 'text-[var(--text-muted)]'}`}>20</span>
          <span className={`px-1.5 py-0.5 rounded ${isHighlighted('40') ? 'bg-[var(--green)] text-black font-bold' : 'text-[var(--text-muted)]'}`}>40</span>
          <span className={`px-1.5 py-0.5 rounded ${isHighlighted('60') ? 'bg-[var(--green)] text-black font-bold' : 'text-[var(--text-muted)]'}`}>60</span>
          <span className={`px-1.5 py-0.5 rounded ${isHighlighted('80') ? 'bg-[var(--green)] text-black font-bold' : 'text-[var(--text-muted)]'}`}>80</span>
        </div>
      </div>

      {/* Log */}
      <div className="bg-[var(--bg-deep)] border border-[var(--border)] px-3 py-1 rounded-lg font-mono text-xs text-[var(--green)]">
        {log}
      </div>
    </div>
  )
}

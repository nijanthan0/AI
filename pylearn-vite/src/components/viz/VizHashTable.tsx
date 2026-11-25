'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function VizHashTable() {
  const [keyInput, setKeyInput] = useState('apple')
  const [valInput, setValInput] = useState('10')
  const [buckets, setBuckets] = useState<Record<number, { key: string; val: string }[]>>({
    0: [{ key: 'cherry', val: '25' }],
    1: [{ key: 'apple', val: '10' }],
    2: [{ key: 'banana', val: '15' }],
    3: [],
  })
  const [activeBucket, setActiveBucket] = useState<number | null>(1)

  const computeHash = (k: string) => {
    let sum = 0
    for (let i = 0; i < k.length; i++) sum += k.charCodeAt(i)
    return sum % 4
  }

  const handleInsert = () => {
    if (!keyInput.trim()) return
    const b = computeHash(keyInput.trim())
    setActiveBucket(b)
    setBuckets((prev) => ({
      ...prev,
      [b]: [...(prev[b] || []).filter((item) => item.key !== keyInput), { key: keyInput, val: valInput }],
    }))
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Input controls */}
      <div className="flex items-center gap-1.5 text-xs flex-wrap">
        <span className="font-mono text-[var(--primary)] font-bold">dict[</span>
        <input
          type="text"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder="key"
          className="w-16 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded px-1.5 py-0.5 text-xs font-mono outline-none"
        />
        <span className="font-mono text-[var(--primary)] font-bold">] =</span>
        <input
          type="text"
          value={valInput}
          onChange={(e) => setValInput(e.target.value)}
          placeholder="value"
          className="w-12 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded px-1.5 py-0.5 text-xs font-mono outline-none"
        />
        <button
          onClick={handleInsert}
          className="px-2.5 py-0.5 rounded bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/40 hover:bg-[var(--primary)]/30 font-semibold text-xs"
        >
          Compute Hash &amp; Insert
        </button>
      </div>

      {/* Visual Hash Pipeline */}
      <div className="bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl p-2.5 flex items-center justify-between min-h-[95px] gap-2">
        {/* Key in */}
        <div className="text-center min-w-[70px]">
          <div className="text-[10px] text-[var(--text-dim)] font-mono">Key</div>
          <div className="bg-[var(--surface2)] border border-[var(--primary)] rounded px-2 py-1 font-mono text-xs text-[var(--text)] font-bold">
            "{keyInput}"
          </div>
        </div>

        {/* Hash function box */}
        <div className="text-center px-2">
          <div className="text-[10px] text-[var(--mauve)] font-mono">hash(key) % 4</div>
          <div className="text-sm font-bold text-[var(--mauve)]">➔ Index [{computeHash(keyInput)}] ➔</div>
        </div>

        {/* 4 Hash Buckets */}
        <div className="flex-1 grid grid-cols-4 gap-1">
          {[0, 1, 2, 3].map((b) => (
            <motion.div
              key={b}
              animate={{ scale: activeBucket === b ? 1.05 : 1 }}
              className={`border-2 rounded-lg p-1 text-center min-h-[55px] flex flex-col justify-between transition-colors ${
                activeBucket === b
                  ? 'border-[var(--green)] bg-[var(--green)]/10'
                  : 'border-[var(--border)] bg-[var(--bg-deep)]'
              }`}
            >
              <span className="text-[10px] font-mono text-[var(--text-dim)] font-bold">Slot [{b}]</span>
              <div className="space-y-0.5">
                {(buckets[b] || []).map((item) => (
                  <div key={item.key} className="text-[10px] font-mono bg-[var(--surface)] px-1 rounded truncate text-[var(--text)]" title={`${item.key}: ${item.val}`}>
                    {item.key}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-[var(--bg-deep)] border border-[var(--border)] px-3 py-1 rounded-lg font-mono text-xs text-[var(--green)]">
        ⚡ Direct Array Indexing: Hashing maps any string key to a memory slot in O(1) constant time!
      </div>
    </div>
  )
}

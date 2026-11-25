import React, { useState } from 'react'
import { Plus, Minus, RefreshCw, Layers } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizHeap({ data }: Props) {
  // Min-Heap array state
  const [heap, setHeap] = useState<number[]>([12, 25, 18, 40, 32, 28, 55])
  const [inputVal, setInputVal] = useState('15')
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  // Push into min-heap with sift-up
  const handlePush = () => {
    const val = parseInt(inputVal)
    if (isNaN(val)) return

    const newHeap = [...heap, val]
    let current = newHeap.length - 1

    // Sift up
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2)
      if (newHeap[current] < newHeap[parent]) {
        const tmp = newHeap[current]
        newHeap[current] = newHeap[parent]
        newHeap[parent] = tmp
        current = parent
      } else {
        break
      }
    }

    setHeap(newHeap)
    setActiveIdx(current)
    setInputVal((Math.floor(Math.random() * 80) + 5).toString())
    setTimeout(() => setActiveIdx(null), 800)
  }

  // Pop min from heap with sift-down
  const handlePop = () => {
    if (heap.length === 0) return
    if (heap.length === 1) {
      setHeap([])
      return
    }

    const newHeap = [...heap]
    newHeap[0] = newHeap.pop()!
    let current = 0

    // Sift down
    while (true) {
      let smallest = current
      const left = 2 * current + 1
      const right = 2 * current + 2

      if (left < newHeap.length && newHeap[left] < newHeap[smallest]) {
        smallest = left
      }
      if (right < newHeap.length && newHeap[right] < newHeap[smallest]) {
        smallest = right
      }

      if (smallest !== current) {
        const tmp = newHeap[current]
        newHeap[current] = newHeap[smallest]
        newHeap[smallest] = tmp
        current = smallest
      } else {
        break
      }
    }

    setHeap(newHeap)
    setActiveIdx(0)
    setTimeout(() => setActiveIdx(null), 800)
  }

  const handleReset = () => {
    setHeap([12, 25, 18, 40, 32, 28, 55])
    setActiveIdx(null)
  }

  return (
    <div className="h-full flex flex-col gap-3 text-xs overflow-y-auto pr-1">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--surface)] p-2.5 rounded-lg border border-[var(--border)]">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-16 px-2 py-1 bg-[var(--bg)] border border-[var(--border)] rounded text-xs font-mono text-center outline-none text-[var(--text)]"
            placeholder="Val"
          />
          <button
            onClick={handlePush}
            className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition-colors"
          >
            <Plus size={13} />
            heappush()
          </button>
          <button
            onClick={handlePop}
            disabled={heap.length === 0}
            className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded font-medium transition-colors"
          >
            <Minus size={13} />
            heappop() [Min: {heap[0] ?? 'None'}]
          </button>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-2 py-1 text-[var(--text-dim)] hover:text-[var(--text)] bg-[var(--surface-hover)] rounded border border-[var(--border)]"
        >
          <RefreshCw size={12} />
          Reset
        </button>
      </div>

      {/* Heap Tree View */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 flex-1 flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden">
        <div className="absolute top-2 left-2 text-[10px] text-[var(--text-dim)] font-mono uppercase tracking-wider flex items-center gap-1">
          <Layers size={11} className="text-amber-400" />
          Min-Heap Binary Tree: Parent ≤ Children
        </div>

        {/* Tree levels */}
        <div className="flex flex-col items-center gap-3 w-full max-w-sm mt-3">
          {/* Level 0: Root */}
          <div className="flex justify-center">
            {heap[0] !== undefined && (
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs border-2 shadow-sm transition-all ${
                  activeIdx === 0
                    ? 'bg-amber-500 border-amber-300 text-white scale-110'
                    : 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                }`}
              >
                {heap[0]}
              </div>
            )}
          </div>

          {/* Level 1: Left / Right */}
          <div className="flex justify-around w-full px-12">
            {[1, 2].map(
              (idx) =>
                heap[idx] !== undefined && (
                  <div
                    key={idx}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs border-2 shadow-sm transition-all ${
                      activeIdx === idx
                        ? 'bg-amber-500 border-amber-300 text-white scale-110'
                        : 'bg-blue-600/30 border-blue-500 text-blue-300'
                    }`}
                  >
                    {heap[idx]}
                  </div>
                )
            )}
          </div>

          {/* Level 2: Children */}
          <div className="flex justify-between w-full px-4">
            {[3, 4, 5, 6].map(
              (idx) =>
                heap[idx] !== undefined && (
                  <div
                    key={idx}
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-[11px] border shadow-sm transition-all ${
                      activeIdx === idx
                        ? 'bg-amber-500 border-amber-300 text-white scale-110'
                        : 'bg-zinc-700/40 border-zinc-600 text-zinc-300'
                    }`}
                  >
                    {heap[idx]}
                  </div>
                )
            )}
          </div>
        </div>
      </div>

      {/* Heap Array Representation */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider">
            Contiguous Memory Array (List)
          </span>
          <span className="text-[10px] font-mono text-zinc-400">heapq.heappop() is O(log n)</span>
        </div>
        <div className="flex flex-wrap gap-1.5 overflow-x-auto p-1">
          {heap.map((val, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center border rounded px-2.5 py-1 min-w-[38px] font-mono text-xs transition-colors ${
                activeIdx === idx
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : idx === 0
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text)]'
              }`}
            >
              <span className="font-bold">{val}</span>
              <span className="text-[9px] text-[var(--text-dim)]">[{idx}]</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

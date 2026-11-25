import React, { useState, useEffect, useRef } from 'react'
import { Play, RotateCcw, FastForward, Pause } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizSorting({ data }: Props) {
  const initialArray = [48, 15, 82, 33, 91, 24, 67, 12, 55]
  const [array, setArray] = useState<number[]>([...initialArray])
  const [comparing, setComparing] = useState<number[]>([])
  const [swapping, setSwapping] = useState<number[]>([])
  const [sortedIndices, setSortedIndices] = useState<number[]>([])
  const [algorithm, setAlgorithm] = useState<'bubble' | 'selection'>('bubble')
  const [isPlaying, setIsPlaying] = useState(false)
  const [stepCount, setStepCount] = useState(0)

  const stateRef = useRef({ array, comparing, swapping, sortedIndices, isPlaying, stepCount })
  stateRef.current = { array, comparing, swapping, sortedIndices, isPlaying, stepCount }

  const reset = () => {
    setIsPlaying(false)
    setArray([...initialArray])
    setComparing([])
    setSwapping([])
    setSortedIndices([])
    setStepCount(0)
  }

  // Bubble sort step-by-step generator logic
  useEffect(() => {
    let timer: any = null
    if (isPlaying) {
      timer = setInterval(() => {
        const { array: arr, sortedIndices: sorted, stepCount: count } = stateRef.current
        const n = arr.length

        // If fully sorted
        if (sorted.length >= n) {
          setIsPlaying(false)
          return
        }

        // Find next adjacent comparison
        let changed = false
        const nextArr = [...arr]

        // Simple bubble sort sweep
        for (let i = 0; i < n - 1; i++) {
          if (sorted.includes(i + 1)) continue

          setComparing([i, i + 1])
          setStepCount(count + 1)

          if (nextArr[i] > nextArr[i + 1]) {
            setSwapping([i, i + 1])
            const temp = nextArr[i]
            nextArr[i] = nextArr[i + 1]
            nextArr[i + 1] = temp
            setArray(nextArr)
            changed = true
            return
          } else {
            setSwapping([])
          }
        }

        // If reached end of pass
        const lastUnsorted = n - 1 - sorted.length
        if (lastUnsorted >= 0) {
          setSortedIndices([...sorted, lastUnsorted])
        }

        if (!changed && sorted.length >= n - 2) {
          setSortedIndices(Array.from({ length: n }, (_, k) => k))
          setComparing([])
          setSwapping([])
          setIsPlaying(false)
        }
      }, 400)
    }

    return () => clearInterval(timer)
  }, [isPlaying])

  return (
    <div className="h-full flex flex-col gap-3 text-xs overflow-y-auto pr-1">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--surface)] p-2.5 rounded-lg border border-[var(--border)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold text-xs transition-colors shadow-sm ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? 'Pause' : 'Run Sort'}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[var(--surface-hover)] hover:bg-[var(--surface)] text-[var(--text-dim)] border border-[var(--border)] text-xs"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[var(--text-dim)] font-mono">
            Steps: <strong className="text-[var(--text)]">{stepCount}</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-[10px]">
            Timsort: O(n log n) | Bubble: O(n²)
          </span>
        </div>
      </div>

      {/* Visual Bars Container */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 flex-1 flex flex-col justify-end min-h-[170px]">
        <div className="flex items-end justify-between gap-2 h-36 px-2">
          {array.map((val, idx) => {
            const isComparing = comparing.includes(idx)
            const isSwapping = swapping.includes(idx)
            const isSorted = sortedIndices.includes(idx)

            let barColor = 'bg-blue-600'
            let borderColor = 'border-blue-400'
            let textColor = 'text-blue-300'

            if (isSwapping) {
              barColor = 'bg-rose-500 animate-pulse'
              borderColor = 'border-rose-300'
              textColor = 'text-rose-200'
            } else if (isComparing) {
              barColor = 'bg-amber-500'
              borderColor = 'border-amber-300'
              textColor = 'text-amber-200'
            } else if (isSorted) {
              barColor = 'bg-emerald-600'
              borderColor = 'border-emerald-400'
              textColor = 'text-emerald-300'
            }

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <span className={`text-[10px] font-mono font-bold ${textColor}`}>
                  {val}
                </span>
                <div
                  style={{ height: `${(val / 100) * 100}%` }}
                  className={`w-full max-w-[36px] rounded-t-md transition-all duration-200 border-t-2 ${barColor} ${borderColor} shadow-sm`}
                />
                <span className="text-[9px] text-[var(--text-dim)] font-mono">
                  [{idx}]
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend / Status */}
      <div className="grid grid-cols-4 gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-2 text-center text-[11px]">
        <div className="flex items-center justify-center gap-1.5 text-blue-400">
          <div className="w-2.5 h-2.5 rounded bg-blue-600" />
          <span>Unsorted</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-amber-400">
          <div className="w-2.5 h-2.5 rounded bg-amber-500" />
          <span>Comparing</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-rose-400">
          <div className="w-2.5 h-2.5 rounded bg-rose-500" />
          <span>Swapping</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-emerald-400">
          <div className="w-2.5 h-2.5 rounded bg-emerald-600" />
          <span>In Place</span>
        </div>
      </div>
    </div>
  )
}

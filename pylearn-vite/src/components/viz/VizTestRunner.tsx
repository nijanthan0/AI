import React, { useState } from 'react'
import { Play, CheckCircle2, XCircle, RotateCcw, ShieldCheck, Clock } from 'lucide-react'

interface TestCase {
  id: string
  name: string
  duration: string
  status: 'passed' | 'failed' | 'running' | 'idle'
}

interface Props {
  data?: any
}

export default function VizTestRunner({ data }: Props) {
  const defaultTests: TestCase[] = data?.tests || [
    { id: '1', name: 'test_calculate_tax_standard()', duration: '1.2ms', status: 'idle' },
    { id: '2', name: 'test_calculate_tax_zero_income()', duration: '0.8ms', status: 'idle' },
    { id: '3', name: 'test_negative_income_raises_value_error()', duration: '1.5ms', status: 'idle' },
    { id: '4', name: 'test_vip_deduction_boundary()', duration: '2.1ms', status: 'idle' },
  ]

  const [tests, setTests] = useState<TestCase[]>(defaultTests)
  const [isRunning, setIsRunning] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)

  const handleRunTests = () => {
    setIsRunning(true)
    setSummary('Running test suite with pytest & unittest...')

    // Reset to running
    setTests(defaultTests.map((t) => ({ ...t, status: 'running' })))

    // Step-by-step resolve
    defaultTests.forEach((t, i) => {
      setTimeout(() => {
        setTests((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: 'passed' } : item
          )
        )
        if (i === defaultTests.length - 1) {
          setIsRunning(false)
          setSummary('✅ 4 passed in 0.04s — 100% Code Coverage!')
        }
      }, (i + 1) * 350)
    })
  }

  const handleReset = () => {
    setTests(defaultTests.map((t) => ({ ...t, status: 'idle' })))
    setSummary(null)
    setIsRunning(false)
  }

  return (
    <div className="h-full flex flex-col gap-2.5 text-xs overflow-y-auto pr-1">
      {/* Header controls */}
      <div className="flex items-center justify-between p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck size={16} />
          </div>
          <div>
            <div className="font-bold text-xs text-[var(--text)]">Pytest & Unittest Runner</div>
            <div className="text-[10px] text-[var(--text-dim)] font-mono">
              {summary || 'Click Run to execute test suite'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-md transition-colors shadow-sm text-xs"
          >
            <Play size={12} />
            {isRunning ? 'Running...' : 'Run Tests'}
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 bg-[var(--surface-hover)] border border-[var(--border)] rounded text-[var(--text-dim)] hover:text-[var(--text)]"
            title="Reset"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="flex-1 space-y-1.5 overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-lg p-2.5 font-mono">
        {tests.map((test) => (
          <div
            key={test.id}
            className={`flex items-center justify-between p-2 rounded border transition-colors ${
              test.status === 'passed'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : test.status === 'running'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 animate-pulse'
                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {test.status === 'passed' ? (
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              ) : test.status === 'running' ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-zinc-600 shrink-0" />
              )}
              <span className="text-[11px] truncate">{test.name}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-[var(--text-dim)] flex items-center gap-0.5">
                <Clock size={10} />
                {test.duration}
              </span>
              <span
                className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${
                  test.status === 'passed'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : test.status === 'running'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {test.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

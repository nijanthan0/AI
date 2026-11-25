'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, CheckCircle2, AlertOctagon, RotateCcw, ArrowDown, Sparkles } from 'lucide-react'

interface Props {
  data?: any
}

interface Scenario {
  title: string
  code: string
  errorType: string | null
  handledBy: string | null
  elseRan: boolean
  finallyRan: boolean
  explanation: string
}

export default function VizExceptionFlow({ data }: Props) {
  const [activeScenario, setActiveScenario] = useState<number>(0)

  const SCENARIOS: Scenario[] = [
    {
      title: 'ZeroDivisionError (Caught)',
      code: 'result = 100 / 0',
      errorType: 'ZeroDivisionError',
      handledBy: 'except ZeroDivisionError as e:',
      elseRan: false,
      finallyRan: true,
      explanation: 'Division by zero halts the try block instantly. Python searches down the except clauses, matches ZeroDivisionError, executes fallback recovery, skips else, and guarantees finally executes!',
    },
    {
      title: 'Happy Path (No Exception)',
      code: 'result = 100 / 4  # -> 25.0',
      errorType: null,
      handledBy: null,
      elseRan: true,
      finallyRan: true,
      explanation: 'When no error is raised in try, all except blocks are bypassed entirely. Python then executes the "else" block, followed by the mandatory "finally" cleanup block.',
    },
    {
      title: 'KeyError (Caught by tuple)',
      code: 'val = payload["token"]',
      errorType: 'KeyError',
      handledBy: 'except (KeyError, TypeError):',
      elseRan: false,
      finallyRan: true,
      explanation: 'Missing dictionary key raises KeyError. Caught cleanly by a grouped exception tuple. Process continues running without a fatal crash!',
    },
    {
      title: 'Custom UserException',
      code: 'raise InsufficientFunds(500)',
      errorType: 'InsufficientFundsError',
      handledBy: 'except InsufficientFundsError:',
      elseRan: false,
      finallyRan: true,
      explanation: 'Custom domain exceptions inheriting from Exception allow microservices to signal precise business logic failures with typed error payloads.',
    },
  ]

  const active = SCENARIOS[activeScenario]

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <ShieldAlert size={15} className="text-[#f472b6]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            EXCEPTION PIPELINE: try ➔ except ➔ else ➔ finally
          </span>
        </div>
        <span className="text-[10px] bg-black/40 text-zinc-400 px-2 py-0.5 rounded border border-white/10">
          EAFP Pattern Architecture
        </span>
      </div>

      {/* Scenario Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {SCENARIOS.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveScenario(i)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border-2 transition-all whitespace-nowrap ${
              activeScenario === i
                ? 'bg-[#f472b6] text-black border-black shadow-brutal-sm -translate-y-0.5 font-black'
                : 'bg-[#181926] text-zinc-400 border-zinc-700 hover:text-white'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Pipeline Diagram */}
      <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-2">
        {/* Step 1: TRY Block */}
        <div className="bg-[#1a1b2a] p-2.5 rounded-xl border border-zinc-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#38bdf8] text-black font-black flex items-center justify-center text-[10px]">
              1
            </span>
            <span className="text-white font-black text-xs font-mono">try:</span>
            <code className="text-[#38bdf8] text-xs ml-2">{active.code}</code>
          </div>
          {active.errorType ? (
            <span className="text-[#ef4444] text-[10px] font-bold bg-[#ef4444]/20 px-2 py-0.5 rounded border border-[#ef4444]/40 flex items-center gap-1">
              <AlertOctagon size={11} />
              Raised {active.errorType}
            </span>
          ) : (
            <span className="text-[#22c55e] text-[10px] font-bold bg-[#22c55e]/20 px-2 py-0.5 rounded border border-[#22c55e]/40 flex items-center gap-1">
              <CheckCircle2 size={11} />
              Executed Cleanly
            </span>
          )}
        </div>

        <div className="flex justify-center text-zinc-600">
          <ArrowDown size={14} />
        </div>

        {/* Step 2: EXCEPT Branch */}
        <div className={`p-2.5 rounded-xl border-2 flex items-center justify-between transition-all ${
          active.handledBy
            ? 'bg-[#ef4444]/15 border-[#ef4444] text-white'
            : 'bg-[#1a1b2a] border-zinc-800 opacity-50 text-zinc-500'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#f472b6] text-black font-black flex items-center justify-center text-[10px]">
              2
            </span>
            <span className="font-mono font-black text-xs">except:</span>
            <span className="text-[11px] font-mono ml-2">
              {active.handledBy ? active.handledBy : 'Bypassed (no error occurred)'}
            </span>
          </div>
          {active.handledBy && (
            <span className="text-[#22c55e] font-black text-[10px] bg-black/40 px-2 py-0.5 rounded border border-[#22c55e]">
              ✓ CAUGHT & RECOVERED
            </span>
          )}
        </div>

        {/* Step 3: ELSE & FINALLY */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          {/* Else Block */}
          <div className={`p-2 rounded-xl border flex flex-col justify-between ${
            active.elseRan
              ? 'bg-[#a3e635]/15 border-[#a3e635] text-white'
              : 'bg-[#1a1b2a] border-zinc-800 opacity-40 text-zinc-500'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-bold text-xs">else:</span>
              <span className="text-[9px] font-bold uppercase">{active.elseRan ? 'Executed' : 'Skipped'}</span>
            </div>
            <p className="text-[10px] text-zinc-400">
              Only runs when 0 exceptions happen.
            </p>
          </div>

          {/* Finally Block */}
          <div className="p-2 rounded-xl border-2 bg-[#facc15]/15 border-[#facc15] text-white flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-black text-xs text-[#facc15]">finally:</span>
              <span className="text-[9px] font-bold bg-[#facc15] text-black px-1.5 py-0.2 rounded">ALWAYS RUNS</span>
            </div>
            <p className="text-[10px] text-zinc-300">
              Guaranteed cleanup (close DB, free locks, flush buffer).
            </p>
          </div>
        </div>
      </div>

      {/* Explanatory Callout */}
      <div className="bg-[#181926] p-2.5 rounded-xl border-2 border-black flex items-start gap-2 shadow-brutal-sm">
        <Sparkles size={14} className="text-[#a3e635] shrink-0 mt-0.5" />
        <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
          {active.explanation}
        </p>
      </div>
    </div>
  )
}

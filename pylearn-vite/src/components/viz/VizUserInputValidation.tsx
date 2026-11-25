'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Terminal,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Code2
} from 'lucide-react'

interface Props {
  data?: any
}

interface TestCase {
  label: string
  raw: string
  badge: string
  badgeColor: string
  desc: string
}

const PRESET_TEST_CASES: TestCase[] = [
  {
    label: '"25"',
    raw: '25',
    badge: 'VALID INT',
    badgeColor: 'bg-[#a3e635] text-black',
    desc: 'Standard numeric input converted to integer 25.'
  },
  {
    label: '"twenty-five"',
    raw: 'twenty-five',
    badge: 'VALUE ERROR',
    badgeColor: 'bg-[#f87171] text-black',
    desc: 'Non-numeric alphabetic string raises ValueError in int().'
  },
  {
    label: '"-4"',
    raw: '-4',
    badge: 'RANGE ERROR',
    badgeColor: 'bg-[#fbbf24] text-black',
    desc: 'Parses as integer -4, but fails range check (0 <= age <= 130).'
  },
  {
    label: '"3.14"',
    raw: '3.14',
    badge: 'FLOAT STR',
    badgeColor: 'bg-[#f87171] text-black',
    desc: 'int("3.14") raises ValueError! (Must cast to float first).'
  },
  {
    label: '"  42  "',
    raw: '  42  ',
    badge: 'WHITESPACE',
    badgeColor: 'bg-[#38bdf8] text-black',
    desc: 'Surrounded by whitespace. Safely cleaned using .strip().'
  }
]

export default function VizUserInputValidation({ data }: Props) {
  const [rawInput, setRawInput] = useState<string>('25')
  const [withTryExcept, setWithTryExcept] = useState<boolean>(true)
  const [activeStep, setActiveStep] = useState<number>(4) // 1: input(), 2: strip, 3: int(), 4: range

  const trimmed = rawInput.trim()
  const isDigits = /^[-+]?\d+$/.test(trimmed)
  const parsedNum = isDigits ? parseInt(trimmed, 10) : NaN
  const isValueError = isNaN(parsedNum)
  const isOutOfRange = !isValueError && (parsedNum < 0 || parsedNum > 130)
  const isValid = !isValueError && !isOutOfRange

  // Simulated trap: input() + input()
  const concatResult = `"${rawInput}" + "${rawInput}" = "${rawInput}${rawInput}"`
  const additionResult = !isValueError ? `${parsedNum} + ${parsedNum} = ${parsedNum * 2}` : 'Error'

  const handleSelectPreset = (tc: TestCase) => {
    setRawInput(tc.raw)
    setActiveStep(4)
  }

  return (
    <div className="h-full flex flex-col gap-2.5 text-xs select-none overflow-y-auto pr-1">
      {/* Top Controls: Preset Chips & Safe Toggle */}
      <div className="flex flex-col gap-2 p-3 bg-[#181922] border-2 border-black rounded-xl shadow-brutal-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-zinc-400 text-[11px] uppercase tracking-wider">
              Test Input Presets:
            </span>
          </div>

          {/* Safe Mode Toggle */}
          <button
            onClick={() => setWithTryExcept(!withTryExcept)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-2 border-black font-mono font-black text-[11px] transition-all shadow-brutal-xs ${
              withTryExcept
                ? 'bg-[#a3e635] text-black hover:-translate-y-0.5'
                : 'bg-[#ef4444] text-white hover:-translate-y-0.5'
            }`}
            title="Toggle between safe try/except handling and unhandled crashes"
          >
            {withTryExcept ? <ShieldCheck size={13} /> : <AlertOctagon size={13} />}
            <span>{withTryExcept ? 'TRY / EXCEPT: ENABLED (SAFE)' : 'NO TRY / EXCEPT: (CRASH RISKY)'}</span>
          </button>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {PRESET_TEST_CASES.map((tc) => {
            const isSelected = rawInput === tc.raw
            return (
              <button
                key={tc.label}
                onClick={() => handleSelectPreset(tc)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-2 border-black font-mono text-xs transition-all ${
                  isSelected
                    ? 'bg-[#facc15] text-black font-black shadow-brutal-xs -translate-y-0.5'
                    : 'bg-[#27272a] text-zinc-300 hover:text-white hover:bg-[#3f3f46]'
                }`}
              >
                <span>{tc.label}</span>
                <span className={`text-[9px] font-black px-1 py-0.2 rounded ${tc.badgeColor}`}>
                  {tc.badge}
                </span>
              </button>
            )
          })}
        </div>

        {/* Custom Input Field */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1 flex items-center bg-[#0d0e15] border-2 border-black rounded-lg px-2.5 py-1">
            <span className="text-[#a3e635] font-mono font-bold text-xs mr-2">
              input(&quot;Enter age: &quot;) ➔
            </span>
            <input
              type="text"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Type anything (e.g. 25, hello, 3.14)..."
              className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none"
            />
          </div>
          <button
            onClick={() => setRawInput('25')}
            className="p-1.5 bg-[#27272a] text-zinc-400 hover:text-white rounded-lg border border-black transition-all"
            title="Reset to default (25)"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* The String vs Integer Trap Banner */}
      <div className="bg-[#12131a] border-2 border-black rounded-xl p-2.5 shadow-brutal-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#38bdf8] border border-black flex items-center justify-center text-black font-black text-xs rotate-[-3deg] flex-shrink-0">
            ⚠️
          </div>
          <div>
            <div className="text-[11px] font-black text-white">
              Remember: input() Always Returns a String (`str`)!
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">
              Without casting, adding inputs concatenates characters instead of math!
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] bg-[#181924] px-2.5 py-1 rounded-lg border border-zinc-800 flex-shrink-0">
          <div>
            <span className="text-zinc-500">str + str: </span>
            <span className="text-[#f87171] font-bold">{concatResult}</span>
          </div>
          <div className="text-zinc-700">|</div>
          <div>
            <span className="text-zinc-500">int + int: </span>
            <span className="text-[#a3e635] font-bold">
              {!isValueError ? additionResult : 'ValueError'}
            </span>
          </div>
        </div>
      </div>

      {/* 4-Stage Execution Flow Pipeline */}
      <div className="bg-[#181922] border-2 border-black rounded-xl p-3 shadow-brutal-sm flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono font-bold text-zinc-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#facc15]" />
            <span>Validation Pipeline (Left to Right)</span>
          </span>
          <span className="text-[10px] font-mono text-zinc-400">
            {isValid ? 'STATUS: VALID INPUT' : isValueError ? 'STATUS: VALUE ERROR' : 'STATUS: RANGE ERROR'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {/* Stage 1: input() raw string */}
          <div className="p-2.5 rounded-lg bg-[#12131a] border-2 border-black flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-black text-[#38bdf8]">
                  STAGE 1: INPUT
                </span>
                <span className="text-[9px] font-mono bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded">
                  sys.stdin
                </span>
              </div>
              <div className="font-mono text-xs text-white truncate py-0.5">
                &quot;{rawInput}&quot;
              </div>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono mt-1 pt-1 border-t border-zinc-800">
              type: <strong className="text-[#38bdf8]">str</strong>
            </div>
          </div>

          {/* Stage 2: .strip() clean */}
          <div className="p-2.5 rounded-lg bg-[#12131a] border-2 border-black flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-black text-[#a3e635]">
                  STAGE 2: STRIP
                </span>
                <span className="text-[9px] font-mono bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded">
                  .strip()
                </span>
              </div>
              <div className="font-mono text-xs text-white truncate py-0.5">
                &quot;{trimmed}&quot;
              </div>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono mt-1 pt-1 border-t border-zinc-800">
              spaces: <strong className="text-zinc-300">{rawInput.length - trimmed.length} removed</strong>
            </div>
          </div>

          {/* Stage 3: int() Type Cast & try/except */}
          <div
            className={`p-2.5 rounded-lg border-2 border-black flex flex-col justify-between transition-all ${
              isValueError
                ? withTryExcept
                  ? 'bg-[#3b2d18] border-[#fbbf24]'
                  : 'bg-[#451212] border-[#ef4444]'
                : 'bg-[#12131a]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-black text-[#facc15]">
                  STAGE 3: CAST
                </span>
                <span className="text-[9px] font-mono bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded">
                  int(...)
                </span>
              </div>
              <div className="font-mono text-xs text-white truncate py-0.5">
                {isValueError ? (
                  <span className="text-[#f87171] font-bold">ValueError!</span>
                ) : (
                  <span className="text-[#a3e635] font-bold">{parsedNum}</span>
                )}
              </div>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-1 pt-1 border-t border-zinc-800">
              {isValueError ? (
                withTryExcept ? (
                  <span className="text-[#fbbf24]">🛡️ Caught by except!</span>
                ) : (
                  <span className="text-[#f87171]">💥 Uncaught Crash!</span>
                )
              ) : (
                <span>type: <strong className="text-[#a3e635]">int</strong></span>
              )}
            </div>
          </div>

          {/* Stage 4: Range & Logic Check */}
          <div
            className={`p-2.5 rounded-lg border-2 border-black flex flex-col justify-between transition-all ${
              isValid
                ? 'bg-[#142918] border-[#a3e635]'
                : isOutOfRange
                ? 'bg-[#3b2d18] border-[#fbbf24]'
                : 'bg-[#12131a]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-black text-[#f472b6]">
                  STAGE 4: RANGE
                </span>
                <span className="text-[9px] font-mono bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded">
                  0 &lt;= age &lt;= 130
                </span>
              </div>
              <div className="font-mono text-xs truncate py-0.5">
                {isValid ? (
                  <span className="text-[#4ade80] font-black flex items-center gap-1">
                    <CheckCircle2 size={13} /> APPROVED
                  </span>
                ) : isOutOfRange ? (
                  <span className="text-[#fbbf24] font-black flex items-center gap-1">
                    <XCircle size={13} /> OUT OF RANGE
                  </span>
                ) : (
                  <span className="text-zinc-500 font-bold">SKIPPED (ERROR)</span>
                )}
              </div>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-1 pt-1 border-t border-zinc-800">
              result: <strong className={isValid ? 'text-[#a3e635]' : 'text-[#f87171]'}>
                {isValid ? parsedNum : 0}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Live Terminal & Python Code Trace Output */}
      <div className="bg-[#0f1016] border-2 border-black rounded-xl p-3 shadow-brutal-sm flex flex-col gap-2 flex-1 min-h-[140px]">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#a3e635]" />
            <span className="font-mono font-black text-xs text-white">
              Python Runtime Console
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            python3 script.py
          </span>
        </div>

        {/* Console output display */}
        <div className="font-mono text-xs leading-relaxed space-y-1 overflow-x-auto select-text pt-1">
          <div className="text-zinc-400">
            <span className="text-[#a3e635] font-bold">&gt;&gt;&gt;</span> raw = input(&quot;Enter your age: &quot;)
          </div>
          <div className="text-zinc-300 pl-4">
            Enter your age: <strong className="text-white underline">{rawInput}</strong>
          </div>

          <div className="text-zinc-400 pt-1">
            <span className="text-[#a3e635] font-bold">&gt;&gt;&gt;</span> # Executing validation function:
          </div>

          {withTryExcept ? (
            <>
              {isValueError && (
                <div className="p-2 rounded bg-[#3b1d1d] border border-[#ef4444] text-[#fca5a5] space-y-0.5">
                  <div className="font-bold flex items-center gap-1.5 text-white">
                    <AlertTriangle size={13} className="text-[#f87171]" />
                    <span>except ValueError caught!</span>
                  </div>
                  <div>❌ Invalid Input (&apos;{rawInput}&apos;): invalid literal for int() with base 10: &apos;{trimmed}&apos;</div>
                  <div className="text-[#a3e635] text-[11px]">
                    ➔ Safe fallback returned: age = 0 (Script remains healthy!)
                  </div>
                </div>
              )}

              {isOutOfRange && (
                <div className="p-2 rounded bg-[#3b2d18] border border-[#fbbf24] text-[#fde68a] space-y-0.5">
                  <div className="font-bold flex items-center gap-1.5 text-white">
                    <AlertTriangle size={13} className="text-[#fbbf24]" />
                    <span>Range validation failed:</span>
                  </div>
                  <div>❌ Invalid Input (&apos;{rawInput}&apos;): Age must be between 0 and 130</div>
                  <div className="text-[#a3e635] text-[11px]">
                    ➔ Fallback returned: age = 0
                  </div>
                </div>
              )}

              {isValid && (
                <div className="p-2 rounded bg-[#142918] border border-[#a3e635] text-[#bbf7d0] space-y-0.5">
                  <div className="font-bold flex items-center gap-1.5 text-white">
                    <CheckCircle2 size={13} className="text-[#a3e635]" />
                    <span>Validation Successful!</span>
                  </div>
                  <div>✅ Successfully parsed integer age: <strong className="text-white">{parsedNum}</strong></div>
                  <div className="text-zinc-400 text-[11px]">
                    Executable continue: next_stage(age={parsedNum})
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {isValueError ? (
                <div className="p-2 rounded bg-[#450a0a] border-2 border-[#ef4444] text-[#fca5a5] space-y-1">
                  <div className="font-black text-white flex items-center gap-1.5">
                    <AlertOctagon size={14} className="text-[#ef4444]" />
                    <span>Traceback (most recent call last):</span>
                  </div>
                  <div className="text-[11px] text-zinc-300">
                    File &quot;script.py&quot;, line 3, in parse_user_age
                  </div>
                  <div className="text-[11px] text-zinc-300 pl-4">
                    age = int(raw_input_str.strip())
                  </div>
                  <div className="font-bold text-[#f87171] bg-black/40 p-1.5 rounded">
                    ValueError: invalid literal for int() with base 10: &apos;{trimmed}&apos;
                  </div>
                  <div className="text-[10px] text-zinc-400 font-bold">
                    💥 Process finished with exit code 1 (Script crashed due to missing try/except)
                  </div>
                </div>
              ) : isOutOfRange ? (
                <div className="p-2 rounded bg-[#3b2d18] border border-[#fbbf24] text-[#fde68a]">
                  <div>❌ Out of range: {parsedNum} &lt; 0 or &gt; 130</div>
                </div>
              ) : (
                <div className="p-2 rounded bg-[#142918] border border-[#a3e635] text-[#bbf7d0]">
                  <div>✅ Converted: {parsedNum} (type: int)</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

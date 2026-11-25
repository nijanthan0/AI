'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Timer, RefreshCw, CheckCircle2, AlertOctagon, Zap } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizExponentialBackoff({ data }: Props) {
  const [baseDelay, setBaseDelay] = useState<number>(1)
  const [hasJitter, setHasJitter] = useState<boolean>(true)
  const [attempt, setAttempt] = useState<number>(1)
  const maxAttempts = 5

  const calculateDelay = (att: number) => {
    const raw = baseDelay * Math.pow(2, att - 1)
    return hasJitter ? Number((raw + Math.sin(att) * 0.3).toFixed(2)) : raw
  }

  const delays = [1, 2, 3, 4].map(calculateDelay)

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Timer size={15} className="text-[#facc15]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            MICROSERVICE RESILIENCE: EXPONENTIAL BACKOFF + JITTER
          </span>
        </div>
        <span className="text-[10px] bg-black/40 text-zinc-400 px-2 py-0.5 rounded border border-white/10">
          delay = base * (2 ** attempt) + jitter
        </span>
      </div>

      {/* Interactive Retry Timeline */}
      <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-400 font-bold uppercase">
            Retry Intervals Timeline:
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-zinc-300">
            <input
              type="checkbox"
              checked={hasJitter}
              onChange={(e) => setHasJitter(e.target.checked)}
              className="accent-[#a3e635]"
            />
            <span>Add Random Jitter (Thundering Herd Shield)</span>
          </label>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-2">
          {[1, 2, 3, 4, 5].map((attNum) => {
            const isSuccess = attNum === 5
            const delaySec = attNum < 5 ? calculateDelay(attNum) : 0

            return (
              <div key={attNum} className="flex items-center">
                <div className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 min-w-[75px] ${
                  isSuccess
                    ? 'bg-[#22c55e]/20 border-[#22c55e] text-white shadow-brutal-sm'
                    : 'bg-[#ef4444]/15 border-[#ef4444] text-white'
                }`}>
                  <span className="text-[9px] font-bold text-zinc-400">Try #{attNum}</span>
                  <div className="flex items-center gap-1 my-1">
                    {isSuccess ? <CheckCircle2 size={13} className="text-[#22c55e]" /> : <AlertOctagon size={13} className="text-[#ef4444]" />}
                    <span className="font-mono font-black text-xs">
                      {isSuccess ? '200 OK' : '503 Fail'}
                    </span>
                  </div>
                  {attNum < 5 && (
                    <span className="text-[9px] font-bold text-[#facc15] bg-black/40 px-1 rounded">
                      Wait {delaySec}s
                    </span>
                  )}
                </div>

                {attNum < 5 && (
                  <span className="text-zinc-600 font-black px-1">➔</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="bg-[#181926] p-2.5 rounded-xl border-2 border-black flex items-start gap-2 shadow-brutal-sm">
        <Zap size={14} className="text-[#a3e635] shrink-0 mt-0.5" />
        <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
          Exponential backoff doubles the sleep duration between consecutive network retries. Adding <strong>random jitter</strong> prevents hundreds of crashed clients from retrying simultaneously and hammering the downstream database at the exact same millisecond.
        </p>
      </div>
    </div>
  )
}

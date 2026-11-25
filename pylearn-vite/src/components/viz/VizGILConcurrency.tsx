'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Lock, Unlock, Network, Server, ArrowRight } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizGILConcurrency({ data }: Props) {
  const [model, setModel] = useState<'gil_cpu' | 'gil_io' | 'multiprocess' | 'asyncio'>('gil_cpu')

  const MODELS = {
    gil_cpu: {
      name: 'Threading (CPU-bound)',
      verdict: 'GIL Contention Bottleneck',
      verdictColor: '#ef4444',
      coresUsed: '1 Core utilized (despite 4 threads)',
      speedup: '0.9x - 1.0x (Slower due to lock thrashing!)',
      desc: 'In CPython, the GIL (Global Interpreter Lock) restricts bytecode execution to exactly 1 thread at a time. Threads fight for the mutex lock, wasting cycles on context switching.',
    },
    gil_io: {
      name: 'Threading (I/O-bound)',
      verdict: 'Effective Concurrency',
      verdictColor: '#22c55e',
      coresUsed: '1 Core (I/O wait delegated to OS kernel)',
      speedup: '3.8x Speedup on Network/Disk',
      desc: 'When a thread waits for network response or disk read, CPython voluntarily releases the GIL! Other threads acquire the lock and execute while the first waits.',
    },
    multiprocess: {
      name: 'Multiprocessing (CPU-bound)',
      verdict: 'True Parallelism',
      verdictColor: '#a3e635',
      coresUsed: '4 / 4 CPU Cores Saturated',
      speedup: '3.9x True Parallel Speedup',
      desc: 'Bypasses the GIL completely by spawning separate OS processes (os.fork/spawn). Each process has its own dedicated Python interpreter, memory space, and GIL.',
    },
    asyncio: {
      name: 'Asyncio (Single-Thread Event Loop)',
      verdict: 'High-Concurrency I/O Multiplexing',
      verdictColor: '#38bdf8',
      coresUsed: '1 Core (Handles 10,000+ sockets)',
      speedup: 'Massive scale with zero thread memory overhead',
      desc: 'Single OS thread with cooperative multitasking. Uses epoll/kqueue event loop to switch between coroutines instantly when an awaitable pauses on I/O.',
    },
  }

  const active = MODELS[model]

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Cpu size={15} className="text-[#38bdf8]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            CONCURRENCY ARCHITECTURE: GIL VS MULTIPROCESSING
          </span>
        </div>
        <span className="text-[10px] bg-black/40 text-zinc-400 px-2 py-0.5 rounded border border-white/10">
          CPython 3.12 Runtime
        </span>
      </div>

      {/* Model Selection Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
        {(['gil_cpu', 'gil_io', 'multiprocess', 'asyncio'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setModel(m)}
            className={`p-1.5 rounded-lg text-[10px] font-bold border-2 transition-all ${
              model === m
                ? 'bg-[#a3e635] text-black border-black shadow-brutal-sm font-black'
                : 'bg-[#181926] text-zinc-400 border-zinc-700 hover:text-white'
            }`}
          >
            {MODELS[m].name}
          </button>
        ))}
      </div>

      {/* Visual Cores & Threads Matrix */}
      <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Hardware Utilization:</span>
            <span className="text-white font-bold">{active.coresUsed}</span>
          </div>
          <span
            className="text-[10px] font-black px-2 py-0.5 rounded border"
            style={{ color: active.verdictColor, borderColor: `${active.verdictColor}60`, background: `${active.verdictColor}15` }}
          >
            {active.verdict}
          </span>
        </div>

        {/* 4 CPU Cores Diagram */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((coreNum) => {
            const isCoreActive =
              model === 'multiprocess' ||
              (coreNum === 1 && (model === 'gil_cpu' || model === 'gil_io' || model === 'asyncio'))

            return (
              <div
                key={coreNum}
                className={`p-2 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                  isCoreActive
                    ? 'bg-[#22c55e]/15 border-[#22c55e] text-white'
                    : 'bg-[#1a1b2a] border-zinc-800 text-zinc-600 opacity-40'
                }`}
              >
                <Cpu size={18} className={isCoreActive ? 'text-[#22c55e]' : 'text-zinc-600'} />
                <span className="text-[10px] font-bold mt-1">CPU Core {coreNum}</span>
                <span className="text-[9px] font-mono mt-0.5">
                  {isCoreActive ? (model === 'multiprocess' ? '100% Load' : coreNum === 1 ? '100% (GIL)' : '0% Idle') : '0% Idle'}
                </span>
              </div>
            )
          })}
        </div>

        {/* GIL Lock Status Indicator */}
        <div className="bg-[#181926] p-2 rounded-xl border border-zinc-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {model === 'gil_cpu' ? (
              <Lock size={15} className="text-[#ef4444]" />
            ) : model === 'gil_io' ? (
              <Unlock size={15} className="text-[#22c55e]" />
            ) : (
              <Server size={15} className="text-[#38bdf8]" />
            )}
            <span className="text-[11px] font-bold text-white">
              {model === 'gil_cpu' && 'GIL LOCKED: Thread 1 executing; Threads 2, 3, 4 BLOCKED waiting for lock'}
              {model === 'gil_io' && 'GIL RELEASED: Thread 1 waiting on Socket; Thread 2 actively computing'}
              {model === 'multiprocess' && 'GIL INDEPENDENT: 4 separate OS processes running on 4 CPU cores'}
              {model === 'asyncio' && 'EVENT LOOP: Single thread task scheduler cycling through coroutines'}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#facc15]">
            {active.speedup}
          </span>
        </div>
      </div>

      {/* Architectural Description */}
      <div className="bg-[#181926] p-2.5 rounded-xl border-2 border-black flex items-start gap-2 shadow-brutal-sm">
        <ArrowRight size={14} className="text-[#a3e635] shrink-0 mt-0.5" />
        <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
          {active.desc}
        </p>
      </div>
    </div>
  )
}

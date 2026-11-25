'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react'

interface VarItem {
  name: string
  value: string
  type: string
  color: string
}

interface Props {
  data: VarItem[]
}

const SCENES = [
  {
    id: 'boxes',
    short: '1. Boxes',
    title: '1. Memory Boxes',
    subtitle: 'Named containers in memory holding typed values',
  },
  {
    id: 'pointers',
    short: '2. Pointers',
    title: '2. Pointers & Heap (x = 25)',
    subtitle: 'Python names point to object addresses in memory',
  },
  {
    id: 'aliasing',
    short: '3. Shared',
    title: '3. Shared Reference (y = x)',
    subtitle: 'Two names pointing to the exact same memory address',
  },
  {
    id: 'rebind',
    short: '4. Rebind',
    title: '4. Reassignment (x = "Hello")',
    subtitle: 'Pointer detaches and rebinds to a newly allocated object',
  },
  {
    id: 'legb',
    short: '5. Scope',
    title: '5. LEGB Scope Hierarchy',
    subtitle: 'Local ➔ Enclosing ➔ Global ➔ Built-in resolution order',
  },
]

export default function VizVariables({ data }: Props) {
  const [activeScene, setActiveScene] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const varList = Array.isArray(data) && data.length > 0
    ? data
    : [
        { name: 'score', value: '98', type: 'int', color: '#22c55e' },
        { name: 'username', value: '"Alex"', type: 'str', color: '#38bdf8' },
        { name: 'is_active', value: 'True', type: 'bool', color: '#facc15' },
      ]

  // Auto-play animation timer (like an interactive video)
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % SCENES.length)
    }, 3200)
    return () => clearInterval(timer)
  }, [isPlaying])

  const nextScene = () => setActiveScene((prev) => (prev + 1) % SCENES.length)
  const prevScene = () => setActiveScene((prev) => (prev - 1 + SCENES.length) % SCENES.length)

  return (
    <div className="flex flex-col gap-2.5 select-none w-full">
      {/* Top Playback & Scene Selector Bar */}
      <div className="flex items-center justify-between bg-[#161722] p-1.5 rounded-xl border border-zinc-800 text-xs gap-2">
        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-2.5 py-1 rounded-lg font-mono font-bold text-[11px] flex items-center gap-1 transition-all ${
              isPlaying
                ? 'bg-[#fb923c] text-black shadow-sm'
                : 'bg-[#22c55e]/15 text-[#4ade80] hover:bg-[#22c55e]/25 border border-[#22c55e]/40'
            }`}
            title="Auto-play walkthrough animation"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={prevScene}
            className="p-1 rounded-lg bg-[#22232e] hover:bg-[#2c2d3a] text-zinc-300 hover:text-white transition-colors border border-zinc-800"
            title="Previous scene"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={nextScene}
            className="p-1 rounded-lg bg-[#22232e] hover:bg-[#2c2d3a] text-zinc-300 hover:text-white transition-colors border border-zinc-800"
            title="Next scene"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Scene Selection Pills */}
        <div className="flex items-center gap-1 overflow-x-hidden flex-wrap sm:flex-nowrap justify-end">
          {SCENES.map((scene, i) => (
            <button
              key={scene.id}
              onClick={() => {
                setActiveScene(i)
                setIsPlaying(false)
              }}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold whitespace-nowrap transition-all ${
                activeScene === i
                  ? 'bg-[#facc15] text-black shadow-sm'
                  : 'bg-[#22232e] text-zinc-400 hover:text-white hover:bg-[#2c2d3a] border border-zinc-800'
              }`}
            >
              {scene.short}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stage: High-Contrast Animated Scenes */}
      <div className="bg-[#101118] border border-zinc-800 rounded-xl p-3 min-h-[145px] flex flex-col justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          {/* SCENE 1: Basic Variables Boxes */}
          {activeScene === 0 && (
            <motion.div
              key="scene-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4 flex-wrap justify-center py-2"
            >
              {varList.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-xs text-zinc-400 mb-1 font-mono font-bold">
                    {item.name}
                  </span>
                  <div
                    className="rounded-xl px-4 py-2 border-2 flex flex-col items-center min-w-[80px] bg-[#1a1b26] shadow-md"
                    style={{ borderColor: item.color }}
                  >
                    <span className="font-mono font-black text-sm text-white">
                      {item.value}
                    </span>
                    <span
                      className="text-[10px] mt-0.5 font-mono font-bold px-1.5 py-0.2 rounded"
                      style={{ color: item.color, background: `${item.color}20` }}
                    >
                      {item.type}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* SCENE 2: Under the Hood — Namespace pointing to Heap Object (x = 25) */}
          {activeScene === 1 && (
            <motion.div
              key="scene-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-around py-2"
            >
              {/* Namespace Side */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 mb-1">
                  Namespace (Symbol)
                </span>
                <div className="bg-[#1a1b26] border-2 border-[#38bdf8] rounded-xl px-4 py-2 flex items-center gap-2 shadow-md">
                  <span className="font-mono font-black text-base text-[#38bdf8]">x</span>
                  <span className="text-[10px] text-zinc-400 font-mono">var</span>
                </div>
              </div>

              {/* Animated Pointer Arrow */}
              <div className="flex flex-col items-center mx-2">
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="text-[#facc15] font-black text-base font-mono"
                >
                  ━━━━━▶
                </motion.div>
                <span className="text-[9px] font-mono text-zinc-400">points to</span>
              </div>

              {/* Heap Object Side */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 mb-1">
                  Heap Memory (RAM)
                </span>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-[#1a1b26] border-2 border-[#4ade80] rounded-xl px-4 py-2 text-center shadow-md"
                >
                  <div className="font-mono text-base font-black text-[#4ade80]">25</div>
                  <div className="text-[10px] text-zinc-300 font-mono">type: int</div>
                  <div className="text-[9px] text-zinc-500 font-mono">0x7fff10a</div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* SCENE 3: Aliasing / Shared Reference (y = x) */}
          {activeScene === 2 && (
            <motion.div
              key="scene-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-around py-2"
            >
              {/* Namespace with 2 names */}
              <div className="flex flex-col gap-2">
                <div className="bg-[#1a1b26] border-2 border-[#38bdf8] rounded-lg px-3 py-1 flex items-center justify-between gap-3 shadow-md">
                  <span className="font-mono font-black text-sm text-[#38bdf8]">x</span>
                  <span className="text-[10px] text-[#38bdf8] font-mono">━━▶</span>
                </div>
                <div className="bg-[#1a1b26] border-2 border-[#c084fc] rounded-lg px-3 py-1 flex items-center justify-between gap-3 shadow-md">
                  <span className="font-mono font-black text-sm text-[#c084fc]">y</span>
                  <span className="text-[10px] text-[#c084fc] font-mono">━━▶</span>
                </div>
              </div>

              {/* Convergence indicator */}
              <div className="text-center px-2">
                <span className="text-[10px] font-mono text-[#4ade80] font-black bg-[#4ade80]/15 px-2 py-0.5 rounded-full border border-[#4ade80]/30">
                  id(x) == id(y) is True
                </span>
                <div className="text-[9px] text-zinc-400 mt-1 font-mono">Both point to same address</div>
              </div>

              {/* Single Shared Heap Object */}
              <div className="bg-[#1a1b26] border-2 border-[#4ade80] rounded-xl px-4 py-2 text-center shadow-md">
                <div className="font-mono text-base font-black text-[#4ade80]">25</div>
                <div className="text-[10px] text-zinc-300 font-mono">ref_count: 2</div>
                <div className="text-[9px] text-zinc-500 font-mono">0x7fff10a</div>
              </div>
            </motion.div>
          )}

          {/* SCENE 4: Dynamic Reassignment (x = "Hello") */}
          {activeScene === 3 && (
            <motion.div
              key="scene-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-around py-2"
            >
              <div className="bg-[#1a1b26] border-2 border-[#38bdf8] rounded-xl px-4 py-2 flex items-center gap-2 shadow-md">
                <span className="font-mono font-black text-base text-[#38bdf8]">x</span>
                <span className="text-[10px] text-zinc-400 font-mono">rebound</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs text-[#fb923c] font-black font-mono">DETACHED ❌</span>
                <span className="text-[9px] font-mono text-zinc-500">original 25 freed if ref=0</span>
              </div>

              <div className="bg-[#1a1b26] border-2 border-[#f472b6] rounded-xl px-4 py-2 text-center shadow-md">
                <div className="font-mono text-sm font-black text-[#f472b6]">"Hello"</div>
                <div className="text-[10px] text-zinc-300 font-mono">type: str</div>
                <div className="text-[9px] text-zinc-500 font-mono">0x7fff99c</div>
              </div>
            </motion.div>
          )}

          {/* SCENE 5: LEGB Scope Hierarchy */}
          {activeScene === 4 && (
            <motion.div
              key="scene-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center py-1 w-full"
            >
              <div className="w-full max-w-sm border-2 border-zinc-700 bg-[#161722] rounded-xl p-2 text-center shadow-md">
                <div className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Built-in Scope (B): print, len, range
                </div>

                <div className="border-2 border-[#38bdf8]/60 bg-[#1a1b26] rounded-lg p-1.5 mb-1">
                  <div className="text-[10px] font-mono font-bold text-[#38bdf8] uppercase tracking-wider mb-1">
                    Global Scope (G): module-level
                  </div>

                  <div className="border-2 border-[#fb923c]/60 bg-[#1e1f2b] rounded-lg p-1.5 mb-1">
                    <div className="text-[10px] font-mono font-bold text-[#fb923c] uppercase tracking-wider mb-1">
                      Enclosing Scope (E): outer func
                    </div>

                    <div className="border-2 border-[#4ade80] bg-[#16291e] rounded-md p-1 font-mono text-xs font-black text-[#4ade80]">
                      Local Scope (L): inside current function
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtitle / Narration Banner */}
      <div className="bg-[#161722] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs flex items-center justify-between font-mono">
        <span className="text-zinc-200">
          <strong className="text-[#facc15] font-black">{SCENES[activeScene].title}:</strong>{' '}
          <span className="text-zinc-300 font-medium">{SCENES[activeScene].subtitle}</span>
        </span>
        <span className="text-[10px] text-zinc-500 font-bold flex-shrink-0 ml-2">
          Step {activeScene + 1} of {SCENES.length}
        </span>
      </div>
    </div>
  )
}

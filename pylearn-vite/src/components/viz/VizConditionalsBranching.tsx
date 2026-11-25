'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitFork,
  Sun,
  CloudRain,
  Snowflake,
  CloudSun,
  CheckCircle2,
  XCircle,
  SkipForward,
  Zap,
  Terminal,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Layers
} from 'lucide-react'

interface Props {
  data?: any
}

interface WeatherPreset {
  label: string
  temp: number
  rain: boolean
  icon: string
  desc: string
}

const PRESETS: WeatherPreset[] = [
  {
    label: '☀️ Hot & Sunny',
    temp: 34,
    rain: false,
    icon: '☀️',
    desc: 'temp=34 (>30), rain=False. if branch succeeds!'
  },
  {
    label: '🌤️ Pleasant Day',
    temp: 24,
    rain: false,
    icon: '🌤️',
    desc: 'temp=24 (<=30 but >20). if fails, elif succeeds!'
  },
  {
    label: '🌧️ Hot Summer Rain',
    temp: 32,
    rain: true,
    icon: '🌧️',
    desc: 'temp=32 (>30), but rain=True! (not rain is False). Falls to elif!'
  },
  {
    label: '🧥 Cold Breeze',
    temp: 14,
    rain: false,
    icon: '🧥',
    desc: 'temp=14 (<=20). if and elif both fail. else executes!'
  },
  {
    label: '⛈️ Cold Downpour',
    temp: 8,
    rain: true,
    icon: '⛈️',
    desc: 'temp=8, rain=True. Fallback else branch executes!'
  }
]

export default function VizConditionalsBranching({ data }: Props) {
  const [temperature, setTemperature] = useState<number>(32)
  const [isRaining, setIsRaining] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'flow' | 'shortcircuit' | 'operators'>('flow')

  // Short-circuit interactive demo states
  const [scOperandA, setScOperandA] = useState<boolean>(true)
  const [scOperator, setScOperator] = useState<'or' | 'and'>('or')

  // Evaluate Branch 1: if temperature > 30 and not is_raining
  const cond1_temp = temperature > 30
  const cond1_notRain = !isRaining
  const branch1_match = cond1_temp && cond1_notRain

  // Evaluate Branch 2: elif temperature > 20
  const cond2_temp = temperature > 20
  const branch2_match = !branch1_match && cond2_temp

  // Evaluate Branch 3: else
  const branch3_match = !branch1_match && !cond2_temp

  // Active winning branch info
  let activeBranchName = 'if'
  let executedMessage = '☀️ Hot & Sunny: Wear sunglasses!'
  let executedColor = 'text-[#facc15]'
  let branchPillBg = 'bg-[#facc15]'

  if (branch1_match) {
    activeBranchName = 'if'
    executedMessage = '☀️ Hot & Sunny: Wear sunglasses!'
    executedColor = 'text-[#facc15]'
    branchPillBg = 'bg-[#facc15]'
  } else if (branch2_match) {
    activeBranchName = 'elif'
    executedMessage = '🌤️ Pleasant weather: Perfect for a walk.'
    executedColor = 'text-[#38bdf8]'
    branchPillBg = 'bg-[#38bdf8]'
  } else {
    activeBranchName = 'else'
    executedMessage = '🧥 Cold or rainy: Grab a jacket!'
    executedColor = 'text-[#f472b6]'
    branchPillBg = 'bg-[#f472b6]'
  }

  // Short circuit evaluation calculation
  const isShortCircuited =
    (scOperator === 'or' && scOperandA === true) || (scOperator === 'and' && scOperandA === false)

  return (
    <div className="h-full flex flex-col gap-2.5 text-xs select-none overflow-y-auto pr-1">
      {/* Top Header & Tab Controls */}
      <div className="flex items-center justify-between bg-[#181922] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#a3e635] border border-black flex items-center justify-center text-black font-black text-xs rotate-[-2deg]">
            <GitFork size={15} />
          </div>
          <div>
            <div className="font-mono font-black text-xs text-white">
              Decision Branching Engine
            </div>
            <div className="text-[10px] font-mono text-zinc-400">
              Top-to-bottom conditional evaluation & short-circuiting
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-[#121316] border border-black rounded-lg p-0.5 gap-1">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all ${
              activeTab === 'flow'
                ? 'bg-[#facc15] text-black shadow-brutal-xs font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Branching Flow
          </button>
          <button
            onClick={() => setActiveTab('shortcircuit')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all ${
              activeTab === 'shortcircuit'
                ? 'bg-[#38bdf8] text-black shadow-brutal-xs font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ⚡ Short-Circuit Tip
          </button>
          <button
            onClick={() => setActiveTab('operators')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all ${
              activeTab === 'operators'
                ? 'bg-[#a3e635] text-black shadow-brutal-xs font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Operators Cheat Sheet
          </button>
        </div>
      </div>

      {activeTab === 'flow' && (
        <>
          {/* Weather Variable Controls & Presets */}
          <div className="bg-[#181922] border-2 border-black rounded-xl p-3 shadow-brutal-sm flex flex-col gap-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-mono font-bold text-zinc-400 text-[11px] uppercase tracking-wider">
                1. Adjust Variables:
              </span>

              {/* Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {PRESETS.map((p) => {
                  const isCur = temperature === p.temp && isRaining === p.rain
                  return (
                    <button
                      key={p.label}
                      onClick={() => {
                        setTemperature(p.temp)
                        setIsRaining(p.rain)
                      }}
                      className={`px-2 py-0.5 rounded-lg border border-black font-mono text-[11px] transition-all ${
                        isCur
                          ? 'bg-[#facc15] text-black font-black shadow-brutal-xs -translate-y-0.5'
                          : 'bg-[#27272a] text-zinc-300 hover:text-white hover:bg-[#3f3f46]'
                      }`}
                      title={p.desc}
                    >
                      {p.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sliders & Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Temperature Slider */}
              <div className="p-2.5 bg-[#12131a] border-2 border-black rounded-lg flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px] text-zinc-300 font-bold flex items-center gap-1.5">
                    <Sun size={13} className="text-[#facc15]" />
                    <span>temperature =</span>
                  </span>
                  <span className="font-mono font-black text-sm text-[#facc15]">
                    {temperature}°C
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={45}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-[#facc15] cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[9px] text-zinc-500 mt-1">
                  <span>5°C (Cold)</span>
                  <span>20°C</span>
                  <span>30°C</span>
                  <span>45°C (Hot)</span>
                </div>
              </div>

              {/* Rain Boolean Toggle */}
              <div className="p-2.5 bg-[#12131a] border-2 border-black rounded-lg flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px] text-zinc-300 font-bold flex items-center gap-1.5">
                    <CloudRain size={13} className="text-[#38bdf8]" />
                    <span>is_raining =</span>
                  </span>
                  <span
                    className={`font-mono font-black text-xs px-2 py-0.5 rounded border border-black ${
                      isRaining ? 'bg-[#38bdf8] text-black' : 'bg-[#27272a] text-zinc-300'
                    }`}
                  >
                    {isRaining ? 'True (Raining)' : 'False (Clear)'}
                  </span>
                </div>

                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => setIsRaining(false)}
                    className={`flex-1 py-1 rounded font-mono text-[11px] font-bold border border-black transition-all ${
                      !isRaining
                        ? 'bg-[#a3e635] text-black font-black shadow-brutal-xs'
                        : 'bg-[#22232a] text-zinc-400 hover:text-white'
                    }`}
                  >
                    ☀️ False (Clear)
                  </button>
                  <button
                    onClick={() => setIsRaining(true)}
                    className={`flex-1 py-1 rounded font-mono text-[11px] font-bold border border-black transition-all ${
                      isRaining
                        ? 'bg-[#38bdf8] text-black font-black shadow-brutal-xs'
                        : 'bg-[#22232a] text-zinc-400 hover:text-white'
                    }`}
                  >
                    🌧️ True (Raining)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Top-to-Bottom Branch Walkthrough Cards */}
          <div className="bg-[#181922] border-2 border-black rounded-xl p-3 shadow-brutal-sm flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-zinc-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#a3e635]" />
                <span>2. Top-to-Bottom Execution Flow:</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                Rule: First matching branch executes; remainder are skipped!
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {/* Branch 1: IF */}
              <div
                className={`p-2.5 rounded-xl border-2 border-black transition-all ${
                  branch1_match
                    ? 'bg-[#292211] border-[#facc15] shadow-brutal-sm'
                    : 'bg-[#12131a] opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono font-black text-[11px] bg-[#facc15] text-black border border-black">
                      1. if
                    </span>
                    <span className="font-mono font-bold text-white text-xs">
                      temperature &gt; 30 and not is_raining:
                    </span>
                  </div>

                  {branch1_match ? (
                    <span className="flex items-center gap-1 font-mono font-black text-[10px] px-2 py-0.5 rounded bg-[#a3e635] text-black border border-black">
                      <CheckCircle2 size={12} /> MATCHED &amp; EXECUTED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      <XCircle size={12} /> EVALUATED FALSE ➔ NEXT
                    </span>
                  )}
                </div>

                {/* Sub-evaluations */}
                <div className="flex items-center gap-2 font-mono text-[10px] bg-[#0d0e15] p-1.5 rounded border border-zinc-800 flex-wrap">
                  <span className="text-zinc-400">Breakdown:</span>
                  <span className="text-zinc-300">
                    ({temperature} &gt; 30) ={' '}
                    <strong className={cond1_temp ? 'text-[#a3e635]' : 'text-[#f87171]'}>
                      {String(cond1_temp)}
                    </strong>
                  </span>
                  <span className="text-zinc-500">and</span>
                  <span className="text-zinc-300">
                    (not {String(isRaining)}) ={' '}
                    <strong className={cond1_notRain ? 'text-[#a3e635]' : 'text-[#f87171]'}>
                      {String(cond1_notRain)}
                    </strong>
                  </span>
                  <span className="text-zinc-500">➔</span>
                  <span className="font-black text-white">
                    {String(cond1_temp)} and {String(cond1_notRain)} ={' '}
                    <strong className={branch1_match ? 'text-[#a3e635]' : 'text-[#f87171]'}>
                      {String(branch1_match)}
                    </strong>
                  </span>
                </div>

                {branch1_match && (
                  <div className="mt-2 pl-4 border-l-2 border-[#facc15] font-mono text-xs text-[#facc15] font-bold">
                    ➔ print(&quot;☀️ Hot &amp; Sunny: Wear sunglasses!&quot;)
                  </div>
                )}
              </div>

              {/* Branch 2: ELIF */}
              <div
                className={`p-2.5 rounded-xl border-2 border-black transition-all ${
                  branch2_match
                    ? 'bg-[#122838] border-[#38bdf8] shadow-brutal-sm'
                    : branch1_match
                    ? 'bg-[#0f1016] opacity-40'
                    : 'bg-[#12131a] opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono font-black text-[11px] bg-[#38bdf8] text-black border border-black">
                      2. elif
                    </span>
                    <span className="font-mono font-bold text-white text-xs">
                      temperature &gt; 20:
                    </span>
                  </div>

                  {branch1_match ? (
                    <span className="flex items-center gap-1 font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-500">
                      <SkipForward size={12} /> SKIPPED (Branch 1 already executed)
                    </span>
                  ) : branch2_match ? (
                    <span className="flex items-center gap-1 font-mono font-black text-[10px] px-2 py-0.5 rounded bg-[#a3e635] text-black border border-black">
                      <CheckCircle2 size={12} /> MATCHED &amp; EXECUTED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      <XCircle size={12} /> EVALUATED FALSE ➔ NEXT
                    </span>
                  )}
                </div>

                {/* Sub-evaluations */}
                {!branch1_match && (
                  <div className="flex items-center gap-2 font-mono text-[10px] bg-[#0d0e15] p-1.5 rounded border border-zinc-800">
                    <span className="text-zinc-400">Breakdown:</span>
                    <span className="text-zinc-300">
                      ({temperature} &gt; 20) ={' '}
                      <strong className={cond2_temp ? 'text-[#a3e635]' : 'text-[#f87171]'}>
                        {String(cond2_temp)}
                      </strong>
                    </span>
                  </div>
                )}

                {branch2_match && (
                  <div className="mt-2 pl-4 border-l-2 border-[#38bdf8] font-mono text-xs text-[#38bdf8] font-bold">
                    ➔ print(&quot;🌤️ Pleasant weather: Perfect for a walk.&quot;)
                  </div>
                )}
              </div>

              {/* Branch 3: ELSE */}
              <div
                className={`p-2.5 rounded-xl border-2 border-black transition-all ${
                  branch3_match
                    ? 'bg-[#2b1625] border-[#f472b6] shadow-brutal-sm'
                    : 'bg-[#0f1016] opacity-40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono font-black text-[11px] bg-[#f472b6] text-black border border-black">
                      3. else:
                    </span>
                    <span className="font-mono font-bold text-zinc-300 text-xs">
                      (Default fallback if no prior branch succeeded)
                    </span>
                  </div>

                  {branch3_match ? (
                    <span className="flex items-center gap-1 font-mono font-black text-[10px] px-2 py-0.5 rounded bg-[#a3e635] text-black border border-black">
                      <CheckCircle2 size={12} /> FALLBACK EXECUTED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-500">
                      <SkipForward size={12} /> SKIPPED (Prior branch matched)
                    </span>
                  )}
                </div>

                {branch3_match && (
                  <div className="mt-2 pl-4 border-l-2 border-[#f472b6] font-mono text-xs text-[#f472b6] font-bold">
                    ➔ print(&quot;🧥 Cold or rainy: Grab a jacket!&quot;)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live Terminal Output Console */}
          <div className="bg-[#0f1016] border-2 border-black rounded-xl p-3 shadow-brutal-sm flex flex-col gap-1.5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-[#a3e635]" />
                <span className="font-mono font-black text-xs text-white">
                  Live Python Terminal Output
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">python3 script.py</span>
            </div>

            <div className="font-mono text-xs leading-relaxed space-y-0.5 select-text pt-1">
              <div className="text-zinc-500">
                &gt;&gt;&gt; temperature = {temperature}
              </div>
              <div className="text-zinc-500">
                &gt;&gt;&gt; is_raining = {String(isRaining)}
              </div>
              <div className="text-zinc-400">
                &gt;&gt;&gt; # Active branch:{' '}
                <strong className="text-white uppercase">{activeBranchName}</strong>
              </div>
              <div className="pt-1">
                <span className="text-[#a3e635] font-black">&gt;&gt;&gt; </span>
                <span className={`font-black ${executedColor}`}>{executedMessage}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tab 2: Short-Circuit Evaluation Demo */}
      {activeTab === 'shortcircuit' && (
        <div className="bg-[#181922] border-2 border-black rounded-xl p-3.5 shadow-brutal-sm flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#38bdf8] border-2 border-black flex items-center justify-center text-black font-black text-sm rotate-[-2deg]">
              ⚡
            </div>
            <div>
              <div className="text-xs font-black text-white">
                Short-Circuit Evaluation in Python
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">
                From Slide Tip: Python never evaluates operand B if operand A already determines the result!
              </div>
            </div>
          </div>

          {/* Interactive controls */}
          <div className="p-3 bg-[#12131a] border-2 border-black rounded-xl flex flex-col gap-2.5">
            <div className="font-mono font-bold text-xs text-zinc-300">
              Test Expression: <span className="text-[#facc15]">operand_A</span>{' '}
              <span className="text-[#38bdf8] font-black">{scOperator}</span>{' '}
              <span className="text-[#f472b6]">expensive_check()</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                  1. Choose Operator:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setScOperator('or')}
                    className={`flex-1 py-1 rounded-lg font-mono font-black text-xs border border-black ${
                      scOperator === 'or' ? 'bg-[#38bdf8] text-black shadow-brutal-xs' : 'bg-[#27272a] text-zinc-400'
                    }`}
                  >
                    or
                  </button>
                  <button
                    onClick={() => setScOperator('and')}
                    className={`flex-1 py-1 rounded-lg font-mono font-black text-xs border border-black ${
                      scOperator === 'and' ? 'bg-[#38bdf8] text-black shadow-brutal-xs' : 'bg-[#27272a] text-zinc-400'
                    }`}
                  >
                    and
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                  2. operand_A Value:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setScOperandA(true)}
                    className={`flex-1 py-1 rounded-lg font-mono font-black text-xs border border-black ${
                      scOperandA === true ? 'bg-[#a3e635] text-black shadow-brutal-xs' : 'bg-[#27272a] text-zinc-400'
                    }`}
                  >
                    True
                  </button>
                  <button
                    onClick={() => setScOperandA(false)}
                    className={`flex-1 py-1 rounded-lg font-mono font-black text-xs border border-black ${
                      scOperandA === false ? 'bg-[#f87171] text-black shadow-brutal-xs' : 'bg-[#27272a] text-zinc-400'
                    }`}
                  >
                    False
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Outcome Visualizer */}
          <div
            className={`p-3 rounded-xl border-2 border-black flex flex-col gap-2 ${
              isShortCircuited ? 'bg-[#212f1f] border-[#a3e635]' : 'bg-[#282119] border-[#fbbf24]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-xs text-white">
                Execution Outcome:
              </span>
              <span
                className={`font-mono font-black text-[10px] px-2 py-0.5 rounded border border-black ${
                  isShortCircuited ? 'bg-[#a3e635] text-black' : 'bg-[#fbbf24] text-black'
                }`}
              >
                {isShortCircuited ? '⚡ SHORT-CIRCUITED!' : 'FULL EVALUATION REQUIRED'}
              </span>
            </div>

            <div className="font-mono text-xs text-zinc-200">
              {scOperator === 'or' && scOperandA === true && (
                <div>
                  Since <strong className="text-[#a3e635]">operand_A is True</strong>, Python knows the entire{' '}
                  <code className="text-white">or</code> expression is guaranteed to be <strong>True</strong>.{' '}
                  <span className="text-[#38bdf8] font-bold">expensive_check() is NEVER evaluated!</span>
                </div>
              )}

              {scOperator === 'or' && scOperandA === false && (
                <div>
                  Since <strong className="text-[#f87171]">operand_A is False</strong>, the outcome depends on operand B.{' '}
                  Python <strong>MUST evaluate expensive_check()</strong> to decide.
                </div>
              )}

              {scOperator === 'and' && scOperandA === false && (
                <div>
                  Since <strong className="text-[#f87171]">operand_A is False</strong>, Python knows the entire{' '}
                  <code className="text-white">and</code> expression is guaranteed to be <strong>False</strong>.{' '}
                  <span className="text-[#38bdf8] font-bold">expensive_check() is NEVER evaluated!</span>
                </div>
              )}

              {scOperator === 'and' && scOperandA === true && (
                <div>
                  Since <strong className="text-[#a3e635]">operand_A is True</strong>, the outcome depends on operand B.{' '}
                  Python <strong>MUST evaluate expensive_check()</strong> to decide.
                </div>
              )}
            </div>

            {/* Real World Safety Example */}
            <div className="p-2.5 bg-black/40 rounded-lg border border-zinc-800 text-[11px] font-mono">
              <span className="text-[#facc15] font-bold block mb-1">
                🛡️ Real-World Lifesaver: Preventing ZeroDivisionError
              </span>
              <code className="text-[#4ade80] block">
                if count != 0 and (total / count) &gt; 50:
              </code>
              <span className="text-zinc-400 text-[10px] block mt-1">
                If <code className="text-white">count == 0</code>, the first condition is False, so Python immediately skips the division. ZeroDivisionError is avoided completely!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Operators Cheat Sheet */}
      {activeTab === 'operators' && (
        <div className="bg-[#181922] border-2 border-black rounded-xl p-3.5 shadow-brutal-sm flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-xs text-white">
              Python Comparison &amp; Logical Operators Reference
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Comparison Operators */}
            <div className="p-2.5 bg-[#12131a] border-2 border-black rounded-lg">
              <span className="text-[11px] font-mono font-black text-[#facc15] block mb-1.5">
                Comparison Operators
              </span>
              <div className="font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <code>==</code> <span className="text-zinc-400">Equal to (5 == 5 ➔ True)</span>
                </div>
                <div className="flex justify-between">
                  <code>!=</code> <span className="text-zinc-400">Not equal (5 != 3 ➔ True)</span>
                </div>
                <div className="flex justify-between">
                  <code>&gt; , &lt;</code> <span className="text-zinc-400">Strict Greater / Less than</span>
                </div>
                <div className="flex justify-between">
                  <code>&gt;= , &lt;=</code> <span className="text-zinc-400">Greater / Less or Equal</span>
                </div>
                <div className="flex justify-between">
                  <code>is</code> <span className="text-zinc-400">Object identity (memory id)</span>
                </div>
              </div>
            </div>

            {/* Logical Operators */}
            <div className="p-2.5 bg-[#12131a] border-2 border-black rounded-lg">
              <span className="text-[11px] font-mono font-black text-[#38bdf8] block mb-1.5">
                Logical Operators
              </span>
              <div className="font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <code>and</code> <span className="text-zinc-400">True ONLY if BOTH are True</span>
                </div>
                <div className="flex justify-between">
                  <code>or</code> <span className="text-zinc-400">True if EITHER is True</span>
                </div>
                <div className="flex justify-between">
                  <code>not</code> <span className="text-zinc-400">Inverts truth (not True ➔ False)</span>
                </div>
                <div className="flex justify-between">
                  <code>in</code> <span className="text-zinc-400">Membership (x in [1, 2, 3])</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

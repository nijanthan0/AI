'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileCode,
  Cpu,
  ArrowRight,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Database,
  Binary,
  CheckCircle2,
  Zap,
  Terminal,
  FastForward
} from 'lucide-react'

interface Props {
  data?: any
}

interface Stage {
  id: string
  num: number
  title: string
  subtitle: string
  icon: any
  color: string
  accentBg: string
  fileOrArtifact: string
  description: string
  internalDetails: string[]
  codePreview: string
  isBypassedOnCacheHit?: boolean
}

export default function VizExecutionFlow({ data }: Props) {
  const [activeStage, setActiveStage] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [cachedRun, setCachedRun] = useState<boolean>(false)

  const STAGES: Stage[] = [
    {
      id: 'source',
      num: 1,
      title: 'Source Code',
      subtitle: 'Human-readable text file',
      icon: FileCode,
      color: '#38bdf8', // Sky
      accentBg: 'bg-[#38bdf8]/15 border-[#38bdf8]',
      fileOrArtifact: 'tax_calc.py',
      description: 'You write standard Python code in a UTF-8 text file. The computer hardware cannot understand or execute this text directly.',
      internalDetails: [
        'Plain text stored on disk',
        'Human-readable Python grammar',
        'Contains comments, indentation, whitespace'
      ],
      codePreview: `def calculate_tax(gross: float, rate: float = 0.15) -> float:
    net_tax = gross * rate
    return round(net_tax, 2)`
    },
    {
      id: 'compiler',
      num: 2,
      title: 'CPython Compiler',
      subtitle: 'Lexer ➔ AST ➔ Opcode generation',
      icon: Layers,
      color: '#f472b6', // Pink
      accentBg: 'bg-[#f472b6]/15 border-[#f472b6]',
      fileOrArtifact: 'Abstract Syntax Tree (AST)',
      isBypassedOnCacheHit: true,
      description: 'CPython tokenizes and parses the text into an Abstract Syntax Tree (AST). If any indentation or syntax errors exist, Python halts immediately with SyntaxError before running any code.',
      internalDetails: [
        'Tokenization: Breaks code into keywords, literals, names',
        'AST Generation: Validates language grammar rules',
        'SyntaxError raised here if code is malformed'
      ],
      codePreview: `# Python ast.dump() representation:
Module(
  body=[
    FunctionDef(
      name='calculate_tax',
      args=arguments(args=[arg(arg='gross'), arg(arg='rate')]),
      body=[Assign(targets=[Name(id='net_tax')], value=BinOp(left=Name(id='gross'), op=Mult(), right=Name(id='rate')))]
    )
  ]
)`
    },
    {
      id: 'bytecode',
      num: 3,
      title: 'Bytecode & .pyc Cache',
      subtitle: 'Platform-independent opcode instructions',
      icon: Binary,
      color: '#facc15', // Yellow
      accentBg: 'bg-[#facc15]/15 border-[#facc15]',
      fileOrArtifact: '__pycache__/tax_calc.cpython-312.pyc',
      isBypassedOnCacheHit: true,
      description: 'The compiler outputs compact binary bytecode instructions and caches them in the __pycache__ directory. Subsequent executions read this .pyc file directly to skip compiling!',
      internalDetails: [
        'Platform-neutral stack-based opcodes',
        'Cached with timestamp & file hash in __pycache__',
        'Inspected using standard library `import dis`'
      ],
      codePreview: `# Disassembled CPython 3.12 Bytecode:
  1           0 RESUME                   0
  2           2 LOAD_FAST                0 (gross)
              4 LOAD_FAST                1 (rate)
              6 BINARY_OP                5 (*)
             10 STORE_FAST               2 (net_tax)
  3          12 LOAD_GLOBAL              1 (round)
             22 LOAD_FAST                2 (net_tax)
             24 LOAD_CONST               1 (2)
             26 CALL                     2
             34 RETURN_VALUE`
    },
    {
      id: 'pvm',
      num: 4,
      title: 'CPython Virtual Machine',
      subtitle: 'Runtime stack loop (ceval.c)',
      icon: Cpu,
      color: '#a3e635', // Lime
      accentBg: 'bg-[#a3e635]/15 border-[#a3e635]',
      fileOrArtifact: 'PVM Evaluation Stack',
      description: 'The Python Virtual Machine (PVM) is a high-speed C loop that processes bytecode instructions sequentially on an in-memory evaluation stack, resolving objects and invoking functions.',
      internalDetails: [
        'PVM is written in C (ceval.c runtime loop)',
        'Stack-based evaluation (Push inputs, Pop operands, Push result)',
        'Manages memory allocation, GIL lock, and garbage collection'
      ],
      codePreview: `# PVM Stack Execution Trace:
Step 1: Push 1000.0   ➔ [ 1000.0 ]
Step 2: Push 0.15     ➔ [ 1000.0, 0.15 ]
Step 3: BINARY_OP (*) ➔ [ 150.0 ] (multiplies top 2 stack items)
Step 4: round(150.0, 2)
Step 5: RETURN_VALUE  ➔ 150.0`
    },
    {
      id: 'cpu',
      num: 5,
      title: 'CPU Machine Execution',
      subtitle: 'Hardware machine instructions',
      icon: Terminal,
      color: '#22c55e', // Green
      accentBg: 'bg-[#22c55e]/15 border-[#22c55e]',
      fileOrArtifact: 'x86_64 / ARM64 Machine Instructions',
      description: 'The operating system executes the C runtime instructions on the physical CPU arithmetic logic units (ALU), producing the final output for the user.',
      internalDetails: [
        'Direct physical hardware execution',
        'CPU Registers & System RAM memory interaction',
        'Final output printed to terminal stdout'
      ],
      codePreview: `--- Execution Output ---
>>> calculate_tax(1000.0, 0.15)
150.0

[Process completed in 0.018s]`
    }
  ]

  // Auto-play animation timer
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setActiveStage((prev) => {
        if (cachedRun) {
          // In cached run: 0 (Source) ➔ 2 (Bytecode) ➔ 3 (PVM) ➔ 4 (CPU)
          if (prev === 0) return 2
          if (prev >= STAGES.length - 1) return 0
          return prev + 1
        }
        return (prev + 1) % STAGES.length
      })
    }, 2800)
    return () => clearInterval(timer)
  }, [isPlaying, cachedRun, STAGES.length])

  const stage = STAGES[activeStage]

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Top Banner & Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Cpu size={15} className="text-[#a3e635]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            CPYTHON EXECUTION PIPELINE FLOWCHART
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Cache Hit Simulator Toggle */}
          <button
            onClick={() => {
              setCachedRun(!cachedRun)
              if (!cachedRun && activeStage === 1) setActiveStage(2)
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border-2 transition-all flex items-center gap-1 ${
              cachedRun
                ? 'bg-[#facc15] text-black border-black shadow-brutal-sm font-black'
                : 'bg-[#22232e] text-zinc-300 border-zinc-700 hover:text-white'
            }`}
            title="Simulate running code a 2nd time with compiled .pyc cache"
          >
            <FastForward size={12} />
            <span>{cachedRun ? '⚡ CACHE HIT (Bypasses Compiler)' : 'First Run (Full Compilation)'}</span>
          </button>

          {/* Auto Play / Pause Flow */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black border-2 transition-all flex items-center gap-1 ${
              isPlaying
                ? 'bg-[#f472b6] text-black border-black shadow-brutal-sm'
                : 'bg-[#a3e635] text-black border-black shadow-brutal-sm hover:-translate-y-0.5'
            }`}
          >
            <Play size={11} className={isPlaying ? 'animate-pulse' : ''} />
            <span>{isPlaying ? 'PAUSE FLOW' : 'AUTO-PLAY FLOW'}</span>
          </button>

          {/* Reset */}
          <button
            onClick={() => {
              setActiveStage(0)
              setIsPlaying(false)
            }}
            className="p-1 rounded-lg bg-[#27272a] text-zinc-300 hover:text-white border border-zinc-700"
            title="Reset to Step 1"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Main Flowchart Steps (Horizontal Architecture Diagram) */}
      <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px] gap-2 py-1">
          {STAGES.map((s, idx) => {
            const isActive = activeStage === idx
            const Icon = s.icon
            const isBypassed = cachedRun && s.isBypassedOnCacheHit && activeStage > 0

            return (
              <React.Fragment key={s.id}>
                {/* Stage Node Box */}
                <motion.div
                  onClick={() => {
                    setActiveStage(idx)
                    setIsPlaying(false)
                  }}
                  animate={{
                    scale: isActive ? 1.08 : 1,
                    y: isActive ? -4 : 0
                  }}
                  className={`flex-1 flex flex-col items-center justify-between p-2.5 rounded-xl border-2 cursor-pointer transition-all min-w-[110px] relative ${
                    isActive
                      ? 'shadow-brutal-lg border-black'
                      : isBypassed
                      ? 'border-zinc-800 bg-[#15161f] opacity-35'
                      : 'border-zinc-700/80 bg-[#181924] hover:border-zinc-400'
                  }`}
                  style={{
                    backgroundColor: isActive ? s.color : undefined,
                    color: isActive ? '#000000' : '#ffffff'
                  }}
                >
                  {/* Step Number Badge */}
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded-full border mb-1.5 ${
                      isActive
                        ? 'bg-black text-white border-black'
                        : 'bg-black/50 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    STEP {s.num}
                  </span>

                  {/* Stage Icon */}
                  <div
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-1 ${
                      isActive
                        ? 'bg-black/10 border-black/40 text-black'
                        : 'bg-black/40 border-zinc-700'
                    }`}
                    style={{ color: isActive ? '#000000' : s.color }}
                  >
                    <Icon size={16} />
                  </div>

                  {/* Title & Subtitle */}
                  <span className="font-black text-[11px] text-center leading-tight">
                    {s.title}
                  </span>
                  <span
                    className={`text-[8px] text-center mt-1 truncate max-w-full ${
                      isActive ? 'text-black/80 font-bold' : 'text-zinc-400'
                    }`}
                  >
                    {s.fileOrArtifact}
                  </span>

                  {/* Active Indicator Pin */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pointer"
                      className="absolute -bottom-2 w-3 h-3 bg-black border-2 border-white rotate-45 rounded-sm"
                    />
                  )}
                </motion.div>

                {/* Arrow Connector between Stages */}
                {idx < STAGES.length - 1 && (
                  <div className="flex flex-col items-center px-0.5">
                    <ArrowRight
                      size={16}
                      className={
                        activeStage > idx
                          ? 'text-[#a3e635] font-black'
                          : 'text-zinc-600'
                      }
                    />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Cached Flow Callout Banner */}
        {cachedRun && (
          <div className="mt-2.5 pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] text-[#facc15] font-bold">
            <span className="flex items-center gap-1">
              ⚡ Cache Mode Active: .pyc file in __pycache__ is fresh! CPython skips Step 2 (Lexing/AST) and loads Bytecode directly into PVM.
            </span>
            <span className="bg-black/50 px-2 py-0.5 rounded border border-[#facc15]/40 text-[#facc15]">
              Compilation Skipped
            </span>
          </div>
        )}
      </div>

      {/* Deep-Dive Inspection Panel for the Active Stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 min-h-0">
        {/* Left: Stage Explanation & Internal Details */}
        <div className="bg-[#181926] p-3.5 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="font-black text-sm text-white uppercase">
                  Stage {stage.num}: {stage.title}
                </span>
              </div>
              <span
                className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border"
                style={{
                  color: stage.color,
                  borderColor: `${stage.color}60`,
                  background: `${stage.color}15`
                }}
              >
                {stage.subtitle}
              </span>
            </div>

            <p className="text-zinc-300 text-xs leading-relaxed font-sans mb-3">
              {stage.description}
            </p>

            {/* Checklist of what occurs at this stage */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">
                Under the Hood:
              </span>
              {stage.internalDetails.map((detail, dIdx) => (
                <div key={dIdx} className="flex items-start gap-2 text-[11px] text-zinc-200">
                  <span
                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold text-[9px] mt-0.5 flex-shrink-0"
                    style={{ backgroundColor: `${stage.color}30`, color: stage.color }}
                  >
                    ✓
                  </span>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stage Steppers */}
          <div className="flex items-center gap-2 pt-3 border-t border-zinc-800 mt-3">
            <button
              onClick={() => {
                setActiveStage((prev) => Math.max(0, prev - 1))
                setIsPlaying(false)
              }}
              disabled={activeStage === 0}
              className="flex-1 py-1.5 bg-[#252739] hover:bg-[#38bdf8] hover:text-black disabled:opacity-30 text-white font-bold rounded-lg border border-black text-[10px] transition-all"
            >
              ◀ Previous Stage
            </button>
            <button
              onClick={() => {
                setActiveStage((prev) => Math.min(STAGES.length - 1, prev + 1))
                setIsPlaying(false)
              }}
              disabled={activeStage === STAGES.length - 1}
              className="flex-1 py-1.5 bg-[#a3e635] hover:bg-[#84cc16] disabled:opacity-30 text-black font-black rounded-lg border-2 border-black text-[10px] shadow-brutal-sm transition-all"
            >
              Next Stage ▶
            </button>
          </div>
        </div>

        {/* Right: Code & Opcode Inspector Box */}
        <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col">
          <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              Inspect Representation ({stage.fileOrArtifact})
            </span>
            <span
              className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded"
              style={{ color: stage.color, background: `${stage.color}20` }}
            >
              Live Data
            </span>
          </div>

          <div className="flex-1 overflow-y-auto bg-black/60 p-2.5 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-200 whitespace-pre leading-relaxed">
            {stage.codePreview}
          </div>
        </div>
      </div>
    </div>
  )
}

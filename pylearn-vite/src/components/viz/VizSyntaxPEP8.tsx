'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Check, X, Shield, Lock, Code2, ArrowRight, Zap, RefreshCw } from 'lucide-react'

export default function VizSyntaxPEP8() {
  const [activeTab, setActiveTab] = useState<'case' | 'indent' | 'pep8'>('case')

  // Case Sensitivity Mode State
  const [compared, setCompared] = useState(false)
  const [compareType, setCompareType] = useState<'value' | 'identity'>('value')

  // Indent Mode State
  const [indentLevel, setIndentLevel] = useState<0 | 1 | 2>(1)

  // PEP 8 Naming Tester State
  const [namingStyle, setNamingStyle] = useState<'variable' | 'class' | 'constant'>('variable')
  const [testInput, setTestInput] = useState('user_model_count')

  // Validate user test input
  const getValidationFeedback = (input: string) => {
    if (!input.trim()) return { valid: false, msg: 'Type a name to test compliance' }
    
    const isSnake = /^[a-z0-9_]+$/.test(input) && !input.startsWith('_')
    const isPascal = /^[A-Z][a-zA-Z0-9]*$/.test(input)
    const isScreaming = /^[A-Z0-9_]+$/.test(input)

    if (namingStyle === 'variable') {
      if (isSnake) return { valid: true, msg: '✓ Valid snake_case for variable or function' }
      if (isPascal) return { valid: false, msg: '⚠️ PascalCase detected! Use snake_case for variables (e.g. ' + input.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '') + ')' }
      return { valid: false, msg: '⚠️ Use lower_case_with_underscores (PEP 8)' }
    }

    if (namingStyle === 'class') {
      if (isPascal) return { valid: true, msg: '✓ Valid PascalCase (CapWords) for Python Class' }
      return { valid: false, msg: '⚠️ Classes must use PascalCase (e.g. MyNeuralNetwork)' }
    }

    if (namingStyle === 'constant') {
      if (isScreaming) return { valid: true, msg: '✓ Valid SCREAMING_SNAKE_CASE for constant' }
      return { valid: false, msg: '⚠️ Constants should be ALL_CAPS (e.g. MAX_TIMEOUT)' }
    }

    return { valid: true, msg: 'Valid name' }
  }

  const feedback = getValidationFeedback(testInput)

  return (
    <div className="flex flex-col gap-3 select-none w-full">
      {/* Top Interactive Mode Tabs */}
      <div className="flex items-center justify-between bg-[#161722] p-1.5 rounded-xl border-2 border-black shadow-brutal-sm text-xs flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { setActiveTab('case'); setCompared(false); }}
            className={`px-3 py-1 rounded-lg font-mono font-black text-xs border-2 border-black transition-all flex items-center gap-1.5 ${
              activeTab === 'case'
                ? 'bg-[#facc15] text-black shadow-brutal-sm -translate-x-0.5 -translate-y-0.5'
                : 'bg-[#22232e] text-zinc-300 hover:text-white'
            }`}
          >
            <span>🔤 Case Sensitivity</span>
          </button>

          <button
            onClick={() => setActiveTab('indent')}
            className={`px-3 py-1 rounded-lg font-mono font-black text-xs border-2 border-black transition-all flex items-center gap-1.5 ${
              activeTab === 'indent'
                ? 'bg-[#38bdf8] text-black shadow-brutal-sm -translate-x-0.5 -translate-y-0.5'
                : 'bg-[#22232e] text-zinc-300 hover:text-white'
            }`}
          >
            <span>📏 4-Space Indentation</span>
          </button>

          <button
            onClick={() => setActiveTab('pep8')}
            className={`px-3 py-1 rounded-lg font-mono font-black text-xs border-2 border-black transition-all flex items-center gap-1.5 ${
              activeTab === 'pep8'
                ? 'bg-[#a3e635] text-black shadow-brutal-sm -translate-x-0.5 -translate-y-0.5'
                : 'bg-[#22232e] text-zinc-300 hover:text-white'
            }`}
          >
            <span>✨ PEP 8 Naming</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-[#101118] border-2 border-black rounded-xl p-4 min-h-[165px] flex flex-col justify-center relative overflow-hidden shadow-brutal-sm">
        <AnimatePresence mode="wait">
          {/* ========================================================
              MODE 1: CASE SENSITIVITY LAB
             ======================================================== */}
          {activeTab === 'case' && (
            <motion.div
              key="case-mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3 py-1"
            >
              {/* Two RAM Object Slots */}
              <div className="flex items-center justify-around gap-4 flex-wrap">
                {/* Slot 1: model_count */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="flex flex-col items-center bg-[#181926] border-2 border-[#38bdf8] rounded-xl p-3 min-w-[130px] shadow-brutal-sm relative"
                >
                  <span className="text-[10px] font-mono font-bold text-zinc-400 mb-1">
                    lowercase 'm'
                  </span>
                  <div className="text-sm font-mono font-black text-[#38bdf8]">
                    model_count
                  </div>
                  <div className="w-full h-px bg-zinc-700 my-1.5" />
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-lg font-black text-white">5</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#38bdf8]/20 text-[#38bdf8] font-bold">
                      int
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 mt-1">
                    RAM: 0x7FFF10A8
                  </span>
                </motion.div>

                {/* Comparison Center Action */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => { setCompareType('value'); setCompared(true); }}
                      className="px-3 py-1 rounded-lg bg-[#facc15] hover:bg-[#eab308] text-black font-mono font-black text-xs border-2 border-black shadow-brutal-sm transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    >
                      Test ==
                    </button>
                    <button
                      onClick={() => { setCompareType('identity'); setCompared(true); }}
                      className="px-3 py-1 rounded-lg bg-[#c084fc] hover:bg-[#a855f7] text-black font-mono font-black text-xs border-2 border-black shadow-brutal-sm transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    >
                      Test is
                    </button>
                  </div>

                  {compared ? (
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="px-2.5 py-0.5 rounded-full bg-[#ef4444]/20 border-2 border-[#ef4444] text-[#f87171] font-mono font-black text-xs"
                    >
                      FALSE ❌ (5 != 10)
                    </motion.div>
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-500">
                      Click to compare objects
                    </span>
                  )}
                </div>

                {/* Slot 2: Model_count */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="flex flex-col items-center bg-[#181926] border-2 border-[#f472b6] rounded-xl p-3 min-w-[130px] shadow-brutal-sm relative"
                >
                  <span className="text-[10px] font-mono font-bold text-zinc-400 mb-1">
                    Uppercase 'M'
                  </span>
                  <div className="text-sm font-mono font-black text-[#f472b6]">
                    Model_count
                  </div>
                  <div className="w-full h-px bg-zinc-700 my-1.5" />
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-lg font-black text-white">10</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#f472b6]/20 text-[#f472b6] font-bold">
                      int
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 mt-1">
                    RAM: 0x7FFF10B0
                  </span>
                </motion.div>
              </div>

              {/* Explanatory Caption */}
              <div className="text-center text-xs font-mono text-zinc-300 bg-[#161722] p-2 rounded-lg border border-zinc-800">
                <span className="text-[#facc15] font-bold">⚡ Key Rule:</span> Python treats every capitalization variant as a distinct variable name stored at different memory pointers.
              </div>
            </motion.div>
          )}

          {/* ========================================================
              MODE 2: 4-SPACE INDENTATION RULER
             ======================================================== */}
          {activeTab === 'indent' && (
            <motion.div
              key="indent-mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3 py-1"
            >
              {/* Indent Stepper Buttons */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-400">
                  Select Scope Depth:
                </span>
                <div className="flex items-center gap-1.5 font-mono">
                  <button
                    onClick={() => setIndentLevel(0)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border-2 border-black transition-all ${
                      indentLevel === 0
                        ? 'bg-[#38bdf8] text-black shadow-brutal-sm'
                        : 'bg-[#22232e] text-zinc-300'
                    }`}
                  >
                    Level 0 (Module)
                  </button>
                  <button
                    onClick={() => setIndentLevel(1)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border-2 border-black transition-all ${
                      indentLevel === 1
                        ? 'bg-[#38bdf8] text-black shadow-brutal-sm'
                        : 'bg-[#22232e] text-zinc-300'
                    }`}
                  >
                    Level 1 (4 Spaces)
                  </button>
                  <button
                    onClick={() => setIndentLevel(2)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border-2 border-black transition-all ${
                      indentLevel === 2
                        ? 'bg-[#38bdf8] text-black shadow-brutal-sm'
                        : 'bg-[#22232e] text-zinc-300'
                    }`}
                  >
                    Level 2 (8 Spaces)
                  </button>
                </div>
              </div>

              {/* Code Indent Simulation Box */}
              <div className="bg-[#0b0c10] border-2 border-black rounded-xl p-3 font-mono text-xs shadow-inner">
                <div className="text-zinc-500 mb-1">
                  def calculate_bonus(salary: float):
                </div>
                <div className="flex items-center gap-2">
                  {/* Visual 4-space dot guide */}
                  <div
                    className="flex items-center gap-1 transition-all duration-200"
                    style={{ width: indentLevel === 0 ? '0px' : indentLevel === 1 ? '50px' : '100px' }}
                  >
                    {indentLevel >= 1 && (
                      <span className="text-[#38bdf8] font-black text-xs tracking-widest bg-[#38bdf8]/10 px-1 rounded border border-[#38bdf8]/30">
                        ••••
                      </span>
                    )}
                    {indentLevel >= 2 && (
                      <span className="text-[#38bdf8] font-black text-xs tracking-widest bg-[#38bdf8]/10 px-1 rounded border border-[#38bdf8]/30">
                        ••••
                      </span>
                    )}
                  </div>
                  <span className="text-[#4ade80] font-bold">
                    {indentLevel === 0
                      ? 'SyntaxError: expected an indented block!'
                      : indentLevel === 1
                      ? 'bonus = salary * 0.15  # Level 1 Block (4 spaces)'
                      : 'if salary > 100_000: bonus += 5_000  # Level 2 Nested (8 spaces)'}
                  </span>
                </div>
              </div>

              <div className="text-center text-xs font-mono text-zinc-400">
                <span className="text-[#38bdf8] font-bold">No Braces {} Needed:</span> In Python, indentation defines block structure. Mixing tabs and spaces causes a <code>TabError</code>!
              </div>
            </motion.div>
          )}

          {/* ========================================================
              MODE 3: PEP 8 NAMING PLAYGROUND
             ======================================================== */}
          {activeTab === 'pep8' && (
            <motion.div
              key="pep8-mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3 py-1"
            >
              {/* Category selector */}
              <div className="flex items-center gap-2 justify-between flex-wrap">
                <span className="text-xs font-mono font-bold text-zinc-400">
                  Target Entity:
                </span>
                <div className="flex items-center gap-1.5 font-mono">
                  <button
                    onClick={() => { setNamingStyle('variable'); setTestInput('user_model_count'); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border-2 border-black transition-all ${
                      namingStyle === 'variable'
                        ? 'bg-[#a3e635] text-black shadow-brutal-sm'
                        : 'bg-[#22232e] text-zinc-300'
                    }`}
                  >
                    Variable (snake_case)
                  </button>
                  <button
                    onClick={() => { setNamingStyle('class'); setTestInput('NeuralNetworkModel'); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border-2 border-black transition-all ${
                      namingStyle === 'class'
                        ? 'bg-[#c084fc] text-black shadow-brutal-sm'
                        : 'bg-[#22232e] text-zinc-300'
                    }`}
                  >
                    Class (PascalCase)
                  </button>
                  <button
                    onClick={() => { setNamingStyle('constant'); setTestInput('MAX_RETRIES'); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border-2 border-black transition-all ${
                      namingStyle === 'constant'
                        ? 'bg-[#facc15] text-black shadow-brutal-sm'
                        : 'bg-[#22232e] text-zinc-300'
                    }`}
                  >
                    Constant (ALL_CAPS)
                  </button>
                </div>
              </div>

              {/* Live Interactive Input Tester */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="Type an identifier name to test..."
                    className="w-full bg-[#181926] text-white font-mono text-xs font-bold px-3 py-2 rounded-xl border-2 border-black shadow-brutal-sm outline-none focus:border-[#a3e635]"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <button
                    onClick={() => setTestInput(namingStyle === 'variable' ? 'user_model_count' : namingStyle === 'class' ? 'NeuralNetworkModel' : 'MAX_RETRIES')}
                    className="px-2.5 py-2 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-zinc-200 border-2 border-black shadow-brutal-sm text-xs font-mono flex items-center gap-1"
                    title="Load sample name"
                  >
                    <RefreshCw size={12} />
                    <span>Sample</span>
                  </button>
                </div>
              </div>

              {/* Validation Result Box */}
              <div
                className={`px-3 py-1.5 rounded-lg border-2 border-black font-mono text-xs font-bold flex items-center gap-2 shadow-brutal-sm ${
                  feedback.valid
                    ? 'bg-[#a3e635]/15 text-[#a3e635] border-[#a3e635]'
                    : 'bg-[#fb923c]/20 text-[#fb923c] border-[#fb923c]'
                }`}
              >
                <span>{feedback.valid ? '✅' : '⚠️'}</span>
                <span>{feedback.msg}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Narration Banner */}
      <div className="bg-[#161722] border-2 border-black rounded-xl px-3.5 py-2 text-xs flex items-center justify-between font-mono shadow-brutal-sm">
        <span className="text-zinc-200 truncate">
          <strong className="text-[#facc15] font-black">PEP 8 Standard:</strong>{' '}
          {activeTab === 'case'
            ? 'Variables with different casing point to separate objects in memory.'
            : activeTab === 'indent'
            ? 'Use 4 spaces per indentation level. Never mix tabs with spaces.'
            : 'snake_case for variables, PascalCase for classes, SCREAMING_SNAKE for constants.'}
        </span>
        <span className="text-[10px] text-zinc-400 font-bold flex-shrink-0 ml-2">
          💡 SWITCH TABS ABOVE
        </span>
      </div>
    </div>
  )
}

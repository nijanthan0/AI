'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, ShieldAlert, Sparkles, Terminal, Code2 } from 'lucide-react'

interface Props {
  data?: any
}

const RESERVED = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
  'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
  'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
  'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield',
  'match', 'case'
])

export default function VizIdentifierRules({ data }: Props) {
  const [identifier, setIdentifier] = useState('valid_user_2026')

  // Validation tests
  const startsWithDigit = /^[0-9]/.test(identifier)
  const isKeyword = RESERVED.has(identifier)
  const hasInvalidChars = /[^a-zA-Z0-9_]/.test(identifier)
  const isDunder = identifier.startsWith('__') && identifier.endsWith('__')
  const isPrivate = identifier.startsWith('__') && !identifier.endsWith('__')
  const isProtected = identifier.startsWith('_') && !identifier.startsWith('__')
  const isEmpty = identifier.trim().length === 0

  const isValid = !isEmpty && !startsWithDigit && !isKeyword && !hasInvalidChars

  const PRESETS = [
    { name: 'user_count', valid: true },
    { name: '2fast_2furious', valid: false },
    { name: 'order-id', valid: false },
    { name: 'class', valid: false },
    { name: '_internal_cache', valid: true },
    { name: '__secret_hash', valid: true },
    { name: '__init__', valid: true },
  ]

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Code2 size={15} className="text-[#a3e635]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            IDENTIFIER LEXER: VALID VS INVALID RULES
          </span>
        </div>
        <span className="text-[10px] bg-black/40 text-zinc-400 px-2 py-0.5 rounded border border-white/10">
          Python Lexical Grammar
        </span>
      </div>

      {/* Input Field and Presets */}
      <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-400 font-bold uppercase">Test Identifier Name:</span>
          <div className="flex items-center gap-1">
            {isValid ? (
              <span className="flex items-center gap-1 text-[#22c55e] font-black text-xs bg-[#22c55e]/20 px-2 py-0.5 rounded border border-[#22c55e]/40">
                <Check size={12} />
                VALID IDENTIFIER
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[#ef4444] font-black text-xs bg-[#ef4444]/20 px-2 py-0.5 rounded border border-[#ef4444]/40">
                <X size={12} />
                INVALID IDENTIFIER
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center bg-black/60 px-3 py-1.5 rounded-lg border border-zinc-700">
          <span className="text-[#a3e635] mr-2 font-bold">&gt;&gt;&gt;</span>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value.trim())}
            placeholder="Type variable name..."
            className="bg-transparent text-white font-mono text-xs outline-none flex-1 font-bold"
          />
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[10px] text-zinc-400">Presets:</span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => setIdentifier(p.name)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                identifier === p.name
                  ? 'bg-[#a3e635] text-black border-black shadow-brutal-sm'
                  : p.valid
                  ? 'bg-[#181926] text-zinc-300 border-zinc-700 hover:text-white'
                  : 'bg-[#181926] text-[#f472b6] border-[#f472b6]/40 hover:text-white'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Rules Checklist Breakdown */}
      <div className="bg-[#181926] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-2">
        <span className="text-[10px] text-zinc-400 font-bold uppercase">
          Rule Verification Checklist:
        </span>

        {/* Rule 1: No digit start */}
        <div className={`p-2 rounded-lg border flex items-center justify-between ${
          !startsWithDigit ? 'bg-[#22c55e]/15 border-[#22c55e]/50 text-white' : 'bg-[#ef4444]/15 border-[#ef4444] text-white'
        }`}>
          <div>
            <span className="font-bold text-xs">Rule 1: Cannot begin with a digit (0-9)</span>
            <div className="text-[10px] text-zinc-400">Identifiers can only start with a letter (a-z, A-Z) or underscore (_)</div>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
            !startsWithDigit ? 'bg-[#22c55e] text-black' : 'bg-[#ef4444] text-white'
          }`}>
            {!startsWithDigit ? 'PASS' : 'FAIL (Starts with digit)'}
          </span>
        </div>

        {/* Rule 2: Allowed characters only */}
        <div className={`p-2 rounded-lg border flex items-center justify-between ${
          !hasInvalidChars ? 'bg-[#22c55e]/15 border-[#22c55e]/50 text-white' : 'bg-[#ef4444]/15 border-[#ef4444] text-white'
        }`}>
          <div>
            <span className="font-bold text-xs">Rule 2: Alphanumeric & Underscores only</span>
            <div className="text-[10px] text-zinc-400">No hyphens (-), spaces, dots, or symbols (@, $, %, !)</div>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
            !hasInvalidChars ? 'bg-[#22c55e] text-black' : 'bg-[#ef4444] text-white'
          }`}>
            {!hasInvalidChars ? 'PASS' : 'FAIL (Illegal characters)'}
          </span>
        </div>

        {/* Rule 3: Not a reserved keyword */}
        <div className={`p-2 rounded-lg border flex items-center justify-between ${
          !isKeyword ? 'bg-[#22c55e]/15 border-[#22c55e]/50 text-white' : 'bg-[#ef4444]/15 border-[#ef4444] text-white'
        }`}>
          <div>
            <span className="font-bold text-xs">Rule 3: Not a Python Reserved Keyword</span>
            <div className="text-[10px] text-zinc-400">Cannot shadow built-in syntax tokens like class, def, return</div>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
            !isKeyword ? 'bg-[#22c55e] text-black' : 'bg-[#ef4444] text-white'
          }`}>
            {!isKeyword ? 'PASS' : 'FAIL (Is Keyword)'}
          </span>
        </div>
      </div>

      {/* Special Underscore Conventions Callout */}
      {(isProtected || isPrivate || isDunder) && (
        <div className="bg-[#12131c] p-2.5 rounded-xl border border-zinc-700 text-[11px] text-zinc-300">
          <span className="text-[#facc15] font-black">Python Underscore Convention Detected: </span>
          {isDunder && 'Special Dunder / Magic Name (e.g. __init__, __str__). Reserved by Python for language hooks.'}
          {isPrivate && 'Private Attribute (__prefix). CPython mangles this to _ClassName__attr to prevent accidental child override.'}
          {isProtected && 'Protected Attribute (_prefix). PEP 8 convention indicating internal module or class scope.'}
        </div>
      )}
    </div>
  )
}

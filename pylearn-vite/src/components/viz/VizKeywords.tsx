'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { KeyRound, Search, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

interface Props {
  data?: any
}

interface KeywordGroup {
  category: string
  color: string
  words: string[]
}

const KEYWORD_GROUPS: KeywordGroup[] = [
  {
    category: 'Control Flow',
    color: '#38bdf8',
    words: ['if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'pass', 'match', 'case'],
  },
  {
    category: 'Structure & Functions',
    color: '#a3e635',
    words: ['def', 'return', 'yield', 'lambda', 'class'],
  },
  {
    category: 'Async & Coroutines',
    color: '#facc15',
    words: ['async', 'await'],
  },
  {
    category: 'Exceptions',
    color: '#f472b6',
    words: ['try', 'except', 'finally', 'raise', 'assert'],
  },
  {
    category: 'Imports & Context',
    color: '#c084fc',
    words: ['import', 'from', 'as', 'with'],
  },
  {
    category: 'Variables & Scope',
    color: '#fb923c',
    words: ['global', 'nonlocal', 'del'],
  },
  {
    category: 'Boolean & Logic',
    color: '#22c55e',
    words: ['True', 'False', 'None', 'and', 'or', 'not', 'is', 'in'],
  },
]

const ALL_KEYWORDS = new Set(KEYWORD_GROUPS.flatMap((g) => g.words))

export default function VizKeywords({ data }: Props) {
  const [search, setSearch] = useState('')
  const [testInput, setTestInput] = useState('class')

  const isReserved = ALL_KEYWORDS.has(testInput.trim())
  const filteredGroups = KEYWORD_GROUPS.map((g) => ({
    ...g,
    words: g.words.filter((w) => w.toLowerCase().includes(search.toLowerCase())),
  })).filter((g) => g.words.length > 0)

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <KeyRound size={15} className="text-[#facc15]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            PYTHON 3.12 RESERVED KEYWORDS MATRIX (35 TOTAL)
          </span>
        </div>
        <span className="text-[10px] bg-black/40 text-zinc-400 px-2 py-0.5 rounded border border-white/10">
          keyword.iskeyword()
        </span>
      </div>

      {/* Interactive Keyword Tester */}
      <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-400 uppercase">
            Test any identifier or word:
          </span>
          <span className="text-[10px] text-zinc-500">
            e.g. Try <button onClick={() => setTestInput('class')} className="text-[#38bdf8] underline">class</button>, <button onClick={() => setTestInput('user_name')} className="text-[#a3e635] underline">user_name</button>, <button onClick={() => setTestInput('yield')} className="text-[#facc15] underline">yield</button>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-black/60 px-3 py-1.5 rounded-lg border border-zinc-700">
            <span className="text-zinc-500 mr-2">&gt;&gt;&gt;</span>
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value.trim())}
              placeholder="Type word to test..."
              className="bg-transparent text-white font-mono text-xs outline-none flex-1 font-bold"
            />
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 font-black text-xs ${
            isReserved
              ? 'bg-[#ef4444] text-white border-black shadow-brutal-sm'
              : 'bg-[#22c55e] text-black border-black shadow-brutal-sm'
          }`}>
            {isReserved ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
            <span>{isReserved ? 'RESERVED KEYWORD' : 'VALID IDENTIFIER'}</span>
          </div>
        </div>

        {/* Live Feedback Message */}
        <div className={`p-2 rounded-lg text-[11px] border font-sans ${
          isReserved
            ? 'bg-[#ef4444]/15 border-[#ef4444] text-red-200'
            : 'bg-[#22c55e]/15 border-[#22c55e] text-green-200'
        }`}>
          {isReserved ? (
            <span>
              ❌ <strong>SyntaxError:</strong> Cannot assign to <code className="font-mono bg-black/50 px-1 rounded">{testInput}</code>! Python grammar reserves this token exclusively for internal language constructs.
            </span>
          ) : (
            <span>
              ✅ <code className="font-mono bg-black/50 px-1 rounded">{testInput}</code> is NOT a reserved keyword. It is safe to use as a variable, function, or parameter name.
            </span>
          )}
        </div>
      </div>

      {/* Search and Keyword Matrix */}
      <div className="bg-[#181926] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-2 flex-1 min-h-0 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-400 font-bold uppercase">
            All 35 Built-in Keywords by Category
          </span>
          <div className="flex items-center bg-black/40 px-2 py-0.5 rounded border border-zinc-700 text-[10px]">
            <Search size={11} className="text-zinc-400 mr-1" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter keywords..."
              className="bg-transparent text-white outline-none w-24 text-[10px]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredGroups.map((g) => (
            <div key={g.category} className="bg-[#12131c] p-2 rounded-lg border border-zinc-800">
              <span
                className="text-[10px] font-black uppercase tracking-wider block mb-1.5"
                style={{ color: g.color }}
              >
                {g.category}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {g.words.map((w) => (
                  <button
                    key={w}
                    onClick={() => setTestInput(w)}
                    className="px-2 py-0.5 rounded font-mono text-[11px] font-bold border transition-all hover:scale-105"
                    style={{
                      background: `${g.color}15`,
                      borderColor: `${g.color}50`,
                      color: g.color,
                    }}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

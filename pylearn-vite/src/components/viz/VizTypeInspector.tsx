'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, Lock, Unlock, Hash, Database, Sparkles } from 'lucide-react'

interface Props {
  data?: any
}

interface TypeInfo {
  type: string
  example: string
  mutable: boolean
  hashable: boolean
  size: number
  category: string
  useCase: string
  castingExample: string
}

export default function VizTypeInspector({ data }: Props) {
  const [selectedType, setSelectedType] = useState<string>('int')

  const TYPES: Record<string, TypeInfo> = {
    int: {
      type: 'int',
      example: '42',
      mutable: false,
      hashable: true,
      size: 28,
      category: 'Numeric',
      useCase: 'Arbitrary-precision integers. Never overflows in Python 3!',
      castingExample: 'int("100") -> 100 | int(9.99) -> 9',
    },
    float: {
      type: 'float',
      example: '3.14159',
      mutable: false,
      hashable: true,
      size: 24,
      category: 'Numeric',
      useCase: '64-bit IEEE 754 double precision floating point numbers.',
      castingExample: 'float("3.14") -> 3.14 | float(5) -> 5.0',
    },
    str: {
      type: 'str',
      example: '"Hello, Python!"',
      mutable: false,
      hashable: true,
      size: 63,
      category: 'Text Sequence',
      useCase: 'Immutable UTF-8 unicode character sequences with rich methods.',
      castingExample: 'str(42) -> "42" | str([1, 2]) -> "[1, 2]"',
    },
    list: {
      type: 'list',
      example: '[10, "apple", True]',
      mutable: true,
      hashable: false,
      size: 80,
      category: 'Dynamic Sequence',
      useCase: 'Heterogeneous dynamic arrays with O(1) amortized append.',
      castingExample: 'list((1, 2)) -> [1, 2] | list("py") -> ["p", "y"]',
    },
    tuple: {
      type: 'tuple',
      example: '(10, 20, "coord")',
      mutable: false,
      hashable: true,
      size: 64,
      category: 'Immutable Sequence',
      useCase: 'Fixed records, lighter than list, safe as dictionary keys.',
      castingExample: 'tuple([1, 2, 3]) -> (1, 2, 3)',
    },
    dict: {
      type: 'dict',
      example: '{"id": 101, "role": "admin"}',
      mutable: true,
      hashable: false,
      size: 232,
      category: 'Hash Mapping',
      useCase: 'Key-value hash table with O(1) average lookup and insertion.',
      castingExample: 'dict([("a", 1), ("b", 2)]) -> {"a": 1, "b": 2}',
    },
    set: {
      type: 'set',
      example: '{1, 2, 3, 4}',
      mutable: true,
      hashable: false,
      size: 216,
      category: 'Hash Collection',
      useCase: 'Unordered collection of unique items with O(1) lookup.',
      castingExample: 'set([1, 2, 2, 3]) -> {1, 2, 3} (Deduplicates)',
    },
    bool: {
      type: 'bool',
      example: 'True (or False)',
      mutable: false,
      hashable: true,
      size: 28,
      category: 'Boolean Subclass of int',
      useCase: 'Logical truth values (True == 1, False == 0).',
      castingExample: 'bool(0) -> False | bool("text") -> True',
    },
  }

  const active = TYPES[selectedType] || TYPES.int

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-[#a3e635]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            PYTHON BUILT-IN TYPE INSPECTOR & MEMORY FOOTPRINT
          </span>
        </div>
        <span className="text-[10px] bg-black/40 text-zinc-400 px-2 py-0.5 rounded border border-white/10">
          sys.getsizeof() Inspector
        </span>
      </div>

      {/* Type Selector Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {Object.keys(TYPES).map((k) => (
          <button
            key={k}
            onClick={() => setSelectedType(k)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold border-2 transition-all ${
              selectedType === k
                ? 'bg-[#a3e635] text-black border-black shadow-brutal-sm font-black -translate-y-0.5'
                : 'bg-[#181926] text-zinc-400 border-zinc-700 hover:text-white'
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Main Spec Card */}
      <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-base">{active.type}</span>
            <span className="text-[10px] bg-white/10 text-zinc-300 px-2 py-0.5 rounded font-mono">
              {active.category}
            </span>
          </div>

          {/* Mutability Badge */}
          <div className="flex items-center gap-1.5">
            {active.mutable ? (
              <span className="flex items-center gap-1 text-[10px] font-black bg-[#fb923c]/20 text-[#fb923c] px-2 py-0.5 rounded border border-[#fb923c]/50">
                <Unlock size={11} />
                MUTABLE
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-black bg-[#22c55e]/20 text-[#22c55e] px-2 py-0.5 rounded border border-[#22c55e]/50">
                <Lock size={11} />
                IMMUTABLE (Hashable)
              </span>
            )}
          </div>
        </div>

        {/* Code Example & Memory Size */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#1a1b2a] p-2 rounded-lg border border-zinc-800">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Example Literal</span>
            <div className="text-white font-mono font-black text-xs mt-1 truncate">
              {active.example}
            </div>
          </div>

          <div className="bg-[#1a1b2a] p-2 rounded-lg border border-zinc-800">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Base CPython RAM</span>
            <div className="text-[#38bdf8] font-mono font-black text-xs mt-1">
              {active.size} Bytes (overhead)
            </div>
          </div>
        </div>

        {/* Casting Example */}
        <div className="bg-black/40 p-2 rounded-lg border border-zinc-800 text-[11px]">
          <span className="text-[#facc15] font-bold">Type Casting: </span>
          <code className="text-zinc-200">{active.castingExample}</code>
        </div>
      </div>

      {/* Description */}
      <div className="bg-[#181926] p-2.5 rounded-xl border-2 border-black flex items-start gap-2 shadow-brutal-sm">
        <Sparkles size={14} className="text-[#38bdf8] shrink-0 mt-0.5" />
        <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
          {active.useCase}
        </p>
      </div>
    </div>
  )
}

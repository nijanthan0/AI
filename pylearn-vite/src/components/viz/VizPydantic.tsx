'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function VizPydantic() {
  const [ageInput, setAgeInput] = useState('28')
  const isInvalid = isNaN(Number(ageInput))

  return (
    <div className="flex flex-col gap-2">
      {/* Test age input */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[var(--text-dim)] font-semibold">Test Input (age):</span>
        <input
          type="text"
          value={ageInput}
          onChange={(e) => setAgeInput(e.target.value)}
          placeholder="28"
          className="w-16 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded px-2 py-0.5 text-xs font-mono outline-none"
        />
        <span className="text-[11px] text-[var(--text-dim)]">
          (Try typing "abc" to see Pydantic ValidationError)
        </span>
      </div>

      {/* Validation Pipeline */}
      <div className="bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl p-3 flex items-center justify-around min-h-[95px] gap-2">
        {/* Raw JSON */}
        <div className="bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg p-2 font-mono text-[10px] min-w-[100px]">
          <div className="text-[var(--text-dim)] font-bold mb-0.5">Raw JSON / Dict</div>
          <div>name: "Alice"</div>
          <div>age: <span className={isInvalid ? 'text-[var(--red)] underline font-bold' : 'text-[var(--text)]'}>"{ageInput}"</span></div>
        </div>

        {/* Pydantic Schema Validator */}
        <div className="flex flex-col items-center">
          <div className="text-[10px] text-[var(--primary)] font-mono font-bold">BaseModel</div>
          <motion.div
            animate={{ scale: isInvalid ? [1, 1.1, 1] : 1 }}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs ${
              isInvalid ? 'border-[var(--red)] text-[var(--red)]' : 'border-[var(--green)] text-[var(--green)]'
            }`}
          >
            {isInvalid ? '✗' : '✓'}
          </motion.div>
          <div className="text-[9px] text-[var(--text-dim)] font-mono mt-0.5">Validate</div>
        </div>

        {/* Validated Object or ValidationError */}
        <div className={`border-2 rounded-lg p-2 font-mono text-[10px] min-w-[120px] ${
          isInvalid
            ? 'border-[var(--red)] bg-[var(--red)]/10 text-[var(--red)]'
            : 'border-[var(--green)] bg-[var(--green)]/10 text-[var(--green)]'
        }`}>
          {isInvalid ? (
            <div>
              <div className="font-bold">ValidationError:</div>
              <div>age: value is not a valid integer</div>
            </div>
          ) : (
            <div>
              <div className="font-bold">User(BaseModel):</div>
              <div>name = "Alice" (str)</div>
              <div>age = {Number(ageInput)} (int)</div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[var(--bg-deep)] border border-[var(--border)] px-3 py-1 rounded-lg font-mono text-xs text-[var(--green)]">
        🛡 Pydantic automatically parses strings into integers and catches bad API requests instantly!
      </div>
    </div>
  )
}

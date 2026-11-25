'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function VizLinkedList() {
  const [nodes, setNodes] = useState(['10', '25', '40'])
  const [newNodeVal, setNewNodeVal] = useState('55')
  const [log, setLog] = useState('Linked List: Head points to node(10)')

  const appendNode = () => {
    if (!newNodeVal.trim()) return
    setNodes((prev) => [...prev, newNodeVal.trim()])
    setLog(`✓ Appended Node(${newNodeVal}): Previous tail's .next pointer updated`)
  }

  const deleteHead = () => {
    if (nodes.length === 0) return
    const removed = nodes[0]
    setNodes((prev) => prev.slice(1))
    setLog(`✓ Deleted Head(${removed}): Head pointer moved to next node`)
  }

  return (
    <div className="flex flex-col gap-2.5">
      {/* Controls */}
      <div className="flex items-center justify-between text-xs flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={newNodeVal}
            onChange={(e) => setNewNodeVal(e.target.value)}
            placeholder="val"
            className="w-14 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded px-2 py-0.5 text-xs font-mono outline-none"
          />
          <button
            onClick={appendNode}
            className="px-2.5 py-0.5 rounded bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/40 hover:bg-[var(--primary)]/30 font-semibold text-xs"
          >
            + Append Node
          </button>
          <button
            onClick={deleteHead}
            disabled={nodes.length === 0}
            className="px-2 py-0.5 rounded bg-[var(--red)]/20 text-[var(--red)] border border-[var(--red)]/40 hover:bg-[var(--red)]/30 text-xs disabled:opacity-40"
          >
            - Delete Head
          </button>
        </div>
        <span className="text-[11px] text-[var(--text-dim)] font-mono">Count: {nodes.length} nodes</span>
      </div>

      {/* Linked Nodes Visual Track */}
      <div className="bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl p-3 min-h-[90px] flex items-center overflow-x-auto">
        <div className="flex items-center gap-1.5 mx-auto">
          {/* Head Pointer */}
          <div className="flex flex-col items-center flex-shrink-0 mr-1">
            <span className="text-[10px] font-bold text-[var(--primary)] font-mono">HEAD</span>
            <span className="text-xs text-[var(--primary)]">➔</span>
          </div>

          <AnimatePresence mode="popLayout">
            {nodes.map((val, i) => (
              <motion.div
                key={`${val}-${i}`}
                layout
                initial={{ opacity: 0, scale: 0.6, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6, y: 10 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                className="flex items-center flex-shrink-0"
              >
                {/* Node Box with [Data | Next] */}
                <div className="flex border-2 border-[var(--primary)] rounded-lg overflow-hidden bg-[var(--surface2)] shadow-sm">
                  <div className="px-2.5 py-1.5 bg-[var(--surface)] font-mono font-bold text-xs text-[var(--text)] border-r border-[var(--border)]">
                    {val}
                  </div>
                  <div className="px-1.5 py-1.5 bg-[var(--bg-deep)] text-[10px] font-mono text-[var(--text-dim)] flex items-center">
                    next
                  </div>
                </div>

                {/* Pointer Arrow */}
                <span className="text-sm text-[var(--primary)] px-1">➔</span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* None terminator */}
          <div className="flex items-center text-xs font-mono font-bold text-[var(--text-dim)] bg-[var(--surface)] px-2 py-1 rounded border border-[var(--border)]">
            None
          </div>
        </div>
      </div>

      {/* Log */}
      <div className="bg-[var(--bg-deep)] border border-[var(--border)] px-3 py-1 rounded-lg font-mono text-xs text-[var(--green)]">
        {log}
      </div>
    </div>
  )
}

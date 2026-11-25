'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface OutputLine {
  type: string
  text: string
}

const LINE_COLORS: Record<string, string> = {
  cmd:     '#89dceb',
  out:     '#cdd6f4',
  info:    '#fab387',
  warn:    '#f9e2af',
  err:     '#f38ba8',
  success: '#a6e3a1',
  prompt:  '#cba6f7',
}

interface Props {
  title?: string
  output: OutputLine[]
  isRunning: boolean
  height: number
  isDragging?: boolean
  onSetHeight: (h: number) => void
  onClear: () => void
}

export default function Terminal({
  title,
  output,
  isRunning,
  height,
  isDragging = false,
  onSetHeight,
  onClear,
}: Props) {
  const termRef = useRef<HTMLDivElement>(null)
  const isMinimized = height <= 48

  useEffect(() => {
    if (termRef.current && !isMinimized) {
      termRef.current.scrollTop = termRef.current.scrollHeight
    }
  }, [output, isMinimized])

  return (
    <div
      className={`flex-shrink-0 border-t-2 border-black flex flex-col bg-[#121316] select-none overflow-hidden ${
        isDragging ? '' : 'transition-[height] duration-150 ease-out'
      }`}
      style={{ height: `${height}px`, minHeight: '36px' }}
    >
      {/* Terminal Header (Always 36px) */}
      <div className="h-9 px-3 bg-[#181920] border-b-2 border-black flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          {/* Traffic light dots */}
          <div className="flex gap-1.5">
            <button
              onClick={() => onSetHeight(36)}
              title="Minimize Terminal (36px)"
              className="w-3 h-3 rounded-full bg-[#f87171] border border-black hover:opacity-80 transition-opacity"
            />
            <button
              onClick={() => onSetHeight(180)}
              title="Default Height (180px)"
              className="w-3 h-3 rounded-full bg-[#facc15] border border-black hover:opacity-80 transition-opacity"
            />
            <button
              onClick={() => onSetHeight(360)}
              title="Large Height (360px)"
              className="w-3 h-3 rounded-full bg-[#4ade80] border border-black hover:opacity-80 transition-opacity"
            />
          </div>
          <span className="text-xs text-zinc-300 font-mono font-bold">{title || 'Terminal — Python 3.12'}</span>
          {isRunning && (
            <span className="text-xs text-[#facc15] animate-pulse font-mono font-bold">● Running...</span>
          )}
        </div>

        {/* Height Presets & Clear Toolbar */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <button
            onClick={onClear}
            className="hover:text-white px-2 py-0.5 rounded bg-[#27272a] border border-black text-[11px] font-bold shadow-brutal-sm"
            title="Clear Terminal Output"
          >
            CLEAR
          </button>
          <span className="opacity-30">|</span>
          <button
            onClick={() => onSetHeight(36)}
            className={`px-1.5 py-0.5 rounded hover:bg-[#27272a] hover:text-white text-xs transition-colors font-bold ${
              isMinimized ? 'text-[#facc15] bg-[#27272a]' : ''
            }`}
            title="Minimize to header (36px)"
          >
            _
          </button>
          <button
            onClick={() => onSetHeight(180)}
            className={`px-1.5 py-0.5 rounded hover:bg-[#313244] hover:text-[#cdd6f4] text-xs transition-colors ${
              height === 180 ? 'text-[#89b4fa] font-bold bg-[#313244]' : ''
            }`}
            title="Default size (180px)"
          >
            ◻
          </button>
          <button
            onClick={() => onSetHeight(360)}
            className={`px-1.5 py-0.5 rounded hover:bg-[#313244] hover:text-[#cdd6f4] text-xs transition-colors ${
              height >= 340 ? 'text-[#89b4fa] font-bold bg-[#313244]' : ''
            }`}
            title="Large size (360px)"
          >
            ⤢
          </button>
        </div>
      </div>

      {/* Terminal Output Body (Hidden when minimized!) */}
      {!isMinimized && (
        <div
          ref={termRef}
          className="flex-1 overflow-y-auto px-3 py-2 bg-[#11111b] font-mono text-xs leading-relaxed select-text"
        >
          <AnimatePresence initial={false}>
            {output.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1, delay: i * 0.02 }}
                style={{ color: LINE_COLORS[line.type] || '#cdd6f4' }}
                className="leading-5"
              >
                {line.type === 'cmd' && <span className="mr-1 opacity-50">$</span>}
                {line.text || '\u00A0'}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

'use client'

import { SlideExplanation } from '@/lib/types'

// Simple inline markdown parser
function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-white font-extrabold bg-white/10 px-1.5 py-0.5 rounded border border-white/15">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="bg-[#0d0e15] text-[#facc15] font-bold px-1.5 py-0.5 rounded-md text-[12px] font-mono border border-[#facc15]/40 inline-block mx-0.5"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return <span key={i}>{part}</span>
  })
}

// Multi-line point parser so newline-separated bullets stack cleanly
function renderPoint(text: string) {
  const lines = text.split('\n')
  if (lines.length === 1) {
    return renderInlineMarkdown(text)
  }

  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (trimmed.startsWith('•') || trimmed.startsWith('- ')) {
          const content = trimmed.slice(1).trim()
          return (
            <div key={idx} className="pl-1.5 flex items-start gap-2 text-zinc-300">
              <span className="text-[#facc15] font-black select-none">•</span>
              <span className="flex-1 leading-relaxed">{renderInlineMarkdown(content)}</span>
            </div>
          )
        }
        return (
          <div key={idx} className="leading-relaxed">
            {renderInlineMarkdown(line)}
          </div>
        )
      })}
    </div>
  )
}

interface Props {
  explanation: SlideExplanation
  isFullscreen?: boolean
}

export default function ExplanationBlock({ explanation, isFullscreen = false }: Props) {
  return (
    <div className={`space-y-4 w-full ${isFullscreen ? 'py-2 px-1' : ''}`}>
      <div className="sticker-badge bg-white text-black text-[10px] rotate-[1deg]">
        💡 KEY CONCEPTS & BREAKDOWN
      </div>

      <ul className={`space-y-3.5 ${isFullscreen ? 'text-base md:text-lg' : 'text-sm'}`}>
        {explanation.points.map((point, i) => (
          <li
            key={i}
            className={`flex items-start gap-3 text-zinc-300 leading-relaxed font-medium ${
              isFullscreen ? 'text-base md:text-[17px] py-1' : 'text-sm'
            }`}
          >
            <span className={`${isFullscreen ? 'w-6 h-6 text-sm' : 'w-5 h-5 text-xs'} rounded-md bg-[#a3e635] text-black border border-black font-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-brutal-sm`}>
              ✓
            </span>
            <span className="text-zinc-200 flex-1">{renderPoint(point)}</span>
          </li>
        ))}
      </ul>

      {explanation.highlight && (
        <div className={`border-2 border-black bg-[#22232a] rounded-xl shadow-brutal ${isFullscreen ? 'p-5 mt-6' : 'p-4'}`}>
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-black text-[#facc15] uppercase tracking-wider mb-1.5">
            <span>⚡ THE TAKEAWAY:</span>
          </div>
          <div className={`font-bold text-white leading-relaxed ${isFullscreen ? 'text-base md:text-lg' : 'text-sm'}`}>
            {renderPoint(explanation.highlight)}
          </div>
        </div>
      )}
    </div>
  )
}

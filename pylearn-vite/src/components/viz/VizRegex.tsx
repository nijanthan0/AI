import React, { useState } from 'react'
import { Search, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizRegex({ data }: Props) {
  const [pattern, setPattern] = useState(data?.defaultPattern || '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState(
    data?.defaultText || 'Contact Alice at alice@ai-engineer.org or bob_dev@gmail.com for the workshop registration.'
  )

  const presets = [
    { label: '📧 Email Match', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', text: 'Send inquiries to team@antigravity.dev and support@company.com!' },
    { label: '📞 Phone Numbers', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}', text: 'Call office: 415-555-0199 or emergency (800) 234-5678 today.' },
    { label: '🔢 Extract Digits', pattern: '\\d+', text: 'Order #4892 processed 15 items with total $1290 USD.' },
    { label: '🔤 Capital Words', pattern: '\\b[A-Z][a-z]+\\b', text: 'Python and PyTorch enable Deep Learning in Google Cloud.' }
  ]

  let matches: RegExpMatchArray[] = []
  let isValid = true
  let errorMsg = ''

  try {
    const regex = new RegExp(pattern, flags)
    const all = [...testString.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))]
    matches = all
  } catch (err: any) {
    isValid = false
    errorMsg = err.message
  }

  // Highlight matches in text
  const renderHighlightedText = () => {
    if (!isValid || !pattern) return <span>{testString}</span>
    try {
      const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
      const parts: { text: string; isMatch: boolean; idx: number }[] = []
      let lastIndex = 0
      let match: RegExpExecArray | null

      while ((match = regex.exec(testString)) !== null) {
        if (match.index > lastIndex) {
          parts.push({ text: testString.slice(lastIndex, match.index), isMatch: false, idx: lastIndex })
        }
        parts.push({ text: match[0], isMatch: true, idx: match.index })
        lastIndex = match.index + match[0].length
        if (!regex.global) break
        if (match[0].length === 0) regex.lastIndex++ // avoid infinite loop on zero-length match
      }

      if (lastIndex < testString.length) {
        parts.push({ text: testString.slice(lastIndex), isMatch: false, idx: lastIndex })
      }

      return (
        <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono">
          {parts.map((p, i) =>
            p.isMatch ? (
              <mark
                key={i}
                className="bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 rounded px-1.5 py-0.5 mx-0.5 font-bold shadow-sm"
              >
                {p.text}
              </mark>
            ) : (
              <span key={i} className="text-[var(--text)]">{p.text}</span>
            )
          )}
        </p>
      )
    } catch {
      return <span>{testString}</span>
    }
  }

  return (
    <div className="h-full flex flex-col gap-3 text-xs overflow-y-auto pr-1">
      {/* Preset pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[var(--text-dim)] font-semibold text-[10px] uppercase tracking-wider">Presets:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPattern(p.pattern)
              setTestString(p.text)
            }}
            className="px-2 py-0.5 rounded-full bg-[var(--surface-hover)] hover:bg-[var(--primary)] hover:text-white transition-colors border border-[var(--border)] text-[11px] text-[var(--text-dim)]"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Regex Pattern Input */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-2.5">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider flex items-center gap-1">
            <Search size={12} className="text-[var(--primary)]" />
            Regular Expression (Pattern / Flags)
          </label>
          <div className="flex items-center gap-1 text-[11px]">
            {isValid ? (
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 size={12} /> Valid Pattern
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1 font-mono">
                <AlertCircle size={12} /> {errorMsg}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[var(--bg)] border border-[var(--border)] rounded-md px-2.5 py-1.5 font-mono text-xs">
          <span className="text-amber-400 font-bold">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Type regex pattern..."
            className="flex-1 bg-transparent text-[var(--text)] outline-none font-mono"
            spellCheck={false}
          />
          <span className="text-amber-400 font-bold">/</span>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            title="Regex flags (g, i, m)"
            className="w-8 bg-transparent text-amber-300 font-mono outline-none text-center border-l border-[var(--border)] pl-1"
          />
        </div>
      </div>

      {/* Test String Input & Live Highlight */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-2.5 flex-1 flex flex-col gap-2">
        <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider">
          Test String & Live Highlight
        </label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          rows={2}
          className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-md p-2 font-mono text-xs text-[var(--text)] outline-none resize-none"
          placeholder="Input target text to search..."
        />

        <div className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-md flex-1 overflow-y-auto">
          {renderHighlightedText()}
        </div>
      </div>

      {/* Match Results Summary */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={12} className="text-emerald-400" />
            Matched Results ({matches.length} found)
          </span>
          <span className="text-[10px] text-[var(--text-dim)] font-mono">Python: re.findall(pattern, text)</span>
        </div>

        {matches.length === 0 ? (
          <div className="text-[var(--text-dim)] text-center py-2 text-xs italic">
            No matches found for current pattern.
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
            {matches.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2 py-1 rounded font-mono text-xs"
              >
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded font-bold">#{i + 1}</span>
                <span>{m[0]}</span>
                {m.length > 1 && (
                  <span className="text-[10px] text-zinc-400">
                    groups: [{m.slice(1).map((g) => `"${g}"`).join(', ')}]
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

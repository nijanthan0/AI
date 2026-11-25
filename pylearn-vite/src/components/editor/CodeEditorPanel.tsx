'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { Slide } from '@/lib/types'
import Terminal from './Terminal'
import { Database, FileCode } from 'lucide-react'

interface Props { slide: Slide }

export default function CodeEditorPanel({ slide }: Props) {
  const { codeOverrides, codeOverrideVersion, setCodeOverride, resetCodeOverride, zoomedPanel, setZoomedPanel } = useAppStore()

  const isSql = slide.language === 'sql' || String(slide.id).startsWith('sql') || slide.category?.toLowerCase().includes('sql')

  // Retrieve code: ignore any stale Python override if this is an SQL slide
  const storedCode = codeOverrides[slide.id] ?? codeOverrides[String(slide.id)]
  const isStalePythonOverride = isSql && storedCode && (storedCode.startsWith('#') || storedCode.includes('def ') || storedCode.includes('import ') || storedCode.includes('print('))
  const code = isStalePythonOverride ? slide.code : (storedCode ?? slide.code)

  const editorRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [editorReady, setEditorReady] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [terminalHeight, setTerminalHeight] = useState(180)
  const [isDragging, setIsDragging] = useState(false)

  const [output, setOutput] = useState<{ type: string; text: string }[]>([
    { type: 'info', text: `Slide ${slide.id}: ${slide.tag}` },
    { type: 'info', text: isSql ? 'Press ▶ Run (Ctrl+Enter) to execute SQL in SQLite WASM…' : 'Press ▶ Run (Ctrl+Enter) to execute…' },
  ])

  // Lazy-load CodeMirror with Python or SQL language support & proper indentation
  useEffect(() => {
    let destroyed = false
    async function setup() {
      if (!containerRef.current) return
      const { EditorView, keymap, highlightActiveLine } = await import('@codemirror/view')
      const { EditorState } = await import('@codemirror/state')
      const { oneDark } = await import('@codemirror/theme-one-dark')
      const { defaultKeymap, history, historyKeymap, indentWithTab } = await import('@codemirror/commands')
      const { indentUnit } = await import('@codemirror/language')
      const { lineNumbers, highlightActiveLineGutter } = await import('@codemirror/view')

      let langExtension: any
      if (isSql) {
        const { sql } = await import('@codemirror/lang-sql')
        langExtension = sql()
      } else {
        const { python } = await import('@codemirror/lang-python')
        langExtension = python()
      }

      if (destroyed) return

      const view = new EditorView({
        state: EditorState.create({
          doc: code,
          extensions: [
            lineNumbers(),
            highlightActiveLine(),
            highlightActiveLineGutter(),
            history(),
            langExtension,
            oneDark,
            indentUnit.of(isSql ? '  ' : '    '),
            EditorState.tabSize.of(isSql ? 2 : 4),
            keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
            EditorView.updateListener.of((update) => {
              if (update.docChanged) {
                setCodeOverride(slide.id, update.state.doc.toString())
              }
            }),
            EditorView.theme({
              '&': { height: '100%', fontSize: '13px' },
              '.cm-scroller': { fontFamily: "'Fira Code', monospace", overflow: 'auto' },
              '.cm-content': { padding: '12px 0' },
            }),
          ],
        }),
        parent: containerRef.current,
      })

      editorRef.current = view
      setEditorReady(true)
    }

    setup()
    return () => {
      destroyed = true
      editorRef.current?.destroy()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide.id, isSql])

  // Synchronize editor document when code changes externally (e.g. Reveal Solution / Load to Editor)
  useEffect(() => {
    if (editorRef.current) {
      const currentDoc = editorRef.current.state.doc.toString()
      if (currentDoc !== code) {
        editorRef.current.dispatch({
          changes: { from: 0, to: currentDoc.length, insert: code },
        })
        setOutput((prev) => [
          ...prev,
          { type: 'info', text: '⚡ Code editor updated with optimal solution.' },
        ])
      }
    }
  }, [code, codeOverrideVersion])

  const handleRun = useCallback(async () => {
    setIsRunning(true)
    const currentCode = editorRef.current ? editorRef.current.state.doc.toString() : code

    if (isSql) {
      setOutput([{ type: 'cmd', text: '$ sqlite3 bookstore.db' }])
      try {
        const { runSqlQuery } = await import('@/lib/sqlEngine')
        setOutput((prev) => [...prev, { type: 'info', text: 'Executing query in SQLite WASM engine…' }])
        const result = await runSqlQuery(currentCode)

        const lines: { type: string; text: string }[] = [{ type: 'cmd', text: '$ sqlite3 bookstore.db' }]

        if (result.error) {
          lines.push({ type: 'err', text: `SQLite Error: ${result.error}` })
          lines.push({ type: 'err', text: '✗ Query failed' })
        } else {
          result.outputLines.forEach((l) => {
            lines.push({ type: 'out', text: l })
          })
          lines.push({ type: 'success', text: '✓ Query executed successfully (0)' })
        }

        setOutput(lines)
      } catch (err: any) {
        setOutput([
          { type: 'cmd', text: '$ sqlite3 bookstore.db' },
          { type: 'err', text: err.message || 'Failed to run SQL query' },
        ])
      } finally {
        setIsRunning(false)
      }
      return
    }

    setOutput([{ type: 'cmd', text: '$ python main.py' }])

    try {
      const { runPython } = await import('@/lib/pyodide')
      setOutput((prev) => [...prev, { type: 'info', text: 'Executing Python code…' }])
      const result = await runPython(currentCode)

      const lines: { type: string; text: string }[] = [{ type: 'cmd', text: '$ python main.py' }]

      if (result.stdout) {
        result.stdout.split('\n').filter(Boolean).forEach((line) => {
          lines.push({ type: 'out', text: line })
        })
      }
      if (result.stderr) {
        result.stderr.split('\n').filter(Boolean).forEach((line) => {
          lines.push({ type: 'warn', text: line })
        })
      }
      if (result.error) {
        result.error.split('\n').filter(Boolean).forEach((line) => {
          lines.push({ type: 'err', text: line })
        })
        lines.push({ type: 'err', text: '✗ Process exited (1)' })
      } else {
        lines.push({ type: 'success', text: '✓ Process exited (0)' })
      }

      setOutput(lines)
    } catch (err: any) {
      setOutput([
        { type: 'cmd', text: '$ python main.py' },
        { type: 'err', text: err.message || 'Failed to run Python' },
      ])
    } finally {
      setIsRunning(false)
    }
  }, [code, isSql])

  const handleReset = useCallback(() => {
    resetCodeOverride(slide.id)
    if (editorRef.current) {
      editorRef.current.dispatch({
        changes: { from: 0, to: editorRef.current.state.doc.length, insert: slide.code },
      })
    }
    setOutput([{ type: 'info', text: 'Code reset to default.' }])
  }, [slide.id, slide.code, resetCodeOverride])

  const handleClearTerminal = () => {
    setOutput([])
  }

  // Ctrl+Enter shortcut to run code
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault()
        handleRun()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleRun])

  // Modern HTML5 Pointer-Capture Resizer (Smooth in both directions!)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)

    const startY = e.clientY
    const startH = terminalHeight
    const target = e.currentTarget
    target.setPointerCapture(e.pointerId)

    const onPointerMove = (ev: PointerEvent) => {
      // Delta: moving mouse UP (ev.clientY < startY) increases terminal height
      // Moving mouse DOWN (ev.clientY > startY) decreases terminal height
      const deltaY = startY - ev.clientY
      const panelHeight = panelRef.current ? panelRef.current.clientHeight : window.innerHeight
      const maxH = Math.max(120, panelHeight - 100)

      const targetH = Math.max(36, Math.min(maxH, startH + deltaY))
      setTerminalHeight(targetH)
    }

    const onPointerUp = (ev: PointerEvent) => {
      setIsDragging(false)
      try {
        target.releasePointerCapture(ev.pointerId)
      } catch {}
      target.removeEventListener('pointermove', onPointerMove)
      target.removeEventListener('pointerup', onPointerUp)
      target.removeEventListener('pointercancel', onPointerUp)
    }

    target.addEventListener('pointermove', onPointerMove)
    target.addEventListener('pointerup', onPointerUp)
    target.addEventListener('pointercancel', onPointerUp)
  }

  // Double click resizer bar to toggle between minimized (36px) and default (180px)
  const handleDoubleClickResizer = () => {
    setTerminalHeight((prev) => (prev <= 48 ? 180 : 36))
  }

  const isFullscreen = zoomedPanel === 'editor'

  return (
    <div ref={panelRef} className="flex flex-col h-full w-full overflow-hidden bg-[#121316] relative select-none">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#181920] border-b-2 border-black flex-shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <div className={`w-6 h-6 rounded-md border-2 border-black shadow-brutal-sm flex items-center justify-center font-bold text-xs ${
            isSql ? 'bg-[#38bdf8] text-black' : 'bg-[#facc15] text-black'
          }`}>
            {isSql ? 'SQL' : 'PY'}
          </div>

          <span className="text-xs font-mono font-black text-white">
            {isSql ? 'query.sql' : 'main.py'}
          </span>

          <span className="sticker-badge bg-[#27272a] text-zinc-300 text-[10px] hidden sm:inline-flex">
            {isSql ? '⚡ SQLite 3.45 WASM' : '⚡ Python 3.12 VM'}
          </span>

          {isFullscreen && (
            <span className="sticker-badge bg-[#f472b6] text-black text-[10px] rotate-[-2deg]">
              FULLSCREEN
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Fullscreen Toggle Button */}
          <button
            onClick={() => setZoomedPanel(isFullscreen ? 'none' : 'editor')}
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-1 border-2 border-black ${
              isFullscreen
                ? 'bg-[#facc15] text-black shadow-none translate-x-[1px] translate-y-[1px]'
                : 'bg-[#27272a] text-zinc-300 shadow-brutal-sm hover:text-white hover:-translate-x-0.5 hover:-translate-y-0.5'
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor & Terminal'}
          >
            <span>{isFullscreen ? '↙ SPLIT' : '⤢ EXPAND'}</span>
          </button>

          <button
            onClick={handleReset}
            className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-[#27272a] text-zinc-300 border-2 border-black shadow-brutal-sm hover:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            title="Reset code to original slide code"
          >
            ↺ RESET
          </button>

          {/* Neobrutal Mega Run Button */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-4 py-1.5 text-xs font-mono font-black rounded-lg bg-[#a3e635] text-black border-2 border-black shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 flex items-center gap-1.5"
            title={isSql ? "Execute SQL query in SQLite WASM (Ctrl+Enter)" : "Run Python code (Ctrl+Enter)"}
          >
            {isRunning ? '⟳ RUNNING…' : '▶ RUN CODE'}
          </button>
        </div>
      </div>

      {/* CodeMirror Editor Area */}
      <div className="flex-1 overflow-hidden bg-[#121316] min-h-[80px]">
        <div ref={containerRef} className="h-full" />
      </div>

      {/* Resizer Handle Bar */}
      <div
        onPointerDown={handlePointerDown}
        onDoubleClick={handleDoubleClickResizer}
        className={`h-3.5 border-t-2 border-black cursor-row-resize flex items-center justify-center transition-colors select-none group relative z-10 ${
          isDragging ? 'bg-[#facc15]' : 'bg-[#181920] hover:bg-[#27272a]'
        }`}
        title="Drag up or down to resize terminal. Double-click to toggle minimize."
      >
        <div className="w-12 h-1 rounded-full bg-zinc-600 group-hover:bg-[#facc15] transition-colors" />
      </div>

      {/* Terminal with Dynamic Height */}
      <Terminal
        title={isSql ? 'TERMINAL — SQLite 3.45 (WASM)' : 'TERMINAL — Python 3.12 (Pyodide)'}
        output={output}
        isRunning={isRunning}
        height={terminalHeight}
        isDragging={isDragging}
        onSetHeight={setTerminalHeight}
        onClear={handleClearTerminal}
      />
    </div>
  )
}

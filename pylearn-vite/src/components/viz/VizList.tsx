'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  data?: {
    initial?: string[]
    title?: string
  }
}

export default function VizList({ data }: Props) {
  const defaultItems = data?.initial && data.initial.length > 0 
    ? data.initial 
    : ['Milk', 'Eggs', 'Bread']

  const [cart, setCart] = useState<string[]>(defaultItems)
  const [log, setLog] = useState<string>('supermarket_cart = ["' + defaultItems.join('", "') + '"]')
  const [logType, setLogType] = useState<'success' | 'warn' | 'info'>('info')

  // Form states for each operation
  const [appendItem, setAppendItem] = useState('Apple')
  const [insertIdx, setInsertIdx] = useState('0')
  const [insertItem, setInsertItem] = useState('Coffee')
  const [extendItems, setExtendItems] = useState('Cheese, Yogurt')
  const [popIdx, setPopIdx] = useState('')
  const [removeItem, setRemoveItem] = useState('')

  useEffect(() => {
    if (data?.initial) {
      setCart(data.initial)
      setLog('supermarket_cart = ["' + data.initial.join('", "') + '"]')
    }
  }, [data])

  // Operation Handlers
  const handleAppend = () => {
    if (!appendItem.trim()) return
    const val = appendItem.trim()
    setCart((prev) => [...prev, val])
    setLog(`>>> supermarket_cart.append("${val}")  # Added at index [${cart.length}]`)
    setLogType('success')
  }

  const handleInsert = () => {
    if (!insertItem.trim()) return
    const idx = parseInt(insertIdx, 10)
    if (isNaN(idx)) {
      setLog(`>>> TypeError: insert() index must be an integer`)
      setLogType('warn')
      return
    }
    const val = insertItem.trim()
    setCart((prev) => {
      const next = [...prev]
      const target = Math.max(0, Math.min(next.length, idx < 0 ? next.length + idx : idx))
      next.splice(target, 0, val)
      return next
    })
    setLog(`>>> supermarket_cart.insert(${idx}, "${val}")  # Shifted items right`)
    setLogType('success')
  }

  const handleExtend = () => {
    if (!extendItems.trim()) return
    const parsed = extendItems
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (parsed.length === 0) return
    setCart((prev) => [...prev, ...parsed])
    setLog(`>>> supermarket_cart.extend([${parsed.map((p) => `"${p}"`).join(', ')}])  # Added ${parsed.length} items`)
    setLogType('success')
  }

  const handlePop = () => {
    if (cart.length === 0) {
      setLog(`>>> IndexError: pop from empty list`)
      setLogType('warn')
      return
    }

    if (popIdx.trim() === '') {
      const popped = cart[cart.length - 1]
      setCart((prev) => prev.slice(0, prev.length - 1))
      setLog(`>>> val = supermarket_cart.pop()  # Popped "${popped}" from index [${cart.length - 1}]`)
      setLogType('info')
    } else {
      const idx = parseInt(popIdx, 10)
      const realIdx = idx < 0 ? cart.length + idx : idx
      if (isNaN(idx) || realIdx < 0 || realIdx >= cart.length) {
        setLog(`>>> IndexError: pop index out of range (${idx})`)
        setLogType('warn')
        return
      }
      const popped = cart[realIdx]
      setCart((prev) => {
        const next = [...prev]
        next.splice(realIdx, 1)
        return next
      })
      setLog(`>>> val = supermarket_cart.pop(${idx})  # Popped "${popped}" from index [${realIdx}]`)
      setLogType('info')
    }
  }

  const executeRemove = (valToRemove: string) => {
    const val = valToRemove.trim()
    if (!val) {
      setLog(`>>> ValueError: Specify value to remove`)
      setLogType('warn')
      return
    }
    const idx = cart.indexOf(val)
    if (idx === -1) {
      setLog(`>>> ValueError: list.remove(x): "${val}" not in list!`)
      setLogType('warn')
      return
    }
    setCart((prev) => {
      const next = [...prev]
      next.splice(idx, 1)
      return next
    })
    setLog(`>>> supermarket_cart.remove("${val}")  # Removed from index [${idx}]`)
    setLogType('info')
  }

  const handleQuickDelete = (index: number, val: string) => {
    setCart((prev) => {
      const next = [...prev]
      next.splice(index, 1)
      return next
    })
    setLog(`>>> del supermarket_cart[${index}]  # Removed "${val}"`)
    setLogType('info')
  }

  const handleReset = () => {
    setCart(defaultItems)
    setLog(`>>> supermarket_cart = ["${defaultItems.join('", "')}"]  # Reset`)
    setLogType('info')
  }

  // Prevent keyboard events inside inputs from triggering global slide player navigation
  const stopPropagation = (e: React.KeyboardEvent) => {
    e.stopPropagation()
  }

  return (
    <div className="flex flex-col gap-2.5">
      {/* Header: Supermarket Persona & List Metadata */}
      <div className="flex items-center justify-between text-xs pb-1 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="text-base">🧑‍🛒</span>
          <span className="font-mono font-bold text-[var(--primary)]">supermarket_cart</span>
          <span className="text-[11px] text-[var(--text-dim)] font-mono">= [ ]</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="bg-[var(--surface)] text-[var(--text-muted)] px-2 py-0.5 rounded border border-[var(--border)]">
            len = <strong className="text-[var(--text)]">{cart.length}</strong>
          </span>
          <button
            onClick={handleReset}
            className="text-[var(--text-dim)] hover:text-[var(--text)] hover:underline text-[10px]"
          >
            ↺ Reset Cart
          </button>
        </div>
      </div>

      {/* Visual Memory Slots: Positive Index on Top, Item, Negative Index on Bottom */}
      <div className="bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl p-3 min-h-[92px] flex items-center overflow-x-auto">
        <div className="flex items-center gap-2 mx-auto">
          <AnimatePresence mode="popLayout">
            {cart.map((item, i) => {
              const negIdx = i - cart.length

              return (
                <motion.div
                  key={`${item}-${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0.5, y: -15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 15 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex flex-col items-center flex-shrink-0"
                >
                  {/* Positive Index */}
                  <span className="text-[10px] font-mono font-bold text-[var(--primary)] mb-1">
                    [{i}]
                  </span>

                  {/* Cart Item Box */}
                  <div className="relative group bg-[var(--surface2)] border-2 border-[var(--primary)]/60 rounded-lg px-3 py-1.5 min-w-[70px] text-center shadow-sm">
                    <span className="font-mono text-xs font-semibold text-[var(--text)] select-all">
                      {item}
                    </span>
                    {/* Quick remove button on card */}
                    <button
                      onClick={() => handleQuickDelete(i, item)}
                      title={`Remove ${item}`}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--red)] text-white rounded-full text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Negative Index */}
                  <span className="text-[10px] font-mono text-[var(--peach)] mt-1" title="Negative Index">
                    [{negIdx}]
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {cart.length === 0 && (
            <div className="text-center py-3 text-xs text-[var(--text-dim)] font-mono">
              🛒 Empty Cart: `supermarket_cart = []` — Add items below!
            </div>
          )}
        </div>
      </div>

      {/* Clean, Non-Cramped Interactive Operation Controls */}
      <div className="space-y-1.5 text-xs">
        {/* Row 1: Append & Insert */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {/* 1. Append */}
          <div className="bg-[var(--surface)] px-2.5 py-1.5 rounded-lg border border-[var(--border)] flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-mono text-[11px] text-[var(--green)] font-bold">.append(</span>
              <input
                type="text"
                value={appendItem}
                onChange={(e) => setAppendItem(e.target.value)}
                onKeyDown={(e) => {
                  stopPropagation(e)
                  if (e.key === 'Enter') handleAppend()
                }}
                placeholder="item"
                className="w-20 bg-[var(--bg-deep)] text-[var(--text)] border border-[var(--border)] rounded px-1.5 py-0.5 text-xs font-mono outline-none focus:border-[var(--green)]"
              />
              <span className="font-mono text-[11px] text-[var(--green)] font-bold">)</span>
            </div>
            <button
              onClick={handleAppend}
              className="px-2.5 py-1 rounded bg-[var(--green)]/20 text-[var(--green)] hover:bg-[var(--green)]/30 border border-[var(--green)]/40 font-semibold text-[11px] transition-colors flex-shrink-0"
            >
              + Append
            </button>
          </div>

          {/* 2. Insert */}
          <div className="bg-[var(--surface)] px-2.5 py-1.5 rounded-lg border border-[var(--border)] flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-mono text-[11px] text-[var(--primary)] font-bold">.insert(</span>
              <input
                type="text"
                value={insertIdx}
                onChange={(e) => setInsertIdx(e.target.value)}
                onKeyDown={stopPropagation}
                placeholder="0"
                className="w-7 text-center bg-[var(--bg-deep)] text-[var(--text)] border border-[var(--border)] rounded px-1 py-0.5 text-xs font-mono outline-none focus:border-[var(--primary)]"
              />
              <span className="font-mono text-[11px] text-[var(--text-dim)]">,</span>
              <input
                type="text"
                value={insertItem}
                onChange={(e) => setInsertItem(e.target.value)}
                onKeyDown={(e) => {
                  stopPropagation(e)
                  if (e.key === 'Enter') handleInsert()
                }}
                placeholder="item"
                className="w-16 bg-[var(--bg-deep)] text-[var(--text)] border border-[var(--border)] rounded px-1.5 py-0.5 text-xs font-mono outline-none focus:border-[var(--primary)]"
              />
              <span className="font-mono text-[11px] text-[var(--primary)] font-bold">)</span>
            </div>
            <button
              onClick={handleInsert}
              className="px-2.5 py-1 rounded bg-[var(--primary)]/20 text-[var(--primary)] hover:bg-[var(--primary)]/30 border border-[var(--primary)]/40 font-semibold text-[11px] transition-colors flex-shrink-0"
            >
              Insert
            </button>
          </div>
        </div>

        {/* Row 2: Extend */}
        <div className="bg-[var(--surface)] px-2.5 py-1.5 rounded-lg border border-[var(--border)] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <span className="font-mono text-[11px] text-[var(--mauve)] font-bold flex-shrink-0">.extend([</span>
            <input
              type="text"
              value={extendItems}
              onChange={(e) => setExtendItems(e.target.value)}
              onKeyDown={(e) => {
                stopPropagation(e)
                if (e.key === 'Enter') handleExtend()
              }}
              placeholder="Cheese, Yogurt"
              className="flex-1 bg-[var(--bg-deep)] text-[var(--text)] border border-[var(--border)] rounded px-2 py-0.5 text-xs font-mono outline-none focus:border-[var(--mauve)]"
            />
            <span className="font-mono text-[11px] text-[var(--mauve)] font-bold flex-shrink-0">])</span>
          </div>
          <button
            onClick={handleExtend}
            className="px-2.5 py-1 rounded bg-[var(--mauve)]/20 text-[var(--mauve)] hover:bg-[var(--mauve)]/30 border border-[var(--mauve)]/40 font-semibold text-[11px] transition-colors flex-shrink-0"
          >
            Extend List
          </button>
        </div>

        {/* Row 3: Pop & Remove (Each has its own dedicated card with no clipping!) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {/* 4. Pop */}
          <div className="bg-[var(--surface)] px-2.5 py-1.5 rounded-lg border border-[var(--border)] flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-mono text-[11px] text-[var(--peach)] font-bold">.pop(</span>
              <input
                type="text"
                value={popIdx}
                onChange={(e) => setPopIdx(e.target.value)}
                onKeyDown={(e) => {
                  stopPropagation(e)
                  if (e.key === 'Enter') handlePop()
                }}
                placeholder="-1"
                className="w-10 text-center bg-[var(--bg-deep)] text-[var(--text)] border border-[var(--border)] rounded px-1.5 py-0.5 text-xs font-mono outline-none focus:border-[var(--peach)]"
              />
              <span className="font-mono text-[11px] text-[var(--peach)] font-bold">)</span>
            </div>
            <button
              onClick={handlePop}
              className="px-3 py-1 rounded bg-[var(--peach)]/20 text-[var(--peach)] hover:bg-[var(--peach)]/30 border border-[var(--peach)]/40 font-semibold text-[11px] transition-colors flex-shrink-0"
            >
              - Pop
            </button>
          </div>

          {/* 5. Remove (Now with typed input AND instant dropdown click!) */}
          <div className="bg-[var(--surface)] px-2.5 py-1.5 rounded-lg border border-[var(--border)] flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <span className="font-mono text-[11px] text-[var(--red)] font-bold flex-shrink-0">.remove(</span>
              <input
                type="text"
                value={removeItem}
                onChange={(e) => setRemoveItem(e.target.value)}
                onKeyDown={(e) => {
                  stopPropagation(e)
                  if (e.key === 'Enter') executeRemove(removeItem)
                }}
                placeholder={cart[0] || 'val'}
                className="w-20 bg-[var(--bg-deep)] text-[var(--text)] border border-[var(--border)] rounded px-1.5 py-0.5 text-xs font-mono outline-none focus:border-[var(--red)] flex-1 min-w-0"
              />
              <span className="font-mono text-[11px] text-[var(--red)] font-bold flex-shrink-0">)</span>
            </div>
            <button
              onClick={() => executeRemove(removeItem || cart[0] || '')}
              className="px-3 py-1 rounded bg-[var(--red)]/20 text-[var(--red)] hover:bg-[var(--red)]/30 border border-[var(--red)]/40 font-semibold text-[11px] transition-colors flex-shrink-0"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Live Execution Log */}
      <div
        className={`px-3 py-1.5 rounded-lg border font-mono text-xs leading-relaxed flex items-center justify-between ${
          logType === 'warn'
            ? 'bg-[var(--red)]/10 border-[var(--red)]/40 text-[var(--red)]'
            : logType === 'success'
            ? 'bg-[var(--green)]/10 border-[var(--green)]/40 text-[var(--green)]'
            : 'bg-[var(--bg-deep)] border-[var(--border)] text-[var(--primary)]'
        }`}
      >
        <span className="truncate">{log}</span>
        <span className="text-[10px] text-[var(--text-dim)] ml-2 flex-shrink-0">Live Python State</span>
      </div>
    </div>
  )
}

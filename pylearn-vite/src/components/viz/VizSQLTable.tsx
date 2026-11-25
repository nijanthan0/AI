import React, { useState } from 'react'
import { Table, Database, Key, Hash, Calendar, Type } from 'lucide-react'

export interface ColumnDef {
  name: string
  type: string
  isPk?: boolean
  isFk?: boolean
}

export interface TableData {
  tableName: string
  columns: ColumnDef[]
  rows: any[][]
  note?: string
}

interface Props {
  data?: TableData
}

export default function VizSQLTable({ data }: Props) {
  const [filterText, setFilterText] = useState('')

  if (!data || !data.columns) {
    return (
      <div className="h-full flex items-center justify-center text-xs text-[var(--text-muted)]">
        No table schema loaded.
      </div>
    )
  }

  const { tableName, columns, rows, note } = data

  const filteredRows = rows.filter(row => {
    if (!filterText) return true
    return row.some(cell => String(cell).toLowerCase().includes(filterText.toLowerCase()))
  })

  const getTypeIcon = (type: string) => {
    const t = type.toUpperCase()
    if (t.includes('INT') || t.includes('REAL') || t.includes('NUM')) return <Hash size={11} className="text-amber-400" />
    if (t.includes('DATE') || t.includes('TIME')) return <Calendar size={11} className="text-emerald-400" />
    return <Type size={11} className="text-blue-400" />
  }

  return (
    <div className="h-full flex flex-col p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden font-sans">
      {/* Table Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Database size={15} />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-[var(--text)] flex items-center gap-2">
              <span>{tableName}</span>
              <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-[var(--bg-alt)] border border-[var(--border)] text-[var(--text-muted)]">
                {rows.length} rows
              </span>
            </div>
            {note && <div className="text-[11px] text-[var(--text-muted)]">{note}</div>}
          </div>
        </div>

        {/* Quick Filter */}
        <input
          type="text"
          placeholder="Filter table rows…"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="text-xs bg-[var(--bg-alt)] border border-[var(--border)] rounded-lg px-2.5 py-1 text-[var(--text)] placeholder-[var(--text-dim)] focus:outline-none focus:border-blue-500 w-36 transition-colors"
        />
      </div>

      {/* Table Grid */}
      <div className="flex-1 overflow-auto border border-[var(--border)] rounded-lg bg-[var(--bg-alt)]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-10">
              {columns.map((col, idx) => (
                <th key={idx} className="px-3 py-2 text-[var(--text)] font-semibold text-[11px] border-r border-[var(--border)] last:border-r-0">
                  <div className="flex items-center gap-1.5">
                    {getTypeIcon(col.type)}
                    <span className="font-mono">{col.name}</span>
                    {col.isPk && (
                      <span className="px-1 py-0.2 text-[9px] font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-0.5">
                        <Key size={8} /> PK
                      </span>
                    )}
                    {col.isFk && (
                      <span className="px-1 py-0.2 text-[9px] font-bold rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        FK
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] text-[var(--text-dim)] font-mono font-normal">
                    {col.type}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] font-mono text-[11px]">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-[var(--text-dim)]">
                  No matching rows found.
                </td>
              </tr>
            ) : (
              filteredRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-blue-500/5 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-1.5 border-r border-[var(--border)] last:border-r-0 text-[var(--text)]">
                      {cell === null ? (
                        <span className="text-[var(--text-dim)] italic">NULL</span>
                      ) : typeof cell === 'number' ? (
                        <span className="text-amber-400 font-semibold">{cell}</span>
                      ) : (
                        <span>{String(cell)}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

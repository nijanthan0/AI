import React, { useState } from 'react'
import { GitMerge, ArrowRight, Check } from 'lucide-react'

interface JoinData {
  leftTable: { name: string; rows: any[][] }
  rightTable: { name: string; rows: any[][] }
  joinKey: string
  joinTypes?: string[]
}

interface Props {
  data?: JoinData
}

export default function VizSQLJoin({ data }: Props) {
  const [selectedType, setSelectedType] = useState<'INNER' | 'LEFT' | 'RIGHT' | 'CROSS'>('INNER')

  const leftTable = data?.leftTable || {
    name: 'customers',
    rows: [
      [1, 'Alice'],
      [2, 'Bob'],
      [3, 'Charlie'],
      [4, 'Diana (no orders)'],
    ],
  }

  const rightTable = data?.rightTable || {
    name: 'orders',
    rows: [
      [101, 1, '$77.50'],
      [102, 2, '$45.00'],
      [103, 1, '$119.98'],
      [104, 99, '$29.99 (guest)'],
    ],
  }

  // Compute joined preview rows based on selectedType
  const getJoinedRows = () => {
    if (selectedType === 'INNER') {
      return [
        ['1', 'Alice', '101', '$77.50', 'Matched on customer_id = 1'],
        ['1', 'Alice', '103', '$119.98', 'Matched on customer_id = 1'],
        ['2', 'Bob', '102', '$45.00', 'Matched on customer_id = 2'],
      ]
    }
    if (selectedType === 'LEFT') {
      return [
        ['1', 'Alice', '101', '$77.50', 'Matched'],
        ['1', 'Alice', '103', '$119.98', 'Matched'],
        ['2', 'Bob', '102', '$45.00', 'Matched'],
        ['3', 'Charlie', 'NULL', 'NULL', 'Left-preserved (No order)'],
        ['4', 'Diana', 'NULL', 'NULL', 'Left-preserved (No order)'],
      ]
    }
    if (selectedType === 'RIGHT') {
      return [
        ['1', 'Alice', '101', '$77.50', 'Matched'],
        ['1', 'Alice', '103', '$119.98', 'Matched'],
        ['2', 'Bob', '102', '$45.00', 'Matched'],
        ['NULL', 'NULL', '104', '$29.99', 'Right-preserved (guest order)'],
      ]
    }
    return [
      ['1', 'Alice', '101', '$77.50', 'Cartesian Product'],
      ['1', 'Alice', '102', '$45.00', 'Cartesian Product'],
      ['...', '...', '...', '...', 'Total 16 combinations (4 x 4)'],
    ]
  }

  const joinedRows = getJoinedRows()

  return (
    <div className="h-full flex flex-col p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
      {/* Header and Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <GitMerge size={15} />
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--text)]">Relational JOIN Visualizer</div>
            <div className="text-[11px] text-[var(--text-muted)]">
              Matching keys on: <code className="text-indigo-400 font-mono">customers.id = orders.customer_id</code>
            </div>
          </div>
        </div>

        {/* JOIN Type Selector */}
        <div className="flex items-center gap-1 bg-[var(--bg-alt)] p-1 rounded-lg border border-[var(--border)]">
          {(['INNER', 'LEFT', 'RIGHT', 'CROSS'] as const).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2 py-1 rounded text-[11px] font-bold font-mono transition-all ${
                selectedType === type
                  ? 'bg-indigo-500 text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Representation */}
      <div className="grid grid-cols-2 gap-3 mb-3 flex-shrink-0">
        <div className="p-2.5 rounded-lg bg-[var(--bg-alt)] border border-[var(--border)] text-xs">
          <div className="text-emerald-400 font-mono font-bold text-[11px] mb-1 flex items-center gap-1">
            <span>Table A: {leftTable.name}</span>
          </div>
          <div className="space-y-1 font-mono text-[10px] text-[var(--text-muted)]">
            {leftTable.rows.map((r, i) => (
              <div key={i} className="flex justify-between px-1.5 py-0.5 rounded bg-[var(--surface)]">
                <span>id: {r[0]}</span>
                <span>{r[1]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[var(--bg-alt)] border border-[var(--border)] text-xs">
          <div className="text-cyan-400 font-mono font-bold text-[11px] mb-1 flex items-center gap-1">
            <span>Table B: {rightTable.name}</span>
          </div>
          <div className="space-y-1 font-mono text-[10px] text-[var(--text-muted)]">
            {rightTable.rows.map((r, i) => (
              <div key={i} className="flex justify-between px-1.5 py-0.5 rounded bg-[var(--surface)]">
                <span>order #{r[0]} (cust #{r[1]})</span>
                <span>{r[2]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resulting Joined Table */}
      <div className="flex-1 overflow-auto border border-[var(--border)] rounded-lg bg-[var(--bg-alt)]">
        <div className="p-2 bg-[var(--surface)] border-b border-[var(--border)] text-[11px] font-bold text-indigo-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ArrowRight size={12} /> {selectedType} JOIN Result Set
          </span>
          <span className="text-[10px] text-[var(--text-dim)] font-mono">
            {joinedRows.length} rows produced
          </span>
        </div>
        <table className="w-full text-left font-mono text-[11px]">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface)]/50 text-[10px] text-[var(--text-dim)]">
              <th className="px-2.5 py-1.5">cust_id</th>
              <th className="px-2.5 py-1.5">name</th>
              <th className="px-2.5 py-1.5">order_id</th>
              <th className="px-2.5 py-1.5">total</th>
              <th className="px-2.5 py-1.5">match_reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {joinedRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-indigo-500/5">
                <td className="px-2.5 py-1 font-bold text-emerald-400">{row[0]}</td>
                <td className="px-2.5 py-1">{row[1]}</td>
                <td className="px-2.5 py-1 font-bold text-cyan-400">{row[2]}</td>
                <td className="px-2.5 py-1">{row[3]}</td>
                <td className="px-2.5 py-1 text-[10px] text-[var(--text-dim)] italic">{row[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

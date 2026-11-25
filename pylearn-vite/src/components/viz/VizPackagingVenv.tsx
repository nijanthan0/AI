'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, ShieldCheck, Box, Zap, FolderTree, Terminal } from 'lucide-react'

interface Props {
  data?: any
}

export default function VizPackagingVenv({ data }: Props) {
  const [tab, setTab] = useState<'venv' | 'tools' | 'pyproject'>('venv')

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Package size={15} className="text-[#38bdf8]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            PACKAGING & VIRTUAL ENVIRONMENTS
          </span>
        </div>
        <div className="flex items-center gap-1">
          {(['venv', 'tools', 'pyproject'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border border-black transition-all ${
                tab === t ? 'bg-[#38bdf8] text-black font-black' : 'bg-[#22232e] text-zinc-400'
              }`}
            >
              {t === 'venv' && '1. Isolated .venv'}
              {t === 'tools' && '2. Pip vs uv vs Poetry'}
              {t === 'pyproject' && '3. pyproject.toml'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Virtual Environments (Isolation) */}
      {tab === 'venv' && (
        <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Global Python (Dirty) */}
            <div className="p-2.5 rounded-xl border-2 border-[#ef4444]/60 bg-[#ef4444]/10 flex flex-col justify-between">
              <div>
                <span className="text-[#ef4444] font-black text-xs">⚠️ System Global Python</span>
                <p className="text-[10px] text-zinc-400 mt-1">
                  All projects share same site-packages. Project A needs django==4.2, Project B needs django==5.1 ➔ Dependency Conflict Crash!
                </p>
              </div>
              <div className="text-[10px] text-[#ef4444] font-mono mt-2 bg-black/40 p-1.5 rounded">
                /usr/local/lib/python3.12/site-packages
              </div>
            </div>

            {/* Isolated .venv (Clean) */}
            <div className="p-2.5 rounded-xl border-2 border-[#22c55e] bg-[#22c55e]/10 flex flex-col justify-between">
              <div>
                <span className="text-[#22c55e] font-black text-xs">✅ Isolated .venv per Project</span>
                <p className="text-[10px] text-zinc-300 mt-1">
                  Dedicated sandbox per workspace. Python binary and libraries completely isolated from OS. Zero conflicts!
                </p>
              </div>
              <div className="text-[10px] text-[#22c55e] font-mono mt-2 bg-black/40 p-1.5 rounded">
                my_project/.venv/bin/python
              </div>
            </div>
          </div>

          <div className="bg-[#181926] p-2.5 rounded-xl border border-zinc-700 text-[11px]">
            <span className="text-[#a3e635] font-black">Standard CLI Commands:</span><br />
            <span className="text-zinc-400 font-mono">
              python3 -m venv .venv &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Create sandbox<br />
              source .venv/bin/activate &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Activate on macOS/Linux<br />
              .venv\Scripts\activate.bat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Activate on Windows
            </span>
          </div>
        </div>
      )}

      {/* Tab 2: Package Managers Comparison */}
      {tab === 'tools' && (
        <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-xl bg-[#1a1b2a] border border-zinc-700">
              <span className="text-white font-black text-xs">pip</span>
              <div className="text-[10px] text-[#facc15] font-bold mt-0.5">Built-in Default</div>
              <p className="text-[10px] text-zinc-400 mt-1">Standard installer for PyPI. Flat requirements.txt format.</p>
            </div>

            <div className="p-2 rounded-xl bg-[#1a1b2a] border-2 border-[#a3e635]">
              <span className="text-[#a3e635] font-black text-xs">uv (Astral)</span>
              <div className="text-[10px] text-[#a3e635] font-bold mt-0.5">Rust-Powered (10-100x Faster)</div>
              <p className="text-[10px] text-zinc-300 mt-1">Blazing fast drop-in pip alternative with global cache & lockfile.</p>
            </div>

            <div className="p-2 rounded-xl bg-[#1a1b2a] border border-zinc-700">
              <span className="text-[#38bdf8] font-black text-xs">Poetry</span>
              <div className="text-[10px] text-[#38bdf8] font-bold mt-0.5">Deterministic Packaging</div>
              <p className="text-[10px] text-zinc-400 mt-1">Dependency resolution engine with poetry.lock reproducibility.</p>
            </div>
          </div>

          <div className="bg-[#181926] p-2 rounded-lg border border-zinc-700 text-[10px] text-zinc-300">
            💡 <strong className="text-white">Modern Industry Standard:</strong> Use <code className="text-[#a3e635]">uv pip install</code> or <code className="text-[#a3e635]">uv venv</code> for near-instant installation across CI/CD and local environments.
          </div>
        </div>
      )}

      {/* Tab 3: pyproject.toml Anatomy */}
      {tab === 'pyproject' && (
        <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-2">
          <div className="bg-black/60 p-2.5 rounded-lg border border-zinc-800 text-[11px] font-mono leading-relaxed overflow-x-auto">
            <span className="text-[#c084fc]">[project]</span><br />
            name = <span className="text-[#a3e635]">"payment-microservice"</span><br />
            version = <span className="text-[#a3e635]">"1.0.0"</span><br />
            dependencies = [<br />
            &nbsp;&nbsp;<span className="text-[#a3e635]">"fastapi&gt;=0.110.0"</span>,<br />
            &nbsp;&nbsp;<span className="text-[#a3e635]">"pydantic&gt;=2.0"</span>,<br />
            &nbsp;&nbsp;<span className="text-[#a3e635]">"uvicorn[standard]"</span><br />
            ]<br />
            <br />
            <span className="text-[#c084fc]">[tool.ruff]</span> &nbsp;&nbsp;<span className="text-zinc-500"># Unified linter & formatter configuration</span><br />
            line-length = 88
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import {
  Package,
  Terminal,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  Play
} from 'lucide-react'

interface Props {
  data?: any
}

type ToolKey = 'pip' | 'poetry' | 'conda' | 'compare'

interface ToolSpec {
  name: string
  tagline: string
  badge: string
  badgeBg: string
  summary: string
  commands: {
    label: string
    cmd: string
    output: string
  }[]
  pros: string[]
  cons: string[]
  bestFor: string
}

const TOOLS: Record<'pip' | 'poetry' | 'conda', ToolSpec> = {
  pip: {
    name: 'pip + venv',
    tagline: 'Built-in Standard Installer',
    badge: 'DEFAULT',
    badgeBg: 'bg-[#facc15] text-black',
    summary:
      'Ships with Python. Installs pure Python wheels from PyPI into whichever .venv is currently active.',
    commands: [
      {
        label: '1. Create & activate venv',
        cmd: 'python3.12 -m venv .venv && source .venv/bin/activate',
        output: '(.venv) $ # Isolated Python 3.12 environment active'
      },
      {
        label: '2. Install packages',
        cmd: 'pip install fastapi uvicorn',
        output: 'Successfully installed fastapi-0.115.0 uvicorn-0.30.6'
      },
      {
        label: '3. Freeze dependencies',
        cmd: 'pip freeze > requirements.txt',
        output: '# Wrote 14 pinned packages to requirements.txt'
      },
      {
        label: '4. Reproduce elsewhere',
        cmd: 'pip install -r requirements.txt',
        output: 'Requirement already satisfied / Installed 14 packages'
      }
    ],
    pros: [
      'Pre-installed with Python — zero extra setup',
      'Minimal, fast, and universal in Dockerfiles & CI',
      'Works seamlessly with standard .venv'
    ],
    cons: [
      'Does NOT manage Python versions or create venvs by itself',
      'requirements.txt mixes top-level & transitive deps',
      'Weaker lockfile determinism vs Poetry'
    ],
    bestFor: 'Quick scripts, Docker containers, & lightweight projects'
  },
  poetry: {
    name: 'Poetry',
    tagline: 'Deterministic App & Library Manager',
    badge: 'LOCKFILE PRO',
    badgeBg: 'bg-[#38bdf8] text-black',
    summary:
      'Manages virtualenvs, pyproject.toml, and a strict poetry.lock file so every teammate gets identical sub-dependencies.',
    commands: [
      {
        label: '1. Initialize project',
        cmd: 'poetry init -n',
        output: 'Created pyproject.toml in current directory'
      },
      {
        label: '2. Add package + lock',
        cmd: 'poetry add fastapi uvicorn',
        output: 'Creating virtualenv my-app-py3.12... Writing poetry.lock'
      },
      {
        label: '3. Run inside managed venv',
        cmd: 'poetry run python main.py',
        output: 'INFO: Uvicorn running on http://127.0.0.1:8000'
      },
      {
        label: '4. Install exact lockfile',
        cmd: 'poetry install --no-root',
        output: 'Installing dependencies from lock file: 14 packages'
      }
    ],
    pros: [
      'Deterministic poetry.lock guarantees reproducible builds',
      'Auto-creates & manages .venv behind the scenes',
      'Built-in packaging & PyPI publishing (poetry publish)'
    ],
    cons: [
      'Requires separate install (e.g. pipx install poetry)',
      'Dependency solver can be slow on large ML trees',
      'Only manages Python packages (not CUDA/C++ libs)'
    ],
    bestFor: 'Production web APIs, backend services, & PyPI libraries'
  },
  conda: {
    name: 'Conda',
    tagline: 'Cross-Language & Binary Ecosystem',
    badge: 'DATA & ML',
    badgeBg: 'bg-[#a3e635] text-black',
    summary:
      'Language-agnostic manager that installs specific Python versions alongside compiled C/C++, R, and CUDA GPU binaries.',
    commands: [
      {
        label: '1. Create env with Python 3.12',
        cmd: 'conda create -n ml_env python=3.12 -y',
        output: 'done. To activate: conda activate ml_env'
      },
      {
        label: '2. Activate environment',
        cmd: 'conda activate ml_env',
        output: '(ml_env) $ # Conda environment active'
      },
      {
        label: '3. Install binary/GPU stack',
        cmd: 'conda install -c conda-forge numpy pytorch',
        output: 'Downloading and Extracting Packages: pytorch, libcublas...'
      },
      {
        label: '4. Export environment spec',
        cmd: 'conda env export > environment.yml',
        output: '# Exported Python + system binary spec to environment.yml'
      }
    ],
    pros: [
      'Installs non-Python system libs (CUDA, cuDNN, GDAL, FFmpeg)',
      'Can install & switch Python versions per environment directly',
      'Gold standard for complex scientific & GPU computing'
    ],
    cons: [
      'Heavy disk footprint (use Miniconda/Mamba instead of full Anaconda)',
      'Slower dependency solver on large environments',
      'Mixing conda install & pip install carelessly can break envs'
    ],
    bestFor: 'Data Science, Machine Learning, PyTorch/CUDA, & Scientific stacks'
  }
}

export default function VizPackageManagers({ data }: Props) {
  const [activeTab, setActiveTab] = useState<ToolKey>('pip')
  const [selectedCmdIdx, setSelectedCmdIdx] = useState<number>(0)
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null)

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd)
    setCopiedCmd(cmd)
    setTimeout(() => setCopiedCmd(null), 1500)
  }

  const handleSelectTool = (tool: ToolKey) => {
    setActiveTab(tool)
    setSelectedCmdIdx(0)
  }

  const currentTool = activeTab !== 'compare' ? TOOLS[activeTab] : null
  const activeCmd = currentTool ? currentTool.commands[selectedCmdIdx] || currentTool.commands[0] : null

  return (
    <div className="flex flex-col h-full text-xs font-mono gap-2.5 select-none overflow-y-auto pr-1">
      {/* Header & Tool Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Package size={15} className="text-[#facc15]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            PIP vs POETRY vs CONDA
          </span>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {([
            { key: 'pip', label: '1. pip', activeBg: 'bg-[#facc15] text-black' },
            { key: 'poetry', label: '2. Poetry', activeBg: 'bg-[#38bdf8] text-black' },
            { key: 'conda', label: '3. Conda', activeBg: 'bg-[#a3e635] text-black' },
            { key: 'compare', label: '📊 Compare All', activeBg: 'bg-[#f472b6] text-black' }
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => handleSelectTool(t.key)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border-2 transition-all ${
                activeTab === t.key
                  ? `${t.activeBg} border-black font-black shadow-brutal-sm -translate-y-0.5`
                  : 'bg-[#22232e] text-zinc-400 border-zinc-700 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Individual Tool Deep Dive */}
      {currentTool && activeCmd && (
        <>
          {/* Summary Banner */}
          <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">{currentTool.name}</span>
                <span className="text-[10px] text-zinc-400">— {currentTool.tagline}</span>
              </div>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded border border-black ${currentTool.badgeBg}`}>
                {currentTool.badge}
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
              {currentTool.summary}
            </p>
            <div className="text-[10px] text-[#facc15] pt-0.5">
              <strong>Best for:</strong> <span className="text-zinc-300 font-sans">{currentTool.bestFor}</span>
            </div>
          </div>

          {/* Interactive Workflow Commands */}
          <div className="bg-[#181922] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Terminal size={12} className="text-[#a3e635]" />
                <span>How to Use (Click a step to inspect &amp; copy):</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {currentTool.commands.map((c, idx) => {
                const isSel = idx === selectedCmdIdx
                return (
                  <button
                    key={c.label}
                    onClick={() => setSelectedCmdIdx(idx)}
                    className={`p-2 rounded-lg border-2 text-left transition-all flex flex-col gap-1 ${
                      isSel
                        ? 'bg-[#25283a] border-[#a3e635] shadow-brutal-xs'
                        : 'bg-[#12131a] border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-zinc-300">{c.label}</span>
                    <code className="text-[10px] text-[#38bdf8] break-all leading-snug">
                      {c.cmd}
                    </code>
                  </button>
                )
              })}
            </div>

            {/* Simulated Terminal Preview for Selected Command */}
            <div className="bg-[#0d0e15] border-2 border-black rounded-lg p-2.5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] text-white break-all">
                  <span className="text-[#a3e635] font-bold mr-1.5">$</span>
                  <span className="text-[#facc15] font-bold">{activeCmd.cmd}</span>
                </div>
                <button
                  onClick={() => handleCopy(activeCmd.cmd)}
                  className="flex items-center gap-1 px-2 py-0.5 bg-[#27272a] hover:bg-[#3f3f46] text-white text-[10px] font-bold rounded border border-black shrink-0"
                >
                  {copiedCmd === activeCmd.cmd ? <Check size={11} className="text-[#a3e635]" /> : <Copy size={11} />}
                  <span>{copiedCmd === activeCmd.cmd ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
              <div className="text-[10px] text-zinc-400 pl-3 border-l-2 border-zinc-800">
                {activeCmd.output}
              </div>
            </div>
          </div>

          {/* Pros & Cons Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-[#142918]/70 border-2 border-[#22c55e]/60 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[#4ade80] font-black text-[11px]">
                <CheckCircle2 size={13} />
                <span>PROS</span>
              </div>
              <ul className="space-y-1 text-[10px] text-zinc-200 font-sans">
                {currentTool.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#4ade80] font-bold">+</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded-xl bg-[#3b1d1d]/70 border-2 border-[#ef4444]/60 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[#f87171] font-black text-[11px]">
                <AlertTriangle size={13} />
                <span>CONS</span>
              </div>
              <ul className="space-y-1 text-[10px] text-zinc-200 font-sans">
                {currentTool.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#f87171] font-bold">−</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Side-by-Side Comparison Matrix */}
      {activeTab === 'compare' && (
        <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-xs font-black text-white">
            <Layers size={14} className="text-[#f472b6]" />
            <span>Key Differences at a Glance</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b-2 border-black bg-[#181926] text-zinc-300">
                  <th className="p-2 font-black">Feature</th>
                  <th className="p-2 font-black text-[#facc15]">pip + venv</th>
                  <th className="p-2 font-black text-[#38bdf8]">Poetry</th>
                  <th className="p-2 font-black text-[#a3e635]">Conda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300 font-sans">
                <tr>
                  <td className="p-2 font-bold text-white font-mono">Package Source</td>
                  <td className="p-2">PyPI</td>
                  <td className="p-2">PyPI</td>
                  <td className="p-2">Conda channels + PyPI</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-white font-mono">Built-in Venv?</td>
                  <td className="p-2 text-[#fbbf24]">No (pair w/ venv)</td>
                  <td className="p-2 text-[#4ade80]">Yes (Automatic)</td>
                  <td className="p-2 text-[#4ade80]">Yes (Automatic)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-white font-mono">Manages Python Ver?</td>
                  <td className="p-2 text-[#f87171]">No</td>
                  <td className="p-2 text-[#fbbf24]">Uses installed Python</td>
                  <td className="p-2 text-[#4ade80]">Yes (python=3.12)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-white font-mono">C / CUDA Binaries?</td>
                  <td className="p-2 text-[#f87171]">Python wheels only</td>
                  <td className="p-2 text-[#f87171]">Python wheels only</td>
                  <td className="p-2 text-[#4ade80]">Yes (Full system libs)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-white font-mono">Lockfile Format</td>
                  <td className="p-2">requirements.txt</td>
                  <td className="p-2 text-[#4ade80]">poetry.lock (Strict)</td>
                  <td className="p-2">environment.yml</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-white font-mono">Best Use Case</td>
                  <td className="p-2">Scripts &amp; Docker</td>
                  <td className="p-2">Production APIs &amp; Libs</td>
                  <td className="p-2">ML, Data Science &amp; GPU</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

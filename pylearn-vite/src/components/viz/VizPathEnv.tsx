'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'

interface Props {
  data?: any
}

interface PathEntry {
  dir: string
  files: string[]
}

export default function VizPathEnv({ data }: Props) {
  const [cmd, setCmd] = useState<string>('python3')
  const [osType, setOsType] = useState<'mac_linux' | 'windows'>('mac_linux')

  const PATH_ENTRIES_UNIX: PathEntry[] = [
    { dir: '/opt/homebrew/bin', files: ['git', 'node', 'brew', 'docker', 'uv'] },
    { dir: '/Library/Frameworks/Python.framework/Versions/3.12/bin', files: ['python3', 'python', 'python3.12', 'pip3', 'pip', 'idle3'] },
    { dir: '/usr/local/bin', files: ['docker', 'uv', 'poetry'] },
    { dir: '/usr/bin', files: ['curl', 'tar', 'which', 'git'] },
    { dir: '~/.local/bin', files: ['poetry', 'ruff', 'pipx'] },
  ]

  const PATH_ENTRIES_WIN: PathEntry[] = [
    { dir: 'C:\\Program Files\\Python312\\Scripts', files: ['pip.exe', 'pip3.exe', 'uv.exe', 'poetry.exe', 'pytest.exe', 'ruff.exe'] },
    { dir: 'C:\\Program Files\\Python312', files: ['python.exe', 'python3.exe', 'pythonw.exe', 'py.exe'] },
    { dir: 'C:\\Program Files\\Git\\cmd', files: ['git.exe'] },
    { dir: 'C:\\Program Files\\Docker\\Docker\\resources\\bin', files: ['docker.exe', 'docker-compose.exe'] },
    { dir: 'C:\\Windows\\system32', files: ['cmd.exe', 'powershell.exe', 'notepad.exe', 'curl.exe'] },
  ]

  const activePaths = osType === 'mac_linux' ? PATH_ENTRIES_UNIX : PATH_ENTRIES_WIN

  // Determine which directory contains the command
  const findMatch = () => {
    const raw = cmd.trim().toLowerCase()
    if (!raw) return null

    for (let i = 0; i < activePaths.length; i++) {
      const entry = activePaths[i]
      for (const file of entry.files) {
        const fileLower = file.toLowerCase()
        const baseFile = fileLower.replace(/\.exe$/i, '')

        // Check if raw matches exact file or file without .exe extension
        if (
          raw === fileLower ||
          raw === baseFile ||
          (raw === 'python' && fileLower.startsWith('python')) ||
          (raw === 'python3' && (fileLower === 'python3.exe' || fileLower === 'python.exe' || fileLower === 'python3')) ||
          (raw === 'pip' && fileLower.startsWith('pip')) ||
          (raw === 'pip3' && fileLower.startsWith('pip'))
        ) {
          const separator = osType === 'windows' ? '\\' : '/'
          const cleanDir = entry.dir.replace(/[\\/]+$/, '')
          return {
            index: i,
            dir: entry.dir,
            matchedFile: file,
            fullPath: `${cleanDir}${separator}${file}`
          }
        }
      }
    }
    return null
  }

  const match = findMatch()

  const PRESETS = ['python', 'python3', 'pip3', 'uv', 'poetry', 'docker', 'fake_cmd']

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Terminal size={15} className="text-[#a3e635]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            SYSTEM $PATH RESOLUTION SIMULATOR
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOsType('mac_linux')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold border-2 transition-all ${
              osType === 'mac_linux'
                ? 'bg-[#a3e635] text-black border-black font-black shadow-brutal-sm'
                : 'bg-[#22232e] text-zinc-400 border-zinc-700'
            }`}
          >
            macOS / Linux ($PATH)
          </button>
          <button
            onClick={() => setOsType('windows')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold border-2 transition-all ${
              osType === 'windows'
                ? 'bg-[#38bdf8] text-black border-black font-black shadow-brutal-sm'
                : 'bg-[#22232e] text-zinc-400 border-zinc-700'
            }`}
          >
            Windows (%PATH%)
          </button>
        </div>
      </div>

      {/* Terminal Input Bar & Presets */}
      <div className="bg-[#12131c] p-3 rounded-xl border-2 border-black flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-zinc-700">
          <span className="text-[#22c55e] font-bold">
            {osType === 'windows' ? 'PS C:\\Users\\Developer>' : '$'}
          </span>
          <input
            type="text"
            value={cmd}
            onChange={(e) => setCmd(e.target.value.trim())}
            placeholder={osType === 'windows' ? "Type command (e.g. python, pip3)..." : "Type command (e.g. python3, uv)..."}
            className="bg-transparent text-white font-mono text-xs outline-none flex-1 font-bold"
          />
          <span className="text-[10px] text-zinc-500">Press enter</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-zinc-400 font-bold">Try command:</span>
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setCmd(p)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                cmd === p
                  ? 'bg-[#facc15] text-black border-black font-black shadow-brutal-sm'
                  : 'bg-[#1e1f2e] text-zinc-300 border-zinc-700 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Step-by-Step Path Directory Search */}
      <div className="bg-[#181926] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-1.5">
        <div className="text-[10px] text-zinc-400 font-bold uppercase mb-1">
          Searching {osType === 'windows' ? '%PATH%' : '$PATH'} directories in priority order:
        </div>

        {activePaths.map((entry, idx) => {
          const isMatchedHere = match && match.index === idx
          const isSearchedBefore = match ? idx < match.index : true

          return (
            <div
              key={idx}
              className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                isMatchedHere
                  ? 'bg-[#22c55e]/20 border-[#22c55e] text-white'
                  : isSearchedBefore
                  ? 'bg-[#12131c] border-zinc-800 text-zinc-500 opacity-60'
                  : 'bg-[#12131c] border-zinc-800 text-zinc-600 opacity-40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 font-mono">[{idx + 1}]</span>
                <span className="font-mono text-xs">{entry.dir}</span>
              </div>

              {isMatchedHere ? (
                <span className="flex items-center gap-1 text-[#22c55e] font-black text-[10px] bg-black/40 px-2 py-0.5 rounded border border-[#22c55e]">
                  <CheckCircle2 size={12} />
                  MATCH FOUND: {match.matchedFile}
                </span>
              ) : isSearchedBefore ? (
                <span className="flex items-center gap-1 text-zinc-500 text-[10px]">
                  <XCircle size={11} />
                  Not in directory
                </span>
              ) : (
                <span className="text-[10px] text-zinc-600">Skipped (already resolved)</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Terminal Output Result */}
      <div className={`p-2.5 rounded-xl border-2 flex items-center justify-between ${
        match ? 'bg-[#22c55e]/15 border-[#22c55e] text-white' : 'bg-[#ef4444]/15 border-[#ef4444] text-white'
      }`}>
        <div className="flex items-center gap-2">
          {match ? <CheckCircle2 size={16} className="text-[#22c55e]" /> : <XCircle size={16} className="text-[#ef4444]" />}
          <div>
            <div className="text-[10px] uppercase font-bold text-zinc-400">
              {osType === 'windows' ? 'PowerShell / CMD Execution Engine' : 'Terminal Shell Resolution'}
            </div>
            <div className="font-mono text-xs font-bold">
              {match
                ? `Resolved executable binary at: ${match.fullPath}`
                : osType === 'windows'
                ? `'${cmd}' is not recognized as an internal or external command, operable program or batch file.`
                : `zsh: command not found: ${cmd} (Add directory containing executable to PATH)`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

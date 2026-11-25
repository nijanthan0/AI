'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Terminal,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Cpu,
  ArrowRight,
  FolderTree,
  CheckCircle2,
  Zap,
  ShieldCheck
} from 'lucide-react'

interface Props {
  data?: any
}

interface StepCommand {
  step: number
  title: string
  action: string
  cmd: string
  explanation: string
  simulatedOutput: string[]
  envEffect?: string
}

interface OSConfig {
  osName: string
  icon: string
  badgeColor: string
  prompt: string
  activatedPrompt: string
  pathVar: string
  pathSeparator: string
  steps: StepCommand[]
  beforePath: string[]
  afterPath: string[]
}

export default function VizTerminalSetup({ data }: Props) {
  const [selectedOS, setSelectedOS] = useState<'mac' | 'win' | 'linux'>('mac')
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0)
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null)
  const [history, setHistory] = useState<{ prompt: string; cmd: string; output: string[] }[]>([])
  const [isEnvActive, setIsEnvActive] = useState<boolean>(false)

  const CONFIGS: Record<'mac' | 'win' | 'linux', OSConfig> = {
    mac: {
      osName: 'macOS (Homebrew & zsh)',
      icon: '🍏',
      badgeColor: '#38bdf8',
      prompt: '$',
      activatedPrompt: '(.venv) $',
      pathVar: '$PATH',
      pathSeparator: ':',
      steps: [
        {
          step: 1,
          title: '1. Install Python 3.12 via Terminal',
          action: 'brew install python@3.12',
          cmd: 'brew install python@3.12',
          explanation: 'Homebrew downloads and links Python 3.12 into /opt/homebrew/bin with pip3 bundled automatically.',
          simulatedOutput: [
            '==> Downloading https://ghcr.io/v2/homebrew/core/python/3.12.3',
            '==> Installing python@3.12',
            '🍺  /opt/homebrew/Cellar/python@3.12/3.12.3: 3,241 files, 64.8MB',
            '==> Linked python3.12, python3, and pip3 to /opt/homebrew/bin'
          ]
        },
        {
          step: 2,
          title: '2. Verify Installation & Path',
          action: 'python3.12 --version && which python3.12',
          cmd: 'python3.12 --version && which python3.12',
          explanation: 'Confirms that Python 3.12 is active and points to Homebrew rather than the older system python3 (e.g. 3.9).',
          simulatedOutput: [
            'Python 3.12.3',
            '/opt/homebrew/bin/python3.12'
          ]
        },
        {
          step: 3,
          title: '3. Create Isolated Environment (.venv)',
          action: 'python3.12 -m venv .venv',
          cmd: 'python3.12 -m venv .venv',
          explanation: 'Explicitly invokes python3.12 so .venv uses 3.12 instead of an older default system python3.',
          simulatedOutput: [
            'Creating isolated virtual environment in ./my_project/.venv ...',
            '✓ Generated .venv/bin/python3.12',
            '✓ Generated .venv/lib/python3.12/site-packages'
          ]
        },
        {
          step: 4,
          title: '4. Activate & Auto-Set $PATH',
          action: 'source .venv/bin/activate',
          cmd: 'source .venv/bin/activate',
          explanation: 'Prepends .venv/bin to the front of $PATH so terminal commands default to the virtualenv interpreter.',
          simulatedOutput: [
            'Environment activated!',
            'PATH updated: /Users/developer/my_project/.venv/bin prepended to $PATH',
            'Current python3 ➔ /Users/developer/my_project/.venv/bin/python3'
          ],
          envEffect: 'Prepends .venv/bin/ to $PATH (Priority #1)'
        }
      ],
      beforePath: [
        '/opt/homebrew/bin',
        '/usr/local/bin',
        '/usr/bin',
        '/bin'
      ],
      afterPath: [
        '/Users/developer/my_project/.venv/bin  ⭐ (VENV ACTIVE)',
        '/opt/homebrew/bin',
        '/usr/local/bin',
        '/usr/bin',
        '/bin'
      ]
    },
    win: {
      osName: 'Windows 10/11 (winget / PowerShell)',
      icon: '🪟',
      badgeColor: '#38bdf8',
      prompt: 'PS C:\\Project>',
      activatedPrompt: '(.venv) PS C:\\Project>',
      pathVar: '%PATH%',
      pathSeparator: ';',
      steps: [
        {
          step: 1,
          title: '1. Install Python 3.12 via Terminal',
          action: 'winget install Python.Python.3.12',
          cmd: 'winget install Python.Python.3.12',
          explanation: 'Uses Windows Package Manager (winget) to install Python and automatically registers python.exe into system %PATH%.',
          simulatedOutput: [
            'Found Python 3.12 [Python.Python.3.12]',
            'Downloading https://www.python.org/ftp/python/3.12.3/python-3.12.3-amd64.exe',
            'Starting package install...',
            'Successfully installed: Python 3.12 (64-bit) with PATH registration'
          ]
        },
        {
          step: 2,
          title: '2. Verify Installation & Path',
          action: 'python --version; where.exe python',
          cmd: 'python --version; where.exe python',
          explanation: 'Confirms that python.exe and pip.exe are callable from any PowerShell terminal.',
          simulatedOutput: [
            'Python 3.12.3',
            'C:\\Program Files\\Python312\\python.exe',
            'C:\\Program Files\\Python312\\Scripts\\pip.exe'
          ]
        },
        {
          step: 3,
          title: '3. Create Isolated Environment (.venv)',
          action: 'python -m venv .venv',
          cmd: 'python -m venv .venv',
          explanation: 'Creates a clean virtual environment sandbox (.venv) with local Scripts and site-packages.',
          simulatedOutput: [
            'Creating virtual environment in C:\\Project\\.venv ...',
            '✓ Created .venv\\Scripts\\python.exe',
            '✓ Created .venv\\Lib\\site-packages'
          ]
        },
        {
          step: 4,
          title: '4. Activate & Auto-Set %PATH%',
          action: '.\\.venv\\Scripts\\Activate.ps1',
          cmd: '.\\.venv\\Scripts\\Activate.ps1',
          explanation: 'Prepends .venv\\Scripts to %PATH%. If PowerShell blocks scripts, run: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser (or use .\\.venv\\Scripts\\activate.bat in CMD).',
          simulatedOutput: [
            'Virtualenv activated!',
            '%PATH% updated: C:\\Project\\.venv\\Scripts injected at priority #1',
            'Where python ➔ C:\\Project\\.venv\\Scripts\\python.exe'
          ],
          envEffect: 'Prepends C:\\Project\\.venv\\Scripts\\ to %PATH%'
        }
      ],
      beforePath: [
        'C:\\Program Files\\Python312\\Scripts',
        'C:\\Program Files\\Python312',
        'C:\\Windows\\system32',
        'C:\\Windows'
      ],
      afterPath: [
        'C:\\Project\\.venv\\Scripts  ⭐ (VENV ACTIVE)',
        'C:\\Program Files\\Python312\\Scripts',
        'C:\\Program Files\\Python312',
        'C:\\Windows\\system32',
        'C:\\Windows'
      ]
    },
    linux: {
      osName: 'Linux (Ubuntu / Debian / apt)',
      icon: '🐧',
      badgeColor: '#a3e635',
      prompt: 'dev@ubuntu:~$',
      activatedPrompt: '(.venv) dev@ubuntu:~$',
      pathVar: '$PATH',
      pathSeparator: ':',
      steps: [
        {
          step: 1,
          title: '1. Install Python 3.12 via Terminal',
          action: 'sudo apt update && sudo apt install -y python3.12 python3.12-venv python3-pip',
          cmd: 'sudo apt update && sudo apt install -y python3.12 python3.12-venv python3-pip',
          explanation: 'Installs Python 3.12 along with python3-venv (Ubuntu splits the venv package from core Python).',
          simulatedOutput: [
            'Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease',
            'Reading package lists... Done',
            'Setting up python3.12 (3.12.3-1) ...',
            'Setting up python3.12-venv ... Done'
          ]
        },
        {
          step: 2,
          title: '2. Verify Installation & Path',
          action: 'python3.12 --version && which python3.12',
          cmd: 'python3.12 --version && which python3.12',
          explanation: 'Checks the binary link in /usr/bin/python3.12.',
          simulatedOutput: [
            'Python 3.12.3',
            '/usr/bin/python3.12'
          ]
        },
        {
          step: 3,
          title: '3. Create Isolated Environment (.venv)',
          action: 'python3.12 -m venv .venv',
          cmd: 'python3.12 -m venv .venv',
          explanation: 'Creates isolated .venv sandbox directory without touching system-managed packages.',
          simulatedOutput: [
            'Creating isolated virtual environment in ./.venv ...',
            '✓ Created .venv/bin/python3.12',
            '✓ Created .venv/lib/python3.12/site-packages'
          ]
        },
        {
          step: 4,
          title: '4. Activate & Auto-Set $PATH',
          action: 'source .venv/bin/activate',
          cmd: 'source .venv/bin/activate',
          explanation: 'Prepends .venv/bin to front of $PATH, guaranteeing that pip install installs locally.',
          simulatedOutput: [
            'Virtualenv activated!',
            '$PATH updated: /home/dev/project/.venv/bin injected at front of $PATH',
            'which python ➔ /home/dev/project/.venv/bin/python'
          ],
          envEffect: 'Prepends .venv/bin/ to $PATH (Priority #1)'
        }
      ],
      beforePath: [
        '/usr/local/bin',
        '/usr/bin',
        '/bin'
      ],
      afterPath: [
        '/home/dev/project/.venv/bin  ⭐ (VENV ACTIVE)',
        '/usr/local/bin',
        '/usr/bin',
        '/bin'
      ]
    }
  }

  const currentOS = CONFIGS[selectedOS]
  const currentStep = currentOS.steps[currentStepIdx]

  // Copy command to clipboard
  const handleCopy = (command: string) => {
    navigator.clipboard.writeText(command)
    setCopiedCmd(command)
    setTimeout(() => setCopiedCmd(null), 2000)
  }

  // Simulate running command in live terminal
  const handleRunCommand = (step: StepCommand) => {
    const isActivating = step.step === 4
    const promptToUse = isEnvActive ? currentOS.activatedPrompt : currentOS.prompt

    setHistory((prev) => [
      ...prev,
      {
        prompt: promptToUse,
        cmd: step.cmd,
        output: step.simulatedOutput
      }
    ])

    if (isActivating) {
      setIsEnvActive(true)
    }

    if (currentStepIdx < currentOS.steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1)
    }
  }

  const resetTerminal = () => {
    setHistory([])
    setIsEnvActive(false)
    setCurrentStepIdx(0)
  }

  return (
    <div className="flex flex-col h-full text-xs font-mono space-y-3 select-none">
      {/* Top Banner: OS Selection Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#181926] p-2.5 rounded-xl border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Terminal size={15} className="text-[#a3e635]" />
          <span className="font-black text-white text-[11px] tracking-wide">
            TERMINAL PYTHON INSTALLER & $PATH MANAGER
          </span>
        </div>

        {/* OS Selector Tabs */}
        <div className="flex items-center gap-1.5">
          {(['mac', 'win', 'linux'] as const).map((osKey) => {
            const os = CONFIGS[osKey]
            const isSelected = selectedOS === osKey

            return (
              <button
                key={osKey}
                onClick={() => {
                  setSelectedOS(osKey)
                  resetTerminal()
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border-2 transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-[#a3e635] text-black border-black shadow-brutal-sm font-black -translate-y-0.5'
                    : 'bg-[#22232e] text-zinc-400 border-zinc-700 hover:text-white'
                }`}
              >
                <span>{os.icon}</span>
                <span>{osKey === 'mac' ? 'macOS' : osKey === 'win' ? 'Windows' : 'Linux'}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 4 Interactive Step Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {currentOS.steps.map((st, idx) => {
          const isSelected = currentStepIdx === idx
          const isDone = history.some((h) => h.cmd === st.cmd)

          return (
            <div
              key={st.step}
              onClick={() => setCurrentStepIdx(idx)}
              className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#25283a] border-[#a3e635] shadow-brutal-sm -translate-y-0.5'
                  : isDone
                  ? 'bg-[#181924] border-[#22c55e]/60 text-zinc-300'
                  : 'bg-[#181924] border-zinc-800 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border ${
                    isSelected ? 'bg-[#a3e635] text-black border-black' : 'bg-black/40 text-zinc-400 border-zinc-700'
                  }`}>
                    STEP {st.step}
                  </span>
                  {isDone && (
                    <span className="text-[#22c55e] text-[9px] font-bold flex items-center gap-0.5">
                      <Check size={10} /> DONE
                    </span>
                  )}
                </div>
                <div className="font-bold text-[11px] text-white leading-tight mt-1">
                  {st.step === 1 && 'Install Python'}
                  {st.step === 2 && 'Verify Version'}
                  {st.step === 3 && 'Create .venv'}
                  {st.step === 4 && 'Activate $PATH'}
                </div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-zinc-800">
                <code className="text-[9.5px] text-[#38bdf8] break-all leading-snug block">
                  {st.cmd}
                </code>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Terminal Shell Simulator */}
      <div className="bg-[#12131c] rounded-xl border-2 border-black shadow-brutal-sm flex flex-col flex-1 min-h-[200px] overflow-hidden">
        {/* Terminal Header */}
        <div className="h-8 px-3 bg-[#181920] border-b-2 border-black flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f87171] border border-black/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#facc15] border border-black/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] border border-black/40" />
            </div>
            <span className="text-[10px] text-zinc-300 font-mono font-bold">
              {currentOS.osName} — Terminal Shell
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isEnvActive && (
              <span className="text-[9px] bg-[#a3e635] text-black font-black px-2 py-0.5 rounded border border-black">
                (.venv) ACTIVE
              </span>
            )}
            <button
              onClick={resetTerminal}
              className="text-[9px] text-zinc-400 hover:text-white px-2 py-0.5 bg-[#27272a] rounded border border-zinc-700"
            >
              Clear Shell
            </button>
          </div>
        </div>

        {/* Terminal Screen Body */}
        <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] space-y-2 bg-black/60">
          {/* Welcome Info */}
          <div className="text-zinc-500 text-[10px]">
            # Select a step above and click [RUN IN TERMINAL] below to simulate execution:
          </div>

          {/* Historical Executed Commands */}
          {history.map((item, hIdx) => (
            <div key={hIdx} className="space-y-1">
              <div className="flex items-center gap-2 text-white">
                <span className="text-[#a3e635] font-bold">{item.prompt}</span>
                <span className="font-bold text-[#facc15]">{item.cmd}</span>
              </div>
              <div className="pl-3 text-zinc-300 text-[10px] space-y-0.5 border-l-2 border-zinc-800">
                {item.output.map((line, lIdx) => (
                  <div key={lIdx} className={line.includes('✓') || line.includes('Success') ? 'text-[#a3e635]' : ''}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Active Command Prompt Line */}
          <div className="flex items-center gap-2 text-white pt-1">
            <span className="text-[#a3e635] font-bold">
              {isEnvActive ? currentOS.activatedPrompt : currentOS.prompt}
            </span>
            <span className="text-white font-mono font-bold">{currentStep.cmd}</span>
            <span className="w-2 h-4 bg-[#a3e635] animate-pulse" />
          </div>
        </div>

        {/* Command Runner Toolbar Bar */}
        <div className="p-2.5 bg-[#181920] border-t-2 border-black flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <span className="text-[10px] text-zinc-400 uppercase font-bold shrink-0">Selected:</span>
            <code className="text-[#38bdf8] font-bold text-[11px] leading-snug break-all bg-black/50 px-2 py-1 rounded border border-zinc-800">
              {currentStep.cmd}
            </code>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopy(currentStep.cmd)}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-white text-[10px] font-bold rounded-lg border border-black shadow-brutal-sm"
              title="Copy command to clipboard"
            >
              {copiedCmd === currentStep.cmd ? <Check size={11} className="text-[#a3e635]" /> : <Copy size={11} />}
              <span>{copiedCmd === currentStep.cmd ? 'COPIED!' : 'COPY'}</span>
            </button>

            <button
              onClick={() => handleRunCommand(currentStep)}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#a3e635] hover:bg-[#84cc16] text-black text-xs font-black rounded-lg border-2 border-black shadow-brutal-sm hover:-translate-y-0.5 transition-all"
            >
              <Play size={12} />
              <span>RUN IN TERMINAL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual $PATH Transformation Diagram ("How Env Sets PATH") */}
      <div className="bg-[#181926] p-3 rounded-xl border-2 border-black shadow-brutal-sm flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderTree size={14} className="text-[#facc15]" />
            <span className="text-[10px] text-zinc-300 font-bold uppercase">
              How Virtualenv Activation Sets Your {currentOS.pathVar}
            </span>
          </div>
          <span className="text-[9px] bg-black/40 text-[#a3e635] font-bold px-2 py-0.5 rounded border border-[#a3e635]/40">
            {isEnvActive ? '✓ .venv/bin Injected at Priority #1' : 'Standard System PATH'}
          </span>
        </div>

        {/* Visual comparison of PATH before and after activation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
          {/* Before Activation */}
          <div className={`p-2 rounded-lg border transition-all ${
            !isEnvActive ? 'bg-[#12131c] border-zinc-700 text-zinc-300' : 'bg-[#12131c] border-zinc-800 text-zinc-500 opacity-60'
          }`}>
            <div className="font-bold mb-1 text-zinc-400">1. Before Activation (System Path):</div>
            <div className="space-y-0.5 font-mono text-[9px]">
              {currentOS.beforePath.map((p, i) => (
                <div key={i} className="truncate">[{i + 1}] {p}</div>
              ))}
            </div>
          </div>

          {/* After Activation */}
          <div className={`p-2 rounded-lg border-2 transition-all ${
            isEnvActive ? 'bg-[#22c55e]/15 border-[#22c55e] text-white shadow-brutal-sm' : 'bg-[#12131c] border-zinc-800 text-zinc-500 opacity-50'
          }`}>
            <div className="font-bold mb-1 text-[#22c55e]">2. After Running activate ({currentOS.pathVar}):</div>
            <div className="space-y-0.5 font-mono text-[9px]">
              {currentOS.afterPath.map((p, i) => (
                <div key={i} className={`truncate ${i === 0 ? 'text-[#a3e635] font-black' : ''}`}>
                  [{i + 1}] {p}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
          💡 <strong>The Magic of Activation:</strong> When you run <code className="text-white font-mono">{selectedOS === 'win' ? '.\\.venv\\Scripts\\Activate.ps1' : 'source .venv/bin/activate'}</code>, the script simply prepends your project’s local directory to the front of <code className="text-[#a3e635] font-mono">{currentOS.pathVar}</code>. When you type <code className="text-white font-mono">python</code>, your operating system immediately finds the local sandbox first!
        </p>
      </div>
    </div>
  )
}

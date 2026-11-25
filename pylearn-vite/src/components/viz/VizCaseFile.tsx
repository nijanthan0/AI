import React, { useState } from 'react'
import { ShieldAlert, FileText, CheckCircle2, Lock, Search, UserCheck, Terminal, AlertTriangle, Sparkles } from 'lucide-react'

export interface CaseClue {
  id: string | number
  title: string
  status: 'unlocked' | 'locked' | 'current'
  lead: string
  revealedInfo?: string
}

export interface CaseSuspect {
  name: string
  alias?: string
  status: 'cleared' | 'prime_suspect' | 'mastermind' | 'person_of_interest'
  notes: string
  avatarEmoji?: string
}

export interface CaseFileData {
  caseId: string
  caseName: string
  theme: 'cyber' | 'detective'
  stageNumber: number
  totalStages: number
  briefing: string
  clues: CaseClue[]
  suspects?: CaseSuspect[]
  rawEvidenceSnippet?: string
}

interface Props {
  data?: CaseFileData
}

export default function VizCaseFile({ data }: Props) {
  const [activeTab, setActiveTab] = useState<'briefing' | 'evidence' | 'suspects'>('briefing')

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center text-xs text-[var(--text-muted)]">
        No case file loaded.
      </div>
    )
  }

  const isCyber = data.theme === 'cyber'
  const accentColor = isCyber ? 'text-emerald-400' : 'text-amber-400'
  const accentBg = isCyber ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'

  return (
    <div className="h-full flex flex-col p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden font-sans">
      {/* Dossier Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${accentBg} ${accentColor}`}>
            {isCyber ? <Terminal size={16} /> : <ShieldAlert size={16} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.2 rounded border ${accentBg} ${accentColor}`}>
                {data.caseId}
              </span>
              <span className="text-xs font-bold text-[var(--text)]">{data.caseName}</span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">
              Investigation Phase {data.stageNumber} of {data.totalStages}
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[var(--bg-alt)] p-1 rounded-lg border border-[var(--border)]">
          <button
            onClick={() => setActiveTab('briefing')}
            className={`px-2 py-1 text-xs rounded transition-all ${
              activeTab === 'briefing' ? 'bg-[var(--surface)] text-[var(--text)] font-semibold shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Briefing
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-2 py-1 text-xs rounded transition-all ${
              activeTab === 'evidence' ? 'bg-[var(--surface)] text-[var(--text)] font-semibold shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Clues Tracker
          </button>
          {data.suspects && data.suspects.length > 0 && (
            <button
              onClick={() => setActiveTab('suspects')}
              className={`px-2 py-1 text-xs rounded transition-all ${
                activeTab === 'suspects' ? 'bg-[var(--surface)] text-[var(--text)] font-semibold shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              Suspects
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-1">
        {activeTab === 'briefing' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)]">
              <div className="text-xs font-bold text-[var(--text)] mb-1.5 flex items-center gap-1.5">
                <FileText size={13} className={accentColor} /> Official Mission Briefing
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {data.briefing}
              </p>
            </div>

            {data.rawEvidenceSnippet && (
              <div className="p-3 rounded-xl bg-[#11111b] border border-[#313244] font-mono text-[11px]">
                <div className="text-[10px] text-[#6c7086] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Terminal size={10} /> Extracted Evidence Stream
                </div>
                <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-48">
                  {data.rawEvidenceSnippet}
                </pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-[var(--text-muted)] mb-1">
              Case Evidence & Investigation Milestones:
            </div>
            {data.clues.map((clue, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all ${
                  clue.status === 'unlocked'
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : clue.status === 'current'
                    ? `${accentBg}`
                    : 'bg-[var(--bg-alt)] border-[var(--border)] opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {clue.status === 'unlocked' ? (
                      <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                    ) : clue.status === 'current' ? (
                      <Search size={14} className={`${accentColor} animate-pulse flex-shrink-0`} />
                    ) : (
                      <Lock size={14} className="text-[var(--text-dim)] flex-shrink-0" />
                    )}
                    <span className="text-xs font-bold text-[var(--text)]">
                      {clue.title}
                    </span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    clue.status === 'unlocked'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : clue.status === 'current'
                      ? 'bg-blue-500/20 text-blue-300 font-bold'
                      : 'bg-[var(--surface)] text-[var(--text-dim)]'
                  }`}>
                    {clue.status === 'unlocked' ? 'UNLOCKED' : clue.status === 'current' ? 'CURRENT OBJECTIVE' : 'LOCKED'}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] ml-5 leading-relaxed">
                  {clue.lead}
                </p>
                {clue.revealedInfo && clue.status === 'unlocked' && (
                  <div className="mt-2 ml-5 p-2 rounded bg-emerald-500/10 text-emerald-300 font-mono text-[10px] border border-emerald-500/20">
                    💡 Uncovered: {clue.revealedInfo}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'suspects' && data.suspects && (
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-[var(--text-muted)] mb-1">
              Identified Persons of Interest:
            </div>
            {data.suspects.map((suspect, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)] flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-xl flex-shrink-0 shadow-xs">
                  {suspect.avatarEmoji || '👤'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="font-bold text-xs text-[var(--text)] flex items-center gap-1.5">
                      <span>{suspect.name}</span>
                      {suspect.alias && (
                        <span className="text-[10px] text-cyan-400 font-mono font-normal">
                          "{suspect.alias}"
                        </span>
                      )}
                    </div>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold border ${
                      suspect.status === 'mastermind'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : suspect.status === 'prime_suspect'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : suspect.status === 'cleared'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                    }`}>
                      {suspect.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    {suspect.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

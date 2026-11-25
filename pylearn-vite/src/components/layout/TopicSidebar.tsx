'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Search,
  BookOpen,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  Layers,
  Code2,
  Cpu,
  Boxes,
  Terminal,
  ShieldAlert,
  FolderGit2,
  Database,
  Table,
  FileEdit,
  GitMerge,
  BarChart3,
  Network
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Slide, CourseMeta } from '@/lib/types'

interface Props {
  slides: Slide[]
  meta: CourseMeta
  currentSlide: number
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
  // Python Sections
  '1. Learn the Basics': <Code2 size={14} className="text-emerald-400" />,
  '2. Data Structures & Algorithms': <Layers size={14} className="text-amber-400" />,
  '3. Modules & Advanced Python': <Sparkles size={14} className="text-purple-400" />,
  '4. Object Oriented Programming': <Boxes size={14} className="text-rose-400" />,
  '5. Package Managers & Environments': <FolderGit2 size={14} className="text-cyan-400" />,
  '6. Static Typing & Code Quality': <ShieldAlert size={14} className="text-blue-400" />,
  '7. Concurrency & Performance': <Cpu size={14} className="text-orange-400" />,
  '8. Testing & Modern Frameworks': <Terminal size={14} className="text-pink-400" />,

  // SQL Sections
  '1. Introduction': <Database size={14} className="text-blue-400" />,
  '2. SQL Basics': <Table size={14} className="text-cyan-400" />,
  '3. Manipulating Data': <FileEdit size={14} className="text-amber-400" />,
  '4. Defining Tables': <Boxes size={14} className="text-emerald-400" />,
  '5. Multi-Table Queries': <GitMerge size={14} className="text-indigo-400" />,
  '6. Aggregate Functions': <BarChart3 size={14} className="text-purple-400" />,
  '7. Scalar Functions': <Sparkles size={14} className="text-rose-400" />,
  '8. Subqueries and CTEs': <Network size={14} className="text-orange-400" />,
  '9. Window Functions': <Layers size={14} className="text-teal-400" />,

  // Gamified Detective Mysteries
  'SQL Murder Mystery': <ShieldAlert size={14} className="text-amber-400" />,
  'Operation ShadowByte': <Terminal size={14} className="text-emerald-400" />,
}

const CATEGORY_COLORS: Record<string, string> = {
  basics: '#10b981',
  dsa: '#f59e0b',
  advanced: '#a855f7',
  oop: '#f43f5e',
  tooling: '#06b6d4',
  typing: '#3b82f6',
  concurrency: '#f97316',
  testing: '#ec4899',
  frameworks: '#8b5cf6',
  sql: '#3b82f6',
}

interface SlideItem {
  slide: Slide
  index: number
}

interface TopicGroup {
  topicName: string
  slides: SlideItem[]
}

interface SectionGroup {
  sectionName: string
  topics: TopicGroup[]
}

export default function TopicSidebar({ slides, meta, currentSlide }: Props) {
  const { setSlide, sidebarOpen, setSidebarOpen } = useAppStore()
  const [search, setSearch] = useState('')
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string | null>(null)

  // Track expanded state: all sections and subtopics default to COLLAPSED
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({})

  // Build tree: Section -> Topic -> Slides
  const tree: SectionGroup[] = useMemo(() => {
    const q = search.toLowerCase().trim()
    const sectionMap = new Map<string, Map<string, SlideItem[]>>()

    slides.forEach((slide, index) => {
      const matchSearch =
        !q ||
        slide.question.toLowerCase().includes(q) ||
        slide.tag.toLowerCase().includes(q) ||
        (slide.topic && slide.topic.toLowerCase().includes(q)) ||
        (slide.section && slide.section.toLowerCase().includes(q))

      const matchFilter =
        !selectedSectionFilter || slide.section === selectedSectionFilter

      if (!matchSearch || !matchFilter) return

      const sec = slide.section || 'General'
      const top = slide.topic || slide.tag || 'Overview'

      if (!sectionMap.has(sec)) sectionMap.set(sec, new Map())
      const topicMap = sectionMap.get(sec)!
      if (!topicMap.has(top)) topicMap.set(top, [])
      topicMap.get(top)!.push({ slide, index })
    })

    const result: SectionGroup[] = []
    sectionMap.forEach((topicMap, sectionName) => {
      const topics: TopicGroup[] = []
      topicMap.forEach((slidesList, topicName) => {
        topics.push({ topicName, slides: slidesList })
      })
      result.push({ sectionName, topics })
    })

    return result
  }, [slides, search, selectedSectionFilter])

  // Get all unique section names for top filter pills
  const allSections = useMemo(() => {
    const set = new Set<string>()
    slides.forEach((s) => s.section && set.add(s.section))
    return Array.from(set)
  }, [slides])

  const progressPercent = Math.round(((currentSlide + 1) / slides.length) * 100)

  // Section toggle logic
  const toggleSection = (secName: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [secName]: !prev[secName],
    }))
  }

  const isSectionExpanded = (secName: string) => {
    // When searching or filtering by a section pill, expand automatically
    if (search.trim().length > 0 || selectedSectionFilter) return true
    return Boolean(expandedSections[secName])
  }

  // Topic (subtopic) toggle logic
  const toggleTopic = (topicKey: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicKey]: !prev[topicKey],
    }))
  }

  const isTopicExpanded = (topicKey: string) => {
    // When searching, expand matching topics automatically
    if (search.trim().length > 0) return true
    return Boolean(expandedTopics[topicKey])
  }

  // Check if any item is expanded for the footer toggle button
  const hasAnyExpanded =
    Object.values(expandedSections).some(Boolean) ||
    Object.values(expandedTopics).some(Boolean)

  const handleToggleAll = () => {
    if (hasAnyExpanded) {
      // Collapse everything
      setExpandedSections({})
      setExpandedTopics({})
    } else {
      // Expand all sections and topics
      const allSecs: Record<string, boolean> = {}
      const allTops: Record<string, boolean> = {}
      tree.forEach((sec) => {
        allSecs[sec.sectionName] = true
        sec.topics.forEach((tg) => {
          allTops[`${sec.sectionName}__${tg.topicName}`] = true
        })
      })
      setExpandedSections(allSecs)
      setExpandedTopics(allTops)
    }
  }

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Slide-over Drawer Panel */}
          <motion.aside
            initial={{ x: '-100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 left-0 z-50 w-full max-w-md bg-[#181920] border-r-2 border-black shadow-brutal-xl flex flex-col select-none overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b-2 border-black bg-[#121316] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#facc15] border-2 border-black shadow-brutal-sm flex items-center justify-center text-black font-black text-sm rotate-[-2deg]">
                    ⚡
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white flex items-center gap-2">
                      CURRICULUM INDEX
                      <span className="sticker-badge bg-[#a3e635] text-black text-[10px] rotate-[1.5deg]">
                        COMPLETE TRACK
                      </span>
                    </h2>
                    <p className="text-xs font-mono font-medium text-zinc-400">
                      Slide {currentSlide + 1} of {slides.length} ({progressPercent}% completed)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-7 h-7 rounded-lg bg-[#27272a] text-zinc-300 hover:text-white border-2 border-black shadow-brutal-sm flex items-center justify-center transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
                  title="Close menu (M or Esc)"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#1c1d24] border-2 border-black rounded-full h-2 overflow-hidden shadow-brutal-sm">
                <div
                  className="bg-[#facc15] h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Live Search Input */}
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-2.5 text-zinc-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search topics (e.g. heap, regex, oop)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#181920] text-white placeholder-zinc-500 text-xs font-mono rounded-lg pl-9 pr-8 py-2 outline-none border-2 border-black shadow-brutal-sm focus:border-[#facc15] transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-2 text-xs font-bold text-zinc-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Quick Section Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono no-scrollbar">
                <button
                  onClick={() => setSelectedSectionFilter(null)}
                  className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all border-2 border-black font-bold ${
                    selectedSectionFilter === null
                      ? 'bg-[#facc15] text-black shadow-brutal-sm -translate-x-0.5 -translate-y-0.5'
                      : 'bg-[#27272a] text-zinc-300 shadow-brutal-sm hover:text-white'
                  }`}
                >
                  ALL ({slides.length})
                </button>
                {allSections.map((sec, idx) => {
                  const shortName = sec.replace(/^\d+\.\s*/, '')
                  const isSelected = selectedSectionFilter === sec
                  return (
                    <button
                      key={idx}
                      onClick={() =>
                        setSelectedSectionFilter(isSelected ? null : sec)
                      }
                      className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all border-2 border-black flex items-center gap-1 font-bold ${
                        isSelected
                          ? 'bg-[#38bdf8] text-black shadow-brutal-sm -translate-x-0.5 -translate-y-0.5'
                          : 'bg-[#27272a] text-zinc-300 shadow-brutal-sm hover:text-white'
                      }`}
                    >
                      <span>#{shortName}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Topics Tree View (Level 1: Section Accordions, Level 2: Subtopic Accordions) */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0">
              {tree.map((sec) => {
                const isExpanded = isSectionExpanded(sec.sectionName)
                const totalSecSlides = sec.topics.reduce((acc, t) => acc + t.slides.length, 0)
                const hasActiveSlide = sec.topics.some((t) =>
                  t.slides.some((s) => s.index === currentSlide)
                )

                return (
                  <div
                    key={sec.sectionName}
                    className={`rounded-xl border transition-all overflow-hidden ${
                      hasActiveSlide
                        ? 'border-emerald-500/40 bg-zinc-900/50'
                        : 'border-zinc-800/80 bg-zinc-900/30'
                    }`}
                  >
                    {/* Level 1: Section Header Accordion */}
                    <div
                      onClick={() => toggleSection(sec.sectionName)}
                      className="px-3 py-2.5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {SECTION_ICONS[sec.sectionName] || <Code2 size={14} className="text-emerald-400" />}
                        <span className="text-xs font-bold text-zinc-200 truncate">
                          {sec.sectionName}
                        </span>
                        {hasActiveSlide && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-mono">
                          {totalSecSlides} slides
                        </span>
                        {isExpanded ? (
                          <ChevronDown size={14} className="text-zinc-400" />
                        ) : (
                          <ChevronRight size={14} className="text-zinc-400" />
                        )}
                      </div>
                    </div>

                    {/* Level 2: Subtopics inside Section (Collapsible Accordions) */}
                    {isExpanded && (
                      <div className="p-2 pt-1 space-y-1.5 border-t border-zinc-800/50 bg-[#0d0e15]/40">
                        {sec.topics.map((tg) => {
                          const topicKey = `${sec.sectionName}__${tg.topicName}`
                          const isTopicOpen = isTopicExpanded(topicKey)
                          const topicHasActive = tg.slides.some((s) => s.index === currentSlide)
                          const color = CATEGORY_COLORS[tg.slides[0]?.slide.category] || '#10b981'

                          return (
                            <div
                              key={tg.topicName}
                              className={`border rounded-lg overflow-hidden transition-colors ${
                                topicHasActive
                                  ? 'border-emerald-500/30 bg-zinc-900/60'
                                  : 'border-zinc-800/60 bg-zinc-900/20'
                              }`}
                            >
                              {/* Subtopic Header Accordion */}
                              <div
                                onClick={() => toggleTopic(topicKey)}
                                className={`px-2.5 py-1.5 flex items-center justify-between cursor-pointer transition-colors ${
                                  isTopicOpen
                                    ? 'bg-zinc-800/40 text-zinc-200'
                                    : 'hover:bg-zinc-800/30 text-zinc-400 hover:text-zinc-300'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: color }}
                                  />
                                  <span className="text-xs font-semibold text-zinc-300 truncate">
                                    {tg.topicName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] bg-zinc-800/80 px-1.5 py-0.2 rounded text-zinc-400 font-mono">
                                    {tg.slides.length}
                                  </span>
                                  {isTopicOpen ? (
                                    <ChevronDown size={12} className="text-zinc-400" />
                                  ) : (
                                    <ChevronRight size={12} className="text-zinc-400" />
                                  )}
                                </div>
                              </div>

                              {/* Sub-slides List (Revealed when Subtopic is clicked) */}
                              {isTopicOpen && (
                                <div className="p-1 space-y-1 border-t border-zinc-800/40 bg-black/20">
                                  {tg.slides.map(({ slide, index }) => {
                                    const isCurrent = index === currentSlide
                                    const tag = slide.tag || ''
                                    let badgeStyle = 'bg-zinc-800 text-zinc-400'
                                    if (isCurrent) {
                                      badgeStyle = 'bg-emerald-500 text-black font-bold'
                                    } else if (tag.includes('Practice')) {
                                      badgeStyle = 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    } else if (tag.includes('LeetCode')) {
                                      badgeStyle = 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                    } else if (tag.includes('Real-World')) {
                                      badgeStyle = 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                                    }

                                    return (
                                      <button
                                        key={slide.id}
                                        onClick={() => {
                                          setSlide(index)
                                          setSidebarOpen(false)
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-start gap-2.5 ${
                                          isCurrent
                                            ? 'bg-[#facc15] text-black border-2 border-black shadow-brutal-sm font-bold'
                                            : 'hover:bg-[#27272a] text-zinc-300 hover:text-white border border-transparent'
                                        }`}
                                      >
                                        <span
                                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded border border-black flex-shrink-0 mt-0.5 ${
                                            isCurrent ? 'bg-black text-white' : badgeStyle
                                          }`}
                                        >
                                          {slide.step || `#${index + 1}`}
                                        </span>

                                        <div className="flex-1 min-w-0">
                                          <div
                                            className={`truncate text-xs ${
                                              isCurrent ? 'text-black font-black' : 'text-zinc-200 font-medium'
                                            }`}
                                          >
                                            {slide.question}
                                          </div>
                                          <div className={`text-[10px] truncate mt-0.5 font-mono ${
                                            isCurrent ? 'text-zinc-800' : 'text-zinc-500'
                                          }`}>
                                            #{slide.tag} {slide.viz?.type ? `• 🎨 ${slide.viz.type}` : ''}
                                          </div>
                                        </div>

                                        {isCurrent && (
                                          <CheckCircle2
                                            size={15}
                                            className="text-black flex-shrink-0 mt-0.5"
                                          />
                                        )}
                                      </button>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}

              {tree.length === 0 && (
                <div className="text-center py-12 text-zinc-500 text-xs font-mono">
                  No topics identified matching "<span className="text-white">{search}</span>"
                </div>
              )}
            </div>

            {/* Footer with keyboard hint & Collapse/Expand All toggle */}
            <div className="p-3 border-t-2 border-black bg-[#121316] text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                Press <kbd className="px-1.5 py-0.5 bg-[#27272a] border border-black rounded text-white font-mono text-[10px]">M</kbd> or <kbd className="px-1.5 py-0.5 bg-[#27272a] border border-black rounded text-white font-mono text-[10px]">Esc</kbd>
              </span>
              <button
                onClick={handleToggleAll}
                className="text-[#facc15] font-black hover:underline"
              >
                {hasAnyExpanded ? 'COLLAPSE ALL' : 'EXPAND ALL'}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

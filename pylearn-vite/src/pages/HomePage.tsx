import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllCourses, CourseSummary } from '../lib/courses'
import { useAppStore } from '../lib/store'
import PythonLogo from '../components/common/PythonLogo'
import { 
  Clock, 
  BookOpen, 
  Sparkles, 
  Flame, 
  Search,
  ArrowUpRight,
  Zap,
  Terminal,
  Database,
  ShieldAlert,
  Cpu,
  User,
  LogOut,
  CreditCard
} from 'lucide-react'

const BADGE_CONFIG: Record<string, { bg: string; text: string; label: string; tilt: string }> = {
  'python-basics': {
    bg: 'bg-[#a3e635]', // Lime
    text: 'text-black',
    label: 'CORE SYSTEM',
    tilt: 'rotate-[-2deg]',
  },
  'sql-mastery': {
    bg: 'bg-[#38bdf8]', // Sky
    text: 'text-black',
    label: 'DATABASE PRO',
    tilt: 'rotate-[2deg]',
  },
  'sql-murder-mystery': {
    bg: 'bg-[#f472b6]', // Hot Pink
    text: 'text-black',
    label: 'VIRAL INQUEST',
    tilt: 'rotate-[-3deg]',
  },
  'python-cyber-mystery': {
    bg: 'bg-[#fb923c]', // Tangerine
    text: 'text-black',
    label: 'CYBER FORENSICS',
    tilt: 'rotate-[2.5deg]',
  },
  'ai-foundations': {
    bg: 'bg-[#c084fc]', // Purple
    text: 'text-black',
    label: 'NEURAL NETS',
    tilt: 'rotate-[-1.5deg]',
  },
}

function CourseCard({ course }: { course: CourseSummary }) {
  const isMystery = course.meta.level === 'Interactive Mystery'
  const badge = BADGE_CONFIG[course.slug] || {
    bg: 'bg-[#facc15]',
    text: 'text-black',
    label: course.meta.level.toUpperCase(),
    tilt: 'rotate-[-2deg]',
  }

  return (
    <Link
      to={`/${course.slug}`}
      className="group flex flex-col justify-between brutal-card rounded-2xl p-6 relative overflow-hidden transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg"
    >
      {/* Top Row: Icon & Slanted Sticker Badge */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="w-14 h-14 rounded-xl bg-white border-2 border-black shadow-brutal-sm flex items-center justify-center p-2.5 group-hover:scale-105 group-hover:rotate-[-3deg] transition-transform duration-150">
            {course.slug === 'python-basics' ? (
              <PythonLogo className="w-9 h-9" />
            ) : (
              <span className="text-3xl">{course.meta.emoji}</span>
            )}
          </div>

          <div
            className={`sticker-badge ${badge.bg} ${badge.text} ${badge.tilt} uppercase tracking-wider text-[11px]`}
          >
            {isMystery ? '🕵️ ' : '⚡ '}
            {badge.label}
          </div>
        </div>

        {/* Title */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="text-xl md:text-2xl font-black text-white group-hover:text-[#facc15] transition-colors leading-tight">
            {course.meta.title}
          </h2>
          <div className="w-7 h-7 rounded-lg bg-[#27272a] border border-black shadow-brutal-sm flex items-center justify-center text-zinc-300 group-hover:bg-[#facc15] group-hover:text-black transition-colors flex-shrink-0 mt-0.5">
            <ArrowUpRight size={16} />
          </div>
        </div>

        {/* Subtitle */}
        {course.meta.subtitle && (
          <p className="text-xs font-mono font-bold text-[#facc15] mb-3">
            {course.meta.subtitle}
          </p>
        )}

        {/* Description */}
        <p className="text-zinc-400 text-xs leading-relaxed mb-6 line-clamp-3">
          {course.meta.description}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-4 border-t-2 border-black/40 space-y-4">
        {/* Specs */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
          <span className="flex items-center gap-1.5 font-bold">
            <Clock size={13} className="text-[#facc15]" />
            {course.meta.estimatedTime}
          </span>
          <span className="flex items-center gap-1.5 font-bold">
            <BookOpen size={13} className="text-[#a3e635]" />
            {course.slideCount} {isMystery ? 'Investigation Stages' : 'Interactive Slides'}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          {course.meta.topics?.slice(0, 3).map((topic: string) => (
            <span
              key={topic}
              className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-black/60 text-zinc-300 border border-zinc-700"
            >
              #{topic}
            </span>
          ))}
          {course.meta.topics && course.meta.topics.length > 3 && (
            <span className="text-[10px] font-mono font-semibold text-zinc-500 px-1 py-0.5">
              +{course.meta.topics.length - 3} more
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="w-full py-2.5 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-wider text-center border-2 border-black shadow-brutal-sm group-hover:bg-[#facc15] group-hover:shadow-brutal transition-all">
          Launch Track 🚀
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const [courses, setCourses] = useState<CourseSummary[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const { user, isPro, openProModal, openAuthModal, logout } = useAppStore()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'mysteries' | 'curriculums'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let active = true
    fetchAllCourses()
      .then((data) => {
        if (active) {
          setCourses(data)
          setLoadingCourses(false)
        }
      })
      .catch(() => {
        if (active) setLoadingCourses(false)
      })
    return () => {
      active = false
    }
  }, [])

  const mysteries = courses.filter((c) => c.meta.level === 'Interactive Mystery')
  const curriculums = courses.filter((c) => c.meta.level !== 'Interactive Mystery')

  const filteredCourses = courses.filter((c) => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'mysteries' ? c.meta.level === 'Interactive Mystery' :
      c.meta.level !== 'Interactive Mystery'

    const matchesSearch = 
      searchQuery.trim() === '' ||
      c.meta.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.meta.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.meta.topics?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen flex flex-col bg-[#121316] text-white select-none relative overflow-x-hidden bg-brutal-dots">
      {/* Top Nav Header */}
      <header className="border-b-2 border-black bg-[#181920] px-6 sm:px-10 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-brutal-sm">
        <div className="flex items-center gap-3">
          {/* Logo Badge */}
          <div className="w-10 h-10 rounded-xl bg-[#facc15] border-2 border-black shadow-brutal-sm flex items-center justify-center text-black font-black text-xl rotate-[-2deg]">
            P⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-white tracking-tight">
                PyLearn Studio
              </span>
              <span className="sticker-badge bg-[#a3e635] text-black text-[10px] rotate-[2deg]">
                WASM ⚡ 0ms LATENCY
              </span>
            </div>
            <div className="text-zinc-400 text-xs font-mono font-medium hidden sm:block">
              Zero-Server Interactive Engineering & Detective Sandboxes
            </div>
          </div>
        </div>

        {/* Right Nav Stickers & Auth */}
        <div className="flex items-center gap-2.5">
          {/* Pro Upgrade Trigger */}
          <button
            onClick={() => openProModal('home_navbar')}
            className={`sticker-badge text-xs font-mono font-black transition-transform ${
              isPro
                ? 'bg-[#a3e635] text-black shadow-brutal-sm'
                : 'bg-[#f472b6] text-black rotate-[-2deg] hover:rotate-0'
            }`}
          >
            <Sparkles size={12} />
            <span>{isPro ? (user?.planType === 'annual' ? 'PRO ANNUAL' : 'PRO PASS') : 'PRO PASS'}</span>
          </button>

          {/* User Account / Profile Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-white border-2 border-black shadow-brutal-sm font-mono text-xs font-bold transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-[#38bdf8] border border-black flex items-center justify-center text-[10px] text-black font-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{user.name}</span>
              </button>

              {/* Profile Dropdown */}
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-[#181920] border-2 border-black rounded-xl shadow-brutal-lg p-3 z-50 font-mono text-xs space-y-3"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="border-b-2 border-black pb-2.5">
                    <div className="font-black text-white text-sm truncate">{user.name}</div>
                    <div className="text-[11px] text-zinc-400 truncate">{user.email}</div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span
                        className={`sticker-badge text-[9px] ${
                          isPro ? 'bg-[#a3e635] text-black font-black' : 'bg-zinc-700 text-zinc-300'
                        }`}
                      >
                        {isPro ? '⭐ PRO SUBSCRIBER' : 'FREE TIER'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <button
                      onClick={() => { setUserMenuOpen(false); openProModal('manage_plan'); }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-white font-bold transition-all text-left"
                    >
                      <CreditCard size={14} className="text-[#facc15]" />
                      <span>{isPro ? 'Manage Subscription' : 'Upgrade to Pro'}</span>
                    </button>
                  </div>

                  <div className="border-t-2 border-black pt-2">
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 font-bold transition-all text-left"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-black rounded-xl bg-[#facc15] hover:bg-[#eab308] text-black border-2 border-black shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <User size={13} />
              <span>SIGN IN</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 py-10 space-y-12">
        {/* Hero Section */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="sticker-badge bg-[#38bdf8] text-black text-xs rotate-[-1deg]">
              🚀 NO SERVERS REQUIRED
            </span>
            <span className="sticker-badge bg-[#facc15] text-black text-xs rotate-[1.5deg]">
              ⚡ IN-BROWSER WASM VM
            </span>
            <span className="sticker-badge bg-[#fb923c] text-black text-xs rotate-[-2deg]">
              🎯 PRODUCTION READY CURRICULUM
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl">
            Master Code With Real Execution,{' '}
            <span className="bg-[#facc15] text-black px-3 py-0.5 border-2 border-black shadow-brutal inline-block rotate-[-1deg] my-1">
              Zero Server Latency,
            </span>{' '}
            & Detective Inquests.
          </h1>

          <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-3xl font-medium">
            Run Python 3.12 and SQLite 3.45 directly inside your browser's WebAssembly sandbox. Inspect live pointer references, simulate relational database joins, and crack viral forensic crime investigations.
          </p>

          {/* Quick Metrics Sticker Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl pt-2">
            <div className="p-4 rounded-xl bg-[#1c1d24] border-2 border-black shadow-brutal">
              <div className="text-zinc-400 font-mono text-[11px] font-bold uppercase mb-1">Total Curriculum</div>
              <div className="text-white font-black text-xl">296 Challenges</div>
            </div>
            <div className="p-4 rounded-xl bg-[#1c1d24] border-2 border-black shadow-brutal">
              <div className="text-zinc-400 font-mono text-[11px] font-bold uppercase mb-1">Execution Engines</div>
              <div className="text-[#a3e635] font-black text-xl">Python + SQLite WASM</div>
            </div>
            <div className="p-4 rounded-xl bg-[#1c1d24] border-2 border-black shadow-brutal">
              <div className="text-zinc-400 font-mono text-[11px] font-bold uppercase mb-1">Server Setup</div>
              <div className="text-[#38bdf8] font-black text-xl">0MB Overhead</div>
            </div>
            <div className="p-4 rounded-xl bg-[#1c1d24] border-2 border-black shadow-brutal">
              <div className="text-zinc-400 font-mono text-[11px] font-bold uppercase mb-1">Viral Cases</div>
              <div className="text-[#f472b6] font-black text-xl">2 Mysteries</div>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t-2 border-black">
          {/* Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-black border-2 border-black transition-all ${
                filter === 'all'
                  ? 'bg-[#facc15] text-black shadow-brutal -translate-x-0.5 -translate-y-0.5'
                  : 'bg-[#1c1d24] text-zinc-300 shadow-brutal-sm hover:bg-[#27272a]'
              }`}
            >
              All Tracks ({courses.length})
            </button>
            <button
              onClick={() => setFilter('mysteries')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-black border-2 border-black transition-all flex items-center gap-1.5 ${
                filter === 'mysteries'
                  ? 'bg-[#f472b6] text-black shadow-brutal -translate-x-0.5 -translate-y-0.5'
                  : 'bg-[#1c1d24] text-zinc-300 shadow-brutal-sm hover:bg-[#27272a]'
              }`}
            >
              <Flame size={14} className={filter === 'mysteries' ? 'text-black' : 'text-[#f472b6]'} />
              Detective Mysteries ({mysteries.length})
            </button>
            <button
              onClick={() => setFilter('curriculums')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-black border-2 border-black transition-all flex items-center gap-1.5 ${
                filter === 'curriculums'
                  ? 'bg-[#a3e635] text-black shadow-brutal -translate-x-0.5 -translate-y-0.5'
                  : 'bg-[#1c1d24] text-zinc-300 shadow-brutal-sm hover:bg-[#27272a]'
              }`}
            >
              <Sparkles size={14} className={filter === 'curriculums' ? 'text-black' : 'text-[#a3e635]'} />
              Mastery Tracks ({curriculums.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Python, SQL, recursion, joins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c1d24] text-white placeholder-zinc-500 font-mono text-xs rounded-xl pl-10 pr-4 py-2.5 border-2 border-black shadow-brutal-sm focus:shadow-brutal focus:border-[#facc15] outline-none transition-all"
            />
          </div>
        </section>

        {/* Loading State */}
        {loadingCourses && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="brutal-card rounded-2xl p-6 h-64 animate-pulse bg-[#1c1d24]" />
            ))}
          </div>
        )}

        {/* Section 1: Viral Detective Mysteries */}
        {!loadingCourses && (filter === 'all' || filter === 'mysteries') && !searchQuery && mysteries.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="sticker-badge bg-[#f472b6] text-black text-xs rotate-[-2deg]">
                🔥 MOST POPULAR
              </span>
              <h2 className="text-2xl font-black text-white">Gamified Detective Inquests</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mysteries.map((course) => (
                <CourseCard key={course.slug} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Core Engineering Curriculums */}
        {(filter === 'all' || filter === 'curriculums') && !searchQuery && curriculums.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="sticker-badge bg-[#a3e635] text-black text-xs rotate-[2deg]">
                📚 CURRICULUM
              </span>
              <h2 className="text-2xl font-black text-white">Full-Stack Engineering Tracks</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {curriculums.map((course) => (
                <CourseCard key={course.slug} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* Search Results Display */}
        {searchQuery && (
          <section className="space-y-4">
            <div className="font-mono text-xs text-zinc-400">
              Found {filteredCourses.length} tracks matching "{searchQuery}":
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.slug} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t-2 border-black pt-8 pb-16 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#facc15] border border-black" />
            <span className="font-bold text-white">PyLearn Studio</span>
            <span>• Built with React 18, Pyodide, SQLite WASM & Tailwind</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="sticker-badge bg-[#a3e635] text-black text-[10px]">
              0ms CLIENT-SIDE EXECUTION
            </span>
          </div>
        </footer>
      </main>
    </div>
  )
}
